import React from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Order Inspector</span>
          <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Fulfillment #{id}</h1>
        </div>
        <button className="bg-indigo-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rose-500 transition-colors">
          Update Status
        </button>
      </div>
      <div className="py-20 bg-white border border-slate-200 p-8 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Admin Order Inspector, Tracking Assignment & Customer Coordinates Scaffolding]
      </div>
    </div>
  );
}
