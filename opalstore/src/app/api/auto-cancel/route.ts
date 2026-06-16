import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// Auto-cancel pending transactions older than 1 hour
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const ONE_HOUR = 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - ONE_HOUR);

    const result = await Transaction.updateMany(
      { status: "pending", createdAt: { $lt: cutoff } },
      { status: "cancelled" }
    );

    return NextResponse.json({
      success: true,
      cancelled: result.modifiedCount,
    });
  } catch (error) {
    console.error("Auto-cancel error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
