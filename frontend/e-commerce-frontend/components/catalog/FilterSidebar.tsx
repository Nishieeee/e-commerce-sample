'use client';

import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryToggle: (slug: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
}

const TAXONOMIES = [
  { id: 'hoodie', label: 'Hoodies & Outerwear', count: 4 },
  { id: 'shirt', label: 'Tees & Tops', count: 3 },
  { id: 'pants', label: 'Bottoms & Joggers', count: 2 },
  { id: 'bracelet', label: 'Bracelets & Gear', count: 3 },
];

export default function FilterSidebar({
  selectedCategories,
  onCategoryToggle,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="w-full bg-white border border-slate-200 rounded-sm p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-indigo-950 font-heading font-extrabold text-base uppercase tracking-wider">
          <Filter className="w-4 h-4 text-rose-500" />
          <span>Filter Merch</span>
        </div>
        <button
          onClick={onReset}
          aria-label="Reset filters"
          className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Checkboxes */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
          Taxonomies
        </span>
        <div className="space-y-2.5">
          {TAXONOMIES.map((tax) => {
            const isChecked = selectedCategories.includes(tax.id);
            return (
              <label
                key={tax.id}
                className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-indigo-950 cursor-pointer group select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => onCategoryToggle(tax.id)}
                    className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center ${
                      isChecked
                        ? 'bg-indigo-950 border-indigo-950 text-white shadow-sm'
                        : 'border-slate-300 bg-slate-50 group-hover:border-indigo-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span onClick={() => onCategoryToggle(tax.id)} className={isChecked ? 'font-bold text-indigo-950' : ''}>
                    {tax.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({tax.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range ($0 - $500) */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Price Range ($0 - $500)
          </span>
        </div>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-950"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-2 rounded-sm">
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Min</span>
              <div className="flex items-center">
                <span className="text-xs font-mono text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max={maxPrice}
                  value={minPrice}
                  onChange={(e) => onPriceChange(Math.max(0, Number(e.target.value)), maxPrice)}
                  className="w-full bg-transparent text-xs font-mono font-bold text-indigo-950 focus:outline-none pl-1"
                />
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded-sm">
              <span className="text-[9px] font-mono uppercase text-slate-400 block">Max</span>
              <div className="flex items-center">
                <span className="text-xs font-mono text-slate-400">$</span>
                <input
                  type="number"
                  min={minPrice}
                  max="500"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, Math.min(500, Number(e.target.value)))}
                  className="w-full bg-transparent text-xs font-mono font-bold text-indigo-950 focus:outline-none pl-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Availability Toggle */}
      <div className="pt-6 border-t border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-3">
          Availability
        </span>
        <label className="flex items-center justify-between cursor-pointer group select-none">
          <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-950">
            In Stock Only
          </span>
          <div
            onClick={() => onInStockChange(!inStockOnly)}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              inStockOnly ? 'bg-indigo-950' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>
    </aside>
  );
}
