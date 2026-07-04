import React from 'react';

export default function NewProductPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Catalog Management</span>
        <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Create New Merch Drop</h1>
      </div>
      <div className="py-20 bg-white border border-slate-200 p-8 rounded-sm text-center text-xs text-slate-500 font-mono">
        [New Product Form: Title, GSM Specs, SKU, Price & Image Upload Scaffolding]
      </div>
    </div>
  );
}
