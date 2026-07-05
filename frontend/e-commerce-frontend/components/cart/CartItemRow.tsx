'use client';

import React from 'react';
import { Plus, Minus, X } from 'lucide-react';
import type { CartItem } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-200 last:border-none group">
      {/* Thumbnail */}
      <div className="relative w-20 h-24 bg-slate-100 rounded-sm overflow-hidden shrink-0 border border-slate-200">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item Details */}
      <div className="flex flex-col flex-1 justify-between min-h-[96px]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-xs text-indigo-950 font-heading line-clamp-1">
              <a href={`/products/${item.productId}`} className="hover:text-rose-500 transition-colors">
                {item.name}
              </a>
            </h4>
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Remove item"
              className="text-slate-400 hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mt-0.5">
            SKU: {item.sku}
          </span>
        </div>

        {/* Quantity Controls & Line Price */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-center border border-slate-200 rounded-sm bg-slate-50 overflow-hidden">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200/70 hover:text-indigo-950 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-indigo-950">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200/70 hover:text-indigo-950 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold font-mono text-indigo-950">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            {item.quantity > 1 && (
              <span className="text-[9px] font-mono text-slate-400 block">
                (${item.price.toFixed(2)} ea)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
