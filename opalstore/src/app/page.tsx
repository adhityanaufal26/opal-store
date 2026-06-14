"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredProducts = products
    .filter((p) => p.badges?.includes("best_seller"))
    .slice(0, 6);

  const faqs = [
    {
      q: "Apa itu OpalStore?",
      a: "OpalStore adalah toko digital yang menyediakan berbagai produk AI, template bisnis, automation tools, dan resources premium untuk membantu produktivitas Anda.",
    },
    {
      q: "Bagaimana cara membeli produk?",
      a: "Pilih produk yang Anda inginkan, klik Beli Sekarang, isi form checkout, lakukan pembayaran, dan kirim bukti transfer. Setelah dikonfirmasi, Anda akan mendapat akses ke produk.",
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "Saat ini kami menerima transfer bank dan QRIS. Anda juga bisa order via WhatsApp untuk bantuan lebih lanjut.",
    },
    {
      q: "Apakah produk bisa diakses selamanya?",
      a: "Ya, produk digital yang Anda beli bisa diakses selamanya melalui dashboard Anda.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ============ HERO ============ */}
      <section className="hero relative overflow-hidden" style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}>
        {/* Gradient lines background */}
        <div className="hero-lines">
          <div className="hero-line hero-line-1" />
          <div className="hero-line hero-line-2" />
          <div className="hero-line hero-line-3" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full border border-primary/30 bg-primary/10 text-primary-light tracking-wide">
              Platform Digital #1 Indonesia
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Transaksi Digital
            <br />
            <span className="gradient-text">Lebih Cepat & Murah</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            Dapatkan akses ke koleksi template, tools automation, AI prompts, dan
            resources premium untuk meningkatkan produktivitas bisnis Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 gradient-bg-green text-white font-semibold rounded-2xl hover:opacity-90 transition-all text-base inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Jelajahi Produk
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-white font-semibold rounded-2xl transition-all text-base inline-flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Dokumentasi
            </a>
          </div>
        </div>
      </section>

      {/* ============ 3 FEATURE CARDS (like XOneShop) ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-14">
            Semua yang Anda Butuhkan
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card p-8 text-center group">
              <div className="w-14 h-14 icon-purple flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Transaksi Instan</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Akses produk langsung setelah pembayaran dikonfirmasi. Tanpa
                menunggu, tanpa ribet.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card p-8 text-center group">
              <div className="w-14 h-14 icon-green flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Harga Termurah</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Produk digital premium dengan harga terjangkau. Mulai dari
                Rp149.000 untuk tools berkualitas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card p-8 text-center group">
              <div className="w-14 h-14 icon-pink flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Aman & Terpercaya</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Transaksi aman dengan sistem pembayaran terverifikasi. Didukung
                oleh Opal Agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS SHOWCASE ============ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Produk Terpopuler
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
              Tools dan template pilihan yang paling diminati pelanggan kami
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Lihat Semua Produk
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ API / AUTOMATION SECTION (like XOneShop) ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Otomasi Bisnis Anda.
                <br />
                <span className="gradient-text">Satu Platform.</span>
              </h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Semua template, workflow, dan AI prompt yang Anda butuhkan untuk
                mengotomasi bisnis — tersedia dalam satu platform digital.
              </p>

              <div className="space-y-4">
                {[
                  { icon: "purple", text: "100+ AI Prompts untuk operasional bisnis" },
                  { icon: "green", text: "20+ Template SOP siap pakai" },
                  { icon: "cyan", text: "15+ Workflow automation (Make.com & Zapier)" },
                  { icon: "pink", text: "Bundle lengkap: branding, email, social media" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 icon-${item.icon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-text-secondary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Code block */}
            <div className="code-block p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-text-muted">workflow.json</span>
              </div>
              <pre className="overflow-x-auto text-xs md:text-sm">
{`{
  "workflow": "customer-support-ai",
  "trigger": "new_whatsapp_message",
  "steps": [
    {
      "action": "classify_intent",
      "model": "gpt-4o-mini",
      "categories": ["order", "complaint", "general"]
    },
    {
      "action": "generate_reply",
      "template": "cs_response_v2",
      "language": "id"
    },
    {
      "action": "send_whatsapp",
      "delay": "2s"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES & ADVANTAGES (like XOneShop) ============ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Layanan & Keunggulan
            </h2>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
              Kenapa ribuan pelanggan memilih OpalStore
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "green",
                title: "Instant Access",
                desc: "Akses produk langsung setelah pembayaran dikonfirmasi. Download dari dashboard Anda.",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                icon: "purple",
                title: "Regular Updates",
                desc: "Produk terus diupdate mengikuti perkembangan teknologi AI terbaru.",
                iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              },
              {
                icon: "cyan",
                title: "Support 24/7",
                desc: "Tim support siap membantu kapan saja via WhatsApp. Respon cepat & ramah.",
                iconPath: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
              },
              {
                icon: "pink",
                title: "Dashboard Lengkap",
                desc: "Kelola semua produk Anda dari satu dashboard. Download, akses riwayat, dan kelola akun.",
                iconPath: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
              },
              {
                icon: "amber",
                title: "Multi Payment",
                desc: "Bayar via transfer bank atau QRIS. Proses verifikasi otomatis & cepat.",
                iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
              },
              {
                icon: "blue",
                title: "Notifikasi Realtime",
                desc: "Dapatkan notifikasi WhatsApp saat produk baru tersedia atau promo berjalan.",
                iconPath: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
              },
            ].map((service, i) => (
              <div key={i} className="card p-7 group">
                <div className={`w-12 h-12 icon-${service.icon} flex items-center justify-center mb-4`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.iconPath} />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Cara Berbelanja
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              Proses mudah dan cepat dalam 4 langkah
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Pilih Produk", desc: "Browse katalog dan temukan produk yang Anda butuhkan", color: "icon-purple" },
              { num: "2", title: "Checkout", desc: "Isi form pembelian dan pilih metode pembayaran", color: "icon-green" },
              { num: "3", title: "Bayar", desc: "Lakukan pembayaran via transfer bank atau QRIS", color: "icon-cyan" },
              { num: "4", title: "Akses Produk", desc: "Download atau akses produk dari dashboard Anda", color: "icon-pink" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 ${step.color} flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
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
            <p className="text-text-secondary text-sm md:text-base">
              Jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
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

      {/* ============ CTA SECTION ============ */}
      <section className="section py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Siap Meningkatkan Bisnis Anda?
          </h2>
          <p className="text-text-secondary text-sm md:text-base mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah meningkatkan
            produktivitas mereka dengan tools dari OpalStore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 gradient-bg text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-sm md:text-base"
            >
              Mulai Belanja Sekarang
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-semibold rounded-2xl transition-all inline-flex items-center justify-center gap-2 text-sm md:text-base"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
