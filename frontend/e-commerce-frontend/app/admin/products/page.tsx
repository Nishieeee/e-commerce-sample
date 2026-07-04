import React from 'react';

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Inventory</span>
          <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Merch Catalog Management</h1>
        </div>
        <a href="/admin/products/new" className="bg-indigo-950 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-rose-500 transition-colors">
          + New Drop
        </a>
      </div>
      <div className="py-20 bg-white border border-slate-200 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Admin Product List Table & Stock Badges Scaffolding]
      </div>
    </div>
  );
}
