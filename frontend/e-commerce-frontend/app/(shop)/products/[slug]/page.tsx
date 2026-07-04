import React from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="py-4 border-b border-slate-200 mb-8 text-xs font-mono text-slate-400 uppercase tracking-widest">
        Home / Catalog / {slug}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 bg-slate-100 aspect-[4/5] rounded-sm flex items-center justify-center text-xs text-slate-400 font-mono">
          [Image Gallery Scaffolding for: {slug}]
        </div>
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Collection 04 / Featured</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading">{slug.replace(/-/g, ' ').toUpperCase()}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">High-density heavyweight fabrication engineered for daily wear and lifelong thermal comfort.</p>
          <div className="py-6 border-y border-slate-200 text-center text-xs text-slate-400 font-mono">
            [GSM Specs & Add to Bag Scaffolding]
          </div>
        </div>
      </div>
    </div>
  );
}
