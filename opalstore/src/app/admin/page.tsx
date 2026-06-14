'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { mockOrders, mockSubscriptions, mockUsers, products } from '@/lib/data';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
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

  if (!user || user.role !== 'admin') return null;

  const totalRevenue = mockOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_price, 0);
  const pendingOrders = mockOrders.filter(o => o.payment_status === 'waiting_confirmation').length;
  const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">Manage OpalStore</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Total Revenue</span>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-success">{formatPrice(totalRevenue)}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Pending Orders</span>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{pendingOrders}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Active Subscriptions</span>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{activeSubscriptions}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary text-sm">Total Users</span>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{mockUsers.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="border-b border-border">
            <nav className="flex">
              {['overview', 'orders', 'products', 'users'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">{order.product?.name}</p>
                          <p className="text-sm text-text-secondary">
                            {mockUsers.find(u => u.id === order.user_id)?.name} • {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatPrice(order.total_price)}</p>
                          <p className={`text-sm ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">All Orders</h3>
                  <span className="text-sm text-text-secondary">{mockOrders.length} orders</span>
                </div>
                <div className="space-y-3">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-surface rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-text-primary">{order.product?.name}</p>
                          <p className="text-sm text-text-secondary">
                            Order #{order.id} • {mockUsers.find(u => u.id === order.user_id)?.name}
                          </p>
                        </div>
                        <span className="font-bold text-primary">{formatPrice(order.total_price)}</span>
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
                      {order.payment_status === 'waiting_confirmation' && (
                        <div className="mt-3 pt-3 border-t border-border flex gap-2">
                          <button className="px-4 py-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium">
                            Confirm Payment
                          </button>
                          <button className="px-4 py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors text-sm font-medium">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">All Products</h3>
                  <button className="px-4 py-2 rounded-lg gradient-bg text-white font-medium">
                    + Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.slice(0, 8).map((product) => (
                    <div key={product.id} className="p-4 bg-surface rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl shrink-0">
                          💎
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-primary mb-1">{product.name}</h4>
                          <p className="text-sm text-text-secondary mb-2">{product.short_description.slice(0, 60)}...</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                            <button className="text-sm text-primary hover:underline">Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">All Users</h3>
                  <span className="text-sm text-text-secondary">{mockUsers.length} users</span>
                </div>
                <div className="space-y-3">
                  {mockUsers.map((u) => (
                    <div key={u.id} className="p-4 bg-surface rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-text-primary">{u.name}</p>
                          <p className="text-sm text-text-secondary">{u.email} • {u.phone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
