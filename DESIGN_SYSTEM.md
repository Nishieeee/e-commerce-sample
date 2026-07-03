# DESIGN_SYSTEM.md - NexusCommerce MVP Frontend UI/UX Standards

This document establishes the official visual identity, design tokens, color palette, typography hierarchy, and UI component standards for **NexusCommerce MVP**, based on **Option C: Nordic Minimalist Indigo & Coral**.

---

## 1. Brand Identity & Visual Vibe

* **Theme Name**: **Nordic Minimalist Indigo & Coral**
* **Vibe & Aesthetic**: Fresh, editorial, vibrant, high-contrast, and inviting. Engineered specifically for retail, lifestyle, apparel, and premium consumer goods.
* **Core Philosophy**:
  * **Content-First Retail**: Clean white/cream backgrounds (`#FDF8F6`) allow colorful product photography and promotional banners to stand out without visual clutter.
  * **High-Conversion Urgency**: Bold coral/rose accents (`#F43F5E`) immediately attract the eye to primary conversion triggers (Add to Cart, Checkout, 20% OFF badges).
  * **Tactile Micro-Interactions**: Hover zoom, smooth drawer animations, and spring-based button feedback (150–300ms duration).

---

## 2. Color Palette & Design Tokens

### 2.1 Core Semantic Tokens

| Token Role | Hex Code | Tailwind Class | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Primary (Brand / Typography)** | `#1E1B4B` | `indigo-950` | Primary headings (`h1`, `h2`), navigation bar background, dark interactive surfaces |
| **On Primary (Text)** | `#FFFFFF` | `white` | Text inside primary dark headers and badges |
| **Accent / Primary CTA** | `#F43F5E` | `rose-500` | "Add to Cart", "Proceed to Checkout", promotional price tags, sale badges |
| **Accent Hover** | `#E11D48` | `rose-600` | Hover state for primary CTA buttons |
| **Secondary Interactive** | `#4F46E5` | `indigo-600` | Active category links, filter pills, secondary buttons, interactive highlights |
| **Background (Light Mode)** | `#FDF8F6` | `orange-50/30` | Warm, soft off-white canvas that eliminates eye strain and enriches product imagery |
| **Surface / Card Background**| `#FFFFFF` | `white` | Product cards, checkout form boxes, cart drawer containers |
| **Border / Divider** | `#E2E8F0` | `slate-200` | Crisp 1px separators between cart items, table rows, and card borders |
| **Muted Text** | `#64748B` | `slate-500` | Secondary descriptions, product SKU numbers, inactive tabs |
| **Destructive / Error** | `#DC2626` | `red-600` | Remove cart item buttons, form validation error text, out of stock notices |

### 2.2 CSS Custom Properties (`:root`)

```css
:root {
  --color-primary: #1E1B4B;
  --color-accent: #F43F5E;
  --color-accent-hover: #E11D48;
  --color-secondary: #4F46E5;
  --color-bg: #FDF8F6;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-text-main: #1E1B4B;
  --color-text-muted: #64748B;
  --color-destructive: #DC2626;
}
```

---

## 3. Typography Hierarchy & Font Pairing

We utilize Google Fonts for seamless cross-platform rendering:

* **Display / Headings (`var(--font-heading)`)**: **`Outfit`**
  * Weights: `500` (Medium), `600` (SemiBold), `700` (Bold)
  * Character: Contemporary, friendly geometric sans-serif that exudes retail polish.
* **UI & Body Text (`var(--font-body)`)**: **`Inter`**
  * Weights: `400` (Regular), `500` (Medium), `600` (SemiBold)
  * Character: Maximum legibility at small sizes (12px–16px). Built-in tabular figures (`font-tabular-nums`) prevent price strings from shifting horizontally.

### Type Scale Standards
* **Page Title (`h1`)**: `text-3xl lg:text-4xl font-bold tracking-tight text-indigo-950`
* **Section Header (`h2`)**: `text-2xl font-semibold tracking-tight text-indigo-950`
* **Card Title (`h3`)**: `text-base font-semibold text-indigo-950 line-clamp-1`
* **Product Price (Large)**: `text-2xl font-bold text-rose-500 font-mono`
* **Body Regular**: `text-sm leading-relaxed text-slate-600`
* **Caption / SKU**: `text-xs font-medium text-slate-400 uppercase tracking-wider`

---

## 4. UI Component Specifications

### 4.1 Buttons & CTAs
* **Primary Conversion CTA**:
  ```html
  <button class="w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-rose-500/20 transition-all duration-200 flex items-center justify-center gap-2">
    <span>Add to Cart</span>
  </button>
  ```
* **Secondary Action Button**:
  ```html
  <button class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2.5 px-5 rounded-xl transition-colors duration-200">
    Filter Catalog
  </button>
  ```

### 4.2 Product Cards (`ProductCard`)
* **Image Wrapper**: `relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-slate-100`
* **Image Behavior**: `h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500`
* **Card Container**: `group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300`

### 4.3 Badges & Pills
* **Sale / Discount Badge**: `absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`
* **Category Tag**: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700`

---

## 5. Touch & Accessibility Rules (WCAG 2.1 AA)

1. **Minimum Touch Targets**: Every clickable element (buttons, icons, checkboxes, pagination links) must enforce at least `min-h-[44px] min-w-[44px]` on mobile screen widths.
2. **Contrast Enforcement**: Text elements must meet or exceed a **4.5:1** contrast ratio against their background surface.
3. **Focus Ring Outline**: Never remove focus rings. Interactive inputs and buttons must display:
   `focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2`
4. **Zero Layout Shift**: Always specify explicit container dimensions or aspect ratios (`aspect-[4/5]`) for image grids to maintain a Cumulative Layout Shift (CLS) score below `0.1`.
