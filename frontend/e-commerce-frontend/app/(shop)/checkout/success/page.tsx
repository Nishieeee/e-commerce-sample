import React from 'react';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="bg-white border border-slate-200 p-12 rounded-sm space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mx-auto text-2xl font-bold">
          ✓
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Acquisition Confirmed</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading">Order Placed Successfully</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">Thank you for ordering from NEXUS Merch Studio. Your inventory allocation has been locked and dispatched to our warehouse.</p>
        <div className="py-6 border-y border-slate-200 text-xs text-slate-400 font-mono">
          [Order Receipt & Tracking Number Scaffolding]
        </div>
      </div>
    </div>
  );
}
