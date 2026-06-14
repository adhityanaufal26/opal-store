'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { products, subscriptionPlans } from '@/lib/data';
import { formatPrice, WHATSAPP_LINK } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const productId = searchParams?.get('product');
  const planName = searchParams?.get('plan');
  
  const product = productId ? products.find(p => p.id === productId) : undefined;
  const plan = planName ? subscriptionPlans.find(p => p.name === planName) : undefined;
  const item = product || plan;

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    whatsapp: user?.phone || '',
    paymentMethod: 'bank_transfer' as 'bank_transfer' | 'qris' | 'whatsapp',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Item Selected</h1>
          <Link href="/products" className="text-primary hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product ? product.price : plan ? plan.price : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order creation
    setTimeout(() => {
      alert('Order submitted! Admin will confirm your payment soon. Check your dashboard for updates.');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-text-secondary">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
                      placeholder="628123456789"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Bank Transfer</div>
                      <div className="text-sm text-text-secondary">Transfer to our bank account</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qris"
                      checked={formData.paymentMethod === 'qris'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">QRIS</div>
                      <div className="text-sm text-text-secondary">Scan QR code to pay</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={formData.paymentMethod === 'whatsapp'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">WhatsApp Order</div>
                      <div className="text-sm text-text-secondary">Confirm via WhatsApp</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Order'}
                </button>
                
                <p className="text-xs text-text-muted text-center mt-4">
                  By completing this order, you agree to our terms of service.
                </p>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-surface-light rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {product ? (
                      product.product_type === 'prompt_pack' ? '💬' :
                      product.product_type === 'template' ? '📄' :
                      product.product_type === 'workflow' ? '⚙️' : '💎'
                    ) : '🔄'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{product ? product.name : plan?.display_name}</h3>
                    <p className="text-sm text-text-secondary">
                      {product ? product.short_description.slice(0, 50) + '...' : plan?.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-text-primary pt-3 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Next Steps
                    </h4>
                    <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                      <li>Complete this form</li>
                      <li>Make payment</li>
                      <li>Admin confirms payment</li>
                      <li>Access product in dashboard</li>
                    </ol>
                  </div>
                </div>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 rounded-lg bg-success/10 text-success border border-success/30 font-medium hover:bg-success/20 transition-colors"
                >
                  💬 Need Help? Chat Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
