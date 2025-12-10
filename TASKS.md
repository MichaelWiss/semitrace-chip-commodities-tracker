# SemiTrace Code Audit - Implementation Tasks

## ⚠️ AUDIT FINDINGS - Issues Requiring Immediate Attention

The following issues were discovered during code audit and need to be fixed before proceeding:

### Issue A: WeatherData interface out of scope
**File:** `services/marketService.ts`
**Problem:** `WeatherData` interface is defined inside `getPowerHubs` function (line 386) but referenced by `fetchWeatherData` function (line 328) which is outside that scope.
**Fix:** Move `WeatherData` interface to module level (after imports, before functions).
```tsx
// Add after line 5 (after BASE_URL):
interface WeatherData {
  hourly: {
    temperature_2m: number[];
    shortwave_radiation: number[];
    wind_speed_10m: number[];
  };
}
```
Then remove the duplicate interface from inside `getPowerHubs`.

### Issue B: Missing Vite env.d.ts type declaration
**File:** Create `env.d.ts` in project root
**Problem:** `import.meta.env.VITE_API_KEY` causes TypeScript error: "Property 'env' does not exist on type 'ImportMeta'"
**Fix:** Create `env.d.ts`:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_DEMO_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Issue C: ErrorBoundary class TypeScript compatibility
**File:** `App.tsx`
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

### Phase 2: Type Safety (4/4) ⚠️ PARTIAL - SEE ISSUES ABOVE
- [x] Type ErrorBoundary component properly ⚠️ Issue C
- [x] Type marketService API responses ⚠️ Issue A
- [x] Fix variable shadowing in ToolingTracker
- [x] Add return types to async functions ⚠️ Issue B

---

## 📋 Remaining Phases

### Phase 3: Performance (9 tasks)

#### Task #11: Wrap CommodityCard with React.memo
**File:** `components/CommodityCard.tsx`
**Change:** Export memoized component to prevent re-renders when props unchanged
```tsx
// Current export (line 12):
export const CommodityCard: React.FC<Props> = ({ data, index }) => {

// Change to:
const CommodityCardComponent: React.FC<Props> = ({ data, index }) => {
  // component body
};
export const CommodityCard = React.memo(CommodityCardComponent);
```
**Note:** Also need to add `useMemo` import at top of file.

#### Task #12: Memoize list components in EnergyMonitor
**File:** `components/EnergyMonitor.tsx`
**Change:** Extract hub selector items as separate memoized component
- Create `HubSelectorItem` component as separate memoized component
- Wrap with `React.memo` to prevent re-renders
- Move hub selection logic to parent `EnergyMonitor`

#### Task #13: Memoize ToolingEntity card component
**File:** `components/ToolingTracker.tsx`
**Change:** Extract tooling cards as separate memoized component
- Create `ToolingCard` component as separate memoized component
- Wrap with `React.memo`
- Use in the grid map

#### Task #14: Use useMemo for forecastData calculation
**File:** `components/CommodityCard.tsx`
**Change:** Wrap forecastData preparation in useMemo (line 17-20)
```tsx
// Current (line 17):
const forecastData = data.forecast?.map(f => ({
    ...f,
    range: [f.lowerBound, f.upperBound]
})) || [];

// Should be:
const forecastData = useMemo(
  () => data.forecast?.map(f => ({
    ...f,
    range: [f.lowerBound, f.upperBound]
  })) || [],
  [data.forecast]
);
```
**Note:** Add `useMemo` to import statement at line 2.

#### Task #15: Memoize mixData in EnergyMonitor
**File:** `components/EnergyMonitor.tsx`
**Change:** Wrap mixData array creation in useMemo (lines 26-31)
```tsx
// Current (line 26):
const mixData = [
  { name: 'Nuclear', value: selectedHub.energyMix.nuclear, color: '#EAE7E0' },
  { name: 'Gas', value: selectedHub.energyMix.gas, color: '#1A1918' },
  { name: 'Renewable', value: selectedHub.energyMix.renewables, color: '#D94E28' },
  { name: 'Coal', value: selectedHub.energyMix.coal, color: '#6B665F' },
].filter(d => d.value > 0);

// Should be:
const mixData = useMemo(() => [
  { name: 'Nuclear', value: selectedHub.energyMix.nuclear, color: '#EAE7E0' },
  { name: 'Gas', value: selectedHub.energyMix.gas, color: '#1A1918' },
  { name: 'Renewable', value: selectedHub.energyMix.renewables, color: '#D94E28' },
  { name: 'Coal', value: selectedHub.energyMix.coal, color: '#6B665F' },
].filter(d => d.value > 0), [selectedHub.energyMix]);
```
**Note:** Add `useMemo` to import statement at line 1.

#### Task #16: Lazy load RiskMap component
**File:** `App.tsx`
**Change:** Convert RiskMap to lazy component with Suspense
```tsx
const RiskMap = React.lazy(() => import('./components/RiskMap').then(m => ({ default: m.RiskMap })));

// In render:
<Suspense fallback={<div className="h-screen bg-surface animate-pulse" />}>
  <RiskMap />
</Suspense>
```

#### Task #17: Lazy load EnergyMonitor component
**File:** `App.tsx`
**Change:** Convert EnergyMonitor to lazy component with Suspense

#### Task #18: Lazy load ToolingTracker component
**File:** `App.tsx`
**Change:** Convert ToolingTracker to lazy component with Suspense

#### Task #19: Fix SVG gradient ID collisions
**File:** `components/CommodityCard.tsx` and `components/ToolingTracker.tsx`
**Status:** ✅ ALREADY IMPLEMENTED - Verified in codebase
- CommodityCard: Uses `id={`gradient-${data.id}`}` (line 220) ✓
- ToolingTracker: Uses `id={`grad-${company.id}`}` (line 125) ✓

**Action:** Remove from task list - no work needed.

---

### Phase 4: Build Tooling (1 task)

#### Task #20: Add Tailwind CSS build to devDeps
**Files:** `package.json`, `index.html`, create `tailwind.config.js`
**Change:** Move Tailwind from CDN to build-time compilation
1. Add devDependencies: `tailwindcss`, `postcss`, `autoprefixer`
2. Remove Tailwind CDN script from `index.html`
3. Create `tailwind.config.js` with current theme config
4. Create `postcss.config.js`
5. Create `src/index.css` with Tailwind directives
6. Update `index.html` to reference `/src/index.css`

---

### Phase 5: Error Handling & UX (5 tasks)

#### Task #21: Add error handling to EnergyMonitor
**File:** `components/EnergyMonitor.tsx`
**Change:** Wrap data fetch in try/catch, add loading state, error UI
```tsx
const [hubs, setHubs] = useState<PowerHub[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    try {
      const h = await getPowerHubs();
      const m = await getEnergyMetrics();
      setHubs(h);
      setMetrics(m);
    } catch (err) {
      setError('Failed to load energy data');
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

// Render error state if error exists
if (error) return <div className="error">...</div>;
if (loading) return <SkeletonLoader />;
```

#### Task #22: Add error handling to ToolingTracker
**File:** `components/ToolingTracker.tsx`
**Change:** Similar to Task #21 - add try/catch, loading, error handling

#### Task #23: Add error boundaries around main sections
**File:** `App.tsx`
**Change:** Wrap RiskMap, EnergyMonitor, ToolingTracker with separate ErrorBoundary instances
```tsx
<div id="risk" className="bg-surface relative border-t border-text">
  <ErrorBoundary>
    <RiskMap />
  </ErrorBoundary>
</div>
```

#### Task #24: Implement data refresh intervals
**File:** `App.tsx`
**Change:** Add setInterval to refresh commodity data every 5 minutes
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Refresh data
    fetchData();
  }, 5 * 60 * 1000); // 5 minutes
  
  return () => clearInterval(interval);
}, []);
```

#### Task #25: Add skeleton loaders for async content
**File:** Create `components/SkeletonLoader.tsx`
**Change:** Create loading placeholder components
- `CommodityCardSkeleton`
- `PowerHubSkeleton`
- `ToolingCardSkeleton`

Use in loading states for better UX.

---

### Phase 6: Accessibility (4 tasks)

#### Task #26: Add aria-labels to navigation
**File:** `components/Navigation.tsx`
**Change:** Add accessibility labels to all interactive elements
```tsx
<a href="#materials" aria-label="Go to materials index">INDEX</a>
<div className="group cursor-pointer" role="button" aria-label="Toggle menu" tabIndex={0}>
```

#### Task #27: Add aria-hidden to decorative SVGs
**Files:** `components/Hero.tsx`, `components/Navigation.tsx`, `components/CommodityCard.tsx`, `components/ToolingTracker.tsx`, `components/RiskMap.tsx`
**Change:** Add `aria-hidden="true"` to all decorative SVGs
```tsx
<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
  {/* decorative SVG */}
</svg>
```

#### Task #28: Add focus-visible states
**Files:** Multiple components
**Change:** Add focus-visible CSS classes to interactive elements
```tsx
<a className="hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
```

#### Task #29: Add keyboard navigation to RiskMap
**File:** `components/RiskMap.tsx`
**Change:** Add keyboard event handlers to detail panel
- ESC to close detail panel
- Arrow Up/Down to navigate risks
- Enter to select risk

---

### Phase 7: Code Organization (6 tasks)

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
| **Fixes** | 3 | ⚠️ NEW - Must fix first | 15 min |
| Phase 1 | 6 | ✅ Complete | 14 min |
| Phase 2 | 4 | ⚠️ Partial (3 issues found) | 26 min |
| Phase 3 | 8 | ⏳ Next (Task #19 verified done) | 35 min |
| Phase 4 | 1 | ⏳ Pending | 10 min |
| Phase 5 | 5 | ⏳ Pending | 47 min |
| Phase 6 | 4 | ⏳ Pending | 31 min |
| Phase 7 | 6 | ⏳ Pending | 44 min |
| **Total** | **37** | **10/37** | **~3.5 hrs** |

---

## 🎯 Next Steps

1. **FIX ISSUES A, B, C FIRST** - These are blocking issues from the audit
2. Run `npx tsc --noEmit` to verify no TypeScript errors
3. Continue with Phase 3 when ready
4. Test after each phase to ensure no regressions
5. Commit changes after completing each phase
6. Update `.env` file with API key if needed

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