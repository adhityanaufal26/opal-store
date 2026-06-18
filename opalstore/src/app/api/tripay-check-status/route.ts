import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

const TRIPAY_BASE_URL = process.env.TRIPAY_BASE_URL || "https://tripay.co.id/api-sandbox";

async function reduceStock(productId: string, productName: string, variantName: string, quantity: number) {
  try {
    await connectDB();
    let product = null;
    if (productId && /^[0-9a-fA-F]{24}$/.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ name: productName });
    }
    if (!product) {
      console.error("Product not found:", productName);
      return null;
    }
    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) {
      console.error("Variant not found:", variantName);
      return null;
    }
    variant.stock = Math.max(0, variant.stock - quantity);
    await product.save();
    console.log("Stock reduced:", productName, variantName, "=>", variant.stock);
    return product;
  } catch (err) {
    console.error("Error reducing stock:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) {
    return NextResponse.json({ error: "order_id required" }, { status: 400 });
  }

  try {
    await connectDB();
    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    // If already success, return immediately
    if (transaction.status === "success") {
      const product = await Product.findOne({ name: transaction.productName });
      return NextResponse.json({
        status: "success",
        orderId: transaction.orderId,
        productName: transaction.productName,
        variantName: transaction.variantName,
        quantity: transaction.quantity,
        amount: transaction.amount,
        outputType: product?.outputType || "text",
        outputValue: product?.outputValue || "Pesanan Anda sedang diproses. Admin akan menghubungi Anda via WhatsApp dalam 1x24 jam.",
      });
    }

    // Check status from Tripay
    if (!transaction.tripayReference) {
      return NextResponse.json({
        status: transaction.status,
        orderId: transaction.orderId,
        productName: transaction.productName,
        variantName: transaction.variantName,
        quantity: transaction.quantity,
        amount: transaction.amount,
      });
    }

    const apiKey = process.env.TRIPAY_API_KEY;
    const res = await fetch(
      TRIPAY_BASE_URL + "/transaction/detail?reference=" + transaction.tripayReference,
      { headers: { Authorization: "Bearer " + apiKey } }
    );
    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({
        status: transaction.status,
        orderId: transaction.orderId,
        productName: transaction.productName,
        variantName: transaction.variantName,
        quantity: transaction.quantity,
        amount: transaction.amount,
      });
    }

    const tripayStatus = data.data.status;
    let newStatus = "pending";

    if (tripayStatus === "PAID") {
      newStatus = "success";
    } else if (tripayStatus === "EXPIRED" || tripayStatus === "FAILED") {
      newStatus = "cancelled";
    }

    // Update if status changed
    if (newStatus !== transaction.status) {
      if (newStatus === "success" && transaction.status !== "success") {
        await reduceStock(transaction.productId, transaction.productName, transaction.variantName, transaction.quantity);
      }
      transaction.status = newStatus;
      transaction.tripayStatus = tripayStatus;
      await transaction.save();
    }

    const product = await Product.findOne({ name: transaction.productName });

    return NextResponse.json({
      status: newStatus,
      orderId: transaction.orderId,
      productName: transaction.productName,
      variantName: transaction.variantName,
      quantity: transaction.quantity,
      amount: transaction.amount,
      outputType: newStatus === "success" ? (product?.outputType || "text") : undefined,
      outputValue: newStatus === "success" ? (product?.outputValue || "Pesanan Anda sedang diproses. Admin akan menghubungi Anda via WhatsApp dalam 1x24 jam.") : undefined,
    });
  } catch (error: any) {
    console.error("Check status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
