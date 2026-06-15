export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    best_seller: 'bg-warning text-black',
    new: 'bg-success text-white',
    promo: 'bg-danger text-white',
    subscription: 'bg-accent text-white',
    instant_access: 'bg-primary text-white',
  };
  return colors[badge] || 'bg-surface-light text-text-secondary';
}

export function getBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    best_seller: '🔥 Best Seller',
    new: '✨ New',
    promo: '🏷️ Promo',
    subscription: '🔄 Subscription',
    instant_access: '⚡ Instant Access',
  };
  return labels[badge] || badge;
}

export function getProductTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    digital_product: 'Digital Product',
    template: 'Template',
    prompt_pack: 'Prompt Pack',
    workflow: 'Workflow',
    subscription: 'Subscription',
    addon: 'Add-on',
    toolkit: 'Digital Toolkit',
    course: 'Mini Course',
    kit: 'Kit',
  };
  return labels[type] || type;
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    unpaid: 'text-text-muted',
    waiting_confirmation: 'text-warning',
    paid: 'text-success',
    failed: 'text-danger',
    refunded: 'text-accent',
  };
  return colors[status] || 'text-text-secondary';
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-warning',
    paid: 'text-primary',
    processing: 'text-accent',
    delivered: 'text-success',
    cancelled: 'text-danger',
  };
  return colors[status] || 'text-text-secondary';
}

export function getSubscriptionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-success',
    expired: 'text-danger',
    cancelled: 'text-text-muted',
    pending: 'text-warning',
  };
  return colors[status] || 'text-text-secondary';
}

export const WHATSAPP_NUMBER = '6285669130605';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_ORDER_LINK = (productName: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang produk: ${productName}`)}`;
