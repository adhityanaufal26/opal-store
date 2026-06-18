import { NextRequest, NextResponse } from "next/server";

// Fee structure from Tripay (fee_customer) — verified from sandbox API
const FEE_STRUCTURE: Record<string, { flat: number; percent: number; min: number }> = {
  QRISC: { flat: 750, percent: 0.7, min: 855 },
  OVO: { flat: 0, percent: 3, min: 1000 },
  DANA: { flat: 0, percent: 3, min: 1000 },
  SHOPEEPAY: { flat: 0, percent: 3, min: 1000 },
};

export async function GET(req: NextRequest) {
  const amount = parseInt(req.nextUrl.searchParams.get("amount") || "0");
  const method = req.nextUrl.searchParams.get("method") || "";

  if (!amount || !method) {
    return NextResponse.json({ error: "Missing amount or method" }, { status: 400 });
  }

  const structure = FEE_STRUCTURE[method];
  if (structure) {
    const calculated = structure.flat + Math.round(amount * structure.percent / 100);
    const fee = Math.max(calculated, structure.min);
    return NextResponse.json({ success: true, fee, total: amount + fee });
  }

  return NextResponse.json({ success: true, fee: 0, total: amount });
}
