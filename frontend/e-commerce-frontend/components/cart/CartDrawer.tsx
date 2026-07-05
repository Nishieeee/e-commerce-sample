'use client';

import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, ArrowRight, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartItemRow from './CartItemRow';

export default function CartDrawer() {
  const { items, isOpen, toggleDrawer, clearCart, lastAddedTimestamp } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoClosing, setIsAutoClosing] = useState(false);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 150.00;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeeded = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsAutoClosing(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-close animation after 2.5 seconds when item is newly added!
  useEffect(() => {
    if (isOpen && lastAddedTimestamp && Date.now() - lastAddedTimestamp < 3500) {
      setIsAutoClosing(true);
      const timer = setTimeout(() => {
        if (!isHovered) {
          toggleDrawer(false);
          setIsAutoClosing(false);
        }
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsAutoClosing(false);
    }
  }, [isOpen, lastAddedTimestamp, isHovered, toggleDrawer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop Blur */}
      <div
        onClick={() => toggleDrawer(false)}
        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300 cursor-pointer"
        aria-label="Close cart drawer"
      />

      {/* Slide-over right panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-950 text-white rounded-sm flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-indigo-950 font-heading tracking-tight">
                  YOUR BAG
                </h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  {totalCount} {totalCount === 1 ? 'Item' : 'Items'} Selected
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleDrawer(false)}
              aria-label="Close drawer"
              className="p-2 text-slate-400 hover:text-indigo-950 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Auto-Close Confirmation Animation Bar */}
          {isAutoClosing && (
            <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold animate-in slide-in-from-top duration-300 shadow-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>Item Added! Auto-closing bag...</span>
              </span>
              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Hover to Pause
              </span>
            </div>
          )}

          {/* Free Shipping Progress Bar */}
          <div className="bg-indigo-950/5 border-b border-slate-200 px-6 py-3.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-indigo-950 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                    Free VIP Express Air Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-rose-600 font-mono">${amountNeeded.toFixed(2)}</strong> more for Free VIP Express Shipping
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-emerald-600' : 'bg-rose-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="font-extrabold text-base text-indigo-950 font-heading">
                  YOUR BAG IS EMPTY
                </h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  You haven&apos;t added any heavyweight fleece or titanium gear yet. Explore Collection 04 to begin.
                </p>
                <a
                  href="/catalog"
                  onClick={() => toggleDrawer(false)}
                  className="mt-4 px-6 py-3 bg-indigo-950 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/80 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-indigo-950 text-sm">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping Estimate</span>
                  <span className="font-mono text-slate-500">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : '$15.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-mono text-slate-500">
                    ${(subtotal * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-indigo-950">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base text-rose-600">
                    ${(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15) + subtotal * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/checkout"
                  onClick={() => toggleDrawer(false)}
                  className="w-full py-4 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href="/cart"
                    onClick={() => toggleDrawer(false)}
                    className="flex-1 py-2.5 text-center bg-white hover:bg-slate-100 text-indigo-950 font-bold text-[11px] uppercase tracking-wider rounded-sm border border-slate-200 transition-colors cursor-pointer"
                  >
                    View Bag Table
                  </a>
                  <button
                    onClick={clearCart}
                    className="px-3 py-2.5 text-slate-400 hover:text-red-600 font-semibold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Checkout &bull; 30-Day Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
