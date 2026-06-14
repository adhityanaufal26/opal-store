'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const featuredProducts = products.filter(p => p.badges?.includes('best_seller')).slice(0, 6);

  const faqs = [
    {
      q: 'Apa itu OpalStore?',
      a: 'OpalStore adalah toko digital yang menyediakan berbagai produk AI, template bisnis, automation tools, dan resources premium untuk membantu produktivitas Anda.'
    },
    {
      q: 'Bagaimana cara membeli produk?',
      a: 'Pilih produk yang Anda inginkan, klik "Beli Sekarang", isi form checkout, lakukan pembayaran, dan kirim bukti transfer. Setelah dikonfirmasi, Anda akan mendapat akses ke produk.'
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Saat ini kami menerima transfer bank dan QRIS. Anda juga bisa order via WhatsApp untuk bantuan lebih lanjut.'
    },
    {
      q: 'Apakah produk bisa diakses selamanya?',
      a: 'Ya, produk digital yang Anda beli bisa diakses selamanya melalui dashboard Anda.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-24 md:pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block animate-fadeIn">
              <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                🚀 Solusi Digital untuk Bisnis Modern
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fadeIn">
              Transform Your Business
              <br />
              <span className="gradient-text">with AI-Powered Tools</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fadeIn">
              Dapatkan akses ke koleksi template, tools automation, AI prompts, dan resources premium untuk meningkatkan produktivitas bisnis Anda.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4 animate-fadeIn">
              <Link 
                href="/products"
                className="px-8 py-4 gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                Jelajahi Produk
              </Link>
              <a 
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-light hover:border-primary/30 transition-all"
              >
                Hubungi Kami
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">50+</div>
                <div className="text-sm text-text-secondary mt-1">Digital Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">1K+</div>
                <div className="text-sm text-text-secondary mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-text-secondary mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Produk Terpopuler</h2>
            <p className="text-text-secondary text-lg">
              Tools dan template pilihan yang paling diminati pelanggan kami
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-lg hover:bg-surface-light hover:border-primary/30 transition-all font-medium"
            >
              Lihat Semua Produk
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Kenapa Pilih OpalStore?</h2>
            <p className="text-text-secondary text-lg">
              Platform terpercaya untuk kebutuhan digital bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Access</h3>
              <p className="text-text-secondary text-sm">
                Akses produk langsung setelah pembayaran dikonfirmasi
              </p>
            </div>

            <div className="card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Aman & Terpercaya</h3>
              <p className="text-text-secondary text-sm">
                Transaksi aman dengan sistem pembayaran terverifikasi
              </p>
            </div>

            <div className="card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Regular Updates</h3>
              <p className="text-text-secondary text-sm">
                Produk terus diupdate mengikuti perkembangan teknologi
              </p>
            </div>

            <div className="card p-6 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-text-secondary text-sm">
                Tim support siap membantu kapan saja via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cara Berbelanja</h2>
            <p className="text-text-secondary text-lg">
              Proses mudah dan cepat dalam 4 langkah
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-primary/25">
                1
              </div>
              <h3 className="font-bold mb-2">Pilih Produk</h3>
              <p className="text-text-secondary text-sm">
                Browse katalog dan temukan produk yang Anda butuhkan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-primary/25">
                2
              </div>
              <h3 className="font-bold mb-2">Checkout</h3>
              <p className="text-text-secondary text-sm">
                Isi form pembelian dan pilih metode pembayaran
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-primary/25">
                3
              </div>
              <h3 className="font-bold mb-2">Bayar</h3>
              <p className="text-text-secondary text-sm">
                Lakukan pembayaran dan kirim bukti transfer
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-primary/25">
                4
              </div>
              <h3 className="font-bold mb-2">Akses Produk</h3>
              <p className="text-text-secondary text-sm">
                Download atau akses produk dari dashboard Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-text-secondary text-lg">
              Jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-surface-light/50 transition-colors"
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <svg 
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-text-secondary">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Siap Meningkatkan Bisnis Anda?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pengguna yang telah meningkatkan produktivitas mereka dengan tools dari OpalStore
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/products"
                  className="px-8 py-4 gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:scale-105"
                >
                  Mulai Belanja Sekarang
                </Link>
                <a 
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-light hover:border-primary/30 transition-all inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
