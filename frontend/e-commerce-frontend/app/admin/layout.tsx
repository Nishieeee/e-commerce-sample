import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-indigo-950 text-white p-6 shrink-0 border-b md:border-r border-indigo-900">
        <div className="font-bold font-heading text-lg tracking-tight mb-8">
          NEXUS <span className="text-xs uppercase tracking-widest text-rose-400 block font-mono">Admin Portal</span>
        </div>
        <nav className="space-y-3 text-xs font-bold uppercase tracking-wider">
          <a href="/admin" className="block py-2 text-slate-300 hover:text-white">KPI Dashboard</a>
          <a href="/admin/products" className="block py-2 text-slate-300 hover:text-white">Merch Catalog</a>
          <a href="/admin/categories" className="block py-2 text-slate-300 hover:text-white">Taxonomies</a>
          <a href="/admin/orders" className="block py-2 text-slate-300 hover:text-white">Order Fulfillment</a>
          <a href="/" className="block py-2 text-rose-400 pt-6 border-t border-indigo-900">← Back to Store</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
