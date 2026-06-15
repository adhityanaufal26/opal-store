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
      {/* ============ HERO ============ */}
      <section
        className="hero relative overflow-hidden"
        style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}
      >
        <div className="hero-lines">
          <div className="hero-line hero-line-1" />
          <div className="hero-line hero-line-2" />
          <div className="hero-line hero-line-3" />
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full border border-primary/30 bg-primary/10 text-primary-light tracking-wide">
              Toko Digital Indonesia
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Akses AI Premium
            <br />
            <span className="gradient-text">Harga Terjangkau</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            Dapatkan akses langganan Gemini Pro dan produk digital lainnya
            dengan harga yang ramah di kantong.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 gradient-bg-green text-white font-semibold rounded-2xl hover:opacity-90 transition-all text-base inline-flex items-center justify-center gap-2"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS SHOWCASE ============ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Produk Kami
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
              Langganan AI premium dengan harga terjangkau
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-sm">
                Produk sedang dimuat...
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all text-sm"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Lihat Semua Produk
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Cara Belanja
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              Proses mudah dalam 4 langkah
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: "Pilih Produk",
                desc: "Browse katalog dan pilih produk yang Anda butuhkan",
                color: "icon-purple",
              },
              {
                num: "2",
                title: "Pilih Paket",
                desc: "Pilih durasi langganan yang sesuai kebutuhan Anda",
                color: "icon-green",
              },
              {
                num: "3",
                title: "Bayar",
                desc: "Lakukan pembayaran via QRIS, e-wallet, atau transfer bank",
                color: "icon-cyan",
              },
              {
                num: "4",
                title: "Terima Akses",
                desc: "Akses produk dikirim via WhatsApp setelah pembayaran terkonfirmasi",
                color: "icon-pink",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className={`w-14 h-14 ${step.color} flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-base mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4 text-sm md:text-base">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform text-text-muted ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-text-secondary text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Mulai Sekarang
          </h2>
          <p className="text-text-secondary text-sm md:text-base mb-10 max-w-2xl mx-auto">
            Dapatkan akses Gemini Pro dengan harga mulai dari Rp 40.000
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 gradient-bg text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-sm md:text-base"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
