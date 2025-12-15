import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { GeoRisk } from '../types';

// Safe dynamic import pattern to prevent SSR/Module crashes
let GlobeT: any = null;

// Fallback UI if WebGL fails
const FallbackMap = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface/30 border border-subtle p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 border border-subtle rounded-full flex items-center justify-center mb-4">
            <span className="font-serif text-2xl italic">!</span>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">Visualization Offline</span>
        <span className="font-serif text-sm text-secondary italic">WebGL Module Unavailable.</span>
    </div>
);

// The Globe Component logic
const GlobeVisualization = ({ hoveredId, risks }: { hoveredId: string | null, risks: GeoRisk[] }) => {
    const globeEl = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [GlobeComponent, setGlobeComponent] = useState<any>(null);
    const [hasError, setHasError] = useState(false);
    const [countries, setCountries] = useState({ features: [] });
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

    useEffect(() => {
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setDimensions({ width: offsetWidth, height: offsetHeight });
            
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setDimensions({ 
                        width: entry.contentRect.width, 
                        height: entry.contentRect.height 
                    });
                }
            });
            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);
    }, []);

    useEffect(() => {
        let mounted = true;
        // Dynamically load the module to prevent SSR/Import crashes
        import('react-globe.gl')
            .then((mod) => {
                if(mounted) {
                    GlobeT = mod.default || mod;
                    setGlobeComponent(() => GlobeT);
                }
            })
            .catch(err => {
                console.warn("Globe load failed", err);
                if(mounted) setHasError(true);
            });
        
        return () => { mounted = false; };
    }, []);

    // Auto-rotate logic
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.controls().enableZoom = false;
        }
    }, [GlobeComponent]);

    // Focus logic
    useEffect(() => {
        if (hoveredId && globeEl.current) {
            const risk = risks.find(r => r.id === hoveredId);
            if (risk) {
                globeEl.current.pointOfView({ lat: risk.lat, lng: risk.lng, altitude: 2.0 }, 1000);
            }
        } else if (globeEl.current) {
             // Reset view slightly if nothing hovered
             globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
        }
    }, [hoveredId, risks]);

    // HTML Marker Renderer
    const htmlElementsData = useMemo(() => {
        return risks.map(risk => ({
            lat: risk.lat,
            lng: risk.lng,
            id: risk.id,
            impact: risk.impact,
            code: risk.code,
            altitude: 0.015
        }));
    }, [risks]);

    return (
        <div ref={containerRef} className="w-full h-full">
            {hasError ? (
                <FallbackMap />
            ) : !GlobeComponent ? (
                <div className="w-full h-full bg-surface animate-pulse" />
            ) : (
                <GlobeComponent
                    ref={globeEl}
                    backgroundColor="rgba(0,0,0,0)"
                    globeMaterial={
                        new THREE.MeshPhongMaterial({
                            color: '#EAE7E0', // Surface color
                            emissive: '#222222',
                            emissiveIntensity: 0.1,
                            shininess: 0
                        })
                    }
                    // Atmosphere
                    atmosphereColor="#D94E28"
                    atmosphereAltitude={0.15}
                    // Land
                    polygonsData={countries.features}
                    polygonCapColor={() => '#1A1918'}
                    polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                    polygonStrokeColor={() => '#F4F1EA'}
                    polygonAltitude={0.01}
                    showGlobe={true}
                    showAtmosphere={true}
                    
                    // Markers
                    htmlElementsData={htmlElementsData}
                    htmlElement={(d: any) => {
                        const isHovered = d.id === hoveredId;
                        const isCritical = d.impact === 'CRITICAL';
                        
                        const el = document.createElement('div');
                        el.className = "relative";
                        
                        const markerSize = isHovered ? 'w-6 h-6' : 'w-3 h-3';
                        const markerBg = isCritical ? 'bg-accent' : 'bg-text';
                        const labelTop = isHovered ? 'top-[14px]' : 'top-2';
                        const labelOpacity = isHovered ? 'opacity-100' : 'opacity-70';

                        el.innerHTML = `
                            <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${markerSize} ${markerBg} border-2 border-background rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-300"></div>
                            <div class="absolute ${labelTop} left-1/2 -translate-x-1/2 bg-text text-background px-1.5 py-0.5 font-sans text-[10px] font-bold rounded-sm ${labelOpacity} whitespace-nowrap pointer-events-none">${d.code}</div>
                        `;
                        return el;
                    }}
                    htmlTransitionDuration={400}
                    
                    width={dimensions.width}
                    height={dimensions.height}
                />
            )}
        </div>
    );
};

export const RiskMap: React.FC<{ risks?: GeoRisk[] }> = ({ risks = [] }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeRisk = useMemo(() => 
    risks.find(r => r.id === selectedId) || null
  , [selectedId, risks]);

  return (
    <div className="w-full py-24 md:py-32">
      <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-start mb-16 px-0 md:px-0">
         <div className="col-span-4 md:col-span-8 max-w-xl">
             <span className="font-mono text-sm font-bold text-accent tracking-widest block mb-6">02 — GEOPOLITICAL RISK</span>
             <h2 className="font-sans font-extrabold text-5xl md:text-7xl leading-[0.9] text-text mb-8 tracking-tighter">
                Supply Chain <br />
                <span className="text-secondary">Vulnerabilities</span>
             </h2>
             <p className="font-mono text-sm font-medium text-secondary leading-relaxed max-w-lg">
               Real-time monitoring of geopolitical friction points affecting critical semiconductor material flow.
             </p>
         </div>
         <div className="hidden md:block col-span-4 md:col-span-4 place-self-end text-right">
            <div className="w-32 h-[3px] bg-text mb-4 ml-auto"></div>
            <span className="font-mono text-xs font-bold">GLOBAL THREAT LEVEL: <br/><span className="text-accent text-lg">ELEVATED</span></span>
         </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 border-t-[3px] border-text">
        {/* List Section - Spans 5 cols for readability */}
        <div className="col-span-4 md:col-span-5" role="list">
            {risks.map((risk, index) => (
              <div 
                key={risk.id}
                id={`risk-item-${risk.id}`}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredId(risk.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(risk.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(risk.id);
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextId = risks[index + 1]?.id;
                    if (nextId) document.getElementById(`risk-item-${nextId}`)?.focus();
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevId = risks[index - 1]?.id;
                    if (prevId) document.getElementById(`risk-item-${prevId}`)?.focus();
                  }
                }}
                className={`
                    group relative border-b-[3px] border-text p-8 md:p-10 cursor-pointer transition-all duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent
                    ${selectedId === risk.id ? 'bg-surface' : 'bg-background hover:bg-surface'}
                `}
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-bold text-text border-2 border-text px-2 py-1">
                            {risk.code}
                        </span>
                        <h3 className="font-sans font-bold text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors">{risk.title}</h3>
                    </div>
                    {risk.impact === 'CRITICAL' && (
                        <span className="font-mono text-[10px] font-bold bg-accent text-white px-2 py-1 uppercase animate-pulse">
                            Critical
                        </span>
                    )}
                 </div>
                 
                 <p className="font-sans font-medium text-secondary text-lg mb-6 pr-8 leading-snug">
                     {risk.shortDesc}
                 </p>

                 <div className="flex gap-4">
                     {risk.materials.map(m => (
                         <span key={m} className="font-mono text-xs font-bold uppercase border-b-2 border-secondary text-secondary">
                             {m}
                         </span>
                     ))}
                 </div>

                 {/* Hover Indicator */}
                 <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredId === risk.id ? 1 : 0 }}
                    className="absolute bottom-0 left-0 h-[3px] w-full bg-accent origin-left"
                 />
              </div>
            ))}
        </div>

        {/* Map Visualization - Spans 7 cols */}
        <div className="col-span-4 md:col-span-7 relative h-[600px] overflow-hidden bg-[#E6E2D8] flex items-center justify-center">
            {/* 3D Globe Container */}
            <div className="w-full h-full cursor-move">
                <GlobeVisualization hoveredId={hoveredId || selectedId} risks={risks} />
            </div>
            
            {/* Map Overlays */}
            <div className="absolute top-6 right-6 z-10 pointer-events-none">
                 <div className="flex flex-col items-end gap-1">
                     <span className="font-mono text-[10px] tracking-widest text-text/50">VISUALIZATION</span>
                     <span className="font-sans text-xs font-bold text-text">LIVE FEED</span>
                     <div className="flex gap-1 mt-1">
                         <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                         <div className="w-1 h-1 bg-accent rounded-full animate-pulse delay-75"></div>
                         <div className="w-1 h-1 bg-accent rounded-full animate-pulse delay-150"></div>
                     </div>
                 </div>
            </div>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      <AnimatePresence>
        {selectedId && activeRisk && (
            <DetailPanel 
                activeRisk={activeRisk} 
                onClose={() => setSelectedId(null)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailPanel = ({ activeRisk, onClose }: { activeRisk: GeoRisk, onClose: () => void }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-background border-l border-text z-[100] shadow-2xl p-8 md:p-16 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`Risk details for ${activeRisk.title}`}
        >
            <button 
                onClick={onClose}
                aria-label="Close details"
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center border border-text rounded-full hover:bg-text hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 13L13 1M1 1L13 13" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
            </button>

            <span className="font-mono text-xs text-accent tracking-widest block mb-8">RISK DETAIL — {activeRisk.code}</span>
            
            <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-[0.9]">
                {activeRisk.title}
            </h2>

            <div className="grid grid-cols-2 gap-8 border-y border-text border-opacity-20 py-8 mb-8">
                <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block mb-2">Primary Impact</span>
                    <span className="font-serif text-xl">{activeRisk.marketImpact}</span>
                </div>
                <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block mb-2">Timeline</span>
                    <span className="font-serif text-xl">{activeRisk.timeline}</span>
                </div>
            </div>

            <p className="font-serif text-xl leading-relaxed text-secondary mb-12">
                {activeRisk.fullDesc}
            </p>

            <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-6">Affected Materials</h3>
            <div className="space-y-4">
                {activeRisk.materials.map(mat => (
                    <div key={mat} className="flex items-center justify-between border-b border-subtle pb-2">
                        <span className="font-mono text-sm">{mat}</span>
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};