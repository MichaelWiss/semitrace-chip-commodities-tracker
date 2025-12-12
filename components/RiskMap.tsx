import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Safe dynamic import pattern to prevent SSR/Module crashes
let GlobeT: any = null;

interface RiskItem {
  id: string;
  country: string;
  code: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  impact: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  materials: string[];
  marketImpact: string;
  timeline: string;
  lat: number;
  lng: number;
}

const RISKS: RiskItem[] = [
  { 
    id: '01',
    country: 'CHINA', 
    code: 'CN',
    title: 'Rare Earth Monopoly', 
    shortDesc: 'Controls 80% of global Gallium refining.',
    fullDesc: 'China maintains a stranglehold on the processing and refining of rare earth elements, specifically Gallium and Germanium.',
    impact: 'HIGH',
    materials: ['Gallium', 'Germanium'],
    marketImpact: '+12% Volatility',
    timeline: 'Immediate',
    lat: 35.8617, 
    lng: 104.1954
  },
  { 
    id: '02',
    country: 'TAIWAN', 
    code: 'TW',
    title: 'The Silicon Shield', 
    shortDesc: '90% of advanced logic chips (<5nm) mfg.',
    fullDesc: 'TSMC produces over 90% of the world’s most advanced semiconductor chips. A flashpoint blockade would halt global tech.',
    impact: 'CRITICAL',
    materials: ['3nm Wafers'],
    marketImpact: 'Global Halt',
    timeline: 'Strategic',
    lat: 23.6978, 
    lng: 120.9605
  },
  { 
    id: '03',
    country: 'CONGO', 
    code: 'CD',
    title: 'Cobalt Instability', 
    shortDesc: '70% of global cobalt extraction.',
    fullDesc: 'The DRC sits on the vast majority of Cobalt reserves. Political instability creates a highly volatile supply chain.',
    impact: 'MEDIUM',
    materials: ['Cobalt', 'Copper'],
    marketImpact: 'Supply Constraint',
    timeline: 'Chronic',
    lat: -4.0383, 
    lng: 21.7587
  },
  { 
    id: '04',
    country: 'RUSSIA', 
    code: 'RU',
    title: 'Palladium Supply', 
    shortDesc: 'Key supplier for sensor plating.',
    fullDesc: 'Russia is a key supplier of palladium. Sanctions and trade barriers create supply uncertainty for western manufacturers.',
    impact: 'MEDIUM',
    materials: ['Palladium', 'C4F6'],
    marketImpact: '+15% Cost',
    timeline: 'Ongoing',
    lat: 61.5240, 
    lng: 105.3188
  },
  { 
    id: '05',
    country: 'USA', 
    code: 'US',
    title: 'Reshoring Delays', 
    shortDesc: 'Permitting and talent bottlenecks.',
    fullDesc: 'New fabs in Arizona and Ohio face delays due to environmental permitting, lack of skilled labor, and water rights.',
    impact: 'MEDIUM',
    materials: ['Fab Capacity'],
    marketImpact: 'Delays',
    timeline: 'Medium Term',
    lat: 39.0902, 
    lng: -98.7129
  }
];

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
const GlobeVisualization = ({ hoveredId }: { hoveredId: string | null }) => {
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
            const risk = RISKS.find(r => r.id === hoveredId);
            if (risk) {
                globeEl.current.pointOfView({ lat: risk.lat, lng: risk.lng, altitude: 2.0 }, 1000);
            }
        } else if (globeEl.current) {
             // Reset view slightly if nothing hovered
             globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
        }
    }, [hoveredId]);

    // HTML Marker Renderer
    const htmlElementsData = useMemo(() => {
        return RISKS.map(risk => ({
            lat: risk.lat,
            lng: risk.lng,
            id: risk.id,
            impact: risk.impact,
            code: risk.code,
            altitude: 0.015
        }));
    }, []);

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
                        el.innerHTML = `
                            <div style="position: relative;">
                                <div style="
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    transform: translate(-50%, -50%);
                                    width: ${isHovered ? '24px' : '12px'};
                                    height: ${isHovered ? '24px' : '12px'};
                                    background-color: ${isCritical ? '#D94E28' : '#1A1918'};
                                    border: 2px solid #F4F1EA;
                                    border-radius: 50%;
                                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                                    transition: all 0.3s ease;
                                "></div>
                                <div style="
                                    position: absolute;
                                    top: ${isHovered ? '14px' : '8px'};
                                    left: 50%;
                                    transform: translateX(-50%);
                                    background: #1A1918;
                                    color: #F4F1EA;
                                    padding: 2px 6px;
                                    font-family: 'Manrope', sans-serif;
                                    font-size: 10px;
                                    font-weight: 700;
                                    border-radius: 2px;
                                    opacity: ${isHovered ? 1 : 0.7};
                                    white-space: nowrap;
                                    pointer-events: none;
                                ">${d.code}</div>
                            </div>
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

export const RiskMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeRisk = useMemo(() => 
    RISKS.find(r => r.id === selectedId) || null
  , [selectedId]);

  return (
    <div className="w-full py-24 md:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 px-6 md:px-0">
         <div className="max-w-xl">
             <span className="font-mono text-xs text-accent tracking-widest block mb-6">02 — GEOPOLITICAL RISK</span>
             <h2 className="font-serif text-5xl md:text-6xl leading-none text-text mb-6">
                Supply Chain <br />
                <span className="italic text-secondary">Vulnerabilities</span>
             </h2>
             <p className="font-serif text-lg text-secondary">
               Real-time monitoring of geopolitical friction points affecting critical semiconductor material flow.
             </p>
         </div>
         <div className="hidden md:block">
            <div className="w-32 h-[1px] bg-text mb-4"></div>
            <span className="font-mono text-xs">GLOBAL THREAT LEVEL: <br/><span className="text-accent">ELEVATED</span></span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-text">
        {/* List Section */}
        <div className="border-r border-text border-opacity-20" role="list">
            {RISKS.map((risk, index) => (
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
                    const nextId = RISKS[index + 1]?.id;
                    if (nextId) document.getElementById(`risk-item-${nextId}`)?.focus();
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevId = RISKS[index - 1]?.id;
                    if (prevId) document.getElementById(`risk-item-${prevId}`)?.focus();
                  }
                }}
                className={`
                    group relative border-b border-text border-opacity-20 p-6 md:p-10 cursor-pointer transition-all duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent
                    ${selectedId === risk.id ? 'bg-surface' : 'hover:bg-white'}
                `}
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-secondary border border-subtle px-2 py-0.5 rounded-full">
                            {risk.code}
                        </span>
                        <h3 className="font-serif text-2xl group-hover:text-accent transition-colors">{risk.title}</h3>
                    </div>
                    {risk.impact === 'CRITICAL' && (
                        <span className="font-sans text-[10px] bg-accent text-white px-2 py-1 tracking-widest uppercase animate-pulse">
                            Critical
                        </span>
                    )}
                 </div>
                 
                 <p className="font-serif text-secondary text-lg mb-4 pr-8 leading-snug">
                     {risk.shortDesc}
                 </p>

                 <div className="flex gap-4">
                     {risk.materials.map(m => (
                         <span key={m} className="font-mono text-[10px] uppercase border-b border-subtle text-secondary">
                             {m}
                         </span>
                     ))}
                 </div>

                 {/* Hover Indicator */}
                 <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredId === risk.id ? 1 : 0 }}
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-accent origin-left"
                 />
              </div>
            ))}
        </div>

        {/* Map Visualization */}
        <div className="relative h-[600px] overflow-hidden bg-[#E6E2D8] flex items-center justify-center">
            {/* 3D Globe Container */}
            <div className="w-full h-full cursor-move">
                <GlobeVisualization hoveredId={hoveredId || selectedId} />
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

const DetailPanel = ({ activeRisk, onClose }: { activeRisk: RiskItem, onClose: () => void }) => {
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