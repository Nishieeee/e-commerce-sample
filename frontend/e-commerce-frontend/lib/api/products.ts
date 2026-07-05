import { apiClient } from './client';
import type { Product, Category } from '@/types/product';

export const SAMPLE_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Core 400 GSM Heavyweight Hoodie',
    slug: 'core-heavyweight-hoodie',
    sku: 'MRCH-HD-001',
    category: 'hoodie',
    categoryLabel: 'Hoodies & Outerwear',
    price: 89.00,
    compareAtPrice: 115.00,
    rating: 4.9,
    reviews: 1840,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'COLLECTION 04',
    badgeType: 'featured',
    stock: 24,
    featured: true,
    createdAt: '2026-06-15',
    description: 'Engineered for extreme thermal regulation and lifelong structural integrity. Crafted from custom-milled 400 GSM heavyweight organic combed cotton fleece with double-needle flatlock stitching throughout.',
    specs: [
      { label: 'Fabric Density', value: '400 GSM Combed Cotton Fleece' },
      { label: 'Hardware', value: 'Grade 5 Aerospace Titanium Aglets' },
      { label: 'Fit', value: 'Boxy Oversized Drop-Shoulder' },
      { label: 'Origin', value: 'Engineered & Crafted in Lisbon' }
    ]
  },
  {
    id: 'm2',
    name: 'Boxy Fit Heavy-Cotton Graphic Tee',
    slug: 'boxy-heavy-graphic-tee',
    sku: 'MRCH-TE-002',
    category: 'shirt',
    categoryLabel: 'Tees & Tops',
    price: 45.00,
    compareAtPrice: 60.00,
    rating: 4.9,
    reviews: 940,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: '15% OFF',
    badgeType: 'sale',
    stock: 3, // Low stock alert test
    featured: true,
    createdAt: '2026-06-20',
    description: 'Our signature boxy silhouette constructed from 280 GSM ring-spun carded cotton. Features high-density puff archival print on the reverse and a reinforced ribbed collar designed never to lose structure.',
    specs: [
      { label: 'Fabric Density', value: '280 GSM Ring-Spun Cotton' },
      { label: 'Print Tech', value: 'High-Density Archival Puff Screen' },
      { label: 'Fit', value: 'Boxy Relaxed Cut with Wider Collar' },
      { label: 'Pre-Shrunk', value: 'Garment Washed for Zero Shrinkage' }
    ]
  },
  {
    id: 'm3',
    name: 'Matte Onyx & Titanium Cuff Bracelet',
    slug: 'onyx-titanium-bracelet',
    sku: 'MRCH-BR-003',
    category: 'bracelet',
    categoryLabel: 'Bracelets & Gear',
    price: 65.00,
    compareAtPrice: 85.00,
    rating: 4.8,
    reviews: 920,
    imageUrl: 'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'LOW STOCK',
    badgeType: 'low_stock',
    stock: 2, // Low stock alert test
    featured: true,
    createdAt: '2026-06-10',
    description: 'Precision machined from aerospace-grade titanium alloy paired with matte black onyx beads. Designed with a custom magnetic interlock clasp for effortless one-handed securing.',
    specs: [
      { label: 'Material', value: 'Grade 5 Aerospace Titanium & Onyx' },
      { label: 'Finish', value: 'Bead-Blasted Satin & PVD Black' },
      { label: 'Clasp', value: 'Magnetic Interlock Titanium Buckle' },
      { label: 'Dimensions', value: '8mm Width, 19cm Interior Circumference' }
    ]
  },
  {
    id: 'm4',
    name: 'Relaxed Fit Utility Cargo Joggers',
    slug: 'utility-cargo-joggers',
    sku: 'MRCH-PT-004',
    category: 'pants',
    categoryLabel: 'Bottoms & Joggers',
    price: 95.00,
    compareAtPrice: 120.00,
    rating: 4.9,
    reviews: 640,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'NEW ARRIVAL',
    badgeType: 'featured',
    stock: 18,
    featured: true,
    createdAt: '2026-06-28',
    description: 'Built for urban endurance. Constructed from heavyweight 350 GSM French terry with reinforced nylon ripstop cargo overlays. Features articulated knees and concealed YKK Excella zippers.',
    specs: [
      { label: 'Fabric Density', value: '350 GSM French Terry + Ripstop' },
      { label: 'Hardware', value: 'YKK Excella Matte Black Zippers' },
      { label: 'Fit', value: 'Tapered Articulated Leg with Gusset' },
      { label: 'Pockets', value: '6-Pocket Utility Layout with D-Ring' }
    ]
  },
  {
    id: 'm5',
    name: 'Oversized Acid-Wash Zip Hoodie',
    slug: 'acid-wash-zip-hoodie',
    sku: 'MRCH-HD-005',
    category: 'hoodie',
    categoryLabel: 'Hoodies & Outerwear',
    price: 98.00,
    rating: 4.8,
    reviews: 510,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'HEAVYWEIGHT',
    badgeType: 'featured',
    stock: 12,
    featured: false,
    createdAt: '2026-05-20',
    description: 'Vintage wash aesthetic achieved through a specialized 5-stage enzymatic pigment dye process. Features a custom 2-way titanium zipper and double-layer structured hood.',
    specs: [
      { label: 'Fabric Density', value: '420 GSM Enzymatic Washed Fleece' },
      { label: 'Hardware', value: '2-Way Custom Titanium Zipper' },
      { label: 'Fit', value: 'Oversized Boxy Silhouette' },
      { label: 'Hood', value: 'Double-Layer Self-Fabric Structured Hood' }
    ]
  },
  {
    id: 'm6',
    name: 'Minimalist Monogram Pocket Top',
    slug: 'monogram-pocket-top',
    sku: 'MRCH-TE-006',
    category: 'shirt',
    categoryLabel: 'Tees & Tops',
    price: 38.00,
    compareAtPrice: 48.00,
    rating: 4.7,
    reviews: 420,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'RESTOCKED',
    badgeType: 'sale',
    stock: 45,
    featured: false,
    createdAt: '2026-05-15',
    description: 'Clean Nordic minimalism. Premium 240 GSM organic cotton single jersey featuring an understated high-density silicone monogram emblem on the left chest pocket.',
    specs: [
      { label: 'Fabric Density', value: '240 GSM Organic Cotton Jersey' },
      { label: 'Detail', value: 'Silicone Monogram Chest Emblem' },
      { label: 'Fit', value: 'Tailored Relaxed Fit' },
      { label: 'Stitching', value: 'Twin-Needle Hem & Cuff Finishing' }
    ]
  },
  {
    id: 'm7',
    name: 'Engraved Silver Chain Cuff Bracelet',
    slug: 'engraved-silver-bracelet',
    sku: 'MRCH-BR-007',
    category: 'bracelet',
    categoryLabel: 'Bracelets & Gear',
    price: 75.00,
    compareAtPrice: 95.00,
    rating: 4.9,
    reviews: 380,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: '20% OFF',
    badgeType: 'sale',
    stock: 4, // Low stock alert test
    featured: false,
    createdAt: '2026-06-05',
    description: 'Solid 925 Sterling Silver plating over aerospace titanium core. Laser-engraved with geometric Nordic runes and finished with an anti-tarnish protective sealing.',
    specs: [
      { label: 'Material', value: '925 Silver Plating / Titanium Core' },
      { label: 'Engraving', value: 'Precision Laser Geometric Runes' },
      { label: 'Coating', value: 'Nanotech Anti-Tarnish Sealing' },
      { label: 'Sizing', value: 'Adjustable Open Cuff Architecture' }
    ]
  },
  {
    id: 'm8',
    name: 'Tapered French Terry Track Pants',
    slug: 'french-terry-track-pants',
    sku: 'MRCH-PT-008',
    category: 'pants',
    categoryLabel: 'Bottoms & Joggers',
    price: 78.00,
    rating: 4.8,
    reviews: 530,
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'BEST SELLER',
    badgeType: 'featured',
    stock: 32,
    featured: false,
    createdAt: '2026-06-01',
    description: 'The ultimate lounge-to-street silhouette. 380 GSM loopback French terry with an elasticized waistband, heavy cotton drawstrings, and custom titanium aglet tips.',
    specs: [
      { label: 'Fabric Density', value: '380 GSM Loopback French Terry' },
      { label: 'Hardware', value: 'Engraved Titanium Aglet Tips' },
      { label: 'Fit', value: 'Slim Tapered Athletic Cut' },
      { label: 'Waistband', value: 'Reinforced 3-Channel Elastic Band' }
    ]
  },
  {
    id: 'm9',
    name: 'Tactical Titanium Carabiner Keyclip',
    slug: 'tactical-titanium-carabiner',
    sku: 'MRCH-BR-009',
    category: 'bracelet',
    categoryLabel: 'Bracelets & Gear',
    price: 48.00,
    rating: 4.9,
    reviews: 310,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'DROP #04',
    badgeType: 'featured',
    stock: 15,
    featured: true,
    createdAt: '2026-06-25',
    description: 'EDC perfection. CNC machined from a solid block of Grade 5 titanium. Features an integrated bottle opener, hex wrench slot, and spring-loaded wire gate.',
    specs: [
      { label: 'Material', value: 'CNC Machined Grade 5 Titanium' },
      { label: 'Weight', value: '28 Grams Ultra-Lightweight' },
      { label: 'Functions', value: 'Carabiner, Bottle Opener, 1/4 Hex' },
      { label: 'Finish', value: 'Stonewashed Matte Grey' }
    ]
  },
  {
    id: 'm10',
    name: 'Minimalist Heavyweight Crewneck Pullover',
    slug: 'minimalist-heavyweight-crewneck',
    sku: 'MRCH-HD-010',
    category: 'hoodie',
    categoryLabel: 'Hoodies & Outerwear',
    price: 82.00,
    compareAtPrice: 98.00,
    rating: 4.8,
    reviews: 620,
    imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 19,
    featured: false,
    createdAt: '2026-05-10',
    description: 'Clean Scandinavian aesthetic without a hood. 400 GSM custom cotton fleece with rib-knit side gussets for enhanced mobility and shape retention.',
    specs: [
      { label: 'Fabric Density', value: '400 GSM Combed Cotton Fleece' },
      { label: 'Construction', value: 'Rib-Knit Side Mobility Gussets' },
      { label: 'Fit', value: 'Relaxed Boxy Drop-Shoulder' },
      { label: 'Collar', value: 'High-Density 2x2 Ribbed Neckband' }
    ]
  },
  {
    id: 'm11',
    name: 'Washed Black Oversized Longsleeve Tee',
    slug: 'washed-black-longsleeve-tee',
    sku: 'MRCH-TE-011',
    category: 'shirt',
    categoryLabel: 'Tees & Tops',
    price: 52.00,
    rating: 4.7,
    reviews: 290,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 0, // Out of stock test
    featured: false,
    createdAt: '2026-05-01',
    description: 'The definitive layering piece. 260 GSM heavyweight cotton jersey in an aged charcoal enzyme wash. Ribbed cuffs designed to hold position on the forearm.',
    specs: [
      { label: 'Fabric Density', value: '260 GSM Heavy Cotton Jersey' },
      { label: 'Dye Process', value: 'Charcoal Enzyme Pigment Wash' },
      { label: 'Fit', value: 'Oversized Skater Silhouette' },
      { label: 'Cuffs', value: 'Reinforced Spandex-Ribbed Cuffs' }
    ]
  },
  {
    id: 'm12',
    name: 'Articulated Technical Nylon Parachute Pants',
    slug: 'technical-nylon-parachute-pants',
    sku: 'MRCH-PT-012',
    category: 'pants',
    categoryLabel: 'Bottoms & Joggers',
    price: 105.00,
    compareAtPrice: 135.00,
    rating: 4.9,
    reviews: 480,
    imageUrl: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'DROP #04',
    badgeType: 'featured',
    stock: 8,
    featured: true,
    createdAt: '2026-06-29',
    description: 'Ultra-lightweight windproof and water-resistant crinkle nylon. Features adjustable bungee cord hems to transition between wide-leg and tapered parachute silhouettes.',
    specs: [
      { label: 'Material', value: '100% Water-Resistant Crinkle Nylon' },
      { label: 'Adjustment', value: 'Bungee Cord & Toggle Hem System' },
      { label: 'Fit', value: 'Wide-Leg / Convertible Tapered' },
      { label: 'Hardware', value: 'Matte Black Titanium Toggles' }
    ]
  }
];

export const SAMPLE_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Hoodies & Outerwear', slug: 'hoodie', description: '400 GSM heavyweight combed cotton fleece and structured hoodies.' },
  { id: 'cat-2', name: 'Tees & Tops', slug: 'shirt', description: 'Boxy oversized silhouettes crafted from 280 GSM ring-spun cotton.' },
  { id: 'cat-3', name: 'Bottoms & Joggers', slug: 'pants', description: 'Utility cargo joggers and heavy French terry sweatpants.' },
  { id: 'cat-4', name: 'Bracelets & Gear', slug: 'bracelet', description: 'Grade 5 aerospace titanium accessories and matte onyx bracelets.' }
];

export const productsApi = {
  getAll: async (params: string = ''): Promise<Product[]> => {
    try {
      return await apiClient<Product[]>(`/products?${params}`);
    } catch (error) {
      // Fallback to client-side filtering/sorting of sample data for instant local development
      let results = [...SAMPLE_CATALOG_PRODUCTS];
      
      if (params) {
        const searchParams = new URLSearchParams(params);
        
        // Filter by categories (can be multiple: category=hoodie&category=shirt or comma separated)
        const categories = searchParams.getAll('category').flatMap(c => c.split(',')).filter(Boolean);
        if (categories.length > 0 && !categories.includes('all')) {
          results = results.filter(p => categories.includes(p.category));
        }
        
        // Filter by min/max price
        const minPrice = searchParams.get('minPrice');
        if (minPrice !== null && !isNaN(Number(minPrice))) {
          results = results.filter(p => p.price >= Number(minPrice));
        }
        
        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice !== null && !isNaN(Number(maxPrice))) {
          results = results.filter(p => p.price <= Number(maxPrice));
        }
        
        // Filter by in stock only
        const inStockOnly = searchParams.get('inStockOnly') === 'true';
        if (inStockOnly) {
          results = results.filter(p => p.stock !== undefined && p.stock > 0);
        }
        
        // Filter by search query
        const query = searchParams.get('q') || searchParams.get('search');
        if (query) {
          const qLower = query.toLowerCase();
          results = results.filter(p => 
            p.name.toLowerCase().includes(qLower) || 
            p.description?.toLowerCase().includes(qLower) ||
            p.categoryLabel.toLowerCase().includes(qLower) ||
            p.sku.toLowerCase().includes(qLower)
          );
        }
        
        // Sort options
        const sortBy = searchParams.get('sort') || 'featured';
        switch (sortBy) {
          case 'price-low-high':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price-high-low':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            results.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });
            break;
          case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'featured':
          default:
            results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
        }
      }
      
      // Simulate slight network latency for realistic skeleton loading
      await new Promise(resolve => setTimeout(resolve, 300));
      return results;
    }
  },
  
  getBySlug: async (slug: string): Promise<Product> => {
    try {
      return await apiClient<Product>(`/products/${slug}`);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const found = SAMPLE_CATALOG_PRODUCTS.find(p => p.slug === slug);
      if (!found) {
        throw new Error(`Product not found: ${slug}`);
      }
      return found;
    }
  },
  
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiClient<Category[]>('/categories');
    } catch (error) {
      return SAMPLE_CATEGORIES;
    }
  },
};

