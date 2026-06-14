// Database types for OpalStore

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category_id: string;
  category?: Category;
  product_type: ProductType;
  file_url: string;
  preview_image: string;
  is_active: boolean;
  badges: ProductBadge[];
  variants?: ProductVariant[];
  features: string[];
  faq: { question: string; answer: string }[];
  format: string;
  access_method: string;
  update_policy: string;
  support: string;
  created_at: string;
  stock?: number;
}

export type ProductType = 
  | 'digital_product' 
  | 'template' 
  | 'prompt_pack' 
  | 'workflow' 
  | 'subscription' 
  | 'addon'
  | 'toolkit'
  | 'course'
  | 'kit';

export type ProductBadge = 'best_seller' | 'new' | 'promo' | 'subscription' | 'instant_access';

export interface Order {
  id: string;
  user_id: string;
  user?: User;
  product_id: string;
  product?: Product;
  total_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_proof_url: string | null;
  full_name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

export type PaymentMethod = 'bank_transfer' | 'qris' | 'whatsapp';
export type PaymentStatus = 'unpaid' | 'waiting_confirmation' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled';

export interface Subscription {
  id: string;
  user_id: string;
  user?: User;
  plan_name: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  price: number;
  created_at: string;
}

export type SubscriptionPlan = 'basic' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface Access {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  order_id: string;
  access_url: string;
  created_at: string;
}

export interface SubscriptionPlanInfo {
  name: SubscriptionPlan;
  display_name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}
