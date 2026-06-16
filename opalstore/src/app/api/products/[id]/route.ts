import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { isAdmin } from "@/lib/data";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;
  if (!email || !isAdmin(email)) return null;
  return session;
}

function sanitizeProduct(p: any) {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    image: p.image,
    isActive: p.isActive,
    variants: p.variants?.map((v: any) => ({
      name: v.name,
      price: v.price,
      stock: v.stock || 0,
      inStock: (v.stock || 0) > 0,
    })),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Check if admin request
    const { searchParams } = new URL(request.url);
    if (searchParams.get("admin") === "true") {
      const session = await requireAdmin();
      if (session) {
        return NextResponse.json({ success: true, data: product });
      }
    }

    // Public: strip internal fields
    return NextResponse.json({ success: true, data: sanitizeProduct(product) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
