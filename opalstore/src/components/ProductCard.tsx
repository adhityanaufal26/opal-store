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
    // Try durationMonths first (stored in DB)
    let months = (variant as any).durationMonths;
    // Fallback: parse from variant name
    if (!months) {
      const match = variant.name.match(/(\d+)\s*Bulan/i);
      if (match) months = parseInt(match[1]);
    }
    if (months && months > 0) {
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
  const isOutOfStock = totalStock === 0;

  // Don't show monthly price if all variants have 0 stock
  const showMonthlyPrice = minMonthly && !isOutOfStock;

  return (
    <Link href={`/dashboard/${product.slug}`}>
      <div
        className="card group overflow-hidden h-full"
        style={{ padding: 0, opacity: isOutOfStock ? 0.6 : 1, transition: "opacity 0.2s ease", overflow: "hidden" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", height: "auto", background: "linear-gradient(135deg, rgba(255,107,44,0.08), rgba(139,92,246,0.08))" }}>
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {totalStock > 0 ? (
            <div className="absolute top-1 right-1">
              <span style={{ padding: "2px 6px", fontSize: "10px", fontWeight: "600", borderRadius: "4px", background: "rgba(52,211,153,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                Stok: {totalStock}
              </span>
            </div>
          ) : (
            <>
              {/* Out-of-stock badge in top-right */}
              <div className="absolute top-1 right-1 z-10">
                <span style={{ padding: "2px 6px", fontSize: "10px", fontWeight: "600", borderRadius: "4px", background: "rgba(248,113,113,0.2)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                  Habis
                </span>
              </div>
            </>
          )}
        </div>

        {/* Name & Price */}
        <div style={{ padding: "10px" }}>
          <h3
            style={{ fontWeight: "700", fontSize: "13px", textAlign: "center", marginBottom: "4px", color: isOutOfStock ? "#9ca3af" : "white", lineHeight: "1.3" }}
          >
            {product.name}
          </h3>
          {showMonthlyPrice && (
            <p style={{ textAlign: "center", fontSize: "11px", color: "#FF6B2C", fontWeight: "600" }}>
              Mulai {formatPrice(minMonthly)}/bulan
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
