"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/data";

interface Variant {
  name: string;
  price: string;
  stock: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  isActive: boolean;
  variants: { name: string; price: number; stock: number }[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "Digital Subscription",
    image: "/images/products/default.jpg",
    isActive: true,
  });
  const [variants, setVariants] = useState<Variant[]>([{ name: "", price: "", stock: "" }]);

  const currentEmail = session?.user?.email || user?.email || "";
  const isUserAdmin = isAdmin(currentEmail);

  useEffect(() => {
    if (!isLoading && !user && !session) {
      router.push("/login");
      return;
    }
    if (!isLoading && !isUserAdmin) {
      alert("Akses ditolak! Hanya admin yang bisa mengakses halaman ini.");
      router.push("/dashboard");
    }
  }, [user, session, isLoading, isUserAdmin, router]);

  useEffect(() => {
    if (isUserAdmin) fetchProducts();
  }, [isUserAdmin]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", category: "Digital Subscription", image: "/images/products/default.jpg", isActive: true });
    setVariants([{ name: "", price: "", stock: "" }]);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category || "Digital Subscription",
      image: product.image || "/images/products/default.jpg",
      isActive: product.isActive !== false,
    });
    setVariants(
      product.variants?.length > 0
        ? product.variants.map(v => ({ name: v.name, price: v.price.toString(), stock: v.stock.toString() }))
        : [{ name: "", price: "", stock: "" }]
    );
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert("Upload gagal: " + data.error);
      }
    } catch (err) {
      alert("Upload gagal!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      alert("Nama dan deskripsi harus diisi!");
      return;
    }

    const validVariants = variants.filter(v => v.name && v.price && v.stock);
    if (validVariants.length === 0) {
      alert("Minimal 1 variant harus diisi!");
      return;
    }

    setSaving(true);

    const productData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description,
      category: formData.category,
      image: formData.image,
      isActive: formData.isActive,
      variants: validVariants.map(v => ({ name: v.name, price: parseInt(v.price), stock: parseInt(v.stock) })),
    };

    try {
      let res;
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        res = await fetch("/api/products/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      const data = await res.json();
      if (data.success) {
        alert(editingProduct ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert("Error: " + (data.error || "Gagal menyimpan"));
      }
    } catch (err) {
      alert("Error menyimpan produk!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/products/" + id, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Produk berhasil dihapus!");
        setDeleteConfirm(null);
        fetchProducts();
      }
    } catch (err) {
      alert("Error menghapus produk!");
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const id = product._id || product.id;
      await fetch("/api/products/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const addVariant = () => setVariants([...variants, { name: "", price: "", stock: "" }]);
  const removeVariant = (i: number) => { if (variants.length > 1) setVariants(variants.filter((_, idx) => idx !== i)); };
  const updateVariant = (i: number, field: string, val: string) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: val };
    setVariants(updated);
  };

  if (isLoading || loadingProducts) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p></div>;
  }

  if (!isUserAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Kembali
            </Link>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white" }}>Admin Panel</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Kelola produk Anda</p>
          </div>
          <button onClick={openAddModal} style={{ padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg, #e84393, #6c5ce7)", color: "white", fontWeight: "600", fontSize: "14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tambah Produk
          </button>
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gap: "16px" }}>
          {products.map((product) => {
            const id = product._id || product.id;
            return (
              <div key={id} style={{ background: "#161b22", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Image */}
                <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.05)" }}>
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h3 style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>{product.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "8px" }}>{product.description?.substring(0, 80)}...</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(217,119,6,0.1)", color: "#c49a6c", fontSize: "12px" }}>{product.variants?.length || 0} variant</span>
                    <span style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(139,92,246,0.1)", color: "#a78bfa", fontSize: "12px" }}>{formatPrice(Math.min(...(product.variants?.map(v => v.price) || [0])))}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={() => toggleActive(product)} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: product.isActive ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", color: product.isActive ? "#34d399" : "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                  <button onClick={() => openEditModal(product)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", cursor: "pointer" }} title="Edit">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => id ? setDeleteConfirm(id) : null} style={{ padding: "8px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#ef4444", cursor: "pointer" }} title="Hapus">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div style={{ background: "#161b22", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", padding: "60px", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>Belum ada produk. Klik "Tambah Produk" untuk menambahkan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100 }} onClick={() => setShowModal(false)} />
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "16px" }}>
            <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflow: "auto" }}>
              {/* Modal Header */}
              <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#161b22", zIndex: 10 }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>{editingProduct ? "Edit Produk" : "Tambah Produk"}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px" }}>
                {/* Image Upload */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "8px" }}>Foto Produk</label>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {formData.image && formData.image !== "/images/products/default.jpg" ? (
                        <img src={formData.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      )}
                    </div>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                      <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.1)", color: "#c49a6c", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "8px" }}>
                        {uploading ? "Uploading..." : "Upload Foto"}
                      </button>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>JPG, PNG, WebP (max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Nama Produk *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Contoh: Gemini Pro" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none" }} />
                </div>

                {/* Description */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Deskripsi *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi produk..." rows={4} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", resize: "vertical" }} />
                </div>

                {/* Variants */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Variant Produk *</label>
                    <button type="button" onClick={addVariant} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.1)", color: "#c49a6c", fontSize: "12px", cursor: "pointer" }}>+ Tambah Variant</button>
                  </div>
                  {variants.map((variant, index) => (
                    <div key={index} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Variant {index + 1}</span>
                        {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}>Hapus</button>}
                      </div>
                      <input type="text" value={variant.name} onChange={(e) => updateVariant(index, "name", e.target.value)} placeholder="Nama variant" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", fontSize: "13px", outline: "none", marginBottom: "8px" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <input type="number" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} placeholder="Harga (Rp)" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", fontSize: "13px", outline: "none" }} />
                        <input type="number" value={variant.stock} onChange={(e) => updateVariant(index, "stock", e.target.value)} placeholder="Stok" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", fontSize: "13px", outline: "none" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Toggle */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                    <div style={{ width: "44px", height: "24px", borderRadius: "12px", background: formData.isActive ? "#c49a6c" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: formData.isActive ? "22px" : "2px", transition: "left 0.2s" }} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>{formData.isActive ? "Produk Aktif" : "Produk Nonaktif"}</span>
                  </label>
                </div>

                {/* Save Button */}
                <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: saving ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #e84393, #6c5ce7)", color: "white", fontWeight: "bold", fontSize: "16px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Menyimpan..." : (editingProduct ? "Simpan Perubahan" : "Tambah Produk")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100 }} onClick={() => setDeleteConfirm(null)} />
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: "16px" }}>
            <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", maxWidth: "400px", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Hapus Produk?</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "24px" }}>Produk akan dihapus permanen.</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", cursor: "pointer" }}>Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#ef4444", color: "white", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}>Hapus</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
