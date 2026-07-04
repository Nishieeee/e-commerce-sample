import React from 'react';

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-slate-200 pb-8 mb-12 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Shipment Inspector</span>
          <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Order #{orderNumber}</h1>
        </div>
        <span className="px-3 py-1 bg-indigo-950 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
          Processing
        </span>
      </div>
      <div className="py-20 bg-slate-50 border border-slate-200 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Order Item Breakdown, Shipping Coordinates & Invoice PDF Scaffolding]
      </div>
    </div>
  );
}
