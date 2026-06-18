import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY!;
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE!;
const TRIPAY_BASE_URL = process.env.TRIPAY_BASE_URL || "https://tripay.co.id/api-sandbox";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productName,
      variantName,
      price,
      quantity,
      fee,
      customerEmail,
      customerWhatsapp,
      customerName,
      paymentMethod,
      productId,
      userId,
    } = body;

    console.log("=== TRIPAY CHECKOUT REQUEST ===");
    console.log("productName:", productName);
    console.log("variantName:", variantName);
    console.log("price:", price);
    console.log("quantity:", quantity);
    console.log("customerEmail:", customerEmail);
    console.log("paymentMethod:", paymentMethod);
    console.log("userId:", userId);

    if (!productName || !price || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = price * quantity + (fee || 0);
    const merchantRef = "OPAL-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log("merchantRef:", merchantRef);
    console.log("totalAmount:", totalAmount);

    // Generate HMAC-SHA256 signature
    const signatureInput = TRIPAY_MERCHANT_CODE + merchantRef + String(totalAmount);
    const signature = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(signatureInput)
      .digest("hex");

    console.log("Signature input:", signatureInput);

    // Create Tripay transaction
    const payload = {
      method: paymentMethod,
      merchant_ref: merchantRef,
      amount: totalAmount,
      customer_name: customerName || customerWhatsapp || "Customer",
      customer_email: customerEmail,
      customer_phone: customerWhatsapp || "",
      order_items: [
        {
          sku: merchantRef,
          name: productName + " - " + variantName,
          price: totalAmount,
          quantity: 1,
        },
      ],
      callback_url: "https://opalstore.app/api/tripay-callback",
      return_url: "https://opalstore.app/payment/success?order_id=" + merchantRef,
      expired_time: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      fee_direction: "BUYER",
      signature: signature,
    };

    console.log("Creating Tripay transaction...");

    const response = await fetch(`${TRIPAY_BASE_URL}/transaction/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TRIPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Tripay response:", result);

    if (!result.success) {
      console.error("Tripay error:", result.message);
      return NextResponse.json(
        { error: result.message || "Failed to create transaction" },
        { status: 400 }
      );
    }

    // Save transaction to MongoDB immediately
    try {
      await connectDB();
      await Transaction.create({
        orderId: merchantRef,
        userId: userId || customerEmail,
        productId: productId || "",
        productName: productName,
        variantName: variantName,
        quantity: quantity,
        amount: totalAmount,
        paymentMethod: "tripay",
        whatsappNumber: customerWhatsapp || "",
        email: customerEmail,
        status: "pending",
        tripayReference: result.data.reference,
      });
      console.log("Transaction saved to MongoDB:", merchantRef);
    } catch (dbError) {
      console.error("Failed to save transaction to DB:", dbError);
      // Continue anyway — Tripay transaction is created, callback will handle it
    }

    return NextResponse.json({
      success: true,
      orderId: merchantRef,
      checkout_url: result.data.checkout_url,
      qr_url: result.data.qr_url,
      pay_code: result.data.pay_code,
      payment_method: result.data.payment_name,
      amount: result.data.amount,
      fee: result.data.fee_customer || result.data.total_fee || 0,
      expired_time: result.data.expired_time,
      reference: result.data.reference,
    });

  } catch (error: any) {
    console.error("Tripay checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
