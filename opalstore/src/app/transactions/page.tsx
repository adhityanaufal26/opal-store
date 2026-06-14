'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useSession } from 'next-auth/react';
import { useTransactions, Transaction } from '@/lib/transaction-context';

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const { transactions, cancelTransaction } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed' | 'cancelled'>('all');
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !user && !session) {
      router.push('/login');
    }
  }, [user, session, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
      </div>
    );
  }

  if (!user && !session) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      pending: { bg: 'rgba(250,204,21,0.1)', color: '#facc15', text: 'Menunggu Bayar' },
      success: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', text: 'Berhasil' },
      failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', text: 'Gagal' },
      cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', text: 'Dibatalkan' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{ 
        padding: '4px 10px', 
        borderRadius: '8px', 
        fontSize: '12px', 
        fontWeight: '600',
        background: style.bg,
        color: style.color,
      }}>
        {style.text}
      </span>
    );
  };

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      qris: 'QRIS',
      bank_transfer: 'Bank Transfer',
      ewallet: 'E-Wallet',
      credit_card: 'Kartu Kredit',
      gopay: 'GoPay',
      ovo: 'OVO',
      dana: 'DANA',
      shopeepay: 'ShopeePay',
    };
    return methods[method] || method;
  };

  const handleCancel = (orderId: string) => {
    cancelTransaction(orderId);
    setCancelConfirm(null);
  };

  const filtered = filter === 'all' 
    ? transactions 
    : transactions.filter(trx => trx.status === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Riwayat Transaksi</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Daftar semua transaksi Anda</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Semua', count: transactions.length },
            { id: 'pending', label: 'Pending', count: transactions.filter(t => t.status === 'pending').length },
            { id: 'success', label: 'Berhasil', count: transactions.filter(t => t.status === 'success').length },
            { id: 'failed', label: 'Gagal', count: transactions.filter(t => t.status === 'failed').length },
            { id: 'cancelled', label: 'Dibatalkan', count: transactions.filter(t => t.status === 'cancelled').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: filter === tab.id ? '1px solid rgba(14,165,233,0.5)' : '1px solid rgba(255,255,255,0.1)',
                background: filter === tab.id ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.05)',
                color: filter === tab.id ? '#0ea5e9' : 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ 
                  padding: '2px 6px', 
                  borderRadius: '6px', 
                  background: filter === tab.id ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.1)',
                  fontSize: '11px',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((trx) => (
              <div 
                key={trx.id} 
                style={{ 
                  background: '#161b22', 
                  borderRadius: '16px', 
                  border: trx.status === 'pending' ? '1px solid rgba(250,204,21,0.2)' : '1px solid rgba(255,255,255,0.08)', 
                  padding: '20px',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
                    {trx.orderId}
                  </span>
                  {getStatusBadge(trx.status)}
                </div>

                {/* Product Info */}
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {trx.product}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                    {trx.variant} × {trx.quantity}
                  </p>
                </div>

                {/* Footer Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{formatDate(trx.date)}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{getPaymentMethodText(trx.paymentMethod)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                      {formatPrice(trx.total)}
                    </span>
                    {trx.status === 'pending' && (
                      <button
                        onClick={() => setCancelConfirm(trx.orderId)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(239,68,68,0.3)',
                          background: 'rgba(239,68,68,0.1)',
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Batalkan
                      </button>
                    )}
                    {trx.status === 'pending' && (
                      <Link
                        href={`https://app.sandbox.midtrans.com/snap/v2/vtweb/${trx.orderId}`}
                        target="_blank"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #e84393, #6c5ce7)',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          textDecoration: 'none',
                        }}
                      >
                        Bayar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{ 
            background: '#161b22', 
            borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.08)', 
            padding: '60px 24px',
            textAlign: 'center',
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.2)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              {filter === 'all' ? 'Belum ada transaksi' : `Tidak ada transaksi ${filter}`}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '24px' }}>
              {filter === 'all' ? 'Mulai belanja untuk melihat riwayat transaksi di sini' : 'Coba filter lain'}
            </p>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #e84393, #6c5ce7)', 
                color: 'white', 
                fontSize: '14px', 
                fontWeight: '600', 
                textDecoration: 'none',
              }}
            >
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={() => setCancelConfirm(null)} />
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '16px' }}>
            <div style={{ background: '#161b22', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#facc15">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Batalkan Transaksi?</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>
                Transaksi yang dibatalkan tidak dapat dilanjutkan.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setCancelConfirm(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Kembali
                </button>
                <button
                  onClick={() => handleCancel(cancelConfirm)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
