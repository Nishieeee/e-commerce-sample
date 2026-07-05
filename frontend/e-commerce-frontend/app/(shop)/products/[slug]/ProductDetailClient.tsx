'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Share2,
  Heart,
} from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import { ImageGallery } from '@/components/catalog';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const { addItem } = useCartStore();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-3 w-40 bg-slate-200 rounded-sm mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 aspect-[4/3] max-h-[420px] bg-slate-200 rounded-sm" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-3 w-28 bg-slate-200 rounded-sm" />
            <div className="h-8 w-3/4 bg-slate-200 rounded-sm" />
            <div className="h-6 w-24 bg-slate-200 rounded-sm" />
            <div className="h-14 w-full bg-slate-200 rounded-sm" />
            <div className="h-32 w-full bg-slate-200 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-indigo-950 font-heading">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          We couldn&apos;t locate the merchandise drop with identifier <strong className="font-mono">{slug}</strong>. It may have been retired or moved.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock !== undefined && product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const maxStock = product.stock !== undefined && product.stock > 0 ? product.stock : 99;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToBag = () => {
    if (isSoldOut) return;

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
      sku: product.sku,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  // Default specifications fallback if none provided
  const specs = product.specs || [
    { label: 'Fabric Density', value: '400 GSM Combed Cotton Fleece' },
    { label: 'Hardware', value: 'Grade 5 Aerospace Titanium' },
    { label: 'Fit', value: 'Boxy Oversized Drop-Shoulder' },
    { label: 'Origin', value: 'Engineered & Crafted in Lisbon' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Compact Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="py-2 border-b border-slate-200 mb-5 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-indigo-950 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-indigo-950 transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category}`} className="hover:text-indigo-950 transition-colors">{product.categoryLabel}</Link>
          <span>/</span>
          <span className="text-indigo-950 font-bold truncate max-w-[180px] sm:max-w-md">{product.name}</span>
        </div>

        <Link href="/catalog" className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-indigo-950 hover:text-rose-500 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Grid</span>
        </Link>
      </nav>

      {/* Compact 12-Column Split-Screen Editorial Showcase (Fits on One Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* Left Column (6 Cols): High-Res Image Gallery */}
        <div className="lg:col-span-6 sticky top-24">
          <ImageGallery images={product.images || [product.imageUrl]} productName={product.name} />
        </div>

        {/* Right Column (6 Cols): Technical Specifications & Interactive Add-to-Bag */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          
          {/* Header Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
                {product.categoryLabel} &bull; Drop #04
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-400">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-heading tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-amber-500 font-bold text-sm">
                  {'★'.repeat(Math.floor(product.rating))}
                  {product.rating % 1 > 0 ? '½' : ''}
                </div>
                <span className="font-mono font-bold text-indigo-950">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-mono text-[11px]">({product.reviews} Verified Reviews)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button aria-label="Share product" className="p-1.5 text-slate-400 hover:text-indigo-950 rounded-sm border border-slate-200 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button aria-label="Add to wishlist" className="p-1.5 text-slate-400 hover:text-rose-500 rounded-sm border border-slate-200 transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Compact Price Box */}
          <div className="flex items-baseline gap-2.5 p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-mono tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-sm font-mono text-slate-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
            {product.description || 'High-density heavyweight fabrication engineered for daily wear and lifelong thermal comfort. Constructed with double-needle flatlock seams and custom titanium hardware.'}
          </p>

          {/* Compact Technical Specification Table (2x2 Grid) */}
          <div className="space-y-1.5 pt-0.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-950 font-heading">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-sm overflow-hidden">
              {specs.map((spec, idx) => (
                <div key={idx} className="bg-white p-2 sm:p-2.5 flex flex-col justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {spec.label}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-indigo-950 font-mono line-clamp-1">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Interactive Add-to-Bag Box */}
          <div className="bg-white border-2 border-indigo-950 rounded-sm p-3.5 sm:p-4 space-y-3.5 shadow-sm">
            
            {/* Dynamic Stock Badge Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Stock Status:
              </span>
              {isSoldOut ? (
                <span className="bg-slate-900 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm inline-flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>SOLD OUT - JOIN WAITLIST</span>
                </span>
              ) : isLowStock ? (
                <span className="bg-rose-500 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm inline-flex items-center gap-1 shadow-sm animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>LOW STOCK ({product.stock} LEFT)</span>
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm inline-flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>IN STOCK</span>
                </span>
              )}
            </div>

            {/* Quantity Selector & Add CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Quantity Input */}
              <div className="flex items-center justify-between border-2 border-slate-200 hover:border-indigo-950 rounded-sm bg-slate-50 overflow-hidden sm:w-28 shrink-0 transition-colors h-10">
                <button
                  onClick={handleDecrement}
                  disabled={isSoldOut || quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200/80 hover:text-indigo-950 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-mono font-extrabold text-sm text-indigo-950">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={isSoldOut || quantity >= maxStock}
                  aria-label="Increase quantity"
                  className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200/80 hover:text-indigo-950 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ADD TO BAG CTA Button */}
              <button
                onClick={handleAddToBag}
                disabled={isSoldOut}
                className={`flex-1 py-2.5 px-6 rounded-sm font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 h-10 ${
                  isSoldOut
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-950 hover:bg-rose-500 text-white'
                }`}
              >
                {isSoldOut ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added To Your Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG &bull; ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Compact Trust Badges */}
            <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">Free Air Delivery &gt;$150</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">30-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                  PT
                </span>
                <span className="truncate">Crafted in Lisbon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
