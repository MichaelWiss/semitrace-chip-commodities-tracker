# SemiTrace Code Audit - Implementation Tasks

## ✅ AUDIT FINDINGS - Issues Resolved

The following issues were discovered during code audit and have been fixed:

### Issue A: WeatherData interface out of scope
**File:** `services/marketService.ts`
**Status:** ✅ FIXED
**Problem:** `WeatherData` interface is defined inside `getPowerHubs` function (line 386) but referenced by `fetchWeatherData` function (line 328) which is outside that scope.
**Fix:** Move `WeatherData` interface to module level (after imports, before functions).

### Issue B: Missing Vite env.d.ts type declaration
**File:** Create `env.d.ts` in project root
**Status:** ✅ FIXED
**Problem:** `import.meta.env.VITE_API_KEY` causes TypeScript error: "Property 'env' does not exist on type 'ImportMeta'"
**Fix:** Create `env.d.ts`.

### Issue C: ErrorBoundary class TypeScript compatibility
**File:** `App.tsx`
**Status:** ✅ FIXED
**Problem:** TypeScript strict mode may not recognize `this.state` and `this.props` on class components with current tsconfig settings.
**Fix Options:**
1. Add `"strict": false` to tsconfig.json (not recommended)
2. Use explicit property declarations in class
3. Convert to functional component with error boundary library

---

## ✅ Completed Phases

### Phase 1: Critical Fixes (6/6)
- [x] Remove duplicate script tag in index.html
- [x] Align React versions 18→19
- [x] Create .env.example with API_KEY placeholder
- [x] Move API_KEY to environment variable
- [x] Add missing TypeScript type packages (@types/react, @types/react-dom, @types/three)
- [x] Update copyright year to 2025

### Phase 2: Type Safety (4/4) ✅ COMPLETE
- [x] Type ErrorBoundary component properly
- [x] Type marketService API responses
- [x] Fix variable shadowing in ToolingTracker
- [x] Add return types to async functions

---

## 📋 Remaining Phases

### Phase 3: Performance (9/9) ✅ COMPLETE

#### Task #11: Wrap CommodityCard with React.memo
- [x] Export memoized component to prevent re-renders when props unchanged

#### Task #12: Memoize list components in EnergyMonitor
- [x] Extract hub selector items as separate memoized component

#### Task #13: Memoize ToolingEntity card component
- [x] Extract tooling cards as separate memoized component

#### Task #14: Use useMemo for forecastData calculation
- [x] Wrap forecastData preparation in useMemo

#### Task #15: Memoize mixData in EnergyMonitor
- [x] Wrap mixData array creation in useMemo

#### Task #16: Lazy load RiskMap component
- [x] Convert RiskMap to lazy component with Suspense

#### Task #17: Lazy load EnergyMonitor component
- [x] Convert EnergyMonitor to lazy component with Suspense

#### Task #18: Lazy load ToolingTracker component
- [x] Convert ToolingTracker to lazy component with Suspense

#### Task #19: Fix SVG gradient ID collisions
- [x] Fix SVG gradient ID collisions

---

### Phase 3: Performance (9/9) ✅ COMPLETE
All performance optimizations implemented:
- React.memo on CommodityCard, HubSelectorItem, ToolingCard
- useMemo for forecastData and mixData calculations  
- Lazy loading with Suspense for RiskMap, EnergyMonitor, ToolingTracker

---

### Phase 4: Build Tooling (1/1) ✅ COMPLETE

#### Task #20: Add Tailwind CSS build to devDeps
- [x] Move Tailwind from CDN to build-time compilation
- [x] Add devDependencies: `tailwindcss`, `postcss`, `autoprefixer`
- [x] Create `tailwind.config.js` and `postcss.config.js`
- [x] Create `src/index.css` and update `index.html`

---

### Phase 5: Error Handling & UX (5/5) ✅ COMPLETE

#### Task #21: Add error handling to EnergyMonitor
- [x] Wrap data fetch in try/catch, add loading state, error UI

#### Task #22: Add error handling to ToolingTracker
- [x] Similar to Task #21 - add try/catch, loading, error handling

#### Task #23: Add error boundaries around main sections
- [x] Wrap RiskMap, EnergyMonitor, ToolingTracker with separate ErrorBoundary instances

#### Task #24: Implement data refresh intervals
- [x] Add setInterval to refresh commodity data every 5 minutes

#### Task #25: Add skeleton loaders for async content
- [x] Create `components/SkeletonLoader.tsx`
- [x] Create loading placeholder components (`CommodityCardSkeleton`, `PowerHubSkeleton`, `ToolingCardSkeleton`)
- [x] Use in loading states for better UX

---

### Phase 6: Accessibility (4/4) ✅ COMPLETE

#### Task #26: Add aria-labels to navigation
- [x] Add accessibility labels to all interactive elements in `components/Navigation.tsx`

#### Task #27: Add aria-hidden to decorative SVGs
- [x] Add `aria-hidden="true"` to decorative SVGs in `CommodityCard.tsx` and `RiskMap.tsx`

#### Task #28: Add focus-visible states
- [x] Add focus-visible CSS classes to interactive elements in `Navigation.tsx`, `CommodityCard.tsx`, `RiskMap.tsx`

#### Task #29: Add keyboard navigation to RiskMap
- [x] Add keyboard event handlers to detail panel (ESC to close)
- [x] Add keyboard navigation for risk list (Arrow keys, Enter/Space)
- Enter to select risk

---

### Phase 7: Code Organization (✅ COMPLETE)

#### Task #30: Split marketService.ts - commodities
**Files:** Create `services/commodityService.ts`
**Move:**
- `COMMODITY_MAP`
- `generateSimulation`
- `generateAvailabilityForecast`
- `fetchRealData`
- `getCommodities`

#### Task #31: Split marketService.ts - energy
**Files:** Create `services/energyService.ts`
**Move:**
- `fetchWeatherData`
- `fetchUKCarbon`
- `getPowerHubs`
- `getEnergyMetrics`
- `createForecast` helper
- `buildHub` helper

#### Task #32: Split marketService.ts - tooling
**Files:** Create `services/toolingService.ts`
**Move:**
- `getToolingEntities`
- `ToolingEntityRaw` interface

#### Task #33: Create constants/config.ts file
**File:** Create `constants/config.ts`
**Extract:**
- Color constants: `#D94E28`, `#1A1918`, `#6B665F`, `#EAE7E0`, etc.
- API endpoints and base URLs
- Thresholds (volatility ranges, risk scores, strain levels)
- Timeout values (3000ms for API calls)
- Grid coordinates for power hubs

#### Task #34: Remove leading blank lines from files
**Files:** Multiple
**Change:** Remove empty first line from:
- App.tsx ← Has blank line ✓
- ~~Hero.tsx~~ ← No blank line (starts with `import`)
- CommodityCard.tsx ← Has blank line ✓
- Navigation.tsx ← Has blank line ✓
- Ticker.tsx ← Has blank line ✓
- EnergyMonitor.tsx ← Has blank line ✓
- ~~RiskMap.tsx~~ ← No blank line (starts with `import`)
- types.ts ← Has blank line ✓
- marketService.ts ← Has blank line ✓
- ToolingTracker.tsx ← Has blank line ✓

#### Task #35: Extract inline styles from RiskMap
**File:** `components/RiskMap.tsx`
**Change:** Convert hardcoded inline styles in htmlElement renderer to helper function
- Create `createMarkerElement(d: any, isHovered: boolean): HTMLElement`
- Move inline HTML string generation to cleaner approach
- Consider using data attributes for styling

---

## 📊 Progress Summary

| Phase | Tasks | Status | Time Est. |
|-------|-------|--------|-----------|
| **Fixes** | 3 | ✅ Complete | 15 min |
| Phase 1 | 6 | ✅ Complete | 14 min |
| Phase 2 | 4 | ✅ Complete | 26 min |
| Phase 3 | 9 | ✅ Complete | 35 min |
| Phase 4 | 1 | ✅ Complete | 10 min |
| Phase 5 | 5 | ✅ Complete | 47 min |
| Phase 6 | 4 | ✅ Complete | 31 min |
| Phase 7 | 6 | ✅ Complete | 44 min |
| **Total** | **38** | **38/38** | **~3.5 hrs** |

---

## 🎯 Next Steps

1. **Start Phase 5: Error Handling & UX**
2. Implement error handling in EnergyMonitor (Task #21)
3. Implement error handling in ToolingTracker (Task #22)
4. Add error boundaries (Task #23)
5. Implement data refresh intervals (Task #24)
6. Add skeleton loaders (Task #25)

📊 Implementation Plan: 35 Granular Tasks
PHASE 1: Critical Fixes (6 items) — Tasks #1-6
#	Task	Priority	Est. Time
1	Remove duplicate script tag	🔴 HIGH	1 min
2	Align React versions 18→19	🔴 HIGH	3 min
3	Create .env.example	🔴 HIGH	2 min
4	Move API_KEY to env var	🔴 HIGH	5 min
5	Add @types packages	🔴 HIGH	2 min
6	Update copyright to 2025	🟢 LOW	1 min
Phase 1 Total: ~14 minutes

PHASE 2: Type Safety (4 items) — Tasks #7-10
#	Task	Priority	Est. Time
7	Type ErrorBoundary properly	🟡 MED	5 min
8	Type marketService responses	🟡 MED	10 min
9	Fix variable shadowing	🟡 MED	3 min
10	Add return types to async funcs	🟡 MED	8 min
Phase 2 Total: ~26 minutes

PHASE 3: Performance (9 items) — Tasks #11-19
#	Task	Priority	Est. Time
11	Memoize CommodityCard	🟡 MED	3 min
12	Memoize EnergyMonitor hub items	🟡 MED	5 min
13	Memoize ToolingEntity cards	🟡 MED	5 min
14	useMemo for forecastData	🟡 MED	3 min
15	useMemo for mixData	🟡 MED	3 min
16	Lazy load RiskMap	🟡 MED	5 min
17	Lazy load EnergyMonitor	🟡 MED	5 min
18	Lazy load ToolingTracker	🟡 MED	5 min
19	Fix SVG gradient ID collisions	🟡 MED	4 min
Phase 3 Total: ~38 minutes

PHASE 4: Build Tooling (1 item) — Task #20
#	Task	Priority	Est. Time
20	Add Tailwind to build chain	🟡 MED	10 min
Phase 4 Total: ~10 minutes

PHASE 5: Error Handling & UX (5 items) — Tasks #21-25
#	Task	Priority	Est. Time
21	Add error handling to EnergyMonitor	🟡 MED	8 min
22	Add error handling to ToolingTracker	🟡 MED	8 min
23	Add error boundaries around sections	🟡 MED	6 min
24	Implement data refresh intervals	🟡 MED	10 min
25	Add skeleton loaders	🟡 MED	15 min
Phase 5 Total: ~47 minutes

PHASE 6: Accessibility (4 items) — Tasks #26-29
#	Task	Priority	Est. Time
26	Add aria-labels to nav	🟡 MED	5 min
27	Add aria-hidden to decorative SVGs	🟡 MED	8 min
28	Add focus-visible states	🟡 MED	8 min
29	Add keyboard nav to RiskMap	🟡 MED	10 min
Phase 6 Total: ~31 minutes

PHASE 7: Code Organization (6 items) — Tasks #30-35
#	Task	Priority	Est. Time
30	Split marketService → commodityService	🟢 LOW	10 min
31	Split marketService → energyService	🟢 LOW	10 min
32	Split marketService → toolingService	🟢 LOW	5 min
33	Create constants/config.ts	🟢 LOW	8 min
34	Remove leading blank lines	🟢 LOW	3 min
35	Extract inline styles from RiskMap	🟢 LOW	8 min
Phase 7 Total: ~44 minutes