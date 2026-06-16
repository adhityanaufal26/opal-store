import { NextRequest, NextResponse } from "next/server";
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
  try {
    await connectDB();
    const { id } = await params;
    const transaction = await Transaction.findOne({ orderId: id });
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
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // If setting status to success, reduce stock
    if (body.status === "success") {
      const existing = await Transaction.findOne({ orderId: id });
      if (existing && existing.status !== "success") {
        await reduceStock(existing.productName, existing.variantName, existing.quantity);
      }
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id },
      body,
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

// PATCH handler for fetch keepalive (same as PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    console.log(`[PATCH] Updating transaction ${id}:`, body);

    // If setting status to success, reduce stock
    if (body.status === "success") {
      const existing = await Transaction.findOne({ orderId: id });
      if (existing && existing.status !== "success") {
        await reduceStock(existing.productName, existing.variantName, existing.quantity);
      }
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id },
      body,
      { new: true }
    );
    if (!transaction) {
      console.log(`[PATCH] Transaction not found: ${id}`);
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    console.log(`[PATCH] Transaction updated: ${id} => ${transaction.status}`);
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error("[PATCH] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}

// POST handler for sendBeacon (always sends POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // If setting status to success, reduce stock
    if (body.status === "success") {
      const existing = await Transaction.findOne({ orderId: id });
      if (existing && existing.status !== "success") {
        await reduceStock(existing.productName, existing.variantName, existing.quantity);
      }
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId: id },
      body,
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
