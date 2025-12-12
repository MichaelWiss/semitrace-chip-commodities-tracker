import { ToolingEntity, PricePoint } from '../types';

interface ToolingEntityRaw {
  id: string;
  symbol: string;
  name: string;
  role: 'Lithography' | 'Compute' | 'Foundry' | 'Etch/Deposition' | 'Inspection';
  price: number;
  moat: 'Wide' | 'Medium' | 'Narrow';
  backlog: string;
  dominance: number;
  node: string;
  volatility: number;
}

// Robust simulation for fallback
const generateSimulation = (startPrice: number, volatility: number): PricePoint[] => {
  let currentPrice = startPrice;
  const history: PricePoint[] = [];
  const now = new Date();
  
  // Generate 30 days of history
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with mean reversion tendency
    const change = (Math.random() - 0.5) * (startPrice * volatility);
    currentPrice += change;
    
    // Ensure price doesn't go negative or too unrealistic
    if (currentPrice < startPrice * 0.5) currentPrice = startPrice * 0.5;
    
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(currentPrice.toFixed(2))
    });
  }
  return history;
};

export const getToolingEntities = async (): Promise<ToolingEntity[]> => {
    // Simulated data with realistic values for a demo
    // In a real app, price would come from Alpha Vantage, but complex metrics like Backlog need bespoke data sources.
    const entities: ToolingEntityRaw[] = [
        {
            id: 'asml',
            symbol: 'ASML',
            name: 'ASML Holding',
            role: 'Lithography',
            price: 980.45,
            moat: 'Wide',
            backlog: '€39B',
            dominance: 100, // 100% of EUV market
            node: 'High-NA EUV',
            volatility: 0.02
        },
        {
            id: 'nvda',
            symbol: 'NVDA',
            name: 'NVIDIA Corp',
            role: 'Compute',
            price: 920.10,
            moat: 'Wide',
            backlog: '$22B', // Est. H100 backlog
            dominance: 92, // AI Training market share
            node: 'Blackwell B100',
            volatility: 0.04
        },
        {
            id: 'tsm',
            symbol: 'TSM',
            name: 'TSMC',
            role: 'Foundry',
            price: 145.50,
            moat: 'Wide',
            backlog: '$18B',
            dominance: 58, // Total Foundry
            node: 'N2 (2nm GAA)',
            volatility: 0.015
        },
        {
            id: 'amat',
            symbol: 'AMAT',
            name: 'Applied Materials',
            role: 'Etch/Deposition',
            price: 210.20,
            moat: 'Medium',
            backlog: '$19B',
            dominance: 40,
            node: 'Gate-All-Around',
            volatility: 0.02
        },
        {
            id: 'lrcx',
            symbol: 'LRCX',
            name: 'Lam Research',
            role: 'Etch/Deposition',
            price: 960.80,
            moat: 'Medium',
            backlog: '$11B',
            dominance: 35, // Etch specific
            node: 'Cryogenic Etch',
            volatility: 0.025
        }
    ];

    return entities.map(e => {
        const history = generateSimulation(e.price, e.volatility);
        const current = history[history.length - 1].value;
        const prev = history[history.length - 2].value;
        
        return {
            id: e.id,
            symbol: e.symbol,
            name: e.name,
            role: e.role,
            price: current,
            change: parseFloat((current - prev).toFixed(2)),
            percentChange: parseFloat((((current - prev) / prev) * 100).toFixed(2)),
            moatRating: e.moat,
            backlog: e.backlog,
            dominanceScore: e.dominance,
            techNode: e.node,
            history: history
        };
    });
};
