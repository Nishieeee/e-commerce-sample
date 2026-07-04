import React from 'react';

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-slate-200 pb-8 mb-12">
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">VIP Account</span>
        <h1 className="text-4xl font-extrabold text-indigo-950 font-heading mt-2">Profile & Settings</h1>
      </div>
      <div className="py-20 bg-slate-50 border border-slate-200 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Personal Info, SMS Password Triggers & Password Change Scaffolding]
      </div>
    </div>
  );
}
