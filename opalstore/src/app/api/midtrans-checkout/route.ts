import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productName,
      variantName,
      price,
      quantity,
      customerEmail,
      customerWhatsapp,
      outputType,
      outputValue,
    } = body;

    console.log("=== MIDTRANS CHECKOUT REQUEST ===");
    console.log("productName:", productName);
    console.log("variantName:", variantName);
    console.log("price:", price);
    console.log("quantity:", quantity);
    console.log("customerEmail:", customerEmail);

    if (!productName || !price || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = price * quantity;
    const orderId = "OPAL-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log("orderId:", orderId);
    console.log("totalAmount:", totalAmount);

    // Create Snap transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: customerEmail,
        first_name: customerWhatsapp || "",
      },
      item_details: [
        {
          id: orderId,
          price: price,
          quantity: quantity,
          name: productName + " - " + variantName,
        },
      ],
      callbacks: {
        finish: req.headers.get("origin") + "/payment/success?order_id=" + orderId,
        unfinish: req.headers.get("origin") + "/payment/cancel",
        error: req.headers.get("origin") + "/payment/cancel",
      },
      metadata: {
        orderId,
        productName,
        variantName,
        quantity: quantity.toString(),
        customerEmail,
        customerWhatsapp: customerWhatsapp || "",
        outputType: outputType || "text",
        outputValue: outputValue || "",
        totalAmount: totalAmount.toString(),
      },
    };

    const transaction = await snap.createTransaction(parameter);

    console.log("Transaction created:", transaction.token);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: orderId,
    });

  } catch (error: any) {
    console.error("Midtrans checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
