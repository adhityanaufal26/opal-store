import { Product, Category, Order, Subscription, Access, SubscriptionPlanInfo, User } from './types';

// Admin whitelist - ONLY these emails can access /admin
export const ADMIN_EMAILS: string[] = [
  'adhityanaufal0098@gmail.com',
];

// Helper function to check if user is admin
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Digital Subscription', slug: 'digital-subscription', created_at: '2024-01-01' },
];

// Products with variants
export const products: Product[] = [
  {
    id: '1',
    name: 'Gemini Pro',
    slug: 'gemini-pro',
    description: 'Gemini Pro adalah model AI terbaru dari Google yang dirancang untuk tugas kompleks. Mendukung reasoning, coding, analisis data, dan kreatif writing dengan performa tinggi. Cocok untuk profesional dan bisnis yang membutuhkan AI berkualitas premium.',
    short_description: 'AI premium dari Google untuk reasoning, coding, dan analisis kompleks.',
    price: 40000,
    category_id: '1',
    category: { id: '1', name: 'Digital Subscription', slug: 'digital-subscription', created_at: '2024-01-01' },
    product_type: 'digital_product',
    file_url: '#',
    preview_image: '/images/products/gemini-pro.jpg',
    is_active: true,
    badges: ['best_seller', 'instant_access'],
    stock: 50,
    variants: [
      { id: 'v1', name: 'Gemini Pro 4 Bulan (Via Invite)', price: 40000, stock: 30 },
      { id: 'v2', name: 'Gemini Pro 4 Bulan (Head)', price: 65000, stock: 20 },
      { id: 'v3', name: 'Gemini Pro 18 Bulan (Via Invite)', price: 120000, stock: 15 },
      { id: 'v4', name: 'Gemini Pro 18 Bulan (Head)', price: 180000, stock: 10 },
    ],
    features: [],
    faq: [],
    format: 'Digital Access',
    access_method: 'Dikirim via WhatsApp setelah pembayaran',
    update_policy: 'Akses penuh selama periode aktif',
    support: 'Support 24/7 via WhatsApp',
    created_at: '2024-01-15',
  },
];

// Mock Users
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Admin', email: 'adhityanaufal0098@gmail.com', phone: '628123456789', role: 'admin', created_at: '2024-01-01' },
];

// Mock Orders
export const mockOrders: Order[] = [];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [];

// Mock Access
export const mockAccess: Access[] = [];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlanInfo[] = [];
