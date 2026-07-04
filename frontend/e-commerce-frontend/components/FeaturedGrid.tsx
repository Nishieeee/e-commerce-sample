'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Check, Heart, Eye, ArrowUpRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: 'hoodie' | 'shirt' | 'pants' | 'bracelet';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge?: string;
  badgeType?: 'sale' | 'low_stock' | 'featured';
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Core 400 GSM Heavyweight Hoodie',
    slug: 'core-heavyweight-hoodie',
    sku: 'MRCH-HD-001',
    category: 'hoodie',
    categoryLabel: 'Hoodies & Outerwear',
    price: 89.00,
    compareAtPrice: 115.00,
    rating: 4.9,
    reviews: 1840,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    badge: 'COLLECTION 04',
    badgeType: 'featured'
  },
  {
    id: 'm2',
    name: 'Boxy Fit Heavy-Cotton Graphic Tee',
    slug: 'boxy-heavy-graphic-tee',
    sku: 'MRCH-TE-002',
    category: 'shirt',
    categoryLabel: 'Tees & Tops',
    price: 45.00,
    compareAtPrice: 60.00,
    rating: 4.9,
    reviews: 940,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    badge: '15% OFF',
    badgeType: 'sale'
  },
  {
    id: 'm3',
    name: 'Matte Onyx & Titanium Cuff Bracelet',
    slug: 'onyx-titanium-bracelet',
    sku: 'MRCH-BR-003',
    category: 'bracelet',
    categoryLabel: 'Bracelets & Gear',
    price: 65.00,
    compareAtPrice: 85.00,
    rating: 4.8,
    reviews: 920,
    imageUrl: 'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=800&q=80',
    badge: 'LOW STOCK',
    badgeType: 'low_stock'
  },
  {
    id: 'm4',
    name: 'Relaxed Fit Utility Cargo Joggers',
    slug: 'utility-cargo-joggers',
    sku: 'MRCH-PT-004',
    category: 'pants',
    categoryLabel: 'Bottoms & Joggers',
    price: 95.00,
    compareAtPrice: 120.00,
    rating: 4.9,
    reviews: 640,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW ARRIVAL',
    badgeType: 'featured'
  },
  {
    id: 'm5',
    name: 'Oversized Acid-Wash Zip Hoodie',
    slug: 'acid-wash-zip-hoodie',
    sku: 'MRCH-HD-005',
    category: 'hoodie',
    categoryLabel: 'Hoodies & Outerwear',
    price: 98.00,
    rating: 4.8,
    reviews: 510,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    badge: 'HEAVYWEIGHT',
    badgeType: 'featured'
  },
  {
    id: 'm6',
    name: 'Minimalist Monogram Pocket Top',
    slug: 'monogram-pocket-top',
    sku: 'MRCH-TE-006',
    category: 'shirt',
    categoryLabel: 'Tees & Tops',
    price: 38.00,
    compareAtPrice: 48.00,
    rating: 4.7,
    reviews: 420,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    badge: 'RESTOCKED',
    badgeType: 'sale'
  },
  {
    id: 'm7',
    name: 'Engraved Silver Chain Cuff Bracelet',
    slug: 'engraved-silver-bracelet',
    sku: 'MRCH-BR-007',
    category: 'bracelet',
    categoryLabel: 'Bracelets & Gear',
    price: 75.00,
    compareAtPrice: 95.00,
    rating: 4.9,
    reviews: 380,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    badge: '20% OFF',
    badgeType: 'sale'
  },
  {
    id: 'm8',
    name: 'Tapered French Terry Track Pants',
    slug: 'french-terry-track-pants',
    sku: 'MRCH-PT-008',
    category: 'pants',
    categoryLabel: 'Bottoms & Joggers',
    price: 78.00,
    rating: 4.8,
    reviews: 530,
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    badge: 'BEST SELLER',
    badgeType: 'featured'
  }
];

export default function FeaturedGrid() {
  const [filter, setFilter] = useState<'all' | 'hoodie' | 'shirt' | 'pants' | 'bracelet'>('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const filteredProducts = filter === 'all'
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category === filter);

  const handleAdd = (id: string) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
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
              All Merch ({SAMPLE_PRODUCTS.length})
            </button>
            <button
              onClick={() => setFilter('hoodie')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'hoodie'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Hoodies ({SAMPLE_PRODUCTS.filter(p => p.category === 'hoodie').length})
            </button>
            <button
              onClick={() => setFilter('shirt')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'shirt'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Tees & Tops ({SAMPLE_PRODUCTS.filter(p => p.category === 'shirt').length})
            </button>
            <button
              onClick={() => setFilter('pants')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'pants'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Bottoms ({SAMPLE_PRODUCTS.filter(p => p.category === 'pants').length})
            </button>
            <button
              onClick={() => setFilter('bracelet')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === 'bracelet'
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:text-indigo-950 hover:bg-slate-100'
              }`}
            >
              Accessories ({SAMPLE_PRODUCTS.filter(p => p.category === 'bracelet').length})
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
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />

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
                    <button 
                      aria-label="Quick View"
                      className="w-8 h-8 rounded-sm bg-white text-indigo-950 hover:text-rose-500 flex items-center justify-center shadow-sm border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
                      <a href={`#product-${product.slug}`}>{product.name}</a>
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
                      onClick={() => handleAdd(product.id)}
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
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-indigo-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <span>Explore Complete Collection 04 (45 Items)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
