'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured / Drop #04' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Drops' },
  { value: 'rating', label: 'Customer Rating' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
        <span className="hidden sm:inline">Sort By:</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="bg-white border border-slate-200 hover:border-indigo-950 text-indigo-950 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-950 cursor-pointer transition-colors"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-xs uppercase font-medium">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
