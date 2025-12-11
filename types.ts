
export enum CommodityCategory {
  // Core
  RawSilicon = 'Raw Silicon & Wafers',
  CriticalMetals = 'Critical Metals',
  PreciousMetals = 'Precious Metals',
  PlatinumGroup = 'Platinum Group Metals',
  
  // Elements
  RareEarths = 'Rare Earth Elements',
  SemiconductorElements = 'Semiconductor Elements',
  Dopants = 'Dopants & Trace Elements',
  
  // Energy
  BatteryMaterials = 'Battery & Energy Storage',
  HydrogenEconomy = 'Hydrogen Economy',
  SolarMaterials = 'Solar PV Materials',
  
  // Process
  IndustrialGases = 'Industrial & Process Gases',
  SpecialtyChemicals = 'Specialty Chemicals',
  ALDPrecursors = 'ALD/CVD Precursors',
  
  // Advanced
  SuperconductorMaterials = 'Superconductor Materials',
  QuantumMaterials = 'Quantum Computing Materials',
  AdvancedMaterials = 'Advanced & Emerging Materials',
  
  // Infrastructure
  PackagingMaterials = 'Packaging & Substrates'
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

export interface SupplyChainRisk {
  primaryProducerShare: number;      // % from top producer
  top3ProducerShare: number;         // % from top 3
  exportControlled: boolean;          // Subject to restrictions
  substitutability: 'None' | 'Limited' | 'Moderate' | 'High';
  recyclingRate: number;              // % currently recycled
  stockpileDays: number;              // Strategic reserve days
}

export interface SectorDependencies {
  semiconductors: boolean;
  cleanEnergy: boolean;
  batteries: boolean;
  superconductors: boolean;
  quantumComputing: boolean;
  aiInfrastructure: boolean;
}

export interface MaterialProperties {
  purityGrade?: string;               // "9N", "5N", "4N5"
  form: string;                        // "Ingot", "Powder", "Gas", "Tape"
  criticalProcesses: string[];
  alternativeMaterials: string[];
}

export interface PriceReferences {
  exchange?: string;                  // "LME", "COMEX", "SMM"
  symbol?: string;                    // "HG=F", "LCO"
  spotMarket?: string;                // "Asian Metals", "Minor Metals"
}

export interface ESGMetrics {
  waterIntensity?: number; // Liters/kg
  carbonFootprint?: number; // kg CO2e across lifecycle
  communityImpactScore?: number; // 0-100
  circularityPercentage?: number; // % from recycled sources
  conflictMineralStatus?: boolean; // 3TG compliance
}

export interface GeographicConcentration {
  material: string;
  production: { country: string; share: number }[];
  refining: { country: string; share: number }[];
  chokepoints: string[];               // "Taiwan Strait", "Malacca Strait"
  logisticsRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SupplyChainIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  description: string;
  dataSource: string;
}

export interface CommodityUsage {
  processes: string[]; // e.g., "Wire Bonding", "Sputtering"
  layers: string[];    // e.g., "Interconnects", "Packaging"
}

export interface RelatedCompany {
  symbol: string;       // Stock ticker (e.g., "FCX", "ALB")
  name: string;         // Full company name
  exchange: string;     // NYSE, NASDAQ, etc.
  role: 'Producer' | 'Processor' | 'Supplier' | 'Consumer' | 'Recycler';
  marketCap?: string;   // e.g., "$45B"
  description: string;  // Brief description of relationship to material
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
  
  // New Fields
  supplyChainRisk?: SupplyChainRisk;
  sectorDependencies?: SectorDependencies;
  materialProperties?: MaterialProperties;
  priceReferences?: PriceReferences;
  esgMetrics?: ESGMetrics;
  geographicConcentration?: GeographicConcentration;
  relatedCompanies?: RelatedCompany[];
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

export interface RiskAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  affectedMaterials: string[];
  timestamp: string;
  category: 'geopolitical' | 'supply' | 'price' | 'logistics';
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
