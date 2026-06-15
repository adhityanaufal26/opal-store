'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useSession } from 'next-auth/react';
import { useTransactions, Transaction } from '@/lib/transaction-context';

declare global {
  interface Window {
    snap: any;
  }
}

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: session } = useSession();
  const { transactions, cancelTransaction, updateTransactionStatus, refreshTransactions } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed' | 'cancelled'>('all');
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user && !session) {
      router.push('/login');
    }
  }, [user, session, isLoading, router]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#71717a' }}>Loading...</p>
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
      success: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', text: 'Berhasil' },
      failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', text: 'Gagal' },
      cancelled: { bg: 'rgba(113,113,122,0.1)', color: '#71717a', text: 'Dibatalkan' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: style.bg, color: style.color }}>
        {style.text}
      </span>
    );
  };

  const handlePay = async (trx: any) => {
    setPayingOrderId(trx.orderId);
    try {
      const res = await fetch('/api/midtrans-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: trx.product,
          variantName: trx.variant,
          price: Math.round(trx.total / trx.quantity),
          quantity: trx.quantity,
          customerEmail: trx.customerEmail,
          customerWhatsapp: trx.customerWhatsapp,
          orderId: trx.orderId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert('Error: ' + data.error);
        setPayingOrderId(null);
        return;
      }
      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: function() {
            updateTransactionStatus(trx.orderId, 'success');
            refreshTransactions();
            setPayingOrderId(null);
          },
          onPending: function() {
            alert('Pembayaran pending. Silakan selesaikan pembayaran.');
            setPayingOrderId(null);
          },
          onError: function() {
            alert('Pembayaran gagal.');
            setPayingOrderId(null);
          },
          onClose: function() {
            setPayingOrderId(null);
          }
        });
      }
    } catch (err) {
      console.error('Pay error:', err);
      alert('Terjadi kesalahan.');
      setPayingOrderId(null);
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      qris: 'QRIS', bank_transfer: 'Bank Transfer', ewallet: 'E-Wallet',
      credit_card: 'Kartu Kredit', gopay: 'GoPay', ovo: 'OVO', dana: 'DANA', shopeepay: 'ShopeePay',
    };
    return methods[method] || method;
  };

  const handleCancel = (orderId: string) => {
    cancelTransaction(orderId);
    setCancelConfirm(null);
  };

  const filtered = filter === 'all' ? transactions : transactions.filter(trx => trx.status === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/dashboard" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Riwayat Transaksi</h1>
          <p style={{ color: '#71717a', fontSize: '13px' }}>Daftar semua transaksi Anda</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                padding: '8px 14px', borderRadius: '10px',
                border: filter === tab.id ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                background: filter === tab.id ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.03)',
                color: filter === tab.id ? '#3b82f6' : '#a1a1aa',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ padding: '2px 6px', borderRadius: '6px', background: filter === tab.id ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.06)', fontSize: '11px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((trx) => (
              <div key={trx.id} style={{ background: '#141414', borderRadius: '10px', border: trx.status === 'pending' ? '1px solid rgba(250,204,21,0.15)' : '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#71717a', fontSize: '11px', fontFamily: 'monospace' }}>{trx.orderId}</span>
                  {getStatusBadge(trx.status)}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>{trx.product}</h3>
                  <p style={{ color: '#71717a', fontSize: '12px' }}>{trx.variant} &times; {trx.quantity}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <p style={{ color: '#71717a', fontSize: '11px' }}>{formatDate(trx.date)}</p>
                    <p style={{ color: '#71717a', fontSize: '11px' }}>{getPaymentMethodText(trx.paymentMethod)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{formatPrice(trx.total)}</span>
                    {trx.status === 'pending' && (
                      <>
                        <button onClick={() => setCancelConfirm(trx.orderId)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Batalkan
                        </button>
                        <button onClick={() => handlePay(trx)} disabled={payingOrderId === trx.orderId} style={{ padding: '7px 14px', borderRadius: '8px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: '600', border: 'none', cursor: payingOrderId === trx.orderId ? 'not-allowed' : 'pointer', opacity: payingOrderId === trx.orderId ? 0.5 : 1 }}>
                          {payingOrderId === trx.orderId ? '...' : 'Bayar'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#141414', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px', textAlign: 'center' }}>
            <h3 style={{ color: '#71717a', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              {filter === 'all' ? 'Belum ada transaksi' : `Tidak ada transaksi ${filter}`}
            </h3>
            <p style={{ color: '#52525b', fontSize: '13px', marginBottom: '20px' }}>
              {filter === 'all' ? 'Mulai belanja untuk melihat riwayat transaksi' : 'Coba filter lain'}
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '10px', background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
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
            <div style={{ background: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Batalkan Transaksi?</h3>
              <p style={{ color: '#71717a', fontSize: '13px', marginBottom: '24px' }}>Transaksi yang dibatalkan tidak dapat dilanjutkan.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setCancelConfirm(null)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                  Kembali
                </button>
                <button onClick={() => handleCancel(cancelConfirm)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#ef4444', color: '#fff', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
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
