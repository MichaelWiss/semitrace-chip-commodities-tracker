
export enum CommodityCategory {
  RawSilicon = 'Raw Silicon & Wafers',
  CriticalMetals = 'Critical Metals',
  PreciousMetals = 'Precious & Rare',
  Chemicals = 'Specialty Chemicals',
}

export interface PricePoint {
  date: string;
  value: number;
}

export interface AvailabilityMetric {
  month: string;
  status: 'Surplus' | 'Stable' | 'Tight' | 'Shortage';
  score: number; // 0-100 (100 is max availability)
  lowerBound: number; // Confidence interval lower
  upperBound: number; // Confidence interval upper
}

export interface CommodityUsage {
  processes: string[]; // e.g., "Wire Bonding", "Sputtering"
  layers: string[];    // e.g., "Interconnects", "Packaging"
}

export interface Commodity {
  id: string;
  symbol: string;
  name: string;
  category: CommodityCategory;
  price: number;
  currency: string;
  change24h: number;
  changePercentage: number;
  volatility: 'Low' | 'Medium' | 'High';
  riskLevel: 'Stable' | 'Elevated' | 'Critical';
  description: string;
  topProducer: string;
  history: PricePoint[];
  forecast: AvailabilityMetric[];
  forecastConfidence: number; // % confidence in prediction
  usage: CommodityUsage;
}

export interface MarketTicker {
  symbol: string;
  price: string;
  trend: 'up' | 'down';
}

export interface GeoRisk {
  country: string;
  riskScore: number; // 0-100
  controlledMaterials: string[];
  description: string;
}

// New Types for Energy Module
export interface PowerForecast {
  hour: string;
  strain: number; // 0-100, Net Load after renewables
  solar: number; // 0-100, Solar Generation Potential
  wind: number; // 0-100, Wind Generation Potential
  carbon: number; // gCO2/kWh - Forecasted Carbon Intensity
}

export interface PowerHub {
  id: string;
  name: string; // e.g., "Ashburn, VA"
  region: string;
  spotPrice: number; // $/MWh
  carbonIntensity: number; // gCO2/kWh
  gridStrain: 'Low' | 'Moderate' | 'High' | 'Critical';
  renewables: {
      currentSolarLoad: number; // 0-100% capacity
      currentWindLoad: number; // 0-100% capacity
  };
  energyMix: {
    nuclear: number;
    gas: number;
    renewables: number;
    coal: number;
  };
  forecast: PowerForecast[];
}

export interface GlobalEnergyMetrics {
  globalPUE: number; // Avg Power Usage Effectiveness
  aiTrainingLoad: number; // Estimated GW demand
  totalCarbonFootprint: number; // Million Tonnes
  globalRenewableUsage: number; // % Utilization across all hubs
}

// New Types for Tooling & Industrial Base
export interface ToolingEntity {
  id: string;
  symbol: string;
  name: string;
  role: 'Lithography' | 'Compute' | 'Foundry' | 'Etch/Deposition' | 'Inspection';
  price: number;
  change: number;
  percentChange: number;
  moatRating: 'Wide' | 'Medium' | 'Narrow'; // Warren Buffet style moat
  backlog: string; // e.g. "€38B"
  dominanceScore: number; // 0-100 Market Share in niche
  techNode: string; // e.g. "High-NA EUV" or "3nm GAA"
  history: PricePoint[];
}
