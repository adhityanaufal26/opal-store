"use client";

import { useState, useEffect, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

function SearchIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}>
      <circle cx={11} cy={11} r={8}/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function DashboardContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        const cats = new Set<string>();
        data.data.forEach((p: any) => {
          if (Array.isArray(p.category)) p.category.forEach((c: string) => cats.add(c));
          else if (p.category) cats.add(p.category);
        });
        setCategories(Array.from(cats).sort());
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeProducts = products.filter(p => p.isActive);

  const filtered = activeProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || (Array.isArray(p.category) ? p.category.includes(selectedCategory) : p.category === selectedCategory);
    return matchSearch && matchCategory;
  }).sort((a, b) => {
    const getStock = (p: any) => p.variants?.length > 0 ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0) : (p.stock || 0);
    return getStock(b) - getStock(a);
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>Produk Digital</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Pilih produk yang Anda butuhkan</p>
        </div>

        {/* Search + Filter Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "250px", maxWidth: "400px" }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{ padding: "10px 20px", borderRadius: "10px", border: selectedCategory === "all" ? "1px solid rgba(255,107,44,0.5)" : "1px solid rgba(255,255,255,0.1)", background: selectedCategory === "all" ? "rgba(255,107,44,0.15)" : "rgba(255,255,255,0.05)", color: selectedCategory === "all" ? "#FF6B2C" : "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >Semua</button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: "10px 20px", borderRadius: "10px", border: selectedCategory === cat ? "1px solid rgba(255,107,44,0.5)" : "1px solid rgba(255,255,255,0.1)", background: selectedCategory === cat ? "rgba(255,107,44,0.15)" : "rgba(255,255,255,0.05)", color: selectedCategory === cat ? "#FF6B2C" : "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
