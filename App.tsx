import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { CommodityCard } from './components/CommodityCard';
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

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

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
          
          <Ticker />

          <div id="materials" className="max-w-[90vw] mx-auto py-32 md:py-48">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-6 md:px-0 border-b border-text pb-12">
              <div className="max-w-2xl">
                  <span className="font-mono text-xs text-accent tracking-widest block mb-6">01 — MARKET DATA</span>
                  <h2 className="font-serif text-5xl md:text-7xl leading-none text-text">
                    Material <br />
                    <span className="italic text-secondary">Index</span>
                  </h2>
              </div>
              <div className="mt-8 md:mt-0">
                  <p className="font-sans text-sm text-secondary text-right">
                      LIVE SPOT PRICES <br/> 
                      UPDATED {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
              </div>
            </div>

            {/* Supply Chain Indices */}
            {!loading && indices.length > 0 && (
              <div className="mb-24 px-6 md:px-0">
                <div className="flex items-center gap-4 mb-8">
                  <span className="h-[1px] w-12 bg-accent"></span>
                  <h3 className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-text">SUPPLY CHAIN INDICES</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {indices.map(idx => {
                    const isHigh = idx.value > 70;
                    const isLow = idx.value < 40;
                    return (
                      <div 
                        key={idx.id} 
                        className={`relative p-5 border transition-all hover:shadow-lg ${isHigh ? 'bg-[#D94E28]/5 border-[#D94E28]/30' : isLow ? 'bg-green-50 border-green-200' : 'bg-surface border-subtle'}`}
                      >
                        <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 leading-tight min-h-[28px]">
                          {idx.name}
                        </h4>
                        <div className="flex items-end justify-between">
                          <span className={`font-mono text-3xl ${isHigh ? 'text-[#D94E28]' : 'text-text'}`}>
                            {idx.value}
                          </span>
                          <span className={`font-mono text-sm ${idx.change > 0 ? 'text-[#D94E28]' : 'text-green-600'}`}>
                            {idx.change > 0 ? '↑' : '↓'}{Math.abs(idx.change)}
                          </span>
                        </div>
                        <div className="mt-3 h-1 w-full bg-subtle rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isHigh ? 'bg-[#D94E28]' : isLow ? 'bg-green-500' : 'bg-text'}`}
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
            <div className="flex flex-wrap gap-3 mb-24 px-6 md:px-0 justify-start">
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${selectedCategory === 'ALL' ? 'bg-text text-background border-text' : 'text-secondary border-subtle hover:border-text'}`}
              >
                ALL
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${selectedCategory === cat ? 'bg-text text-background border-text' : 'text-secondary border-subtle hover:border-text'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                  <span className="font-mono text-xs animate-pulse tracking-widest text-secondary">RETRIEVING DATA STREAMS...</span>
              </div>
            ) : (
              <div className="space-y-40">
                {filteredCategories.map((cat) => {
                  const items = commodities.filter(c => c.category === cat);
                  if (items.length === 0) return null;

                  return (
                    <div key={cat} className="relative">
                      <div className="flex items-center gap-4 mb-12 px-4 md:px-0">
                        <span className="h-[1px] w-12 bg-accent"></span>
                        <h3 className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-text">{cat}</h3>
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

          <div id="risk" className="bg-surface relative border-t border-text">
            <div className="max-w-[90vw] mx-auto">
              <Suspense fallback={<SectionLoader />}>
                <RiskMap />
              </Suspense>
            </div>
          </div>

          <div id="energy">
            <Suspense fallback={<SectionLoader />}>
              <EnergyMonitor />
            </Suspense>
          </div>

          <div id="tooling">
            <Suspense fallback={<SectionLoader />}>
              <ToolingTracker />
            </Suspense>
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
