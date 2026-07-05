'use client';

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images?: string[];
  productName: string;
}

export default function ImageGallery({ images = [], productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback if images array is empty
  const displayImages = images.length > 0 ? images.slice(0, 6) : [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
  ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="space-y-2.5">
      {/* Main Compact Editorial Image Showcase with Hover Zoom */}
      <div className="relative aspect-[1/1] sm:aspect-[4/3] lg:aspect-[4/3] max-h-[360px] sm:max-h-[420px] w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200 group cursor-zoom-in">
        <img
          src={currentImage}
          alt={`${productName} - Angle ${selectedIndex + 1}`}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-slate-200 text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3 h-3 text-rose-500" />
          <span>Hover to Zoom Detail</span>
        </div>

        {/* Angle Indicator Badge */}
        <div className="absolute top-3 left-3 bg-indigo-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase tracking-widest">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Compact Thumbnail Navigation Strip */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {displayImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View angle ${idx + 1}`}
                className={`relative aspect-[1/1] max-h-12 sm:max-h-14 rounded-sm overflow-hidden border-2 transition-all cursor-pointer bg-slate-100 ${
                  isSelected
                    ? 'border-indigo-950 shadow-sm scale-98'
                    : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-indigo-950/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
