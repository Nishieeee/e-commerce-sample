'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-indigo-950 text-white pt-16 pb-12 border-t border-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Newsletter Signup Box */}
        <div className="bg-white/5 p-8 sm:p-12 rounded-sm mb-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
              VIP Allocation List
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
              Get VIP Access to Drop 05
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Subscribe to receive private SMS password triggers for limited merch releases, lookbooks, and 15% off your initial acquisition.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 min-w-[300px] sm:min-w-[380px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address..."
              required
              className="px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 text-xs w-full transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-sm bg-rose-500 hover:bg-rose-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <span>Join VIP</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-indigo-900/80 text-xs">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4 pr-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-white text-indigo-950 font-bold text-base flex items-center justify-center font-heading">
                N
              </div>
              <span className="font-bold text-lg tracking-tight font-heading">
                NEXUS
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              The Official Merchandise & Lifestyle Studio. Engineered with heavyweight 400 GSM fabrics, aerospace titanium hardware, and Option C Nordic Minimalist design.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-rose-400 pt-1 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>GOTS Organic Certified</span>
            </div>
          </div>

          {/* Col 2: Merch Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] font-heading">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-slate-300 font-medium">
              <li><a href="#hoodies" className="hover:text-white transition-colors">Hoodies & Outerwear</a></li>
              <li><a href="#shirts" className="hover:text-white transition-colors">Tees & Graphic Tops</a></li>
              <li><a href="#pants" className="hover:text-white transition-colors">Bottoms & Joggers</a></li>
              <li><a href="#bracelets" className="hover:text-white transition-colors">Titanium Bracelets</a></li>
              <li><a href="#deals" className="hover:text-white transition-colors">Collection 04 Box Set</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] font-heading">
              Support
            </h4>
            <ul className="space-y-2.5 text-slate-300 font-medium">
              <li><a href="#tracking" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">30-Day Returns</a></li>
              <li><a href="#sizing" className="hover:text-white transition-colors">Sizing & Boxy Fit Guide</a></li>
              <li><a href="#shipping" className="hover:text-white transition-colors">Global Shipping Rates</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Care & Washing FAQ</a></li>
            </ul>
          </div>

          {/* Col 4: Architecture & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] font-heading">
              System Spec
            </h4>
            <ul className="space-y-2.5 text-slate-300 font-medium">
              <li><a href="#api-docs" className="hover:text-white transition-colors">Next.js 16 App Router</a></li>
              <li><a href="#database" className="hover:text-white transition-colors">Laravel 11/12 REST API</a></li>
              <li><a href="#sanctum" className="hover:text-white transition-colors">Inventory Row-Locking</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>© 2026 NEXUS Merch Studio. All Rights Reserved.</span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase font-bold text-slate-300">
            <span className="px-2 py-1 rounded-sm bg-white/5 border border-white/10">Stripe</span>
            <span className="px-2 py-1 rounded-sm bg-white/5 border border-white/10">PayPal</span>
            <span className="px-2 py-1 rounded-sm bg-white/5 border border-white/10">Visa / MC</span>
            <span className="px-2 py-1 rounded-sm bg-white/5 border border-white/10">Apple Pay</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
