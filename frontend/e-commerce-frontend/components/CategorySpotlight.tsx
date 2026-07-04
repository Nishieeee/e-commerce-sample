'use client';

import React from 'react';
import { ArrowRight, Truck, Shield, Zap, Lock } from 'lucide-react';

export default function CategorySpotlight() {
  const categories = [
    {
      id: 'hoodies',
      title: 'Hoodies & Outerwear',
      subtitle: 'Heavyweight 400 GSM French Terry Fleece & Structured Streetwear Silhouettes.',
      itemCount: '45 Signature Drops',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      badge: 'COLLECTION 04 MAIN',
      href: '#hoodies',
      featuredSpan: 'md:col-span-2 lg:col-span-7'
    },
    {
      id: 'shirts',
      title: 'Tees & Tops',
      subtitle: 'Boxy Fit 280 GSM Combed Cotton with Vintage Acid-Wash & Monogram Prints.',
      itemCount: '80 New Arrivals',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      badge: '100% ORGANIC',
      href: '#shirts',
      featuredSpan: 'md:col-span-1 lg:col-span-5'
    },
    {
      id: 'bracelets',
      title: 'Bracelets & Gear',
      subtitle: 'Aerospace Grade 5 Titanium Cuffs, Matte Onyx Stone Beads & Minimalist Tote Bags.',
      itemCount: '35 Crafted Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=800&q=80',
      badge: 'WATERPROOF & NO TARNISH',
      href: '#bracelets',
      featuredSpan: 'md:col-span-3 lg:col-span-12'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Trust Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 mb-16 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-slate-100 text-indigo-950 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Free Global Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">On all merch orders over $120</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-slate-100 text-indigo-950 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Lifetime Warranty</h4>
              <p className="text-xs text-slate-500 mt-0.5">Guaranteed stitch & hardware quality</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-slate-100 text-indigo-950 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">24-Hour Dispatch</h4>
              <p className="text-xs text-slate-500 mt-0.5">Instant warehouse processing</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-sm bg-slate-100 text-indigo-950 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Secure Checkout</h4>
              <p className="text-xs text-slate-500 mt-0.5">256-Bit SSL Stripe encrypted</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-rose-500 block mb-2">
              Taxonomies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight font-heading">
              Explore Collections
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Hand-crafted in limited quantities using ethical organic fabrics and aerospace-grade hardware. Designed to outlast seasonal trends.
          </p>
        </div>

        {/* Editorial Category Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className={`group flex flex-col bg-slate-50 border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-indigo-950 ${cat.featuredSpan}`}
            >
              {/* Image Box */}
              <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden bg-slate-200">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-indigo-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {cat.badge}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6 bg-white">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                    {cat.itemCount}
                  </span>
                  <h3 className="text-2xl font-bold text-indigo-950 font-heading tracking-tight group-hover:text-rose-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-950 group-hover:text-rose-600 transition-colors">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
