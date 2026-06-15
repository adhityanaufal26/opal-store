import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product & { variants?: { name: string; price: number; stock: number }[]; image?: string };
}

function getTotalStock(product: ProductCardProps["product"]): number {
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return product.stock || 0;
}

function getMinMonthlyPrice(product: ProductCardProps["product"]): number | null {
  if (!product.variants || product.variants.length === 0) return null;
  let minMonthly = Infinity;
  for (const variant of product.variants) {
    const match = variant.name.match(/(\d+)\s*Bulan/i);
    if (match) {
      const months = parseInt(match[1]);
      const monthly = variant.price / months;
      if (monthly < minMonthly) minMonthly = monthly;
    }
  }
  return minMonthly === Infinity ? null : Math.round(minMonthly);
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
  const minMonthly = getMinMonthlyPrice(product);
  const totalStock = getTotalStock(product);
  const imageUrl = product.image || product.preview_image;

  return (
    <Link href={`/dashboard/${product.slug}`}>
      <div className="card group overflow-hidden h-full" style={{ padding: 0 }}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", height: "auto", background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.08))" }}>
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {totalStock > 0 ? (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Stok: {totalStock}
              </span>
            </div>
          ) : (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div className="p-4">
          <h3 className="font-bold text-base group-hover:text-primary-light transition-colors text-center mb-2">
            {product.name}
          </h3>
          {minMonthly && (
            <p style={{ textAlign: "center", fontSize: "13px", color: "#0ea5e9", fontWeight: "600" }}>
              Mulai {formatPrice(minMonthly)}/bulan
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
