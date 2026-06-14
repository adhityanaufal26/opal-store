import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
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

    console.log("=== STRIPE CHECKOUT REQUEST ===");
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
    console.log("totalAmount:", totalAmount);
    console.log("unit_amount will be:", price); // Not totalAmount, just unit price

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "idr",
            product_data: {
              name: productName + " - " + variantName,
              description: quantity + "x " + variantName,
            },
            unit_amount: price, // This should be 40000 for Rp40,000
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      success_url: req.headers.get("origin") + "/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: req.headers.get("origin") + "/payment/cancel",
      metadata: {
        productName,
        variantName,
        quantity: quantity.toString(),
        customerEmail,
        customerWhatsapp: customerWhatsapp || "",
        outputType: outputType || "text",
        outputValue: outputValue || "",
        totalAmount: totalAmount.toString(),
      },
    });

    console.log("Session created:", session.id);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });

  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
