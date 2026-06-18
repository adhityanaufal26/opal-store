"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/lib/transaction-context";

// Payment method options
const PAYMENT_METHODS = [
  { code: "QRISC", name: "QRIS", logo: "/logos/qris.png" },
  { code: "OVO", name: "OVO", logo: "/logos/ovo.jpg" },
  { code: "DANA", name: "DANA", logo: "/logos/dana.jpg" },
  { code: "SHOPEEPAY", name: "ShopeePay", logo: "/logos/shopeepay.jpg" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const { addTransaction, updateTransactionStatus } = useTransactions();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [feeLoading, setFeeLoading] = useState<boolean>(false);
  const [confirmData, setConfirmData] = useState<{checkoutUrl: string, fee: number, total: number} | null>(null);

  const [formData, setFormData] = useState({
    whatsapp: user?.phone || "",
    email: user?.email || session?.user?.email || "",
  });

  const [errors, setErrors] = useState({
    whatsapp: "",
    email: "",
  });

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
            setSelectedVariant(found.variants[0].name);
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



  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner" /></div>;
  }

  if (!product) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "rgba(255,255,255,0.5)" }}>Produk tidak ditemukan</p></div>;
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const currentVariant = product.variants?.find((v: any) => v.name === selectedVariant);
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displayStock = currentVariant ? currentVariant.stock : 0;
  const displayName = currentVariant ? currentVariant.name : product.name;
  const totalPrice = displayPrice * quantity;

  const getMonthlyPrice = (): number | null => {
    if (!currentVariant) return null;
    // Try duration field first (from admin input)
    const duration = currentVariant.duration || currentVariant.durationMonths;
    if (duration && duration > 0) {
      return Math.round(currentVariant.price / duration);
    }
    // Fallback: parse from variant name
    const match = currentVariant.name.match(/(\d+)\s*Bulan/i);
    if (match) {
      const months = parseInt(match[1]);
      return Math.round(currentVariant.price / months);
    }
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
    const whatsappError = validateWhatsapp(formData.whatsapp);
    const emailError = validateEmail(formData.email);
    setErrors({ whatsapp: whatsappError, email: emailError });
    if (whatsappError || emailError) return;
    if (displayStock <= 0) {
      alert("Produk ini sedang habis!");
      return;
    }
    if (quantity > displayStock) {
      alert("Stok tidak cukup! Maksimal " + displayStock + " pcs.");
      return;
    }
    if (!selectedPayment) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tripay-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          variantName: displayName,
          price: displayPrice,
          quantity: quantity,
          fee: fee,
          customerEmail: formData.email,
          customerWhatsapp: formData.whatsapp,
          customerName: user?.name || session?.user?.name || "Customer",
          paymentMethod: selectedPayment,
          productId: product._id,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Error: " + data.error);
        setIsSubmitting(false);
        return;
      }

      addTransaction({
        id: Date.now().toString(),
        orderId: data.orderId,
        date: new Date().toISOString(),
        product: product.name,
        variant: displayName,
        quantity: quantity,
        total: totalPrice,
        paymentMethod: "tripay",
        status: "pending",
        customerEmail: formData.email,
        customerWhatsapp: formData.whatsapp,
      });

      // Show confirmation with actual fee from Tripay
      const tripayFee = data.fee || 0;
      const tripayTotal = data.amount || (totalPrice + tripayFee);
      setFee(tripayFee);
      setConfirmData({
        checkoutUrl: data.checkout_url,
        fee: tripayFee,
        total: tripayTotal,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };



  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali
        </Link>

        {/* Hero: Image + Title responsive */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexDirection: "row" }}>
          <div style={{ width: "33%", flexShrink: 0, borderRadius: "16px", overflow: "hidden", aspectRatio: "1/1", background: "linear-gradient(135deg, rgba(255,107,44,0.08), rgba(139,92,246,0.08))" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white", lineHeight: "1.3" }}>{product.name}</h1>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: "1.6", marginBottom: "24px" }}>{product.description}</p>

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {displayStock > 0 ? (
                <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span><span style={{ color: "#34d399", fontSize: "14px" }}>Stok tersedia: {displayStock}</span></>
              ) : (
                <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171", display: "inline-block" }}></span><span style={{ color: "#f87171", fontSize: "14px" }}>Stok habis</span></>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>Pilih Paket:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {product.variants.map((variant: any) => {
                    const variantMatch = variant.name.match(/(\d+)\s*Bulan/i);
                    const variantMonthly = variantMatch ? Math.round(variant.price / parseInt(variantMatch[1])) : null;
                    const variantOutOfStock = variant.stock <= 0;
                    return (
                      <button type="button" key={variant.name} disabled={variantOutOfStock} onClick={() => { if (!variantOutOfStock) setSelectedVariant(variant.name); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: "12px", border: selectedVariant === variant.name ? "1px solid rgba(255,107,44,0.5)" : "1px solid rgba(255,255,255,0.1)", background: selectedVariant === variant.name ? "rgba(255,107,44,0.1)" : "rgba(255,255,255,0.03)", cursor: variantOutOfStock ? "not-allowed" : "pointer", opacity: variantOutOfStock ? 0.4 : 1 }}>
                        <div style={{ textAlign: "left" }}>
                          <p style={{ color: variantOutOfStock ? "rgba(255,255,255,0.4)" : "white", fontSize: "14px", fontWeight: "600" }}>{variant.name}{variantOutOfStock && " (Habis)"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <p style={{ color: variantOutOfStock ? "#f87171" : "rgba(255,255,255,0.4)", fontSize: "12px" }}>Stok: {variant.stock}</p>
                            {variantMonthly && <span style={{ color: "#FF6B2C", fontSize: "11px", fontWeight: "600", padding: "2px 6px", background: "rgba(255,107,44,0.1)", borderRadius: "4px" }}>{formatPrice(variantMonthly)}/bln</span>}
                          </div>
                        </div>
                        <span style={{ color: variantOutOfStock ? "rgba(255,255,255,0.3)" : selectedVariant === variant.name ? "#FF6B2C" : "rgba(255,255,255,0.7)", fontWeight: "bold", fontSize: "15px", textDecoration: variantOutOfStock ? "line-through" : "none" }}>{formatPrice(variant.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {monthlyPrice && (
              <div style={{ marginBottom: "24px", padding: "16px", background: "linear-gradient(135deg, rgba(255,107,44,0.08), rgba(139,92,246,0.08))", borderRadius: "12px", border: "1px solid rgba(255,107,44,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#FF6B2C"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>Harga per bulan</p>
                    <p style={{ color: "#FF6B2C", fontSize: "20px", fontWeight: "bold" }}>{formatPrice(monthlyPrice)}<span style={{ fontSize: "14px", fontWeight: "500" }}>/bulan</span></p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "24px 0" }}></div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>Jumlah:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <button type="button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1 || displayStock <= 0} style={{ padding: "12px 16px", background: "none", border: "none", color: (quantity <= 1 || displayStock <= 0) ? "rgba(255,255,255,0.2)" : "white", fontSize: "18px", cursor: (quantity <= 1 || displayStock <= 0) ? "not-allowed" : "pointer" }}>-</button>
                  <input type="number" min="1" max={displayStock || 99} value={quantity} disabled={displayStock <= 0} onChange={(e) => { const val = parseInt(e.target.value); if (!isNaN(val) && val >= 1 && (!displayStock || val <= displayStock)) setQuantity(val); }} style={{ width: "60px", textAlign: "center", background: "none", border: "none", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)", color: displayStock <= 0 ? "rgba(255,255,255,0.3)" : "white", fontSize: "16px", fontWeight: "bold", outline: "none", padding: "12px 0", cursor: displayStock <= 0 ? "not-allowed" : "auto" }} />
                  <button type="button" onClick={() => handleQuantityChange(quantity + 1)} disabled={displayStock <= 0 || (displayStock > 0 && quantity >= displayStock)} style={{ padding: "12px 16px", background: "none", border: "none", color: (displayStock <= 0 || (displayStock > 0 && quantity >= displayStock)) ? "rgba(255,255,255,0.2)" : "white", fontSize: "18px", cursor: (displayStock <= 0 || (displayStock > 0 && quantity >= displayStock)) ? "not-allowed" : "pointer" }}>+</button>
                </div>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{displayStock ? "Maks. " + displayStock : ""}</span>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "24px 0" }}></div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>Data Pembeli:</p>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Nomor WhatsApp *</label>
                <input type="tel" required placeholder="628123456789" value={formData.whatsapp} onChange={(e) => handleWhatsappChange(e.target.value)} onBlur={() => setErrors({ ...errors, whatsapp: validateWhatsapp(formData.whatsapp) })} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: errors.whatsapp ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none" }} />
                {errors.whatsapp && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.whatsapp}</p>}
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "6px" }}>Email *</label>
                <input type="email" required placeholder="nama@email.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }); }} onBlur={() => setErrors({ ...errors, email: validateEmail(formData.email) })} style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: errors.email ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none" }} />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "24px 0" }}></div>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>Pilih Metode Pembayaran:</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.code}
                    type="button"
                    onClick={() => setSelectedPayment(method.code)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: selectedPayment === method.code ? "1px solid rgba(255,107,44,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      background: selectedPayment === method.code ? "rgba(255,107,44,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    <img src={method.logo} alt={method.name} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                    <span style={{ color: selectedPayment === method.code ? "white" : "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: selectedPayment === method.code ? "600" : "400" }}>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Harga satuan</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>{formatPrice(displayPrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Jumlah</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>{quantity}x</span>
              </div>
              {fee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Biaya transaksi</span>
                  <span style={{ color: "#f59e0b", fontSize: "14px" }}>+ {formatPrice(fee)}</span>
                </div>
              )}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "12px" }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>Total Pembayaran</span>
                <span style={{ color: "#FF6B2C", fontSize: "20px", fontWeight: "bold" }}>{formatPrice(fee > 0 ? totalPrice + fee : totalPrice)}</span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !selectedPayment || !displayStock || displayStock <= 0} style={{ width: "100%", padding: "16px", borderRadius: "12px", background: (isSubmitting || !selectedPayment || displayStock <= 0) ? "rgba(255,255,255,0.1)" : "#FF6B2C", color: "white", fontWeight: "bold", fontSize: "16px", border: "none", cursor: (isSubmitting || !selectedPayment || displayStock <= 0) ? "not-allowed" : "pointer", opacity: (isSubmitting || !selectedPayment || displayStock <= 0) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {isSubmitting ? (
                <><div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>Memproses...</>
              ) : (
                <><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>Bayar Sekarang</>
              )}
            </button>

          </div>
          {displayStock <= 0 && (
            <div style={{ position: "relative", marginTop: "-16px", marginBottom: "16px", padding: "20px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "16px", textAlign: "center" }}>
              <p style={{ color: "#f87171", fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>🚫 Stok Habis</p>
              <p style={{ color: "rgba(248,113,113,0.7)", fontSize: "13px" }}>Produk ini sedang tidak tersedia. Silakan pilih varian lain atau cek kembali nanti.</p>
            </div>
          )}
        </form>
      </div>

      {/* Confirmation Modal */}
      {confirmData && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setConfirmData(null)} />
          <div style={{ position: "relative", width: "100%", maxWidth: "380px", background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", zIndex: 101 }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>Konfirmasi Pembayaran</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Harga</span>
                <span style={{ color: "white", fontSize: "14px" }}>{formatPrice(totalPrice)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Biaya transaksi</span>
                <span style={{ color: "#f59e0b", fontSize: "14px" }}>+ {formatPrice(confirmData.fee)}</span>
              </div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Total</span>
                <span style={{ color: "#FF6B2C", fontSize: "22px", fontWeight: "bold" }}>{formatPrice(confirmData.total)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmData(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Batal
              </button>
              <button onClick={() => { window.location.href = confirmData.checkoutUrl; }} style={{ flex: 2, padding: "12px", borderRadius: "12px", border: "none", background: "#FF6B2C", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Bayar {formatPrice(confirmData.total)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
