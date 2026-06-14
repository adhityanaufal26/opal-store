'use client';

import { useRouter } from 'next/navigation';
import { subscriptionPlans } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Subscription <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get unlimited access to our growing library of AI tools, templates, and resources. 
            New products added every month.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card border rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-primary glow scale-105 md:scale-110'
                  : 'border-border'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full gradient-bg text-white text-sm font-semibold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.display_name}</h3>
                <div className="mb-3">
                  <span className="text-4xl font-bold text-primary">{formatPrice(plan.price)}</span>
                  <span className="text-text-muted">{plan.period}</span>
                </div>
                <p className="text-text-secondary text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push(`/checkout?plan=${plan.name}`)}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  plan.highlighted
                    ? 'gradient-bg text-white hover:opacity-90 shadow-lg shadow-primary/25'
                    : 'bg-surface-light text-text-primary hover:bg-primary/20 border border-border'
                }`}
              >
                Choose {plan.display_name}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Compare <span className="gradient-text">Plans</span>
          </h2>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-4 text-text-primary font-semibold">Feature</th>
                    <th className="text-center p-4 text-text-primary font-semibold">Basic</th>
                    <th className="text-center p-4 text-text-primary font-semibold bg-primary/5">Pro</th>
                    <th className="text-center p-4 text-text-primary font-semibold">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Access to basic products', basic: true, pro: true, business: true },
                    { feature: 'Monthly updates', basic: true, pro: true, business: true },
                    { feature: 'WhatsApp support', basic: 'Standard', pro: 'Priority', business: '< 2 hours' },
                    { feature: 'Downloads per month', basic: '5', pro: 'Unlimited', business: 'Unlimited' },
                    { feature: 'Premium products', basic: false, pro: true, business: true },
                    { feature: 'Early access', basic: false, pro: true, business: true },
                    { feature: 'Bonus templates monthly', basic: false, pro: true, business: true },
                    { feature: 'Business resources', basic: false, pro: false, business: true },
                    { feature: 'AI consultation', basic: false, pro: false, business: '1x/month' },
                    { feature: 'Team access', basic: false, pro: false, business: '3 members' },
                    { feature: 'Custom requests', basic: false, pro: false, business: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-4 text-text-secondary">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? (
                            <svg className="w-5 h-5 text-success mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-text-primary text-sm">{row.basic}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <svg className="w-5 h-5 text-success mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-text-primary text-sm font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.business === 'boolean' ? (
                          row.business ? (
                            <svg className="w-5 h-5 text-success mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-text-primary text-sm">{row.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Subscription <span className="gradient-text">FAQ</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel anytime. Simply do not renew your subscription at the end of the month. You will keep access until your current period ends.',
              },
              {
                q: 'What happens if I upgrade my plan?',
                a: 'Contact us via WhatsApp and we will help you upgrade. The price difference will be prorated.',
              },
              {
                q: 'Do I get to keep the products after cancellation?',
                a: 'Subscription-based products require an active subscription. However, any one-time purchases you make separately are yours forever.',
              },
              {
                q: 'Is there a discount for annual subscriptions?',
                a: 'Currently we offer monthly subscriptions only. Annual plans with discounts will be available soon.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-2">{faq.q}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
