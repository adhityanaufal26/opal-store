'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { products } from '@/lib/data';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  // Auth guard
  if (!isLoading && !user) {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#71717a' }}>Loading...</p>
      </div>
    );
  }
  
  const productId = searchParams?.get('product');
  const variantId = searchParams?.get('variant');
  
  const product = productId ? products.find(p => p.id === productId) : undefined;
  const variant = variantId && product?.variants ? product.variants.find(v => v.id === variantId) : undefined;
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    whatsapp: user?.phone || '',
    paymentMethod: 'qris' as 'bank_transfer' | 'qris' | 'ewallet',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Produk tidak ditemukan</h1>
          <Link href="/dashboard" style={{ color: '#f59e0b', textDecoration: 'none' }}>Kembali ke Dashboard</Link>
        </div>
      </div>
    );
  }

  const displayPrice = variant ? variant.price : product.price;
  const displayName = variant ? variant.name : product.name;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Pesanan berhasil! Admin akan menghubungi Anda via WhatsApp.');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <Link href={`/dashboard/${product.slug}`} style={{ color: '#71717a', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>Checkout</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {/* Order Summary */}
          <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Pesanan Anda</h2>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
                <img src={product.preview_image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</h3>
                <p style={{ color: '#71717a', fontSize: '13px' }}>{displayName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold' }}>{formatPrice(displayPrice)}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Metode Pembayaran</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'qris', name: 'QRIS', desc: 'Scan QR untuk bayar' },
                { id: 'bank_transfer', name: 'Bank Transfer', desc: 'Transfer ke rekening bank' },
                { id: 'ewallet', name: 'E-Wallet', desc: 'GoPay, OVO, Dana, ShopeePay' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: formData.paymentMethod === method.id ? '1px solid rgba(217,119,6,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    background: formData.paymentMethod === method.id ? 'rgba(217,119,6,0.1)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{method.name}</p>
                    <p style={{ color: '#71717a', fontSize: '12px' }}>{method.desc}</p>
                  </div>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: formData.paymentMethod === method.id ? '6px solid #f59e0b' : '2px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.2s',
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* Total & Pay */}
          <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#71717a', fontSize: '16px' }}>Total Pembayaran</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{formatPrice(displayPrice)}</span>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '10px',
                background: isSubmitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#71717a' }}>Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
