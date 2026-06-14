'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { mockOrders, mockSubscriptions, mockAccess } from '@/lib/data';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor, WHATSAPP_LINK } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userOrders = mockOrders.filter(o => o.user_id === user.id);
  const userSubscriptions = mockSubscriptions.filter(s => s.user_id === user.id);
  const userAccess = mockAccess.filter(a => a.user_id === user.id);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-text-secondary">Manage your products, orders, and subscriptions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">My Products</span>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{userAccess.length}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Active Orders</span>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{userOrders.length}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Subscriptions</span>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{userSubscriptions.length}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Need Help?</span>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
            </div>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-success font-semibold hover:underline">
              Chat Support
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Products */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">My Products</h2>
              
              {userAccess.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📦</div>
                  <p className="text-text-secondary mb-4">You don't have any products yet</p>
                  <Link href="/products" className="inline-block px-6 py-3 rounded-lg gradient-bg text-white font-semibold">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAccess.map((access) => (
                    <div key={access.id} className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl shrink-0">
                        💎
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{access.product?.name}</h3>
                        <p className="text-sm text-text-secondary">Purchased {formatDate(access.created_at)}</p>
                      </div>
                      <a
                        href={access.access_url}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        Access
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              
              {userOrders.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-surface rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-text-primary">{order.product?.name}</h3>
                          <p className="text-sm text-text-secondary">Order #{order.id}</p>
                        </div>
                        <span className="text-lg font-bold text-primary">{formatPrice(order.total_price)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className={`font-medium ${getOrderStatusColor(order.order_status)}`}>
                          {order.order_status.toUpperCase()}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-secondary">{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Subscriptions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
              
              {userSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary mb-4">No active subscriptions</p>
                  <Link href="/subscription" className="text-primary hover:underline text-sm font-medium">
                    View Plans
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSubscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-text-primary capitalize">{sub.plan_name} Plan</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === 'active' ? 'bg-success/20 text-success' : 'bg-text-muted/20 text-text-muted'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        Valid until {formatDate(sub.end_date)}
                      </p>
                      <Link
                        href="/subscription"
                        className="block text-center py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        Renew Plan
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/products" className="block p-3 rounded-lg bg-surface hover:bg-surface-light transition-colors text-text-primary">
                  Browse Products
                </Link>
                <Link href="/subscription" className="block p-3 rounded-lg bg-surface hover:bg-surface-light transition-colors text-text-primary">
                  View Subscriptions
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-success/10 hover:bg-success/20 transition-colors text-success">
                  💬 Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
