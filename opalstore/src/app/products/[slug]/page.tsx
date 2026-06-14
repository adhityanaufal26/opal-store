'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { products } from '@/lib/data';
import { formatPrice, getProductTypeLabel, getBadgeColor, getBadgeLabel, WHATSAPP_ORDER_LINK } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  const product = products.find(p => p.slug === params?.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-text-secondary mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="px-6 py-3 rounded-lg gradient-bg text-white font-semibold">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-text-primary">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image & Quick Info */}
          <div>
            {/* Product Image */}
            <div className="bg-card border border-border rounded-2xl p-12 mb-6 flex items-center justify-center aspect-square">
              <div className="text-9xl opacity-30">
                {product.product_type === 'prompt_pack' && '💬'}
                {product.product_type === 'template' && '📄'}
                {product.product_type === 'workflow' && '⚙️'}
                {product.product_type === 'addon' && '🔌'}
                {product.product_type === 'kit' && '📦'}
                {product.product_type === 'toolkit' && '🧰'}
                {product.product_type === 'subscription' && '🔄'}
                {product.product_type === 'course' && '📚'}
                {product.product_type === 'digital_product' && '💎'}
              </div>
            </div>

            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(badge)}`}
                  >
                    {getBadgeLabel(badge)}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-text-secondary">Format</span>
                <span className="text-text-primary font-medium">{product.format}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-text-secondary">Access Method</span>
                <span className="text-text-primary font-medium text-right">{product.access_method}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-text-secondary">Updates</span>
                <span className="text-text-primary font-medium">{product.update_policy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Support</span>
                <span className="text-text-primary font-medium">{product.support}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Details & CTA */}
          <div>
            {/* Category & Type */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {getProductTypeLabel(product.product_type)}
              </span>
              {product.category && (
                <span className="text-text-muted text-sm">{product.category.name}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

            {/* Short Description */}
            <p className="text-xl text-text-secondary mb-6">{product.short_description}</p>

            {/* Price & CTA */}
            <div className="bg-card border border-primary/30 rounded-xl p-6 mb-8">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
                <span className="text-text-muted">one-time payment</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(`/checkout?product=${product.id}`)}
                  className="flex-1 px-6 py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </button>
                <a
                  href={WHATSAPP_ORDER_LINK(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 rounded-xl bg-success/10 text-success border border-success/30 font-semibold text-lg hover:bg-success/20 transition-colors text-center"
                >
                  💬 Ask via WhatsApp
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Product</h2>
              <p className="text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What You'll Get</h2>
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            {product.faq.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {product.faq.map((faq, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium text-text-primary pr-4">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-text-muted shrink-0 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openFAQ === i && (
                        <div className="px-4 pb-4">
                          <p className="text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category_id === product.category_id && p.is_active)
              .slice(0, 4)
              .map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-2">
                      {p.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{p.short_description}</p>
                    <span className="text-lg font-bold text-primary">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
