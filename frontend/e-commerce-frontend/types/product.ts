export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  category: 'hoodie' | 'shirt' | 'pants' | 'bracelet';
  categoryLabel: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge?: string;
  badgeType?: 'sale' | 'low_stock' | 'featured';
  description?: string;
  specs?: { label: string; value: string }[];
  stock?: number;
  images?: string[];
  featured?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
