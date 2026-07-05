'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from '@/components/cart';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, toggleDrawer } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      {/* Sleek Minimalist Announcement Bar */}
      <div className="bg-indigo-950 text-white text-[11px] font-medium py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping On Orders Over $120 — Use Code <strong className="underline underline-offset-2">NEXUS15</strong></span>
      </div>

      {/* Main Clean Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center shrink-0">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-indigo-950 text-white font-heading font-bold text-lg flex items-center justify-center rounded-sm transition-colors group-hover:bg-rose-500">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-indigo-950 font-heading leading-none">
                NEXUS
              </span>
              <span className="text-[9px] tracking-widest uppercase text-slate-500 font-semibold mt-0.5">
                Merch Studio
              </span>
            </div>
          </a>
        </div>

        {/* Center: Editorial Desktop Links */}
        <div className="hidden lg:flex items-center justify-center gap-8 text-xs font-semibold tracking-wider uppercase text-slate-700">
          <Link href="/catalog" className="hover:text-rose-500 transition-colors py-2">
            All Merch
          </Link>
          <Link href="/catalog" className="hover:text-rose-500 transition-colors py-2">
            Hoodies
          </Link>
          <Link href="/catalog" className="hover:text-rose-500 transition-colors py-2">
            Tees & Tops
          </Link>
          <Link href="/catalog" className="hover:text-rose-500 transition-colors py-2">
            Bottoms
          </Link>
          <Link href="/catalog" className="hover:text-rose-500 transition-colors py-2">
            Accessories
          </Link>
          <Link href="/catalog" className="text-rose-600 font-bold hover:text-indigo-950 transition-colors py-2 flex items-center gap-1">
            <span>Collection 04 Drop</span>
          </Link>
        </div>

        {/* Right: Functional UI Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Refined Search Box */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search catalog..."
              onFocus={() => setSearchOpen(true)}
              className="w-44 lg:w-52 pl-8 pr-3 py-2 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-indigo-950 rounded-sm focus:outline-none transition-all text-indigo-950 placeholder-slate-400 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Wishlist Icon */}
          <button 
            aria-label="Wishlist"
            className="p-2 text-slate-700 hover:text-rose-500 transition-colors hidden sm:block"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Account Icon */}
          <button 
            aria-label="Account"
            className="p-2 text-slate-700 hover:text-indigo-950 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <User className="w-5 h-5" />
            <span className="hidden xl:inline tracking-wider uppercase text-[11px]">Account</span>
          </button>

          {/* Bag Button */}
          <button 
            onClick={() => toggleDrawer(true)}
            aria-label="Shopping Bag"
            className="bg-indigo-950 hover:bg-rose-500 text-white px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-indigo-950 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="relative w-full mb-4 md:hidden">
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 rounded-sm border border-slate-200 focus:outline-none focus:border-indigo-950 text-indigo-950"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <div className="flex flex-col space-y-3 font-heading text-sm font-semibold uppercase tracking-wider text-slate-800">
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-rose-500">
              All Merch Catalog
            </Link>
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-rose-500">
              Hoodies & Outerwear
            </Link>
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-rose-500">
              Tees & Tops
            </Link>
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-rose-500">
              Bottoms & Joggers
            </Link>
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-rose-500">
              Accessories & Gear
            </Link>
            <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 text-rose-600 font-bold">
              Collection 04 Drop
            </Link>
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />
    </header>
  );
}
