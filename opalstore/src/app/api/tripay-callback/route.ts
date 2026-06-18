import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;

async function reduceStock(productId: string, productName: string, variantName: string, quantity: number) {
  try {
    await connectDB();
    // Try productId first (only if valid ObjectId), fallback to productName
    let product = null;
    if (productId && /^[0-9a-fA-F]{24}$/.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ name: productName });
    }
    if (!product) {
      console.error("Product not found for stock reduction:", productName, productId);
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
    
    console.log("=== TRIPAY CALLBACK ===");
    console.log("Callback received:", body);

    // Verify signature
    const callbackSignature = body.signature;
    const data = body.data;

    if (!callbackSignature || !data) {
      console.error("Invalid callback format");
      return NextResponse.json(
        { error: "Invalid callback format" },
        { status: 400 }
      );
    }

    // Verify signature using HMAC-SHA256
    const dataString = JSON.stringify(data);
    const expectedSignature = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(dataString)
      .digest("hex");

    if (callbackSignature !== expectedSignature) {
      console.error("Invalid signature");
      console.error("Expected:", expectedSignature);
      console.error("Received:", callbackSignature);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const merchantRef = data.merchant_ref;
    const status = data.status;
    const reference = data.reference;

    console.log("Merchant Ref:", merchantRef);
    console.log("Status:", status);
    console.log("Reference:", reference);

    // Map Tripay status to our status
    let orderStatus = "pending";
    
    switch (status) {
      case "PAID":
        orderStatus = "success";
        break;
      case "UNPAID":
        orderStatus = "pending";
        break;
      case "EXPIRED":
        orderStatus = "cancelled";
        break;
      case "FAILED":
        orderStatus = "failed";
        break;
      case "REFUND":
        orderStatus = "cancelled";
        break;
      default:
        orderStatus = "pending";
    }

    console.log("Final order status:", orderStatus);

    // Update transaction in database
    await connectDB();
    const transaction = await Transaction.findOne({ orderId: merchantRef });
    
    if (transaction) {
      // Only reduce stock on first success (not if already success)
      if (orderStatus === "success" && transaction.status !== "success") {
        await reduceStock(transaction.productId, transaction.productName, transaction.variantName, transaction.quantity);
      }
      
      transaction.status = orderStatus;
      transaction.tripayStatus = status;
      transaction.tripayReference = reference;
      await transaction.save();
      console.log("Transaction updated:", merchantRef, "=>", orderStatus);
    } else {
      console.log("Transaction not found in DB:", merchantRef);
    }

    return NextResponse.json({ status: "ok", merchantRef, orderStatus });

  } catch (error: any) {
    console.error("Tripay callback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process callback" },
      { status: 500 }
    );
  }
}
