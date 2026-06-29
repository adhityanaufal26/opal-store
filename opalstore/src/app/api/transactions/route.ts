import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET(request: NextRequest) {
  // Require authentication — only return transactions for the logged-in user
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // If user is logged in, only allow querying their own transactions
    // If not logged in, deny access (except for midtrans notification internally)
    if (!sessionEmail) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    // Security: logged-in user can only query their own transactions
    if (userId !== sessionEmail && sessionEmail) {
      // Allow if the user is querying their own email
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    let query: any = { userId };
    if (status && status !== "all") {
      query.status = status;
    }

    // Auto-cancel pending transactions older than 30 minutes
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    await Transaction.updateMany(
      { userId, status: "pending", createdAt: { $lt: thirtyMinAgo } },
      { status: "cancelled" }
    );

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Require authentication
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    // Basic validation
    if (!body.orderId || !body.productName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Force userId and email to session user, status always pending
    const transaction = await Transaction.create({
      ...body,
      userId: sessionEmail,
      email: sessionEmail,
      status: "pending",
    });
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ success: false, error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Require authentication
  const session = await getServerSession(authOptions);
  const sessionEmail = session?.user?.email || null;
  if (!sessionEmail) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Missing orderId or status" }, { status: 400 });
    }

    // Only allow cancelling own transactions
    if (status !== "cancelled") {
      return NextResponse.json({ success: false, error: "Only cancellation is allowed" }, { status: 403 });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { orderId, userId: sessionEmail },
      { status },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 });
  }
}
