'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  AlertCircle,
  ShieldCheck,
  Truck,
  Lock,
  PackageOpen,
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: 'percentage' | 'fixed' | 'shipping';
    value: number;
    description: string;
  } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Promo Code Validation Logic
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');

    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'NEXUS15') {
      setAppliedPromo({
        code: 'NEXUS15',
        type: 'percentage',
        value: 0.15,
        description: '15% Off Collection 04 Merch',
      });
      setPromoCode('');
    } else if (cleanCode === 'VIP2026') {
      setAppliedPromo({
        code: 'VIP2026',
        type: 'fixed',
        value: 25.00,
        description: '$25 Off VIP Customer Allocation',
      });
      setPromoCode('');
    } else if (cleanCode === 'FREESHIP') {
      setAppliedPromo({
        code: 'FREESHIP',
        type: 'shipping',
        value: 15.00,
        description: 'Complimentary Express Air Delivery',
      });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code or expired VIP allocation voucher.');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Financial Calculations
  const discountAmount = appliedPromo
    ? appliedPromo.type === 'percentage'
      ? subtotal * appliedPromo.value
      : appliedPromo.type === 'fixed'
      ? Math.min(subtotal, appliedPromo.value)
      : 0
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  const isFreeShippingUnlocked = discountedSubtotal >= 150 || (appliedPromo && appliedPromo.type === 'shipping');
  const shippingFee = items.length === 0 ? 0 : isFreeShippingUnlocked ? 0 : 15.00;
  
  const taxRate = 0.085; // 8.5% regional tax
  const estimatedTax = discountedSubtotal * taxRate;
  
  const totalAmountDue = discountedSubtotal + shippingFee + estimatedTax;

  const progressToFreeShipping = Math.min(100, (discountedSubtotal / 150) * 100);
  const remainingForFreeShipping = Math.max(0, 150 - discountedSubtotal);

  // Empty Bag State
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white border border-slate-200 rounded-sm p-12 sm:p-20 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <PackageOpen className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-heading">
              YOUR SHOPPING BAG IS EMPTY
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven&apos;t added any merchandise from Collection 04 yet. Explore our latest custom-milled drops and heavyweight streetwear.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Merch Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 block mb-1">
            Acquisitions &bull; Collection 04
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading tracking-tight">
            Review Shopping Bag
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
          <span>{items.reduce((sum, i) => sum + i.quantity, 0)} Items Selected</span>
          <span>&bull;</span>
          <button
            onClick={clearCart}
            className="text-rose-500 hover:underline font-bold tracking-wider uppercase cursor-pointer"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Main Cart Grid (Left: Items Table, Right: Summary Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (8 Cols): Full Bag Review Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Shipping Notification Banner */}
          <div className="bg-indigo-950 text-white p-4 rounded-sm space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-500" />
                <span>
                  {isFreeShippingUnlocked
                    ? 'COMPLIMENTARY VIP EXPRESS AIR DELIVERY UNLOCKED'
                    : `ADD $${remainingForFreeShipping.toFixed(2)} MORE FOR FREE EXPRESS AIR SHIPPING`}
                </span>
              </span>
              <span className="font-mono">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white border border-slate-200 rounded-sm divide-y divide-slate-200 shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-slate-50/60 transition-colors">
                
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`} className="relative w-20 h-24 sm:w-24 sm:h-28 bg-slate-100 rounded-sm overflow-hidden shrink-0 border border-slate-200 block">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        SKU: {item.sku}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm">
                        In Stock
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-indigo-950 font-heading truncate hover:text-rose-600 transition-colors">
                      <Link href={`/products/${item.productId}`}>{item.name}</Link>
                    </h3>

                    <div className="text-xs font-mono text-slate-500">
                      Unit Price: <strong className="text-indigo-950">${item.price.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-slate-200 rounded-sm bg-white overflow-hidden shrink-0 h-9">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-950 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-indigo-950">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-indigo-950 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm sm:text-base font-extrabold text-indigo-950 font-mono block">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-sm transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-950 hover:text-rose-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping Merch</span>
            </Link>

            <span className="text-xs text-slate-400 font-mono">
              Need assistance? Support@nexusmerch.studio
            </span>
          </div>

        </div>

        {/* Right Column (4 Cols): Order Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white border-2 border-indigo-950 rounded-sm p-6 space-y-6 shadow-sm">
            <h2 className="font-extrabold text-lg text-indigo-950 font-heading uppercase tracking-wider border-b border-slate-200 pb-4">
              Order Summary
            </h2>

            {/* Financial Breakdown Table */}
            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between">
                <span>Gross Subtotal</span>
                <span className="font-mono font-bold text-indigo-950 text-sm">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Applied Discount Row */}
              {appliedPromo && (
                <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 p-2 rounded-sm border border-emerald-200 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>{appliedPromo.code} ({appliedPromo.description})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      -{appliedPromo.type === 'shipping' ? 'FREE SHIP' : `$${discountAmount.toFixed(2)}`}
                    </span>
                    <button
                      onClick={removePromo}
                      className="text-rose-500 hover:underline text-[10px] uppercase ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-bold text-indigo-950">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">FREE (VIP AIR)</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated Regional Tax (8.5%)</span>
                <span className="font-mono font-bold text-indigo-950">
                  ${estimatedTax.toFixed(2)}
                </span>
              </div>

              {/* Total Divider */}
              <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between text-indigo-950">
                <span className="font-extrabold text-sm uppercase tracking-wider font-heading">
                  Total Due
                </span>
                <span className="font-mono font-extrabold text-2xl tracking-tight text-rose-600">
                  ${totalAmountDue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Coupon Input Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                VIP Allocation / Promo Code
              </span>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try NEXUS15 or VIP2026..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none font-mono uppercase text-indigo-950 placeholder-slate-400"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>
              {promoError && (
                <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{promoError}</span>
                </p>
              )}
            </div>

            {/* Primary Conversion CTA Button */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 block text-center"
            >
              <Lock className="w-4 h-4" />
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            {/* Security Trust Badges */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Instant Allocation Guarantee</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
