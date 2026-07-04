import React from 'react';

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-slate-200 pb-8 mb-12">
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Acquisitions</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-950 font-heading mt-2">Shopping Bag</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-8 rounded-sm text-center text-xs text-slate-500 font-mono">
          [Cart Items & Quantity Adjustment Scaffolding]
        </div>
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-8 rounded-sm space-y-6">
          <h3 className="font-bold text-lg text-indigo-950 font-heading uppercase tracking-wider">Summary</h3>
          <div className="py-8 border-y border-slate-200 text-center text-xs text-slate-400 font-mono">
            [Subtotal, Tax & Checkout CTA Scaffolding]
          </div>
        </div>
      </div>
    </div>
  );
}
