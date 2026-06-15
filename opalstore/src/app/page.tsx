"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedProducts(data.data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const faqs = [
    {
      q: "Apa itu OpalStore?",
      a: "OpalStore adalah toko digital yang menjual akses langganan AI premium seperti Gemini Pro dengan harga terjangkau.",
    },
    {
      q: "Bagaimana cara membeli produk?",
      a: "Pilih produk, pilih paket yang diinginkan, isi data pembeli, lalu lakukan pembayaran. Setelah pembayaran terkonfirmasi, akses produk akan dikirim via WhatsApp.",
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "Saat ini kami menerima pembayaran melalui Midtrans (QRIS, GoPay, OVO, Dana, ShopeePay, dan Virtual Account bank).",
    },
    {
      q: "Berapa lama akses produk aktif?",
      a: "Tergantung paket yang dipilih. Tersedia paket 4 bulan dan 18 bulan. Detail durasi tertera di halaman produk.",
    },
    {
      q: "Bagaimana jika ada masalah dengan produk?",
      a: "Hubungi kami via WhatsApp. Kami akan membantu menyelesaikan masalah Anda.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="mb-6">
            <span style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#a1a1aa", marginBottom: "8px" }}>
              Toko Digital Indonesia
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-0.02em" }}>
            Akses AI Premium
            <br />
            <span style={{ color: "#f59e0b" }}>Harga Terjangkau</span>
          </h1>

          <p style={{ fontSize: "16px", color: "#a1a1aa", maxWidth: "560px", margin: "0 auto 40px", lineHeight: "1.7" }}>
            Dapatkan akses langganan Gemini Pro dan produk digital lainnya dengan harga yang ramah di kantong.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#d97706", color: "#fff", fontWeight: "600", borderRadius: "12px", fontSize: "15px", transition: "all 0.2s" }}
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTS SHOWCASE */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.01em" }}>Produk Kami</h2>
            <p style={{ color: "#a1a1aa", fontSize: "15px" }}>Langganan AI premium dengan harga terjangkau</p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ color: "#71717a", fontSize: "15px" }}>Produk sedang dimuat...</p>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link
              href="/dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", fontWeight: "500", fontSize: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a1a1aa", transition: "all 0.2s" }}
            >
              Lihat Semua Produk
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.01em" }}>Cara Belanja</h2>
            <p style={{ color: "#a1a1aa", fontSize: "15px" }}>Proses mudah dalam 4 langkah</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
            {[
              { num: "1", title: "Pilih Produk", desc: "Browse katalog dan pilih produk yang Anda butuhkan" },
              { num: "2", title: "Pilih Paket", desc: "Pilih durasi langganan yang sesuai kebutuhan Anda" },
              { num: "3", title: "Bayar", desc: "Lakukan pembayaran via QRIS, e-wallet, atau transfer bank" },
              { num: "4", title: "Terima Akses", desc: "Akses produk dikirim via WhatsApp setelah pembayaran terkonfirmasi" },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(217,119,6,0.1)", color: "#f59e0b", borderRadius: "12px", fontSize: "18px", fontWeight: "700", margin: "0 auto 16px" }}>
                  {step.num}
                </div>
                <h3 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: "1.6" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.01em" }}>Pertanyaan Umum</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, index) => (
              <div key={index} className="card" style={{ overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{ width: "100%", padding: "20px", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "between", background: "none", border: "none", color: "#fff", cursor: "pointer", transition: "background 0.2s" }}
                >
                  <span style={{ fontWeight: "600", fontSize: "14px", flex: 1, paddingRight: "16px" }}>{faq.q}</span>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#71717a" style={{ flexShrink: 0, transform: openFaq === index ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openFaq === index && (
                  <div style={{ padding: "0 20px 20px", color: "#a1a1aa", fontSize: "13px", lineHeight: "1.7" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-20 px-4">
        <div className="max-w-4xl mx-auto" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.01em" }}>Mulai Sekarang</h2>
          <p style={{ color: "#a1a1aa", fontSize: "15px", marginBottom: "40px" }}>
            Dapatkan akses Gemini Pro dengan harga mulai dari Rp 40.000
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/dashboard"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#d97706", color: "#fff", fontWeight: "600", borderRadius: "12px", fontSize: "15px", transition: "all 0.2s" }}
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
