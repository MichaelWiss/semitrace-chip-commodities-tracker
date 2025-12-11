import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiskAlert } from '../types';
import { getRiskAlerts } from '../services/marketService';

const severityConfig = {
  critical: {
    bg: 'bg-[#D94E28]',
    border: 'border-[#D94E28]',
    text: 'text-white',
    icon: '⚠',
    pulse: true
  },
  warning: {
    bg: 'bg-[#1A1918]',
    border: 'border-[#1A1918]',
    text: 'text-white',
    icon: '!',
    pulse: false
  },
  info: {
    bg: 'bg-surface',
    border: 'border-subtle',
    text: 'text-text',
    icon: 'i',
    pulse: false
  }
};

const categoryIcons: Record<string, string> = {
  geopolitical: '🌍',
  supply: '📦',
  price: '💰',
  logistics: '🚚'
};

export const RiskAlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getRiskAlerts();
      setAlerts(data);
    };
    fetchAlerts();
    
    // Refresh alerts every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[90vw] space-y-3">
      <AnimatePresence>
        {visibleAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          const isExpanded = expanded === alert.id;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border ${config.border} ${config.bg} ${config.text} shadow-xl overflow-hidden`}
            >
              {/* Pulse effect for critical alerts */}
              {config.pulse && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
              )}
              
              {/* Header */}
              <div 
                className="flex items-start gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                <div className={`w-8 h-8 flex items-center justify-center text-lg ${alert.severity === 'info' ? 'bg-text text-white' : 'bg-white/20'} rounded-full shrink-0`}>
                  {categoryIcons[alert.category] || config.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-[10px] uppercase tracking-widest opacity-70">
                      {alert.category}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-widest opacity-50">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-sans text-sm font-bold leading-tight">
                    {alert.title}
                  </h4>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissed(prev => new Set(prev).add(alert.id));
                  }}
                  className="w-6 h-6 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity shrink-0"
                >
                  ✕
                </button>
              </div>
              
              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 pb-4 pt-2 border-t ${alert.severity === 'info' ? 'border-subtle' : 'border-white/20'}`}>
                      <p className="font-serif text-sm leading-relaxed mb-4 opacity-90">
                        {alert.message}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {alert.affectedMaterials.map(mat => (
                          <span 
                            key={mat} 
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase ${alert.severity === 'info' ? 'bg-text/10 text-text' : 'bg-white/20'} rounded`}
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Alert count indicator */}
      {visibleAlerts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-right"
        >
          <span className="font-mono text-[10px] text-secondary">
            {visibleAlerts.filter(a => a.severity === 'critical').length > 0 && (
              <span className="text-[#D94E28] mr-2">
                {visibleAlerts.filter(a => a.severity === 'critical').length} CRITICAL
              </span>
            )}
            {visibleAlerts.length} ACTIVE ALERTS
          </span>
        </motion.div>
      )}
    </div>
  );
};
