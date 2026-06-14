import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'best seller':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'new':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'promo':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'subscription':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'instant access':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card group overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {product.badges.slice(0, 2).map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-semibold rounded-md border backdrop-blur-sm ${getBadgeColor(badge)}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Category */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{typeof product.category === 'string' ? product.category : product.category?.name || 'Digital Product'}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <span className="text-2xl font-bold gradient-text">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
              <span>Lihat Detail</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
