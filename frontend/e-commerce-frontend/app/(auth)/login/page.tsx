import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-200 rounded-sm">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Account Access</span>
          <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Sign In to NEXUS</h1>
          <p className="text-sm text-slate-600 mt-2">Enter your VIP credentials to access exclusive Collection 04 drops and order tracking.</p>
        </div>
        <div className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 font-mono">
          [Auth Login Scaffolding]
        </div>
      </div>
    </div>
  );
}
