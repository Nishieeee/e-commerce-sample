# DESIGN_SYSTEM.md - NexusCommerce MVP Frontend UI/UX Standards

This document establishes the official visual identity, design tokens, color palette, typography hierarchy, and UI component standards for **NexusCommerce MVP (Official Merch Studio)**, based on **Option C: Nordic Minimalist Editorial (Indigo & Coral)**.

---

## 1. Brand Identity & Visual Vibe

* **Theme Name**: **Nordic Minimalist Editorial (Indigo & Coral)**
* **Brand Vibe & Aesthetic**: Clean, modern, editorial, high-contrast, and sophisticated. Engineered specifically for a premium creator merchandise and lifestyle brand (heavyweight hoodies, boxy tees, utility cargo joggers, and aerospace titanium accessories).
* **Core Philosophy**:
  * **Zero Marketplace Clutter & Zero AI Slop**: Absolutely **no emojis** (`🔥`, `⚡`, `✨`, etc.), no gimmicky 3D tilting cards, no rainbow/neon text gradients, and no heavy glassmorphic blurs. Every element serves a functional UI/UX purpose.
  * **Editorial Photography Focus**: Crisp white/cream backgrounds (`#FDF8F6` and `#FFFFFF`) allow high-end streetwear and lifestyle photography to speak for itself without dark gradient overlays obscuring the details.
  * **High-Contrast Typography & Structure**: Clean uppercase tracking (`tracking-widest uppercase`), structured tabular specification grids, 1px slate borders (`border-slate-200`), and mono-spaced pricing.
  * **High-Conversion Urgency**: Deep indigo (`#1E1B4B`) surfaces paired with vibrant coral rose (`#F43F5E`) badges and primary CTAs immediately guide user focus to high-converting actions.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Semantic Tokens

| Token Role | Hex Code | Tailwind Class | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Primary (Brand / Typography)** | `#1E1B4B` | `indigo-950` | Primary headings (`h1`, `h2`), navigation bar accents, dark editorial banners, primary buttons |
| **On Primary (Text)** | `#FFFFFF` | `white` | Text inside primary dark headers, badges, and dark hero banners |
| **Accent / Primary CTA** | `#F43F5E` | `rose-500` | "Add to Bag", sale badges, active category indicators, VIP signup buttons |
| **Accent Hover** | `#E11D48` | `rose-600` | Hover state for primary CTA buttons |
| **Secondary Interactive** | `#4F46E5` | `indigo-600` | Secondary interactive text highlights and active state underlines |
| **Background (Canvas)** | `#FDF8F6` | `orange-50/30` or `slate-50` | Warm, soft off-white canvas that eliminates eye strain and separates content sections |
| **Surface / Card Background**| `#FFFFFF` | `white` | Product cards, specification containers, checkout form boxes, cart drawers |
| **Border / Divider** | `#E2E8F0` | `slate-200` | Crisp 1px structural separators between grid items, table rows, and card borders |
| **Muted Text** | `#64748B` | `slate-500` | Secondary descriptions, product SKU numbers, inactive navigation tabs |
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
* **UI & Body Text (`var(--font-body)`)**: **`Inter`**

### Type Scale & Editorial Standards
* **Page Title (`h1`)**: `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-indigo-950 font-heading leading-[1.08]`
* **Section Header (`h2`)**: `text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950 font-heading`
* **Card Title (`h3`)**: `text-base font-bold text-indigo-950 line-clamp-1 font-heading`
* **Editorial Tag / Category Label**: `text-[11px] font-bold tracking-widest uppercase text-rose-500` or `text-slate-400`
* **Product Price (Large)**: `text-3xl sm:text-4xl font-extrabold text-indigo-950 font-mono tracking-tight`
* **Product Price (Card)**: `text-lg font-bold text-indigo-950 font-mono tracking-tight`
* **Body Regular**: `text-sm sm:text-base leading-relaxed text-slate-600 font-normal`
* **SKU / Caption**: `text-[10px] font-mono uppercase tracking-wider text-slate-400`

---

## 4. UI Component Specifications

### 4.1 Buttons & CTAs
* **Primary Conversion CTA**:
  ```html
  <button class="bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer active:scale-98">
    <span>Add to Bag</span>
  </button>
  ```
* **Secondary Action Button**:
  ```html
  <button class="bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-sm border border-slate-200 transition-colors duration-200">
    All Merch (8)
  </button>
  ```

### 4.2 Product Cards (`ProductCard`)
* **Image Wrapper**: `relative aspect-[4/5] w-full overflow-hidden bg-slate-100`
* **Image Behavior**: `w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500`
* **Card Container**: `group flex flex-col justify-between bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-indigo-950`
* **Card Typography Padding**: `p-5 flex flex-col flex-1 justify-between gap-4`

### 4.3 Editorial Showcase (`Hero3DShowcase`)
* **Layout**: 12-column split-screen grid (`lg:col-span-6` left typography + specs, `lg:col-span-6` right high-res photograph).
* **Navigation Tabs**: Numbered editorial tabs (`01 / HOODIES & OUTERWEAR`, `02 / TITANIUM BRACELETS`, `03 / CARGO JOGGERS`) with simple bottom underlines (`border-b-2 border-indigo-950`).
* **Specification Grid**: Clean 2x2 table with top/bottom 1px borders (`border-y border-slate-200 py-6`).

### 4.4 Badges & Pills
* **Sale Badge**: `bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm`
* **Low Stock Badge**: `bg-indigo-950 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm`
* **Neutral Badge**: `bg-white text-indigo-950 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm`

---

## 5. Touch & Accessibility Rules (WCAG 2.1 AA)

1. **Minimum Touch Targets**: Every clickable element (buttons, icons, checkboxes, pagination links) must enforce at least `min-h-[44px] min-w-[44px]` on mobile screen widths.
2. **Contrast Enforcement**: Text elements must meet or exceed a **4.5:1** contrast ratio against their background surface.
3. **Focus Ring Outline**: Never remove focus rings. Interactive inputs and buttons must display:
   `focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2`
4. **Zero Layout Shift**: Always specify explicit container dimensions or aspect ratios (`aspect-[4/5]`, `aspect-[16/9]`) for image grids to maintain a Cumulative Layout Shift (CLS) score below `0.1`.
