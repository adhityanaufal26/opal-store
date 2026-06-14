'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import { ProductType } from '@/lib/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams?.get('type') as ProductType | null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(typeFilter || 'all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => p.is_active);

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category/type
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.product_type === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.badges.includes('best_seller') ? 1 : 0) - (a.badges.includes('best_seller') ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const productTypes = [
    { value: 'all', label: 'All Products' },
    { value: 'prompt_pack', label: 'Prompt Packs' },
    { value: 'template', label: 'Templates' },
    { value: 'workflow', label: 'Workflows' },
    { value: 'addon', label: 'Add-ons' },
    { value: 'kit', label: 'Kits' },
    { value: 'toolkit', label: 'Toolkits' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface via-card to-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Digital <span className="gradient-text">Products</span>
          </h1>
          <p className="text-text-primary text-xl max-w-3xl leading-relaxed">
            Browse our collection of AI-powered digital products, templates, prompts, and tools designed to boost your productivity.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-16 z-40 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-card border-2 border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <svg className="w-5 h-5 text-primary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-card border-2 border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[180px]"
            >
              {productTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-surface text-text-primary">
                  {type.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-card border-2 border-border rounded-xl text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[180px]"
            >
              <option value="newest" className="bg-surface text-text-primary">Newest</option>
              <option value="popular" className="bg-surface text-text-primary">Most Popular</option>
              <option value="price_low" className="bg-surface text-text-primary">Price: Low to High</option>
              <option value="price_high" className="bg-surface text-text-primary">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-text-secondary">
              Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
