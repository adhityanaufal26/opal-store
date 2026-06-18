"use client";

import { useState, useEffect, Suspense } from "react";
import ProductCard from "@/components/ProductCard";

import { Product } from "@/lib/types";

function SearchIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555555" }}>
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
    fetch("/api/products?distinct=category").then(r => r.json()).then(d => {
      if (d.success) setCategories(d.data);
    });
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
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
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px", letterSpacing: "-0.01em" }}>Produk Digital</h1>
          <p style={{ color: "#999999", fontSize: "15px" }}>Pilih produk yang Anda butuhkan</p>
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
              style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.04)", border: "2px solid #2A2A2A", borderRadius: "4px", color: "#fff", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{ padding: "10px 20px", borderRadius: "4px", border: selectedCategory === "all" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)", background: selectedCategory === "all" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)", color: selectedCategory === "all" ? "#fff" : "#999999", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >Semua</button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: "10px 20px", borderRadius: "4px", border: selectedCategory === cat ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)", background: selectedCategory === cat ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)", color: selectedCategory === cat ? "#FF6B2C" : "#999999", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#555555", fontSize: "15px" }}>Tidak ada produk ditemukan</p>
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