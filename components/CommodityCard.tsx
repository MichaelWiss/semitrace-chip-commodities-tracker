import React, { useState, useMemo } from 'react';
import { Commodity } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, ComposedChart, Line, ReferenceArea, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: Commodity;
  index: number;
}

const RiskBar = ({ label, value }: { label: string, value: number }) => (
  <div className="mb-3">
    <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
      <span className="text-secondary">{label}</span>
      <span className={`font-mono ${value > 70 ? 'text-accent' : 'text-text'}`}>{value}/100</span>
    </div>
    <div className="h-1 w-full bg-subtle rounded-full overflow-hidden">
      <div 
        className={`h-full ${value > 70 ? 'bg-accent' : 'bg-text'}`} 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const SectorTag: React.FC<{ name: string, criticality: 'High' | 'Medium' | 'Low' }> = ({ name, criticality }) => {
  const colors = {
    High: 'bg-accent text-white border-accent',
    Medium: 'bg-surface text-text border-text',
    Low: 'bg-surface text-secondary border-subtle'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-wider border ${colors[criticality]} mr-2 mb-2`}>
      {name}
    </span>
  );
};

const CommodityCardComponent: React.FC<Props> = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = data.changePercentage >= 0;

  // Prepare data for the forecast chart including the range array
  const forecastData = useMemo(
    () => data.forecast?.map(f => ({
      ...f,
      range: [f.lowerBound, f.upperBound]
    })) || [],
    [data.forecast]
  );

  const lastForecast = data.forecast?.[data.forecast.length - 1];
  const outlookStatus = lastForecast?.status || 'Unknown';
  const outlookColor = 
    outlookStatus === 'Shortage' ? 'text-accent' : 
    outlookStatus === 'Tight' ? 'text-accent opacity-80' : 
    'text-secondary';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      className="group relative border-b border-subtle py-8 cursor-pointer transition-all duration-500 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0 relative z-10">
        
        {/* Index & Name */}
        <div className="flex items-center gap-8 w-full md:w-1/3">
          <span className="font-mono text-xs text-secondary border border-subtle rounded-full w-8 h-8 flex items-center justify-center">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
             <h3 className="font-serif text-3xl text-text group-hover:text-accent transition-colors duration-300">
                {data.name}
             </h3>
             <span className="font-sans text-[10px] tracking-widest uppercase text-secondary">
               {data.category}
             </span>
          </div>
        </div>

        {/* Price Data & Outlook */}
        <div className="flex items-center gap-8 md:gap-16 w-full md:w-1/3 justify-start md:justify-center">
          <div>
             <span className="font-mono text-xl text-text font-medium">{data.price.toLocaleString()}</span>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">{data.currency}</span>
          </div>
          <div className="text-right">
             <span className={`font-mono text-lg ${isPositive ? 'text-text' : 'text-accent'}`}>
               {isPositive ? '↑' : '↓'} {Math.abs(data.changePercentage)}%
             </span>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">24h Change</span>
          </div>
          {/* Outlook Indicator */}
          <div className="hidden lg:block text-right">
             <div className="flex items-center justify-end gap-2">
                {outlookStatus === 'Shortage' && <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-accent/50" />}
                <span className={`font-mono text-lg ${outlookColor}`}>{outlookStatus.toUpperCase()}</span>
             </div>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">6M Supply Forecast</span>
          </div>
        </div>

        {/* Action / Symbol */}
        <div className="w-full md:w-1/3 flex justify-end items-center pr-4 md:pr-12">
            <motion.div 
               animate={{ rotate: isHovered ? 45 : 0 }}
               className="w-8 h-8 flex items-center justify-center rounded-full border border-text text-text"
            >
               <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
               </svg>
            </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full bg-surface"
          >
             <div className="flex flex-col lg:flex-row gap-12 py-8 px-4 md:px-12 border-t border-subtle mt-8">
                
                {/* Left Col: Detailed Profile */}
                <div className="w-full lg:w-5/12 space-y-8">
                   
                   {/* Description */}
                   <div>
                     <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-accent">Material Profile</h4>
                     <p className="font-serif text-lg text-secondary leading-relaxed">
                       {data.description}
                     </p>
                   </div>

                   {/* Properties & ESG Grid */}
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase mb-1">Purity / Grade</span>
                        <span className="font-mono text-sm block">{data.materialProperties?.purityGrade || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase mb-1">Form</span>
                        <span className="font-mono text-sm block">{data.materialProperties?.form || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase mb-1">Carbon Footprint</span>
                        <span className="font-mono text-sm block">{data.esgMetrics?.carbonFootprint || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase mb-1">Conflict Mineral</span>
                        <span className="font-mono text-sm block">{data.esgMetrics?.conflictMineralStatus ? 'Yes' : 'No'}</span>
                      </div>
                   </div>

                   {/* Supply Chain Risk */}
                   {data.supplyChainRisk && (
                     <div>
                       <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-accent">Supply Chain Risk</h4>
                       <RiskBar label="Primary Producer Share" value={data.supplyChainRisk.primaryProducerShare} />
                       <RiskBar label="Top 3 Producer Share" value={data.supplyChainRisk.top3ProducerShare} />
                       <RiskBar label="Recycling Rate" value={data.supplyChainRisk.recyclingRate} />
                     </div>
                   )}

                   {/* Sector Dependencies */}
                   {data.sectorDependencies && (
                     <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-accent">Critical Sectors</h4>
                        <div className="flex flex-wrap">
                          {Object.entries(data.sectorDependencies)
                            .filter(([_, isDependent]) => isDependent)
                            .map(([sector]) => (
                              <SectorTag key={sector} name={sector} criticality="High" />
                            ))}
                        </div>
                     </div>
                   )}

                   {/* Related Companies */}
                   {data.relatedCompanies && data.relatedCompanies.length > 0 && (
                     <div>
                        <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-accent">Traded Companies</h4>
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                          {data.relatedCompanies.map((company) => (
                            <div 
                              key={company.symbol} 
                              className="p-3 bg-background border border-subtle hover:border-text transition-colors group/company"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-bold text-text">{company.symbol}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 bg-surface text-secondary rounded uppercase tracking-wider">
                                    {company.exchange}
                                  </span>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider ${
                                  company.role === 'Producer' ? 'bg-text text-background' :
                                  company.role === 'Consumer' ? 'bg-accent text-white' :
                                  'bg-surface text-secondary border border-subtle'
                                }`}>
                                  {company.role}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-sans text-xs font-medium text-text truncate max-w-[180px]" title={company.name}>
                                  {company.name}
                                </span>
                                {company.marketCap && (
                                  <span className="font-mono text-[10px] text-secondary">
                                    {company.marketCap}
                                  </span>
                                )}
                              </div>
                              <p className="font-serif text-[11px] text-secondary leading-relaxed line-clamp-2">
                                {company.description}
                              </p>
                            </div>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Right Col: Charts & Application */}
                <div className="w-full lg:w-7/12 flex flex-col gap-8">
                  
                  {/* Price Chart */}
                  <div className="h-[250px]">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-text">Price Action (30D)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.history}>
                        <defs>
                          <linearGradient id={`gradient-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A1918" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1A1918" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <Tooltip 
                          contentStyle={{
                              backgroundColor: '#F4F1EA',
                              borderColor: '#1A1918',
                              borderWidth: '1px',
                              borderRadius: '0px',
                              padding: '8px 12px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                          }}
                          itemStyle={{
                              color: '#1A1918',
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: '12px',
                              fontWeight: 'bold'
                          }}
                          labelStyle={{
                              color: '#6B665F',
                              fontFamily: 'Manrope, sans-serif',
                              fontSize: '10px',
                              marginBottom: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                          }}
                          formatter={(value: number) => [
                              `${data.currency.includes('USD') ? '$' : ''}${value.toLocaleString()}`, 
                              'Price'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#1A1918" 
                          strokeWidth={1.5}
                          fill={`url(#gradient-${data.id})`} 
                          animationDuration={1000}
                          activeDot={{ r: 4, fill: '#D94E28', stroke: '#F4F1EA', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Semiconductor Application Details */}
                     <div>
                       <h5 className="font-sans text-[10px] uppercase tracking-widest text-secondary mb-3">Semiconductor Application</h5>
                       <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                              <span className="font-serif text-xs italic text-secondary block mb-1">Key Processes</span>
                              <ul className="list-disc list-inside">
                                  {data.usage.processes.map(p => (
                                      <li key={p} className="font-mono text-[10px] text-text mb-0.5 truncate" title={p}>{p}</li>
                                  ))}
                              </ul>
                          </div>
                          <div>
                              <span className="font-serif text-xs italic text-secondary block mb-1">Target Layers</span>
                              <ul className="list-disc list-inside">
                                  {data.usage.layers.map(l => (
                                      <li key={l} className="font-mono text-[10px] text-text mb-0.5 truncate" title={l}>{l}</li>
                                  ))}
                              </ul>
                          </div>
                       </div>
                     </div>

                     {/* Detailed Availability Forecast Chart */}
                     <div>
                       <div className="flex justify-between items-end mb-4">
                           <div>
                              <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-text block">Supply Forecast (6MO)</span>
                              <span className="font-serif text-[10px] text-secondary italic">Confidence ±{100 - data.forecastConfidence}%</span>
                           </div>
                           <div className="text-right">
                               <span className={`font-mono text-[10px] font-bold ${outlookColor}`}>
                                   {outlookStatus}
                               </span>
                           </div>
                       </div>
                       <div className="h-[100px] w-full bg-background border border-subtle p-2">
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={forecastData}>
                                  <defs>
                                      <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                          <line x1="0" y1="0" x2="0" y2="4" style={{stroke:'#D94E28', strokeWidth:1, opacity:0.1}} />
                                      </pattern>
                                  </defs>
                                  {/* Risk Zones */}
                                  <ReferenceArea y1={0} y2={30} fill="url(#diagonalHatch)" />
                                  <ReferenceArea y1={30} y2={60} fill="#D94E28" fillOpacity={0.03} />
                                  <ReferenceArea y1={60} y2={100} fill="#1A1918" fillOpacity={0.02} />
                                  
                                  <XAxis dataKey="month" hide />
                                  <YAxis domain={[0, 100]} hide />
                                  <Tooltip 
                                      contentStyle={{ 
                                          backgroundColor: '#F4F1EA', 
                                          borderColor: '#1A1918',
                                          fontSize: '10px',
                                          padding: '4px 8px'
                                      }}
                                      itemStyle={{ color: '#1A1918' }}
                                      formatter={(val: any, name: string, props: any) => {
                                          if (name === 'range') return [`${props.payload.lowerBound}-${props.payload.upperBound}`, 'Confidence'];
                                          return [val, name === 'score' ? 'Availability Score' : name];
                                      }}
                                      labelStyle={{ display: 'none' }}
                                  />
                                  
                                  {/* Confidence Interval (Range Area) */}
                                  <Area 
                                      type="monotone" 
                                      dataKey="range" 
                                      stroke="none" 
                                      fill="#1A1918" 
                                      fillOpacity={0.1} 
                                  />
                                  
                                  {/* Score Line */}
                                  <Line 
                                      type="monotone" 
                                      dataKey="score" 
                                      stroke="#1A1918" 
                                      strokeWidth={1.5} 
                                      dot={{ r: 2, fill: '#1A1918' }}
                                  />
                              </ComposedChart>
                          </ResponsiveContainer>
                       </div>
                     </div>
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CommodityCard = React.memo(CommodityCardComponent);
