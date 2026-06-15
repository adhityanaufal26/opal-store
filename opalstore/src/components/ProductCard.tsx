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

  return (
    <Link href={`/dashboard/${product.slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: 0, opacity: isOutOfStock ? 0.5 : 1, transition: "opacity 0.2s ease", overflow: "hidden" }}>
        <div style={{ position: "relative", aspectRatio: "1/1", background: "#1a1a1a", overflow: "hidden" }}>
          <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {totalStock > 0 ? (
            <span style={{ position: "absolute", top: "6px", right: "6px", padding: "2px 7px", fontSize: "10px", fontWeight: "600", borderRadius: "6px", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
              Stok: {totalStock}
            </span>
          ) : (
            <span style={{ position: "absolute", top: "6px", right: "6px", padding: "2px 7px", fontSize: "10px", fontWeight: "600", borderRadius: "6px", background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              Habis
            </span>
          )}
        </div>

        <div style={{ padding: "10px 8px", minHeight: "44px" }}>
          <h3 style={{ fontWeight: "700", fontSize: "12px", textAlign: "center", marginBottom: "3px", color: isOutOfStock ? "#71717a" : "#fff", lineHeight: "1.3" }}>
            {product.name}
          </h3>
          <p style={{ textAlign: "center", fontSize: "11px", color: isOutOfStock ? "transparent" : "#f59e0b", fontWeight: "600" }}>
            {minMonthly && !isOutOfStock ? `Mulai ${formatPrice(minMonthly)}/bln` : "\u00A0"}
          </p>
        </div>
      </div>
    </Link>
  );
}
