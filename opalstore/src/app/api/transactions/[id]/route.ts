import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

async function reduceStock(productName: string, variantName: string, quantity: number) {
  try {
    await connectDB();
    const product = await Product.findOne({ name: productName });
    if (!product) return;
    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) return;
    variant.stock = Math.max(0, variant.stock - quantity);
    await product.save();
    console.log(`Stock reduced: ${product.name} - ${variantName} => ${variant.stock}`);
  } catch (err) {
    console.error("Error reducing stock:", err);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const transaction = await Transaction.findOne({ orderId: id, userId: sessionEmail });
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch transaction" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Only allow cancelling own transactions
    if (body.status !== "cancelled") {
      return NextResponse.json({ success: false, error: "Only cancellation is allowed" }, { status: 403 });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id, userId: sessionEmail },
      { status: "cancelled" },
      { new: true }
    );
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}

// PATCH handler - auth required, only allow cancel
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (body.status !== "cancelled") {
      return NextResponse.json({ success: false, error: "Only cancellation is allowed" }, { status: 403 });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id, userId: sessionEmail },
      { status: "cancelled" },
      { new: true }
    );
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}

// POST handler - auth required, only allow cancel
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (body.status !== "cancelled") {
      return NextResponse.json({ success: false, error: "Only cancellation is allowed" }, { status: 403 });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id, userId: sessionEmail },
      { status: "cancelled" },
      { new: true }
    );
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}
