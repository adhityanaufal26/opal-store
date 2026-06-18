"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id");

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID tidak ditemukan");
      setChecking(false);
      setLoading(false);
      return;
    }

    // Wait 3 seconds for Tripay to process, then check status
    const timer = setTimeout(() => {
      checkStatus(orderId);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  const checkStatus = async (id: string) => {
    try {
      const res = await fetch("/api/tripay-check-status?order_id=" + id);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError("Gagal memeriksa status pembayaran");
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Loading state
  if (loading || checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`
          @keyframes opal-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes opal-pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
          @keyframes opal-progress { from { width: 0%; } to { width: 100%; } }
          @keyframes opal-dot { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        `}</style>
        <div style={{ textAlign: "center", padding: "20px" }}>
          {/* Spinning ring */}
          <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", position: "relative" }}>
            <div style={{ width: "80px", height: "80px", border: "4px solid rgba(255,255,255,0.06)", borderTopColor: "#FF6B2C", borderRightColor: "#FF6B2C", borderRadius: "50%", animation: "opal-spin 1s linear infinite" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "12px", height: "12px", borderRadius: "50%", background: "#FF6B2C", animation: "opal-pulse 1.5s ease-in-out infinite" }} />
          </div>
          {/* Text */}
          <p style={{ color: "white", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Memeriksa pembayaran</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "32px" }}>Mohon tunggu sebentar...</p>
          {/* Animated dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF6B2C", animation: "opal-dot 1.4s infinite ease-in-out both", animationDelay: (i * 0.16) + "s" }} />
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ width: "200px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", margin: "0 auto", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #FF6B2C, #FFD93D)", animation: "opal-progress 3s ease-out forwards" }} />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Error</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>{error}</p>
          <Link href="/dashboard" style={{ padding: "12px 24px", borderRadius: "12px", background: "#FF6B2C", color: "white", textDecoration: "none", fontWeight: "600" }}>Kembali ke Dashboard</Link>
        </div>
      </div>
    );
  }

  const isPaid = orderData?.status === "success";
  const isPending = orderData?.status === "pending";
  const isFailed = orderData?.status === "failed" || orderData?.status === "cancelled";

  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Status Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          {isPaid ? (
            <>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="#34d399"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>Pembayaran Berhasil!</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Terima kasih atas pesanan Anda</p>
            </>
          ) : isPending ? (
            <>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(250,204,21,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="#facc15"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>Menunggu Pembayaran</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Silakan selesaikan pembayaran Anda</p>
            </>
          ) : (
            <>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>Pembayaran Gagal</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Transaksi ini sudah kedaluwarsa atau gagal</p>
            </>
          )}
        </div>

        {/* Order Details */}
        <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}>Detail Pesanan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Order ID</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600", fontFamily: "monospace" }}>{orderData?.orderId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Produk</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.productName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Varian</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.variantName}</span>
            </div>
            {orderData?.duration > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Durasi</span>
                <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData.duration} Bulan</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Jumlah</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.quantity}x</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Total Bayar</span>
              <span style={{ color: "#FF6B2C", fontSize: "18px", fontWeight: "bold" }}>{formatPrice(orderData?.amount || 0)}</span>
            </div>
          </div>
        </div>

        {/* Order Status — only show if paid */}
        {isPaid && (
          <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}><span style={{ marginRight: "8px" }}>🎁</span>Status Pesanan</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.6" }}>Pesanan anda sedang diproses, mohon tunggu beberapa menit, admin akan mengirimkan detail produk melalui WA atau email anda, jika produk tidak dikirimkan dalam 8 jam silahkan hubungi support.</p>
          </div>
        )}

        {/* Warning — only show if paid */}
        {isPaid && (
          <div style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#facc15" style={{ flexShrink: 0, marginTop: "2px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p style={{ color: "#facc15", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Simpan bukti pembayaran</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Screenshot halaman ini untuk referensi pembelian Anda.</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard" style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>{isPaid ? "Belanja Lagi" : "Kembali"}</Link>
          <Link href="/transactions" style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "#FF6B2C", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>Riwayat Transaksi</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
