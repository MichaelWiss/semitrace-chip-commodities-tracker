# Visual Refactor Implementation Plan

## 1. Diagnostics & Objectives
**Current State:**
- The current design is described as "delicate" and "hard to read".
- Uses thin serif fonts (`Italiana`) and light sans-serif (`Manrope`).
- Low contrast colors (Warm Grey #6B665F on Warm Alabaster #F4F1EA).
- Small font sizes (10px - 11px common).
- Thin borders (1px subtle).

**Target State (based on "Screenshots" proxy):**
- **Bolder Typography**: Stronger weights, larger base sizes.
- **High Contrast**: Darker primary and secondary text colors.
- **Robust Layout**: Thicker borders, more defined structure.
- **Premium Industrial Aesthetic**: Moving from "delicate paper" to "solid industrial report".

## 2. Design System Updates

### A. Typography
- **Headings (Serif)**: Keep `Italiana` but use larger sizes and tighter tracking for impact. Or switch to a sturdier serif if needed (e.g., `Playfair Display` or `Cinzel` if available, but staying with `Italiana` at larger sizes is a good first step).
- **Body/Data (Sans)**: `Manrope`.
    - **Minimum Size**: Increase from 10px to 12px (text-xs).
    - **Weights**: Shift default from 400 (Regular) to 500 (Medium) or 600 (SemiBold) for data.
    - **Labels**: Uppercase labels should be bold and tracked out.

### B. Color Palette (`tailwind.config.cjs`)
- **Background**: Keep `#F4F1EA` (Warm Alabaster) as it provides a good premium base.
- **Text**: Keep `#1A1918` (Sharp Charcoal) for primary.
- **Secondary**: **UPDATE** from `#6B665F` (Warm Grey) to `#4A453F` (Darker Warm Grey) for better legibility.
- **Accent**: Keep `#D94E28` (International Orange).
- **Borders**: **UPDATE** default border color or add a `border-medium` utility. Darken `subtle` to `#C8C5BE`.

## 3. Implementation Steps

### Phase 1: Foundation (Design System)
- [ ] **Update Tailwind Config**:
    - Update `colors.secondary` to `#4A453F`.
    - Add `colors.border` (new) as `#cfccc6` (darker than current subtle).
    - Define new valid font sizes if necessary (e.g., `text-xxs` maybe for very small tags, but generally aim to size UP).

### Phase 2: Structural Updates (Global)
- [ ] **Global CSS**:
    - Set base font size to 16px (if not already).
    - Ensure `antialiased` is on for clearer text rendering.

### Phase 3: Component Refactoring

#### 1. Hero Section (`Hero.tsx`)
- [ ] **Typography**: Increase "RAW MATERIAL" size and weight.
- [ ] **Visibility**: Increase contrast of decorative lines (currently `bg-subtle`).
- [ ] **Content**: Make "Semiconductor Index" and "Data Sources" text larger (text-sm to text-base).

#### 2. Ticker Component (`Ticker.tsx`)
- [ ] **Legibility**: Increase font size of ticker items.
- [ ] **Separation**: Use bolder separators.

#### 3. Commodity Cards (`CommodityCard.tsx`)
- [ ] **Layout**: Increase vertical padding (py-10 instead of py-8).
- [ ] **Borders**: Increase border thickness (`border-b-2` instead of `border-b`).
- [ ] **Data Points**:
    - Prices: `text-xl` -> `text-2xl`.
    - Labels: `text-[10px]` -> `text-xs font-bold`.
    - Colors: Ensure `text-secondary` labels use the new darker shade.

#### 4. Tables / Indices (`App.tsx`)
- [ ] **Index Cards**:
    - Increase border definition.
    - Make "Supply Chain Indices" header larger and bolder.
    - Increase value text sizes.

## 4. Execution Order
1.  **Apply Tailwind Config Updates** (Colors).
2.  **Refactor Hero** (High impact, immediate visual check).
3.  **Refactor CommodityCard** (Core content).
4.  **Refactor App/Layout** (Indices and spacing).
