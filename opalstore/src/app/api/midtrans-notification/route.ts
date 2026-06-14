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
    if (!product) {
      console.error("Product not found for stock reduction:", productName);
      return;
    }

    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) {
      console.error("Variant not found for stock reduction:", variantName);
      return;
    }

    variant.stock = Math.max(0, variant.stock - quantity);
    await product.save();
    console.log(`Stock reduced: ${product.name} - ${variantName} => ${variant.stock}`);
  } catch (err) {
    console.error("Error reducing stock:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("=== MIDTRANS NOTIFICATION ===");
    console.log("Notification received:", body);

    const statusResponse = await core.transaction.notification(body);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log("Order ID:", orderId);
    console.log("Transaction Status:", transactionStatus);
    console.log("Fraud Status:", fraudStatus);

    let orderStatus = "pending";
    
    if (transactionStatus === "capture") {
      orderStatus = fraudStatus === "accept" ? "success" : "challenged";
    } else if (transactionStatus === "settlement") {
      orderStatus = "success";
    } else if (transactionStatus === "deny") {
      orderStatus = "failed";
    } else if (transactionStatus === "cancel" || transactionStatus === "expire") {
      orderStatus = "cancelled";
    }

    console.log("Final order status:", orderStatus);

    // Update transaction in database
    await connectDB();
    const transaction = await Transaction.findOne({ orderId });
    
    if (transaction) {
      // Only reduce stock on first success (not if already success)
      if (orderStatus === "success" && transaction.status !== "success") {
        await reduceStock(transaction.productName, transaction.variantName, transaction.quantity);
      }
      
      transaction.status = orderStatus;
      transaction.midtransStatus = transactionStatus;
      await transaction.save();
      console.log("Transaction updated:", orderId, "=>", orderStatus);
    } else {
      console.log("Transaction not found in DB:", orderId);
    }

    return NextResponse.json({ status: "ok", orderId, orderStatus });

  } catch (error: any) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process notification" },
      { status: 500 }
    );
  }
}
