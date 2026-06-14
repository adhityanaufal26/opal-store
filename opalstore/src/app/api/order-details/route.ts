import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    // In production, fetch from database
    // For now, parse from order ID format or return mock data
    
    // For demo, we'll return a success response
    // In real implementation, query your database with orderId
    return NextResponse.json({
      orderId: orderId,
      paymentStatus: "paid",
      customerEmail: "customer@example.com",
      customerWhatsapp: "",
      productName: "Product",
      variantName: "Variant",
      quantity: 1,
      totalAmount: 0,
      outputType: "text",
      outputValue: "Pesanan Anda sedang diproses. Admin akan menghubungi Anda via WhatsApp dalam 1x24 jam.",
      paidAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
