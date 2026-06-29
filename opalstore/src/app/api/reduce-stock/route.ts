import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    await connectDB();

    // Find transaction
    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    // Check if already processed
    if (transaction.status === "success") {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Update transaction status
    transaction.status = "success";
    await transaction.save();

    // Reduce stock
    const product = await Product.findOne({ name: transaction.productName });
    if (product) {
      const variant = product.variants.find((v: any) => v.name === transaction.variantName);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - transaction.quantity);
        await product.save();
        console.log(`Stock reduced: ${product.name} - ${variant.name} => ${variant.stock}`);
      }
    }

    return NextResponse.json({ success: true, message: "Stock reduced successfully" });
  } catch (error) {
    console.error("Error reducing stock:", error);
    return NextResponse.json({ success: false, error: "Failed to reduce stock" }, { status: 500 });
  }
}
