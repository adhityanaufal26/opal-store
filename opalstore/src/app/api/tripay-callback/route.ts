import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Product from "@/models/Product";

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;

// Telegram admin notification for status changes (fire-and-forget)
function notifyStatus(data: { orderId: string; product: string; variant: string; qty: number; email: string; wa: string; amount: number; expectedAmount: number; unitPrice: number; status: string; duration: number | null }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;
  const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.amount);
  const unitFmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.unitPrice);
  const expectedFmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.expectedAmount);
  const statusEmoji: Record<string, string> = { success: "✅ PAID", pending: "⏳ Pending", cancelled: "❌ Expired", failed: "❌ Failed" };
  const statusLabel = statusEmoji[data.status] || data.status;
  const durationLabel = data.duration ? data.duration + " bulan" : "-";
  const waClean = data.wa.replace(/[^0-9]/g, "");
  const waLink = waClean ? "https://wa.me/" + waClean : "";
  const lines = [
    "💰 *Pembayaran " + (data.status === "success" ? "Berhasil!" : "Gagal/Expired") + "*",
    "",
    "🆔 `" + data.orderId + "`",
    "📦 " + data.product + " — " + data.variant,
    "🔢 Qty: " + data.qty,
    "⏰ Durasi: " + durationLabel,
    "💰 Harga: " + unitFmt + " × " + data.qty + " = " + expectedFmt,
    "📋 Status: " + statusLabel,
    "",
    "👤 " + data.email,
    "📱 " + data.wa,
    ...(waLink ? ["💬 [Chat WhatsApp](" + waLink + ")"] : []),
  ];
  fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "Markdown" }),
  }).catch((e) => { console.error("Telegram notify failed:", e); });
}

function parseDuration(variantName: string): number | null {
  const match = variantName.match(/(\d+)\s*Bulan/i);
  return match ? parseInt(match[1]) : null;
}

async function reduceStock(productId: string, productName: string, variantName: string, quantity: number) {
  try {
    await connectDB();
    let product = null;
    if (productId && /^[0-9a-fA-F]{24}$/.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ name: productName });
    }
    if (!product) {
      console.error("Product not found for stock reduction:", productName, productId);
      return;
    }

    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) {
      console.error("Variant not found for stock reduction:", variantName);
      return;
    }

    variant.stock = Math.max(0, variant.stock - quantity);
    await product.save();
    console.log(`Stock reduced: ${product.name} - ${variantName} => ${variant.stock}`);
  } catch (err) {
    console.error("Error reducing stock:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log("=== TRIPAY CALLBACK ===");
    console.log("Callback received:", JSON.stringify(body, null, 2));

    // Handle both wrapped format (sandbox: {data, signature}) and flat format (production: direct data)
    let callbackSignature: string | undefined;
    let data: any;

    if (body.data && body.signature) {
      // Wrapped format (sandbox)
      callbackSignature = body.signature;
      data = body.data;
    } else if (body.merchant_ref && body.status) {
      // Flat format (production) — data is the body itself
      // Try to get signature from header
      callbackSignature = req.headers.get("x-signature") || req.headers.get("x-callback-signature") || undefined;
      data = body;
      console.log("Production flat callback format detected");
    } else {
      console.error("Unknown callback format:", Object.keys(body));
      return NextResponse.json(
        { error: "Unknown callback format" },
        { status: 400 }
      );
    }

    // Signature is mandatory
    if (!callbackSignature) {
      console.error("No signature provided — rejecting callback");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const dataString = JSON.stringify(data);
    const expectedSignature = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(dataString)
      .digest("hex");

    if (callbackSignature !== expectedSignature) {
      console.error("Signature mismatch");
      console.error("Expected:", expectedSignature);
      console.error("Received:", callbackSignature);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
    console.log("Signature verified OK");

    const merchantRef = data.merchant_ref;
    const status = data.status;
    const reference = data.reference;

    console.log("Merchant Ref:", merchantRef);
    console.log("Status:", status);
    console.log("Reference:", reference);

    // Map Tripay status to our status
    let orderStatus = "pending";
    
    switch (status) {
      case "PAID":
        orderStatus = "success";
        break;
      case "UNPAID":
        orderStatus = "pending";
        break;
      case "EXPIRED":
        orderStatus = "cancelled";
        break;
      case "FAILED":
        orderStatus = "failed";
        break;
      case "REFUND":
        orderStatus = "cancelled";
        break;
      default:
        orderStatus = "pending";
    }

    console.log("Final order status:", orderStatus);

    // Update transaction in database
    await connectDB();
    const transaction = await Transaction.findOne({ orderId: merchantRef });
    
    if (transaction) {
      const wasNotSuccess = transaction.status !== "success";
      // Only reduce stock on first success (not if already success)
      if (orderStatus === "success" && wasNotSuccess) {
        await reduceStock(transaction.productId, transaction.productName, transaction.variantName, transaction.quantity);
      }
      
      transaction.status = orderStatus;
      transaction.tripayStatus = status;
      transaction.tripayReference = reference;
      await transaction.save();
      console.log("Transaction updated:", merchantRef, "=>", orderStatus);

      // Notify admin on status change (only when transitioning to paid/expired/failed)
      if (wasNotSuccess && orderStatus !== "pending") {
        console.log("Sending Telegram notification for:", merchantRef);
        notifyStatus({
          orderId: merchantRef,
          product: transaction.productName,
          variant: transaction.variantName,
          qty: transaction.quantity,
          email: transaction.email,
          wa: transaction.whatsappNumber || "",
          amount: transaction.amount,
          expectedAmount: Math.round(transaction.amount / transaction.quantity) * transaction.quantity,
          unitPrice: Math.round(transaction.amount / transaction.quantity),
          status: orderStatus,
          duration: parseDuration(transaction.variantName),
        });
      }
    } else {
      console.log("Transaction not found in DB:", merchantRef);
    }

    return NextResponse.json({ status: "ok", merchantRef, orderStatus });

  } catch (error: any) {
    console.error("Tripay callback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process callback" },
      { status: 500 }
    );
  }
}
