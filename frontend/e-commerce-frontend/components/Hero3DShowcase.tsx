'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle, ShoppingBag, Eye, Star } from 'lucide-react';

type ShowcaseCategory = 'hoodie' | 'bracelet' | 'pants';

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  category: ShowcaseCategory;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  imageUrl: string;
  specs: { label: string; value: string }[];
}

const SHOWCASE_ITEMS: Record<ShowcaseCategory, ShowcaseItem> = {
  hoodie: {
    id: 'merch-hd-04',
    title: 'Core 400 GSM Heavyweight Hoodie',
    subtitle: 'Crafted from ultra-dense 400 GSM French Terry Fleece with an effortless boxy drape and lifetime thermal comfort. Designed for daily wear.',
    category: 'hoodie',
    price: 89.00,
    compareAtPrice: 115.00,
    rating: 4.9,
    reviews: 1840,
    badge: 'COLLECTION 04 — FLAGSHIP',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    specs: [
      { label: 'Fabric Density', value: '400 GSM French Terry' },
      { label: 'Composition', value: '100% GOTS Organic Cotton' },
      { label: 'Fit Silhouette', value: 'Boxy / Pre-Shrunk' },
      { label: 'Construction', value: 'Double-Lined Heavy Hood' },
    ]
  },
  bracelet: {
    id: 'merch-br-01',
    title: 'Matte Onyx & Titanium Cuff Bracelet',
    subtitle: 'Aerospace Grade 5 Titanium paired with hand-finished matte black onyx stones for understated daily sophistication. Waterproof and tarnish-free.',
    category: 'bracelet',
    price: 65.00,
    compareAtPrice: 85.00,
    rating: 4.8,
    reviews: 920,
    badge: 'SIGNATURE ACCESSORY',
    imageUrl: 'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=1200&q=80',
    specs: [
      { label: 'Base Metal', value: 'Grade 5 Aerospace Titanium' },
      { label: 'Stone Material', value: 'Matte Black Onyx Beads' },
      { label: 'Clasp Mechanism', value: 'Magnetic Laser-Engraved' },
      { label: 'Durability', value: '100% Waterproof / No Tarnish' },
    ]
  },
  pants: {
    id: 'merch-pt-02',
    title: 'Relaxed Fit Utility Cargo Joggers',
    subtitle: 'Enzyme-washed 320 GSM cotton twill engineered for maximum street mobility and multi-pocket functional utility. Tapered or wide-leg toggle.',
    category: 'pants',
    price: 95.00,
    compareAtPrice: 120.00,
    rating: 4.9,
    reviews: 640,
    badge: 'ESSENTIAL BOTTOMS',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80',
    specs: [
      { label: 'Fabric Weave', value: '320 GSM Cotton Twill' },
      { label: 'Pocket Layout', value: '6 Reinforced Utility Pockets' },
      { label: 'Waist & Ankle', value: 'Elastic + Drawstring Toggle' },
      { label: 'Wash Treatment', value: 'Vintage Enzyme Softened' },
    ]
  }
};

export default function Hero3DShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseCategory>('hoodie');
  const [addedToCart, setAddedToCart] = useState(false);

  const currentItem = SHOWCASE_ITEMS[activeTab];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Navigation Tabs */}
        <div className="flex items-center justify-start gap-8 border-b border-slate-200 pb-4 mb-12 overflow-x-auto text-xs font-bold uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('hoodie')}
            className={`pb-4 -mb-[17px] border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'hoodie'
                ? 'border-indigo-950 text-indigo-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            01 / Hoodies & Outerwear
          </button>
          <button
            onClick={() => setActiveTab('bracelet')}
            className={`pb-4 -mb-[17px] border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'bracelet'
                ? 'border-indigo-950 text-indigo-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            02 / Titanium Bracelets
          </button>
          <button
            onClick={() => setActiveTab('pants')}
            className={`pb-4 -mb-[17px] border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'pants'
                ? 'border-indigo-950 text-indigo-950'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            03 / Cargo Joggers
          </button>
        </div>

        {/* Editorial Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Typography & Specs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <div className="space-y-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-rose-500 block">
                {currentItem.badge}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-indigo-950 tracking-tight leading-[1.08] font-heading">
                {currentItem.title}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal pt-2">
                {currentItem.subtitle}
              </p>
            </div>

            {/* Clean 2x2 Specs Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-4 border-y border-slate-200 py-6">
              {currentItem.specs.map((spec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                    {spec.label}
                  </span>
                  <span className="text-sm font-bold text-indigo-950 block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Price & Primary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-mono tracking-tight">
                  ${currentItem.price.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-slate-400 line-through font-mono">
                  ${currentItem.compareAtPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 uppercase tracking-wider">
                  Save ${(currentItem.compareAtPrice - currentItem.price).toFixed(0)}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className={`w-full sm:w-auto px-8 py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer ${
                    addedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-950 hover:bg-rose-500 text-white active:scale-98'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Clean Trust Indicators */}
            <div className="pt-4 flex items-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-950" />
                <span>Lifetime Stitch Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{currentItem.rating} Rating ({currentItem.reviews} Reviews)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Product Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-slate-100 rounded-sm overflow-hidden group">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              
              {/* Subtle Bottom Image Label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-4 rounded-sm border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                    Collection 04 / Featured
                  </span>
                  <h4 className="text-xs font-bold text-indigo-950">
                    {currentItem.title}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-950">
                  ${currentItem.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
