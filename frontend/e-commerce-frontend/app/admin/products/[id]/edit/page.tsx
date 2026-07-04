import React from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500 block">Catalog Management</span>
        <h1 className="text-3xl font-extrabold text-indigo-950 font-heading mt-1">Edit Merch Item #{id}</h1>
      </div>
      <div className="py-20 bg-white border border-slate-200 p-8 rounded-sm text-center text-xs text-slate-500 font-mono">
        [Edit Product Form & Stock Adjustment Scaffolding]
      </div>
    </div>
  );
}
