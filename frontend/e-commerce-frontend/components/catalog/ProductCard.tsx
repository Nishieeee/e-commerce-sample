'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, Heart, Eye, AlertCircle } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const isSoldOut = product.stock !== undefined && product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      sku: product.sku,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group flex flex-col justify-between bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-indigo-950 hover:shadow-md">
      {/* Compact Image Wrapper */}
      <a href={`/products/${product.slug}`} className="relative aspect-[1/1] sm:aspect-[4/5] w-full overflow-hidden bg-slate-100 block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isSoldOut ? 'grayscale opacity-75' : ''
          }`}
        />

        {/* Badges Container */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none gap-1">
          <div className="flex flex-col gap-1">
            {product.badge && (
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm ${
                  product.badgeType === 'sale'
                    ? 'bg-rose-500 text-white'
                    : product.badgeType === 'low_stock'
                    ? 'bg-indigo-950 text-white'
                    : 'bg-white text-indigo-950 border border-slate-200'
                }`}
              >
                {product.badge}
              </span>
            )}
            {isLowStock && !product.badge && (
              <span className="bg-rose-500 text-white text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>Only {product.stock} Left</span>
              </span>
            )}
          </div>

          {isSoldOut && (
            <span className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Wishlist"
            className="w-7 h-7 rounded-sm bg-white text-indigo-950 hover:text-rose-500 flex items-center justify-center shadow-sm border border-slate-200 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <span
            aria-label="Quick View"
            className="w-7 h-7 rounded-sm bg-white text-indigo-950 hover:text-rose-500 flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* Compact Card Body */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1">
          {/* Category Label & SKU */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            <span className="truncate max-w-[120px]">{product.categoryLabel}</span>
            <span className="font-mono text-[9px]">{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-xs sm:text-sm text-indigo-950 group-hover:text-rose-600 transition-colors line-clamp-1 font-heading">
            <a href={`/products/${product.slug}`}>{product.name}</a>
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-0.5">
            <span className="text-amber-500 font-bold">&#9733;</span>
            <span className="font-mono font-bold text-indigo-950">{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-mono">({product.reviews})</span>
          </div>
        </div>

        {/* Price & Add to Cart CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <div>
            {product.compareAtPrice && (
              <span className="text-[10px] font-mono text-slate-400 line-through block">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-indigo-950 font-mono tracking-tight block">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            aria-label={isSoldOut ? 'Sold out' : 'Add to bag'}
            className={`px-3 py-1.5 rounded-sm font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isSoldOut
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-950 hover:bg-rose-500 text-white active:scale-98 shadow-sm'
            }`}
          >
            {isSoldOut ? (
              <span>Sold Out</span>
            ) : isAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
