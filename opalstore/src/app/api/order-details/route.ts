import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    await connectDB();
    const transaction = await Transaction.findOne({ orderId }).lean();

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      orderId: transaction.orderId,
      paymentStatus: transaction.status,
      customerEmail: transaction.email,
      customerWhatsapp: transaction.whatsappNumber,
      productName: transaction.productName,
      variantName: transaction.variantName,
      quantity: transaction.quantity,
      totalAmount: transaction.amount,
      tripayStatus: transaction.tripayStatus,
      tripayReference: transaction.tripayReference,
      outputType: "text",
      outputValue: "Pesanan Anda sedang diproses. Admin akan menghubungi Anda via WhatsApp dalam 1x24 jam.",
      paidAt: transaction.status === "success" ? transaction.updatedAt : null,
    });
  } catch (error: any) {
    console.error("Fetch order error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch order details" }, { status: 500 });
  }
}
