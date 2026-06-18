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

// Serialize product for public API — strip internal fields
function serializeProduct(product: any) {
  const obj = product.toObject ? product.toObject() : { ...product };
  return {
    id: obj._id?.toString() || obj.id,
    name: obj.name,
    slug: obj.slug,
    description: obj.description,
    category: obj.category,
    image: obj.image,
    isActive: obj.isActive,
    variants: obj.variants?.map((v: any) => ({
      name: v.name,
      price: v.price,
      stock: v.stock || 0,
      inStock: (v.stock || 0) > 0,
      durationMonths: v.durationMonths || null,
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const slug = searchParams.get("slug");
    const admin = searchParams.get("admin");

    let isAdminRequest = false;
    if (admin === "true") {
      const session = await requireAdmin();
      isAdminRequest = !!session;
    }

    // Return distinct categories
    const distinct = searchParams.get("distinct");
    if (distinct === "category") {
      const cats = await Product.distinct("category");
      const flat = cats.flat().filter(Boolean);
      return NextResponse.json({ success: true, data: [...new Set(flat)] });
    }

    let query: any = {};
    if (slug) query.slug = slug;
    if (category && category !== "all") query.category = { $in: [category] };
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });

    if (isAdminRequest) {
      return NextResponse.json({ success: true, data: products });
    }

    // Public: serialize to strip _id, stock, timestamps
    const sanitized = products.map(serializeProduct);
    return NextResponse.json({ success: true, data: sanitized });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}