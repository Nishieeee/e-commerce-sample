'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, PackageOpen, RotateCcw } from 'lucide-react';
import { productsApi } from '@/lib/api/products';
import {
  ProductCard,
  ProductCardSkeleton,
  FilterSidebar,
  SortDropdown,
} from '@/components/catalog';

export default function CatalogPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Build query string for API
  const queryParams = new URLSearchParams();
  selectedCategories.forEach((cat) => queryParams.append('category', cat));
  if (minPrice > 0) queryParams.set('minPrice', minPrice.toString());
  if (maxPrice < 500) queryParams.set('maxPrice', maxPrice.toString());
  if (inStockOnly) queryParams.set('inStockOnly', 'true');
  if (sort !== 'featured') queryParams.set('sort', sort);
  if (searchQuery) queryParams.set('q', searchQuery);

  const queryString = queryParams.toString();

  // TanStack Query fetching with instant caching and deduplication
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', queryString],
    queryFn: () => productsApi.getAll(queryString),
  });

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(500);
    setInStockOnly(false);
    setSort('featured');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 1. Page Header & Search Bar */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 block mb-1">
              Official Merch Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-heading tracking-tight">
              Collection 04 Drops
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore our complete range of custom-milled heavyweight fleece hoodies, boxy combed cotton tees, utility cargo joggers, and aerospace titanium accessories.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or specs..."
              className="w-full pl-10 pr-10 py-3 text-xs bg-white border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-950 text-indigo-950 placeholder-slate-400 font-medium shadow-sm transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-indigo-950 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: Mobile Filter Toggle & Sort Dropdown */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 bg-white border border-slate-200 hover:border-indigo-950 text-indigo-950 font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
            <span>Filters</span>
            {(selectedCategories.length > 0 || inStockOnly || minPrice > 0 || maxPrice < 500) && (
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Showing <strong className="text-indigo-950 font-bold">{isLoading ? '...' : products.length}</strong> Products
          </span>
        </div>

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden mb-8 animate-in slide-in-from-top duration-200">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onReset={handleResetFilters}
          />
        </div>
      )}

      {/* 3. Main Grid Layout (Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Grid & State Handling */}
        <div className="lg:col-span-3">
          {/* Active Filter Pills */}
          {(selectedCategories.length > 0 || inStockOnly || minPrice > 0 || maxPrice < 500 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1">
                Active Filters:
              </span>
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className="bg-indigo-950 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer hover:bg-rose-500 transition-colors"
                >
                  <span>{cat}</span>
                  <X className="w-3 h-3" />
                </span>
              ))}
              {(minPrice > 0 || maxPrice < 500) && (
                <span className="bg-white text-indigo-950 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
                  ${minPrice} - ${maxPrice}
                </span>
              )}
              {inStockOnly && (
                <span
                  onClick={() => setInStockOnly(false)}
                  className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 transition-colors"
                >
                  <span>In Stock Only</span>
                  <X className="w-3 h-3" />
                </span>
              )}
              {searchQuery && (
                <span
                  onClick={() => setSearchQuery('')}
                  className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer hover:bg-rose-600 transition-colors"
                >
                  <span>&quot;{searchQuery}&quot;</span>
                  <X className="w-3 h-3" />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:underline ml-2 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Loading State Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="bg-white border border-rose-200 rounded-sm p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-indigo-950 font-heading">Failed to Load Merch Catalog</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We encountered a network error connecting to the API gateway. Please check your connection or retry.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                Retry Query
              </button>
            </div>
          )}

          {/* Zero Results Empty State UI */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-sm p-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
                <PackageOpen className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-indigo-950 font-heading">
                  NO MERCHANDISE MATCHED YOUR CRITERIA
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find any items matching your selected taxonomy filters, price threshold (${minPrice}-${maxPrice}), or search term.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-8 py-3.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
