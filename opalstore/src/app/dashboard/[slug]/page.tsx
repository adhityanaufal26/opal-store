"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/lib/transaction-context";

declare global {
  interface Window {
    snap: any;
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const { addTransaction, updateTransactionStatus, refreshTransactions } = useTransactions();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    whatsapp: user?.phone || "",
    email: user?.email || session?.user?.email || "",
  });

  const [errors, setErrors] = useState({
    whatsapp: "",
    email: "",
  });

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchProduct();
  }, [params]);

  const fetchProduct = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        const found = data.data.find((p: any) => p.slug === params?.slug);
        if (found) {
          setProduct(found);
          if (found.variants && found.variants.length > 0) {
            const firstInStock = found.variants.find((v: any) => v.inStock !== false);
            setSelectedVariant(firstInStock ? firstInStock.name : found.variants[0].name);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userEmail = session?.user?.email || user?.email || "";
    const userPhone = user?.phone || "";
    if (userEmail || userPhone) {
      setFormData({ whatsapp: userPhone, email: userEmail });
    }
  }, [user, session]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner" /></div>;
  }

  if (!product) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#555555" }}>Produk tidak ditemukan</p></div>;
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const currentVariant = product.variants?.find((v: any) => v.name === selectedVariant);
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displayStock = currentVariant?.stock || 0;
  const displayVariantInStock = currentVariant ? currentVariant.inStock !== false : true;
  const displayName = currentVariant ? currentVariant.name : product.name;
  const totalPrice = displayPrice * quantity;

  const getMonthlyPrice = (): number | null => {
    if (!currentVariant) return null;
    const months = currentVariant.durationMonths || (() => {
      const match = currentVariant.name.match(/(\d+)\s*Bulan/i);
      return match ? parseInt(match[1]) : 0;
    })();
    if (months > 0) return Math.round(currentVariant.price / months);
    return null;
  };

  const monthlyPrice = getMonthlyPrice();

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (displayStock && newQty > displayStock) return;
    setQuantity(newQty);
  };

  const validateWhatsapp = (value: string) => {
    const cleaned = value.replace(/[\s\-]/g, "");
    if (!cleaned) return "Nomor WhatsApp wajib diisi";
    if (!cleaned.startsWith("62")) return "Nomor harus diawali 62 (contoh: 628123456789)";
    if (!/^62\d{8,13}$/.test(cleaned)) return "Format nomor tidak valid (8-13 digit setelah 62)";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Format email tidak valid";
    return "";
  };

  const handleWhatsappChange = (value: string) => {
    const filtered = value.replace(/[^0-9\s\-]/g, "");
    setFormData({ ...formData, whatsapp: filtered });
    if (errors.whatsapp) setErrors({ ...errors, whatsapp: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !session) {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    const whatsappError = validateWhatsapp(formData.whatsapp);
    const emailError = validateEmail(formData.email);
    setErrors({ whatsapp: whatsappError, email: emailError });
    if (whatsappError || emailError) return;
    if (!displayVariantInStock) {
      showToast("Produk ini sedang habis!", "error");
      return;
    }
    if (displayStock && quantity > displayStock) {
      showToast("Stok tidak cukup! Maksimal " + displayStock + " pcs.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/midtrans-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          variantName: displayName,
          price: displayPrice,
          quantity: quantity,
          customerEmail: formData.email,
          customerWhatsapp: formData.whatsapp,
          outputType: "text",
          outputValue: "Pesanan Anda sedang diproses.",
        }),
      });

      const data = await response.json();
      if (data.error) {
        showToast(data.error, "error");
        setIsSubmitting(false);
        return;
      }

      const userEmail = session?.user?.email || user?.email || "";
      const userId = userEmail || formData.email;

      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          userId: userId,
          productId: product.id,
          productName: product.name,
          variantName: displayName,
          quantity: quantity,
          amount: totalPrice,
          paymentMethod: "midtrans",
          whatsappNumber: formData.whatsapp,
          email: formData.email,
          status: "pending",
          midtransToken: data.token,
        }),
      });

      addTransaction({
        id: Date.now().toString(),
        orderId: data.orderId,
        date: new Date().toISOString(),
        product: product.name,
        variant: displayName,
        quantity: quantity,
        total: totalPrice,
        paymentMethod: "midtrans",
        status: "pending",
        customerEmail: formData.email,
        customerWhatsapp: formData.whatsapp,
      });

      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: function(result: any) {
            console.log("Payment success:", result);
            // 1. Save proof in localStorage (sync - always completes)
            localStorage.setItem("opal_pay_" + data.orderId, "success");
            // 2. Update DB via sendBeacon (fire-and-forget, survives page unload)
            var payload = JSON.stringify({ status: "success", midtransStatus: "settlement" });
            var blob = new Blob([payload], { type: "application/json" });
            navigator.sendBeacon("/api/transactions/" + encodeURIComponent(data.orderId), blob);
            // 3. Redirect parent page (fallback if callbacks.finish doesn't work)
            window.location.href = "/payment/success?order_id=" + data.orderId;
          },
          onPending: function(result: any) {
            console.log("Payment pending:", result);
            showToast("Pembayaran pending. Silakan selesaikan pembayaran.", "info");
            setIsSubmitting(false);
          },
          onError: function(result: any) {
            console.log("Payment error:", result);
            updateTransactionStatus(data.orderId, "failed");
            showToast("Pembayaran gagal. Silakan coba lagi.", "error");
            setIsSubmitting(false);
          },
          onClose: function() {
            console.log("Payment popup closed");
            refreshTransactions();
            router.push("/transactions");
            setIsSubmitting(false);
          }
        });
      } else if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = !displayVariantInStock;

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/dashboard" style={{ color: "#555555", fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali
        </Link>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#141414", borderRadius: "6px", border: "2px solid #2A2A2A" }}>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={product.image} alt={product.name} style={{ width: "74px", height: "74px", objectFit: "contain", background: "transparent", borderRadius: "18px" }} />
            </div>
            <h1 style={{ fontSize: "17px", fontWeight: "800", color: "#fff", letterSpacing: "-0.01em", lineHeight: "1.2" }}>{product.name}</h1>
          </div>
          <p style={{ color: "#555555", fontSize: "12px", lineHeight: "1.6", marginTop: "10px", paddingLeft: "2px" }}>{product.description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#141414", borderRadius: "4px", border: "2px solid #2A2A2A", padding: "16px", marginBottom: "16px", opacity: isFormDisabled ? 0.5 : 1, pointerEvents: isFormDisabled ? "none" : "auto" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {displayVariantInStock ? (
                <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D68F", display: "inline-block" }}></span><span style={{ color: "#00D68F", fontSize: "13px", fontWeight: "500" }}>Stok: {displayStock}</span></>
              ) : (
                <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF4D6A", display: "inline-block" }}></span><span style={{ color: "#FF4D6A", fontSize: "13px", fontWeight: "500" }}>Stok habis</span></>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: "14px" }}>
                <p style={{ color: "#555555", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>Pilih Paket:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {product.variants.map((variant: any) => {
                    const variantMonths = variant.durationMonths || (() => {
                      const match = variant.name.match(/(\d+)\s*Bulan/i);
                      return match ? parseInt(match[1]) : 0;
                    })();
                    const variantMonthly = variantMonths > 0 ? Math.round(variant.price / variantMonths) : null;
                    const variantOutOfStock = variant.inStock === false;
                    return (
                      <button type="button" key={variant.name} disabled={variantOutOfStock} onClick={() => { if (!variantOutOfStock) setSelectedVariant(variant.name); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: "4px", border: selectedVariant === variant.name ? "1px solid rgba(255,107,44,0.4)" : "1px solid rgba(255,255,255,0.06)", background: selectedVariant === variant.name ? "rgba(255,107,44,0.08)" : "rgba(255,255,255,0.02)", cursor: variantOutOfStock ? "not-allowed" : "pointer", opacity: variantOutOfStock ? 0.35 : 1 }}>
                        <div style={{ textAlign: "left" }}>
                          <p style={{ color: variantOutOfStock ? "#555555" : "#fff", fontSize: "14px", fontWeight: "600" }}>{variant.name}{variantOutOfStock && " (Habis)"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <p style={{ color: variantOutOfStock ? "#FF4D6A" : "#555555", fontSize: "12px" }}>Stok: {variant.stock}</p>
                            {variantMonthly && <span style={{ color: "#FF6B2C", fontSize: "11px", fontWeight: "600", padding: "2px 6px", background: "rgba(255,107,44,0.08)", borderRadius: "4px" }}>{formatPrice(variantMonthly)}/bln</span>}
                          </div>
                        </div>
                        <span style={{ color: variantOutOfStock ? "#555555" : selectedVariant === variant.name ? "#FF6B2C" : "#999999", fontWeight: "700", fontSize: "15px", textDecoration: variantOutOfStock ? "line-through" : "none" }}>{formatPrice(variant.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {monthlyPrice && (
              <div style={{ marginBottom: "14px", padding: "16px", background: "rgba(255,107,44,0.06)", borderRadius: "4px", border: "1px solid rgba(255,107,44,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#FF6B2C"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <div>
                    <p style={{ color: "#555555", fontSize: "12px" }}>Harga per bulan</p>
                    <p style={{ color: "#FF6B2C", fontSize: "20px", fontWeight: "700" }}>{formatPrice(monthlyPrice)}<span style={{ fontSize: "14px", fontWeight: "500" }}>/bulan</span></p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "14px 0" }}></div>

            <div style={{ marginBottom: "14px" }}>
              <p style={{ color: "#555555", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>Jumlah:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: "4px", border: "2px solid #2A2A2A" }}>
                  <button type="button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} style={{ padding: "12px 16px", background: "none", border: "none", color: quantity <= 1 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: "18px", cursor: quantity <= 1 ? "not-allowed" : "pointer" }}>-</button>
                  <input type="number" min="1" max={displayStock || 99} value={quantity} onChange={(e) => { const val = parseInt(e.target.value); if (!isNaN(val) && val >= 1 && (!displayStock || val <= displayStock)) setQuantity(val); }} style={{ width: "60px", textAlign: "center", background: "none", border: "none", borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontSize: "16px", fontWeight: "700", outline: "none", padding: "12px 0" }} />
                  <button type="button" onClick={() => handleQuantityChange(quantity + 1)} disabled={displayStock ? quantity >= displayStock : false} style={{ padding: "12px 16px", background: "none", border: "none", color: displayStock && quantity >= displayStock ? "rgba(255,255,255,0.15)" : "#fff", fontSize: "18px", cursor: displayStock && quantity >= displayStock ? "not-allowed" : "pointer" }}>+</button>
                </div>
                <span style={{ color: "#555555", fontSize: "13px" }}>{displayStock ? "Maks. " + displayStock : ""}</span>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "14px 0" }}></div>

            <div style={{ marginBottom: "14px" }}>
              <p style={{ color: "#555555", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>Data Pembeli:</p>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#999999", fontSize: "13px", marginBottom: "6px" }}>Nomor WhatsApp *</label>
                <input type="tel" required placeholder="628123456789" value={formData.whatsapp} onChange={(e) => handleWhatsappChange(e.target.value)} onBlur={() => setErrors({ ...errors, whatsapp: validateWhatsapp(formData.whatsapp) })} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: errors.whatsapp ? "1px solid #FF4D6A" : "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", color: "#fff", fontSize: "14px", outline: "none" }} />
                {errors.whatsapp && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", padding: "10px 14px", background: "rgba(255,77,106,0.08)", borderRadius: "4px", border: "1px solid rgba(255,77,106,0.15)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FF4D6A"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span style={{ color: "#fca5a5", fontSize: "12px", fontWeight: "500" }}>{errors.whatsapp}</span>
                </div>
              )}
              </div>
              <div>
                <label style={{ display: "block", color: "#999999", fontSize: "13px", marginBottom: "6px" }}>Email *</label>
                <input type="email" required placeholder="nama@email.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }} onBlur={() => setErrors({ ...errors, email: validateEmail(formData.email) })} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: errors.email ? "1px solid #FF4D6A" : "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", color: "#fff", fontSize: "14px", outline: "none" }} />
                {errors.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", padding: "10px 14px", background: "rgba(255,77,106,0.08)", borderRadius: "4px", border: "1px solid rgba(255,77,106,0.15)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FF4D6A"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span style={{ color: "#fca5a5", fontSize: "12px", fontWeight: "500" }}>{errors.email}</span>
                </div>
              )}
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "14px 0" }}></div>

            <div style={{ marginBottom: "14px", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "4px", border: "2px solid #2A2A2A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#555555"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <p style={{ color: "#999999", fontSize: "14px", fontWeight: "600" }}>Metode Pembayaran</p>
              </div>
              <p style={{ color: "#555555", fontSize: "13px" }}>QRIS, GoPay, OVO, Dana, ShopeePay, VA</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#555555", fontSize: "14px" }}>Harga satuan</span>
                <span style={{ color: "#999999", fontSize: "14px" }}>{formatPrice(displayPrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "#555555", fontSize: "14px" }}>Jumlah</span>
                <span style={{ color: "#999999", fontSize: "14px" }}>{quantity}x</span>
              </div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>Total Pembayaran</span>
                <span style={{ color: "#fff", fontSize: "24px", fontWeight: "800" }}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || isFormDisabled} style={{ width: "100%", padding: "16px", borderRadius: "6px", background: (isSubmitting || isFormDisabled) ? "rgba(255,255,255,0.06)" : "#FF6B2C", color: (isSubmitting || isFormDisabled) ? "#555555" : "#fff", fontWeight: "700", fontSize: "15px", border: "none", cursor: (isSubmitting || isFormDisabled) ? "not-allowed" : "pointer", opacity: (isSubmitting || isFormDisabled) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {isSubmitting ? (
                <><div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>Memproses...</>
              ) : isFormDisabled ? (
                "Stok Habis"
              ) : (
                <><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>Bayar Sekarang</>
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <p style={{ color: "#555555", fontSize: "11px" }}>Powered by <span style={{ color: "#999999" }}>Midtrans</span> &middot; Pembayaran aman &amp; terenkripsi</p>
            </div>
          </div>

          {isFormDisabled && (
            <div style={{ marginTop: "-12px", marginBottom: "16px", padding: "20px", background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.15)", borderRadius: "6px", textAlign: "center" }}>
              <p style={{ color: "#FF4D6A", fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Stok Habis</p>
              <p style={{ color: "#555555", fontSize: "13px" }}>Produk ini sedang tidak tersedia. Silakan pilih varian lain atau cek kembali nanti.</p>
            </div>
          )}
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "14px 20px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "280px",
          maxWidth: "90vw",
          background: toast.type === 'error' ? "rgba(255,77,106,0.15)" : toast.type === 'success' ? "rgba(0,214,143,0.15)" : "rgba(59,130,246,0.15)",
          border: `1px solid ${toast.type === 'error' ? "rgba(255,77,106,0.3)" : toast.type === 'success' ? "rgba(0,214,143,0.3)" : "rgba(59,130,246,0.3)"}`,
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {toast.type === 'error' && (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#FF4D6A"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.type === 'success' && (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00D68F"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.type === 'info' && (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3b82f6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span style={{
            color: toast.type === 'error' ? "#fca5a5" : toast.type === 'success' ? "#86efac" : "#93c5fd",
            fontSize: "13px",
            fontWeight: "500",
          }}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}