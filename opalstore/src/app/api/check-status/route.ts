import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

async function reduceStock(productName: string, variantName: string, quantity: number) {
  try {
    await connectDB();
    const product = await Product.findOne({ name: productName });
    if (!product) return;
    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) return;
    variant.stock = Math.max(0, variant.stock - quantity);
    await product.save();
    console.log(`Stock reduced (check-status): ${product.name} - ${variantName} => ${variant.stock}`);
  } catch (err) {
    console.error("Error reducing stock:", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    // Check status directly from Midtrans API
    const statusResponse = await core.transaction.status(orderId);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`[check-status] ${orderId}: ${transactionStatus} (fraud: ${fraudStatus})`);

    // Map to our status
    let orderStatus = "pending";
    if (transactionStatus === "capture") {
      orderStatus = fraudStatus === "accept" ? "success" : "pending";
    } else if (transactionStatus === "settlement") {
      orderStatus = "success";
    } else if (transactionStatus === "deny") {
      orderStatus = "failed";
    } else if (transactionStatus === "cancel") {
      orderStatus = "cancelled";
    } else if (transactionStatus === "expire") {
      orderStatus = "failed";
    }

    // Update DB
    await connectDB();
    const transaction = await Transaction.findOne({ orderId });

    if (transaction && transaction.status !== orderStatus) {
      if (orderStatus === "success" && transaction.status !== "success") {
        await reduceStock(transaction.productName, transaction.variantName, transaction.quantity);
      }
      transaction.status = orderStatus;
      transaction.midtransStatus = transactionStatus;
      await transaction.save();
      console.log(`[check-status] Updated ${orderId}: ${transaction.status} => ${orderStatus}`);
    }

    return NextResponse.json({ success: true, orderId, status: orderStatus, midtransStatus: transactionStatus });
  } catch (error: any) {
    console.error("[check-status] Error:", error.message);
    return NextResponse.json({ error: error.message || "Failed to check status" }, { status: 500 });
  }
}
