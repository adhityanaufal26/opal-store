"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setError("Session ID tidak ditemukan");
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch("/api/order-details?session_id=" + id);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Disalin ke clipboard!");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "#0ea5e9", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }}></div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Memproses pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ef4444"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Error</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>{error}</p>
          <Link href="/dashboard" style={{ padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg, #e84393, #6c5ce7)", color: "white", textDecoration: "none", fontWeight: "600" }}>Kembali ke Dashboard</Link>
        </div>
      </div>
    );
  }

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

        <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}>Detail Pesanan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Produk</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.productName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Varian</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.variantName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Jumlah</span>
              <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{orderData?.quantity}x</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Total Bayar</span>
              <span style={{ color: "#0ea5e9", fontSize: "18px", fontWeight: "bold" }}>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(orderData?.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "#161b22", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "20px" }}><span style={{ marginRight: "8px" }}>🎁</span>Produk Anda</h2>

          {orderData?.outputType === "link" && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "16px" }}>Klik link di bawah untuk mengakses produk Anda:</p>
              <div style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <a href={orderData.outputValue} target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", fontSize: "14px", textDecoration: "none", wordBreak: "break-all", flex: 1 }}>{orderData.outputValue}</a>
                <button onClick={() => copyToClipboard(orderData.outputValue)} style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(14,165,233,0.2)", border: "1px solid rgba(14,165,233,0.3)", color: "#0ea5e9", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>Salin</button>
              </div>
            </div>
          )}

          {orderData?.outputType === "file" && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "16px" }}>Download file produk Anda:</p>
              <a href={orderData.outputValue} download style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px", borderRadius: "12px", background: "linear-gradient(135deg, #e84393, #6c5ce7)", color: "white", textDecoration: "none", fontWeight: "600", fontSize: "16px" }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download File
              </a>
            </div>
          )}

          {orderData?.outputType === "text" && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "16px" }}>Berikut adalah kode/akses produk Anda:</p>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px", position: "relative" }}>
                <pre style={{ color: "white", fontSize: "14px", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>{orderData.outputValue}</pre>
                <button onClick={() => copyToClipboard(orderData.outputValue)} style={{ position: "absolute", top: "12px", right: "12px", padding: "8px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Salin</button>
              </div>
            </div>
          )}

          {orderData?.outputType === "email" && (
            <div>
              <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#34d399" style={{ margin: "0 auto 12px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p style={{ color: "#34d399", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Produk telah dikirim ke email Anda!</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Cek inbox atau folder spam di <strong style={{ color: "white" }}>{orderData?.customerEmail}</strong></p>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "24px", display: "flex", gap: "12px" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#facc15" style={{ flexShrink: 0, marginTop: "2px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p style={{ color: "#facc15", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Simpan bukti pembayaran</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Screenshot halaman ini atau simpan link-nya untuk referensi pembelian Anda.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard" style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>Belanja Lagi</Link>
          <Link href="/transactions" style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #e84393, #6c5ce7)", color: "white", textDecoration: "none", fontWeight: "600", textAlign: "center", fontSize: "14px" }}>Riwayat Transaksi</Link>
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
