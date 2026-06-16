'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="50" height="50" fill="none" viewBox="0 0 24 24" stroke="#facc15">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Pembayaran Dibatalkan</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '32px' }}>
          Anda membatalkan proses pembayaran. Pesanan Anda belum diproses.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link 
            href="/dashboard" 
            style={{ 
              padding: '14px', 
              borderRadius: '12px', 
              background: '#FF6B2C', 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Kembali Belanja
          </Link>
          <Link 
            href="/" 
            style={{ 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
