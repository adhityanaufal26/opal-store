import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product & { variants?: { name: string; price: number; stock?: number; inStock?: boolean }[]; image?: string };
}

function getTotalStock(product: ProductCardProps["product"]): number {
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return 0;
}

function getMinMonthlyPrice(product: ProductCardProps["product"]): number | null {
  if (!product.variants || product.variants.length === 0) return null;
  let minMonthly = Infinity;
  for (const variant of product.variants) {
    const months = variant.durationMonths || (() => {
      const match = variant.name.match(/(\d+)\s*Bulan/i);
      return match ? parseInt(match[1]) : 0;
    })();
    if (months > 0) {
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
        <div style={{ position: "relative", aspectRatio: "1/1", background: "#0C0C0C", overflow: "hidden", padding: "12px", borderRadius: "8px" }}>
          <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          {totalStock > 0 ? (
            <span style={{ position: "absolute", top: "6px", right: "6px", padding: "2px 7px", fontSize: "10px", fontWeight: "600", borderRadius: "6px", background: "rgba(0,214,143,0.15)", color: "#00D68F", border: "1px solid rgba(0,214,143,0.2)" }}>
              Stok: {totalStock}
            </span>
          ) : (
            <span style={{ position: "absolute", top: "6px", right: "6px", padding: "2px 7px", fontSize: "10px", fontWeight: "600", borderRadius: "6px", background: "rgba(255,77,106,0.15)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.2)" }}>
              Habis
            </span>
          )}
          {product.category && (
            <span style={{ position: "absolute", bottom: "6px", left: "6px", padding: "2px 7px", fontSize: "9px", fontWeight: "600", borderRadius: "6px", background: "rgba(255,255,255,0.08)", color: "#999999", border: "1px solid rgba(255,255,255,0.06)" }}>
              {typeof product.category === 'object' ? (product.category as any).name : String(product.category)}
            </span>
          )}
        </div>

        <div style={{ padding: "10px 8px", minHeight: "44px" }}>
          <h3 style={{ fontWeight: "700", fontSize: "12px", textAlign: "center", marginBottom: "3px", color: isOutOfStock ? "#555555" : "#fff", lineHeight: "1.3" }}>
            {product.name}
          </h3>
          <p style={{ textAlign: "center", fontSize: "11px", color: isOutOfStock ? "transparent" : "#FF6B2C", fontWeight: "600" }}>
            {minMonthly && !isOutOfStock ? `Mulai ${formatPrice(minMonthly)}/bln` : "\u00A0"}
          </p>
        </div>
      </div>
    </Link>
  );
}