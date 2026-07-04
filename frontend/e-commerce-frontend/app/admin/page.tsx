import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Executive Summary</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading mt-1">KPI Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Revenue</span>
          <div className="text-2xl font-mono font-bold text-indigo-950 mt-1">$42,850.00</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Orders Placed</span>
          <div className="text-2xl font-mono font-bold text-indigo-950 mt-1">412</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Low Stock Alerts</span>
          <div className="text-2xl font-mono font-bold text-rose-500 mt-1">3 Items</div>
        </div>
      </div>
      <div className="py-20 bg-white border border-slate-200 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Executive Revenue & Analytics Charts Scaffolding]
      </div>
    </div>
  );
}
