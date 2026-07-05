'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Check, Heart, Eye, ArrowUpRight } from 'lucide-react';
import { SAMPLE_CATALOG_PRODUCTS } from '@/lib/api/products';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function FeaturedGrid() {
  const [filter, setFilter] = useState<'all' | 'hoodie' | 'shirt' | 'pants' | 'bracelet'>('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const { addItem, toggleDrawer } = useCartStore();

  const filteredProducts = filter === 'all'
    ? SAMPLE_CATALOG_PRODUCTS
    : SAMPLE_CATALOG_PRODUCTS.filter(p => p.category === filter);

  const handleAdd = (product: typeof SAMPLE_CATALOG_PRODUCTS[number]) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      sku: product.sku,
    });

    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    toggleDrawer(true);

    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section id="featured" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Clean Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-rose-500 block mb-2">
              Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight font-heading">
              Featured Merch
            </h2>
          </div>

          {/* Clean Editorial Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              All Merch ({SAMPLE_CATALOG_PRODUCTS.length})
            </button>
            <button
              onClick={() => setFilter('hoodie')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'hoodie'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Hoodies ({SAMPLE_CATALOG_PRODUCTS.filter(p => p.category === 'hoodie').length})
            </button>
            <button
              onClick={() => setFilter('shirt')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'shirt'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Tees & Tops ({SAMPLE_CATALOG_PRODUCTS.filter(p => p.category === 'shirt').length})
            </button>
            <button
              onClick={() => setFilter('pants')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'pants'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Bottoms ({SAMPLE_CATALOG_PRODUCTS.filter(p => p.category === 'pants').length})
            </button>
            <button
              onClick={() => setFilter('bracelet')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'bracelet'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Accessories ({SAMPLE_CATALOG_PRODUCTS.filter(p => p.category === 'bracelet').length})
            </button>
          </div>
        </div>

        {/* Clean Editorial Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isAdded = addedItems[product.id];

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-indigo-950"
              >
                {/* Image Aspect Ratio Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {product.badge && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${
                        product.badgeType === 'sale'
                          ? 'bg-rose-500 text-white'
                          : product.badgeType === 'low_stock'
                          ? 'bg-indigo-950 text-white'
                          : 'bg-white text-indigo-950 border border-slate-200'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      aria-label="Wishlist"
                      className="w-8 h-8 rounded-sm bg-white text-indigo-950 hover:text-rose-500 flex items-center justify-center shadow-sm border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <Link 
                      href={`/products/${product.slug}`}
                      aria-label="Quick View"
                      className="w-8 h-8 rounded-sm bg-white text-indigo-950 hover:text-rose-500 flex items-center justify-center shadow-sm border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-1.5">
                    {/* Category Label & SKU */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                      <span>{product.categoryLabel}</span>
                      <span className="font-mono text-[10px]">{product.sku}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-base text-indigo-950 group-hover:text-rose-600 transition-colors line-clamp-1 font-heading">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>

                  {/* Price & Add to Cart CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <div>
                      {product.compareAtPrice && (
                        <span className="text-xs font-mono text-slate-400 line-through block">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-indigo-950 font-mono tracking-tight block">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-950 hover:bg-rose-500 text-white active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Catalog Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-indigo-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <span>Explore Complete Collection 04 ({SAMPLE_CATALOG_PRODUCTS.length} Items)</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
