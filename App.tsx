
import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { CommodityCard } from './components/CommodityCard';
import { RiskMap } from './components/RiskMap';
import { EnergyMonitor } from './components/EnergyMonitor';
import { ToolingTracker } from './components/ToolingTracker';
import { getCommodities } from './services/marketService';
import { Commodity, CommodityCategory } from './types';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCommodities();
        setCommodities(data);
      } catch (e) {
        console.error("Failed to initialize app data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = Object.values(CommodityCategory);

  return (
    <ErrorBoundary>
      <div className="bg-background text-text selection:bg-accent selection:text-white min-h-screen flex flex-col">
        <Navigation />
        
        <main className="relative flex-grow">
          <Hero />
          
          <Ticker />

          <div id="materials" className="max-w-[90vw] mx-auto py-32 md:py-48">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 px-6 md:px-0 border-b border-text pb-12">
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

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                  <span className="font-mono text-xs animate-pulse tracking-widest text-secondary">RETRIEVING DATA STREAMS...</span>
              </div>
            ) : (
              <div className="space-y-40">
                {categories.map((cat) => {
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
              <RiskMap />
            </div>
          </div>

          <div id="energy">
            <EnergyMonitor />
          </div>

          <div id="tooling">
            <ToolingTracker />
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
