import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  }

  const body = await req.json();
  const { productName, variantName, price, quantity, customerEmail, customerWhatsapp, outputType, outputValue } = body;

  const { connectDB } = await import("@/lib/mongodb");
  const Transaction = (await import("@/models/Transaction")).default;
  await connectDB();

  try {
    if (!productName || !price || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const totalAmount = price * quantity;
    const orderId = "OPAL-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: totalAmount },
      credit_card: { secure: true },
      customer_details: { email: customerEmail, first_name: customerWhatsapp || "" },
      item_details: [{ id: orderId, price: price, quantity: quantity, name: productName + " - " + variantName }],
      metadata: { orderId, productName, variantName, quantity: quantity.toString(), customerEmail, customerWhatsapp: customerWhatsapp || "", outputType: outputType || "text", outputValue: outputValue || "", totalAmount: totalAmount.toString() },
      callbacks: {
        finish: "https://opalstore.app/payment/success?order_id=" + orderId,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    console.log("Transaction created:", transaction.token, "orderId:", orderId);

    // If old orderId provided, update DB with new orderId and token
    if (body.orderId) {
      const existing = await Transaction.findOne({ orderId: body.orderId });
      if (existing) {
        existing.orderId = orderId;
        existing.midtransToken = transaction.token;
        existing.status = "pending";
        await existing.save();
        console.log("Updated transaction:", body.orderId, "->", orderId);
      }
    }

    return NextResponse.json({ token: transaction.token, orderId, oldOrderId: body.orderId || null });

  } catch (error: any) {
    const errorMsg = error?.response?.data?.error_messages?.[0] || error?.message || "Failed to create transaction";
    console.error("Midtrans checkout error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
