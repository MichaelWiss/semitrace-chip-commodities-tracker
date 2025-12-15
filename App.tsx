import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { StylePreview } from './components/StylePreview';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { CommodityCard } from './components/CommodityCard';
import { CommodityCardSkeleton } from './components/SkeletonLoader';
import { getCommodities, getSupplyChainIndices, getGeoRisks } from './services/marketService';
import { Commodity, CommodityCategory, SupplyChainIndex, GeoRisk } from './types';

// Lazy loaded components for performance
const RiskMap = lazy(() => import('./components/RiskMap').then(m => ({ default: m.RiskMap })));
const EnergyMonitor = lazy(() => import('./components/EnergyMonitor').then(m => ({ default: m.EnergyMonitor })));
const ToolingTracker = lazy(() => import('./components/ToolingTracker').then(m => ({ default: m.ToolingTracker })));

// Loading fallback component
const SectionLoader: React.FC = () => (
  <div className="h-96 bg-surface animate-pulse flex items-center justify-center">
    <span className="font-mono text-xs text-secondary uppercase tracking-widest">Loading...</span>
  </div>
);

// Simple Error Boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  declare props: ErrorBoundaryProps;

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-background text-text font-serif">
          <div className="text-center">
            <h1 className="text-4xl mb-4">System Anomaly</h1>
            <p className="font-sans text-sm text-secondary uppercase tracking-widest">Please refresh the interface.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [indices, setIndices] = useState<SupplyChainIndex[]>([]);
  const [geoRisks, setGeoRisks] = useState<GeoRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fetchData = useCallback(async () => {
    try {
      const [commoditiesData, indicesData, risksData] = await Promise.all([
        getCommodities(),
        getSupplyChainIndices(),
        getGeoRisks()
      ]);
      setCommodities(commoditiesData);
      setIndices(indicesData);
      setGeoRisks(risksData);
    } catch (e) {
      console.error("Failed to initialize app data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const categories = Object.values(CommodityCategory);
  const filteredCategories = selectedCategory === 'ALL' 
    ? categories 
    : categories.filter(c => c === selectedCategory);

  return (
    <ErrorBoundary>
      <div className="bg-background text-text selection:bg-accent selection:text-white min-h-screen flex flex-col">
        <Navigation />
        
        <main className="relative flex-grow">
          <Hero />
          
          <Ticker commodities={commodities} />

          <div id="materials" className="w-full max-w-[94vw] mx-auto py-32 md:py-48">
            
            {/* Header Section */}
            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-end mb-16 px-0 border-b-[3px] border-text pb-12">
              <div className="col-span-4 md:col-span-8">
                  <span className="font-mono text-sm font-bold text-accent tracking-widest block mb-6">01 — MARKET DATA</span>
                  <h2 className="font-sans font-extrabold text-5xl md:text-7xl leading-[0.9] text-text tracking-tighter">
                    Material <br />
                    <span className="text-secondary">Index</span>
                  </h2>
              </div>
              <div className="col-span-4 md:col-span-4 mt-8 md:mt-0 flex justify-end">
                  <p className="font-mono text-xs font-bold text-secondary text-right tracking-tight">
                      LIVE SPOT PRICES <br/> 
                      UPDATED {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
              </div>
            </div>

            {/* Supply Chain Indices */}
            {!loading && indices.length > 0 && (
              <div className="mb-24 px-0">
                <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 mb-8">
                  <div className="col-span-4 md:col-span-12">
                     <h3 className="font-mono text-sm font-bold tracking-[0.1em] uppercase text-text border-b-2 border-text pb-1 inline-block">SUPPLY CHAIN INDICES</h3>
                  </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-12 gap-4">
                  {indices.map(idx => {
                    const isHigh = idx.value > 70;
                    const isLow = idx.value < 40;
                    return (
                      <div 
                        key={idx.id} 
                        className={`col-span-2 md:col-span-4 lg:col-span-2 relative p-5 border-2 transition-all ${isHigh ? 'bg-accent/5 border-accent' : isLow ? 'bg-green-50 border-green-600' : 'bg-background border-text'}`}
                      >
                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 leading-tight min-h-[28px]">
                          {idx.name}
                        </h4>
                        <div className="flex items-end justify-between">
                          <span className={`font-sans font-extrabold text-3xl tracking-tighter ${isHigh ? 'text-accent' : 'text-text'}`}>
                            {idx.value}
                          </span>
                          <span className={`font-mono text-xs font-bold ${idx.change > 0 ? 'text-text' : 'text-accent'}`}>
                            {idx.change > 0 ? '↑' : '↓'}{Math.abs(idx.change)}
                          </span>
                        </div>
                        <div className="mt-3 h-2 w-full border border-black p-0.5">
                          <div 
                            className={`h-full ${isHigh ? 'bg-accent' : isLow ? 'bg-green-600' : 'bg-text'}`}
                            style={{ width: `${idx.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 mb-24 px-0">
                <div className="col-span-4 md:col-span-12 flex flex-wrap gap-3 justify-start">
                  <button 
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-6 py-3 text-xs font-bold tracking-widest uppercase border-2 transition-all ${selectedCategory === 'ALL' ? 'bg-text text-background border-text' : 'text-secondary border-text hover:bg-text hover:text-white'}`}
                  >
                    ALL
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-3 text-xs font-bold tracking-widest uppercase border-2 transition-all ${selectedCategory === cat ? 'bg-text text-background border-text' : 'text-secondary border-text hover:bg-text hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            {loading ? (
              <div className="space-y-0">
                {[1, 2, 3, 4, 5].map(i => (
                  <CommodityCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-40">
                {filteredCategories.map((cat) => {
                  const items = commodities.filter(c => c.category === cat);
                  if (items.length === 0) return null;

                  return (
                    <div key={cat} className="relative">
                      <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 mb-12 px-0">
                         <div className="col-span-4 md:col-span-12">
                           <h3 className="font-mono text-sm font-bold tracking-[0.1em] uppercase text-text border-b-2 border-text pb-1 inline-block">{cat}</h3>
                         </div>
                      </div>
                      
                      <div className="space-y-0">
                        {items.map((item, idx) => (
                          <CommodityCard key={item.id} data={item} index={idx} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div id="risk" className="bg-surface relative border-t-[3px] border-text">
            <div className="w-full max-w-[94vw] mx-auto">
              <ErrorBoundary>
                <Suspense fallback={<SectionLoader />}>
                  <RiskMap risks={geoRisks} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          <div id="energy">
            <ErrorBoundary>
              <Suspense fallback={<SectionLoader />}>
                <EnergyMonitor />
              </Suspense>
            </ErrorBoundary>
          </div>

          <div id="tooling">
            <ErrorBoundary>
              <Suspense fallback={<SectionLoader />}>
                <ToolingTracker />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>

        <footer className="min-h-[80vh] flex flex-col justify-between p-6 md:p-12 bg-text text-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-white"></div>
                <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-white"></div>
            </div>

            <div className="flex justify-between items-start pt-12">
                <h2 className="font-serif text-[15vw] leading-[0.8]">
                  SEMI<br/>TRACE
                </h2>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pb-12">
                <div className="flex gap-12 font-sans text-xs font-bold tracking-widest">
                  <a href="#" className="hover:text-accent transition-colors">INSTAGRAM</a>
                  <a href="#" className="hover:text-accent transition-colors">TWITTER</a>
                  <a href="#" className="hover:text-accent transition-colors">LINKEDIN</a>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl mb-4 italic">Essential Intelligence.</p>
                  <p className="font-sans text-xs text-white/50">© 2025 SEMITRACE ANALYTICS</p>
                </div>
            </div>
          </footer>
      </div>
    </ErrorBoundary>
  );
}
