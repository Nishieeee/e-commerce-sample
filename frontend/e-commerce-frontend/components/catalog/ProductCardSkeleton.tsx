import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white border border-slate-200 rounded-sm overflow-hidden animate-pulse">
      {/* Compact Image Skeleton */}
      <div className="aspect-[1/1] sm:aspect-[4/5] w-full bg-slate-200" />

      {/* Compact Content Skeleton */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-16 bg-slate-200 rounded-sm" />
            <div className="h-2.5 w-12 bg-slate-200 rounded-sm" />
          </div>
          <div className="h-4 w-3/4 bg-slate-200 rounded-sm" />
          <div className="h-2.5 w-20 bg-slate-200 rounded-sm" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
          <div className="h-5 w-14 bg-slate-200 rounded-sm" />
          <div className="h-7 w-16 bg-slate-200 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
