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
  const isOutOfStock = totalStock === 0;
  const showMonthlyPrice = minMonthly && !isOutOfStock;

  return (
    <Link href={`/dashboard/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: 0, opacity: isOutOfStock ? 0.5 : 1, transition: "opacity 0.2s ease", overflow: "hidden" }}>
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", maxHeight: "200px", background: "#1a1a1a", overflow: "hidden" }}>
          <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {totalStock > 0 ? (
            <div style={{ position: "absolute", top: "12px", right: "12px" }}>
              <span style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "8px", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                Stok: {totalStock}
              </span>
            </div>
          ) : (
            <div style={{ position: "absolute", top: "12px", right: "12px" }}>
              <span style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "8px", background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Name & Price */}
        <div style={{ padding: "16px" }}>
          <h3 style={{ fontWeight: "700", fontSize: "14px", textAlign: "center", marginBottom: "6px", color: isOutOfStock ? "#71717a" : "#fff" }}>
            {product.name}
          </h3>
          {showMonthlyPrice && (
            <p style={{ textAlign: "center", fontSize: "12px", color: "#3b82f6", fontWeight: "600" }}>
              Mulai {formatPrice(minMonthly)}/bulan
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
