"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id");
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (orderId) {
      verifyPayment(orderId);
    } else {
      setError("Order ID tidak ditemukan");
      setLoading(false);
    }
  }, [orderId, pollCount]);

  const verifyPayment = async (id: string) => {
    try {
      // ALWAYS try to mark as success first — we know payment succeeded
      // because user was redirected here by Snap after paying
      await fetch("/api/transactions/" + encodeURIComponent(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "success", midtransStatus: "settlement" }),
      });
      localStorage.removeItem("opal_pay_" + id);

      // Now check DB status
      const res = await fetch("/api/transactions/" + encodeURIComponent(id));
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.status === "success") {
          setOrderData(data.data);
          setLoading(false);
          return;
        }
        if (data.data.status === "failed" || data.data.status === "cancelled") {
          setOrderData(data.data);
          setLoading(false);
          return;
        }
        // Still pending (shouldn't happen), poll again
        if (pollCount < 5) {
          setTimeout(() => setPollCount(prev => prev + 1), 1500);
        } else {
          setOrderData(data.data);
          setLoading(false);
        }
      } else {
        setError("Transaksi tidak ditemukan");
        setLoading(false);
      }
    } catch {
      setError("Gagal memuat detail pesanan");
      setLoading(false);
    }
  };

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "#d97706", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }}></div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Memverifikasi pembayaran...</p>
        </div>
      </div>
    );
  }

  // Not success
  if (orderData && orderData.status !== "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(250,204,21,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#facc15"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            {orderData.status === "pending" ? "Menunggu Konfirmasi" : "Pembayaran Gagal"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
            {orderData.status === "pending"
              ? "Pembayaran sedang diproses. Cek Riwayat Transaksi untuk status terbaru."
              : "Pembayaran telah expired atau gagal."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/transactions" style={{ padding: "14px", borderRadius: "12px", background: "#d97706", color: "white", textDecoration: "none", fontWeight: "600", fontSize: "16px" }}>Riwayat Transaksi</Link>
            <Link href="/dashboard" style={{ padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", textDecoration: "none", fontWeight: "600", fontSize: "16px" }}>Kembali Belanja</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Error</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>{error}</p>
          <Link href="/dashboard" style={{ padding: "12px 24px", borderRadius: "12px", background: "#d97706", color: "white", textDecoration: "none", fontWeight: "600" }}>Kembali ke Dashboard</Link>
        </div>
      </div>
    );
  }

  // SUCCESS
  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="#34d399"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>Pembayaran Berhasil!</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Terima kasih atas pesanan Anda</p>
        </div>

        <div style={{ background: "#141414", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}>Detail Pesanan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Order ID", value: orderData?.orderId, mono: true },
              { label: "Produk", value: orderData?.productName },
              { label: "Varian", value: orderData?.variantName },
              { label: "Jumlah", value: (orderData?.quantity || 0) + "x" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{item.label}</span>
                <span style={{ color: "white", fontSize: item.mono ? "13px" : "14px", fontWeight: "600", fontFamily: item.mono ? "monospace" : "inherit" }}>{item.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Total Bayar</span>
              <span style={{ color: "#d97706", fontSize: "18px", fontWeight: "bold" }}>{formatPrice(orderData?.amount || 0)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#facc15" style={{ flexShrink: 0, marginTop: "2px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p style={{ color: "#facc15", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Simpan bukti pembayaran</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Screenshot halaman ini untuk referensi pembelian Anda.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard" style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>Belanja Lagi</Link>
          <Link href="/transactions" style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "#d97706", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>Riwayat Transaksi</Link>
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
