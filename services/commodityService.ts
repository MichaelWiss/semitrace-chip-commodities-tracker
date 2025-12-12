import { Commodity, CommodityCategory, PricePoint, AvailabilityMetric, SupplyChainRisk, SectorDependencies, MaterialProperties, SupplyChainIndex, GeoRisk, RelatedCompany } from '../types';
import { CONFIG } from '../constants/config';

// Commodities to fetch with their API function mapping
interface CommodityDefinition {
  id: string;
  name: string;
  category: CommodityCategory;
  desc: string;
  producer: string;
  symbol: string;
  price: number;
  risk: 'Stable' | 'Elevated' | 'Critical';
  processes: string[];
  layers: string[];
  apiFunc?: string;
  supplyChainRisk: SupplyChainRisk;
  sectorDependencies: SectorDependencies;
  materialProperties: MaterialProperties;
  companies?: RelatedCompany[];
}

const RAW_SILICON: CommodityDefinition[] = [
  {
    id: 'polysilicon', name: 'Polysilicon (9N)', category: CommodityCategory.RawSilicon,
    desc: 'Ultra-pure silicon (9N+) used as the base substrate for wafers.', producer: 'China', symbol: 'POLY', price: 24.50, risk: 'Elevated',
    processes: ['Czochralski Growth'], layers: ['Substrate'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '9N', form: 'Ingot', criticalProcesses: ['Crystal Growth'], alternativeMaterials: [] },
    companies: [
      { symbol: 'GCL', name: 'GCL-Poly Energy', exchange: 'HKG', role: 'Producer', marketCap: '$8B', description: 'World largest polysilicon producer, Chinese state-backed enterprise.' },
      { symbol: 'DAQO', name: 'Daqo New Energy', exchange: 'NYSE', role: 'Producer', marketCap: '$2B', description: 'Major Chinese polysilicon manufacturer for solar and semiconductor.' },
      { symbol: 'WCH.DE', name: 'Wacker Chemie', exchange: 'ETR', role: 'Producer', marketCap: '$9B', description: 'German chemical company, leading Western polysilicon producer.' }
    ]
  },
  {
    id: 'silicon_ingot', name: 'Silicon Ingot', category: CommodityCategory.RawSilicon,
    desc: 'Monocrystalline silicon ingots.', producer: 'China', symbol: 'SI-ING', price: 45.00, risk: 'Stable',
    processes: ['Wafer Slicing'], layers: ['Substrate'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 85, exportControlled: false, substitutability: 'None', recyclingRate: 10, stockpileDays: 45 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '9N', form: 'Ingot', criticalProcesses: ['Slicing'], alternativeMaterials: [] },
    companies: [
      { symbol: 'LONGI', name: 'LONGi Green Energy', exchange: 'SHA', role: 'Producer', marketCap: '$35B', description: 'World largest monocrystalline silicon producer.' },
      { symbol: 'SUMCO', name: 'SUMCO Corporation', exchange: 'TYO', role: 'Producer', marketCap: '$8B', description: 'Japanese silicon wafer manufacturer, key semiconductor supplier.' }
    ]
  },
  {
    id: 'wafer_300mm', name: '300mm Wafer', category: CommodityCategory.RawSilicon,
    desc: 'Polished 300mm silicon wafers.', producer: 'Japan', symbol: 'WFR300', price: 120.00, risk: 'Critical',
    processes: ['Lithography'], layers: ['Substrate'],
    supplyChainRisk: { primaryProducerShare: 55, top3ProducerShare: 90, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: true },
    materialProperties: { purityGrade: '11N', form: 'Wafer', criticalProcesses: ['Polishing'], alternativeMaterials: [] },
    companies: [
      { symbol: '4063.T', name: 'Shin-Etsu Chemical', exchange: 'TYO', role: 'Producer', marketCap: '$80B', description: 'World largest silicon wafer manufacturer, 30% global share.' },
      { symbol: 'SUMCO', name: 'SUMCO Corporation', exchange: 'TYO', role: 'Producer', marketCap: '$8B', description: 'Second largest 300mm wafer producer globally.' },
      { symbol: 'SSNLF', name: 'Siltronic AG', exchange: 'ETR', role: 'Producer', marketCap: '$4B', description: 'German wafer producer, GlobalWafers acquisition target.' },
      { symbol: 'TSM', name: 'TSMC', exchange: 'NYSE', role: 'Consumer', marketCap: '$900B', description: 'World largest foundry, consumes ~20% of global 300mm wafers.' }
    ]
  },
  {
    id: 'sic_wafer', name: 'SiC Wafer', category: CommodityCategory.RawSilicon,
    desc: 'Silicon Carbide wafers for power electronics.', producer: 'USA', symbol: 'SIC', price: 850.00, risk: 'Elevated',
    processes: ['Epitaxy'], layers: ['Substrate'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: true, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '6N', form: 'Wafer', criticalProcesses: ['Epitaxy'], alternativeMaterials: ['GaN'] },
    companies: [
      { symbol: 'WOLF', name: 'Wolfspeed', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'Leading SiC wafer and device manufacturer, formerly Cree.' },
      { symbol: 'ON', name: 'onsemi', exchange: 'NASDAQ', role: 'Producer', marketCap: '$30B', description: 'Major SiC power device producer, vertically integrated.' },
      { symbol: 'STM', name: 'STMicroelectronics', exchange: 'NYSE', role: 'Consumer', marketCap: '$35B', description: 'Key SiC device maker for automotive (Tesla supplier).' },
      { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$800B', description: 'Largest EV SiC consumer, drives 30% of automotive SiC demand.' }
    ]
  },
  {
    id: 'gan_wafer', name: 'GaN-on-Si', category: CommodityCategory.RawSilicon,
    desc: 'Gallium Nitride on Silicon wafers.', producer: 'Japan', symbol: 'GAN', price: 1200.00, risk: 'Elevated',
    processes: ['MOCVD'], layers: ['Active Layer'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 90, exportControlled: true, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '6N', form: 'Wafer', criticalProcesses: ['MOCVD'], alternativeMaterials: ['SiC'] },
    companies: [
      { symbol: 'NVMI', name: 'Navitas Semiconductor', exchange: 'NASDAQ', role: 'Producer', marketCap: '$1B', description: 'Pure-play GaN power IC company, fast charger market leader.' },
      { symbol: 'PI', name: 'Power Integrations', exchange: 'NASDAQ', role: 'Producer', marketCap: '$3B', description: 'GaN-based power conversion IC manufacturer.' },
      { symbol: 'TXN', name: 'Texas Instruments', exchange: 'NASDAQ', role: 'Producer', marketCap: '$170B', description: 'Major GaN power device producer with in-house fab.' },
      { symbol: 'AAPL', name: 'Apple', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$3T', description: 'Drives GaN charger adoption, major fast-charging consumer.' }
    ]
  }
];

const CRITICAL_METALS: CommodityDefinition[] = [
  {
    id: 'copper', name: 'Copper (HG)', category: CommodityCategory.CriticalMetals,
    desc: 'Primary interconnect material.', producer: 'Chile', symbol: 'HG=F', price: 4.12, risk: 'Stable', apiFunc: 'COPPER',
    processes: ['Plating'], layers: ['Interconnects'],
    supplyChainRisk: { primaryProducerShare: 28, top3ProducerShare: 45, exportControlled: false, substitutability: 'Moderate', recyclingRate: 35, stockpileDays: 15 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: true, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '5N', form: 'Cathode', criticalProcesses: ['Refining'], alternativeMaterials: ['Aluminum', 'Carbon Nanotubes'] },
    companies: [
      { symbol: 'FCX', name: 'Freeport-McMoRan', exchange: 'NYSE', role: 'Producer', marketCap: '$60B', description: 'World largest publicly traded copper producer, operates Grasberg mine.' },
      { symbol: 'SCCO', name: 'Southern Copper', exchange: 'NYSE', role: 'Producer', marketCap: '$75B', description: 'Largest copper reserves globally, Peru and Mexico operations.' },
      { symbol: 'BHP', name: 'BHP Group', exchange: 'NYSE', role: 'Producer', marketCap: '$150B', description: 'Major copper producer via Escondida mine in Chile.' },
      { symbol: 'INTC', name: 'Intel', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$200B', description: 'Major consumer of high-purity copper for chip interconnects.' }
    ]
  },
  {
    id: 'aluminum', name: 'Aluminum', category: CommodityCategory.CriticalMetals,
    desc: 'Legacy interconnects and packaging.', producer: 'China', symbol: 'ALI=F', price: 2300, risk: 'Stable', apiFunc: 'ALUMINUM',
    processes: ['Sputtering'], layers: ['Pads'],
    supplyChainRisk: { primaryProducerShare: 57, top3ProducerShare: 65, exportControlled: false, substitutability: 'High', recyclingRate: 70, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Ingot', criticalProcesses: ['Smelting'], alternativeMaterials: ['Copper'] },
    companies: [
      { symbol: 'AA', name: 'Alcoa', exchange: 'NYSE', role: 'Producer', marketCap: '$8B', description: 'American aluminum producer, vertically integrated from bauxite to metal.' },
      { symbol: 'RIO', name: 'Rio Tinto', exchange: 'NYSE', role: 'Producer', marketCap: '$120B', description: 'Major aluminum producer through Alcan subsidiary.' },
      { symbol: 'ARNC', name: 'Arconic', exchange: 'NYSE', role: 'Processor', marketCap: '$3B', description: 'Specialty aluminum products for aerospace and electronics.' }
    ]
  },
  {
    id: 'cobalt', name: 'Cobalt', category: CommodityCategory.CriticalMetals,
    desc: 'Advanced node barrier layers.', producer: 'DRC', symbol: 'CO', price: 28500, risk: 'Critical',
    processes: ['CVD'], layers: ['Contacts'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 80, exportControlled: false, substitutability: 'Limited', recyclingRate: 30, stockpileDays: 90 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Cathode', criticalProcesses: ['Refining'], alternativeMaterials: ['Ruthenium'] },
    companies: [
      { symbol: 'GLEN', name: 'Glencore', exchange: 'LSE', role: 'Producer', marketCap: '$60B', description: 'World largest cobalt producer, DRC mining operations.' },
      { symbol: 'CMCLF', name: 'CMOC Group', exchange: 'HKG', role: 'Producer', marketCap: '$15B', description: 'Chinese mining company, major DRC cobalt producer.' },
      { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$800B', description: 'Major battery cobalt consumer, pushing for cobalt-free chemistries.' },
      { symbol: 'AAPL', name: 'Apple', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$3T', description: 'Committed to 100% recycled cobalt in batteries by 2025.' }
    ]
  },
  {
    id: 'tungsten', name: 'Tungsten', category: CommodityCategory.CriticalMetals,
    desc: 'Contacts and vias.', producer: 'China', symbol: 'W', price: 320, risk: 'Elevated',
    processes: ['CVD'], layers: ['Vias'],
    supplyChainRisk: { primaryProducerShare: 85, top3ProducerShare: 92, exportControlled: true, substitutability: 'Limited', recyclingRate: 20, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Powder', criticalProcesses: ['Reduction'], alternativeMaterials: ['Molybdenum'] },
    companies: [
      { symbol: '000657.SZ', name: 'China Tungsten', exchange: 'SHE', role: 'Producer', marketCap: '$5B', description: 'Chinese state-owned, world largest tungsten producer.' },
      { symbol: 'LMAT', name: 'LeMaitre Vascular', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$2B', description: 'Medical device tungsten consumer (not semiconductor).' },
      { symbol: 'AMAT', name: 'Applied Materials', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$150B', description: 'Uses tungsten targets in semiconductor equipment manufacturing.' }
    ]
  },
  {
    id: 'titanium', name: 'Titanium', category: CommodityCategory.CriticalMetals,
    desc: 'Barrier/liner materials.', producer: 'China', symbol: 'TI', price: 6.50, risk: 'Stable',
    processes: ['PVD'], layers: ['Barrier'],
    supplyChainRisk: { primaryProducerShare: 35, top3ProducerShare: 60, exportControlled: false, substitutability: 'Moderate', recyclingRate: 50, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Sponge', criticalProcesses: ['Kroll Process'], alternativeMaterials: ['Tantalum'] },
    companies: [
      { symbol: 'TIE', name: 'Titanium Metals', exchange: 'NYSE', role: 'Producer', marketCap: '$4B', description: 'Major titanium sponge and mill products producer.' },
      { symbol: 'ATI', name: 'ATI Inc', exchange: 'NYSE', role: 'Producer', marketCap: '$6B', description: 'Specialty materials including titanium for aerospace and electronics.' },
      { symbol: 'VSEC', name: 'VSMPO-AVISMA', exchange: 'MCX', role: 'Producer', marketCap: '$3B', description: 'Russian titanium giant, largest global producer (sanctions affected).' }
    ]
  },
  {
    id: 'tantalum', name: 'Tantalum', category: CommodityCategory.CriticalMetals,
    desc: 'Capacitors and barriers.', producer: 'DRC', symbol: 'TA', price: 150, risk: 'Critical',
    processes: ['PVD'], layers: ['Barrier'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 70, exportControlled: false, substitutability: 'Limited', recyclingRate: 20, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Powder', criticalProcesses: ['Refining'], alternativeMaterials: ['Titanium'] },
    companies: [
      { symbol: 'AMG', name: 'AMG Advanced Metallurgical', exchange: 'AMS', role: 'Producer', marketCap: '$1.5B', description: 'Major tantalum processor and recycler, vertically integrated.' },
      { symbol: 'MULN', name: 'Muelhan AG', exchange: 'ETR', role: 'Processor', marketCap: '$500M', description: 'Specialty tantalum products for electronics.' },
      { symbol: 'AVX', name: 'Kyocera AVX', exchange: 'NYSE', role: 'Consumer', marketCap: '$4B', description: 'World largest tantalum capacitor manufacturer.' }
    ]
  }
];

const SEMICONDUCTOR_ELEMENTS: CommodityDefinition[] = [
  {
    id: 'gallium', name: 'Gallium', category: CommodityCategory.SemiconductorElements,
    desc: 'Critical for GaN and GaAs chips.', producer: 'China', symbol: 'GA', price: 450, risk: 'Critical',
    processes: ['MOCVD'], layers: ['Active Layer'],
    supplyChainRisk: { primaryProducerShare: 98, top3ProducerShare: 99, exportControlled: true, substitutability: 'None', recyclingRate: 1, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '6N', form: 'Liquid Metal', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: '600459.SS', name: 'Guizhou Huaren', exchange: 'SHA', role: 'Producer', marketCap: '$2B', description: 'Chinese gallium producer, controls ~20% global supply.' },
      { symbol: 'CHINALCO', name: 'Aluminum Corp of China', exchange: 'HKG', role: 'Producer', marketCap: '$15B', description: 'Gallium byproduct from aluminum refining.' },
      { symbol: 'QCOM', name: 'Qualcomm', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$180B', description: 'Major GaAs chip consumer for 5G RF front-ends.' },
      { symbol: 'SWKS', name: 'Skyworks Solutions', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$15B', description: 'GaAs-based RF semiconductor manufacturer.' }
    ]
  },
  {
    id: 'germanium', name: 'Germanium', category: CommodityCategory.SemiconductorElements,
    desc: 'SiGe chips and fiber optics.', producer: 'China', symbol: 'GE', price: 1350, risk: 'Critical',
    processes: ['Epitaxy'], layers: ['Channel'],
    supplyChainRisk: { primaryProducerShare: 65, top3ProducerShare: 80, exportControlled: true, substitutability: 'Limited', recyclingRate: 30, stockpileDays: 45 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '5N', form: 'Ingot', criticalProcesses: ['Zone Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'UCG.BE', name: 'Umicore', exchange: 'EBR', role: 'Producer', marketCap: '$8B', description: 'Belgian materials company, major germanium recycler and refiner.' },
      { symbol: 'TECK', name: 'Teck Resources', exchange: 'NYSE', role: 'Producer', marketCap: '$20B', description: 'Canadian miner, germanium byproduct from zinc operations.' },
      { symbol: 'II-VI', name: 'Coherent (II-VI)', exchange: 'NYSE', role: 'Consumer', marketCap: '$8B', description: 'Major germanium consumer for infrared optics.' }
    ]
  },
  {
    id: 'indium', name: 'Indium', category: CommodityCategory.SemiconductorElements,
    desc: 'ITO and InP photonics.', producer: 'China', symbol: 'IN', price: 240, risk: 'Critical',
    processes: ['Sputtering'], layers: ['Transparent Conductors'],
    supplyChainRisk: { primaryProducerShare: 55, top3ProducerShare: 75, exportControlled: false, substitutability: 'None', recyclingRate: 15, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Ingot', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: '5765.T', name: 'JX Nippon Mining', exchange: 'TYO', role: 'Producer', marketCap: '$6B', description: 'Japanese indium producer, supplies ITO for displays.' },
      { symbol: 'NZYM.B', name: 'Nyrstar', exchange: 'EBR', role: 'Producer', marketCap: '$2B', description: 'Zinc smelter, indium byproduct.' },
      { symbol: 'LPL', name: 'LG Display', exchange: 'NYSE', role: 'Consumer', marketCap: '$5B', description: 'Major ITO consumer for OLED and LCD panels.' }
    ]
  }
];

const PRECIOUS_METALS: CommodityDefinition[] = [
  {
    id: 'gold', name: 'Gold', category: CommodityCategory.PreciousMetals,
    desc: 'Bonding wires and contacts.', producer: 'China', symbol: 'GC=F', price: 2000, risk: 'Stable', apiFunc: 'GOLD',
    processes: ['Wire Bonding'], layers: ['Packaging'],
    supplyChainRisk: { primaryProducerShare: 10, top3ProducerShare: 30, exportControlled: false, substitutability: 'Moderate', recyclingRate: 90, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Wire', criticalProcesses: ['Refining'], alternativeMaterials: ['Copper'] },
    companies: [
      { symbol: 'NEM', name: 'Newmont Corporation', exchange: 'NYSE', role: 'Producer', marketCap: '$40B', description: 'World largest gold producer, diversified global operations.' },
      { symbol: 'GOLD', name: 'Barrick Gold', exchange: 'NYSE', role: 'Producer', marketCap: '$30B', description: 'Major gold miner, operations across Americas and Africa.' },
      { symbol: 'ABX', name: 'Agnico Eagle Mines', exchange: 'NYSE', role: 'Producer', marketCap: '$25B', description: 'Canadian senior gold producer.' },
      { symbol: 'HMY', name: 'Harmony Gold', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'South African gold miner, deep-level operations.' }
    ]
  },
  {
    id: 'silver', name: 'Silver', category: CommodityCategory.PreciousMetals,
    desc: 'Pastes and plating.', producer: 'Mexico', symbol: 'SI=F', price: 23, risk: 'Stable', apiFunc: 'SILVER',
    processes: ['Sintering'], layers: ['Backside'],
    supplyChainRisk: { primaryProducerShare: 25, top3ProducerShare: 50, exportControlled: false, substitutability: 'Moderate', recyclingRate: 60, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: true, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Paste', criticalProcesses: ['Refining'], alternativeMaterials: ['Copper'] },
    companies: [
      { symbol: 'PAAS', name: 'Pan American Silver', exchange: 'NYSE', role: 'Producer', marketCap: '$8B', description: 'Largest primary silver producer in the world.' },
      { symbol: 'AG', name: 'First Majestic Silver', exchange: 'NYSE', role: 'Producer', marketCap: '$2B', description: 'Pure-play silver producer, Mexican operations.' },
      { symbol: 'WPM', name: 'Wheaton Precious Metals', exchange: 'NYSE', role: 'Producer', marketCap: '$20B', description: 'Silver and gold streaming company.' }
    ]
  },
  {
    id: 'platinum', name: 'Platinum', category: CommodityCategory.PreciousMetals,
    desc: 'Thin films and catalysts.', producer: 'South Africa', symbol: 'PL=F', price: 900, risk: 'Elevated', apiFunc: 'PLATINUM',
    processes: ['Deposition'], layers: ['Electrodes'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: false, substitutability: 'Limited', recyclingRate: 25, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '3N', form: 'Sponge', criticalProcesses: ['Refining'], alternativeMaterials: ['Palladium'] },
    companies: [
      { symbol: 'IMPUY', name: 'Impala Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$8B', description: 'Second largest platinum producer, South Africa.' },
      { symbol: 'ANGPY', name: 'Anglo American Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$20B', description: 'World largest primary platinum producer.' },
      { symbol: 'SBSW', name: 'Sibanye-Stillwater', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'Major PGM producer, South Africa and US operations.' }
    ]
  },
  {
    id: 'palladium', name: 'Palladium', category: CommodityCategory.PreciousMetals,
    desc: 'Plating and sensors.', producer: 'Russia', symbol: 'PA', price: 980, risk: 'Elevated',
    processes: ['Plating'], layers: ['Finishing'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'Limited', recyclingRate: 30, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '3N', form: 'Sponge', criticalProcesses: ['Refining'], alternativeMaterials: ['Platinum'] },
    companies: [
      { symbol: 'NILSY', name: 'Nornickel', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$30B', description: 'Russian mining giant, world largest palladium producer (40% share).' },
      { symbol: 'SBSW', name: 'Sibanye-Stillwater', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'US palladium from Stillwater mine, Montana.' }
    ]
  }
];

const PLATINUM_GROUP: CommodityDefinition[] = [
  {
    id: 'rhodium', name: 'Rhodium', category: CommodityCategory.PlatinumGroup,
    desc: 'Catalysts.', producer: 'South Africa', symbol: 'RH', price: 4500, risk: 'Critical',
    processes: ['Catalysis'], layers: ['None'],
    supplyChainRisk: { primaryProducerShare: 80, top3ProducerShare: 95, exportControlled: false, substitutability: 'None', recyclingRate: 30, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '3N', form: 'Sponge', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'ANGPY', name: 'Anglo American Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$20B', description: 'Largest rhodium producer as byproduct of platinum mining.' },
      { symbol: 'IMPUY', name: 'Impala Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$8B', description: 'Major rhodium producer, South African operations.' }
    ]
  },
  {
    id: 'ruthenium', name: 'Ruthenium', category: CommodityCategory.PlatinumGroup,
    desc: 'Advanced interconnects.', producer: 'South Africa', symbol: 'RU', price: 450, risk: 'Critical',
    processes: ['ALD'], layers: ['Interconnects'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: false, substitutability: 'None', recyclingRate: 10, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '4N', form: 'Precursor', criticalProcesses: ['Refining'], alternativeMaterials: ['Cobalt'] },
    companies: [
      { symbol: 'ANGPY', name: 'Anglo American Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$20B', description: 'Primary ruthenium supplier for semiconductor precursors.' },
      { symbol: 'JM.L', name: 'Johnson Matthey', exchange: 'LSE', role: 'Processor', marketCap: '$5B', description: 'Refines ruthenium into semiconductor-grade precursors.' },
      { symbol: 'INTC', name: 'Intel', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$200B', description: 'Evaluating ruthenium for sub-2nm interconnects.' }
    ]
  },
  {
    id: 'iridium', name: 'Iridium', category: CommodityCategory.PlatinumGroup,
    desc: 'Electrolyzer anodes.', producer: 'South Africa', symbol: 'IR', price: 5000, risk: 'Critical',
    processes: ['Electrolysis'], layers: ['Anode'],
    supplyChainRisk: { primaryProducerShare: 85, top3ProducerShare: 95, exportControlled: false, substitutability: 'None', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '3N', form: 'Powder', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'ANGPY', name: 'Anglo American Platinum', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$20B', description: 'Primary iridium source, critical for PEM electrolyzers.' },
      { symbol: 'BE', name: 'Bloom Energy', exchange: 'NYSE', role: 'Consumer', marketCap: '$3B', description: 'Fuel cell manufacturer, iridium catalyst consumer.' },
      { symbol: 'PLUG', name: 'Plug Power', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$5B', description: 'Green hydrogen company, electrolyzer iridium demand.' }
    ]
  }
];

const RARE_EARTHS: CommodityDefinition[] = [
  {
    id: 'neodymium', name: 'Neodymium', category: CommodityCategory.RareEarths,
    desc: 'Permanent magnets.', producer: 'China', symbol: 'ND', price: 65, risk: 'Critical',
    processes: ['Sintering'], layers: ['Magnets'],
    supplyChainRisk: { primaryProducerShare: 85, top3ProducerShare: 95, exportControlled: true, substitutability: 'None', recyclingRate: 1, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '3N', form: 'Metal', criticalProcesses: ['Separation'], alternativeMaterials: [] },
    companies: [
      { symbol: 'MP', name: 'MP Materials', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'Largest US rare earth producer, Mountain Pass mine.' },
      { symbol: '600111.SS', name: 'Northern Rare Earth', exchange: 'SSE', role: 'Producer', marketCap: '$15B', description: 'World largest rare earth producer, Chinese SOE.' },
      { symbol: 'LYC.AX', name: 'Lynas Rare Earths', exchange: 'ASX', role: 'Producer', marketCap: '$6B', description: 'Largest non-Chinese rare earth producer.' },
      { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$800B', description: 'EV motors use neodymium magnets in drive units.' }
    ]
  },
  {
    id: 'praseodymium', name: 'Praseodymium', category: CommodityCategory.RareEarths,
    desc: 'Magnet alloys.', producer: 'China', symbol: 'PR', price: 70, risk: 'Critical',
    processes: ['Alloying'], layers: ['Magnets'],
    supplyChainRisk: { primaryProducerShare: 85, top3ProducerShare: 95, exportControlled: true, substitutability: 'None', recyclingRate: 1, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '3N', form: 'Metal', criticalProcesses: ['Separation'], alternativeMaterials: [] },
    companies: [
      { symbol: 'MP', name: 'MP Materials', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'NdPr oxide producer, vertically integrating magnets.' },
      { symbol: 'LYC.AX', name: 'Lynas Rare Earths', exchange: 'ASX', role: 'Producer', marketCap: '$6B', description: 'Major NdPr supplier outside China.' },
      { symbol: 'VACN.SW', name: 'VAC', exchange: 'SWX', role: 'Processor', marketCap: '$2B', description: 'German rare earth magnet manufacturer.' }
    ]
  },
  {
    id: 'dysprosium', name: 'Dysprosium', category: CommodityCategory.RareEarths,
    desc: 'High-temp magnets.', producer: 'China', symbol: 'DY', price: 280, risk: 'Critical',
    processes: ['Alloying'], layers: ['Magnets'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '3N', form: 'Metal', criticalProcesses: ['Separation'], alternativeMaterials: [] },
    companies: [
      { symbol: '600111.SS', name: 'Northern Rare Earth', exchange: 'SSE', role: 'Producer', marketCap: '$15B', description: 'Dominant dysprosium producer, Baotou region.' },
      { symbol: 'UUUU', name: 'Energy Fuels', exchange: 'NYSE', role: 'Producer', marketCap: '$2B', description: 'US uranium/REE producer, heavy rare earth focus.' },
      { symbol: 'V', name: 'Vestas Wind', exchange: 'NYSE', role: 'Consumer', marketCap: '$25B', description: 'Wind turbine generator magnets require dysprosium.' }
    ]
  },
  {
    id: 'terbium', name: 'Terbium', category: CommodityCategory.RareEarths,
    desc: 'Magnet enhancement.', producer: 'China', symbol: 'TB', price: 1200, risk: 'Critical',
    processes: ['Alloying'], layers: ['Magnets'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '3N', form: 'Metal', criticalProcesses: ['Separation'], alternativeMaterials: [] },
    companies: [
      { symbol: '600111.SS', name: 'Northern Rare Earth', exchange: 'SSE', role: 'Producer', marketCap: '$15B', description: 'Primary terbium source, Chinese magnet supply chain.' },
      { symbol: 'UUUU', name: 'Energy Fuels', exchange: 'NYSE', role: 'Producer', marketCap: '$2B', description: 'Developing heavy REE separation in US.' }
    ]
  }
];

const BATTERY_MATERIALS: CommodityDefinition[] = [
  {
    id: 'lithium_carbonate', name: 'Lithium Carbonate', category: CommodityCategory.BatteryMaterials,
    desc: 'Cathode precursor.', producer: 'Chile', symbol: 'LCO', price: 15, risk: 'Critical',
    processes: ['Precipitation'], layers: ['Cathode'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'None', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '99.5%', form: 'Powder', criticalProcesses: ['Extraction'], alternativeMaterials: ['Sodium'] },
    companies: [
      { symbol: 'SQM', name: 'Sociedad Química y Minera', exchange: 'NYSE', role: 'Producer', marketCap: '$15B', description: 'Chilean lithium giant, Atacama salar operations.' },
      { symbol: 'ALB', name: 'Albemarle', exchange: 'NYSE', role: 'Producer', marketCap: '$15B', description: 'US lithium leader, Chile/Australia/US operations.' },
      { symbol: 'LTHM', name: 'Livent', exchange: 'NYSE', role: 'Producer', marketCap: '$3B', description: 'Pure-play lithium, Argentine brine extraction.' },
      { symbol: 'CATL', name: 'CATL', exchange: 'SZSE', role: 'Consumer', marketCap: '$150B', description: 'World largest battery manufacturer, lithium processing.' }
    ]
  },
  {
    id: 'lithium_hydroxide', name: 'Lithium Hydroxide', category: CommodityCategory.BatteryMaterials,
    desc: 'High-nickel cathodes.', producer: 'Australia', symbol: 'LIOH', price: 18, risk: 'Critical',
    processes: ['Conversion'], layers: ['Cathode'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 85, exportControlled: false, substitutability: 'None', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '56.5%', form: 'Powder', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'PLS.AX', name: 'Pilbara Minerals', exchange: 'ASX', role: 'Producer', marketCap: '$12B', description: 'Australian spodumene producer, lithium hydroxide feedstock.' },
      { symbol: 'ALB', name: 'Albemarle', exchange: 'NYSE', role: 'Producer', marketCap: '$15B', description: 'Major hydroxide converter, Kemerton plant Australia.' },
      { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$800B', description: 'Battery cells require battery-grade lithium hydroxide.' }
    ]
  },
  {
    id: 'graphite_natural', name: 'Natural Graphite', category: CommodityCategory.BatteryMaterials,
    desc: 'Anode material.', producer: 'China', symbol: 'GR-NAT', price: 0.8, risk: 'Critical',
    processes: ['Spheronization'], layers: ['Anode'],
    supplyChainRisk: { primaryProducerShare: 65, top3ProducerShare: 80, exportControlled: true, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 45 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '99.95%', form: 'Flake', criticalProcesses: ['Purification'], alternativeMaterials: ['Synthetic Graphite', 'Silicon'] },
    companies: [
      { symbol: 'SYA.AX', name: 'Syrah Resources', exchange: 'ASX', role: 'Producer', marketCap: '$800M', description: 'Mozambique graphite, Vidalia US anode facility.' },
      { symbol: 'NOU.V', name: 'Nouveau Monde Graphite', exchange: 'TSX-V', role: 'Producer', marketCap: '$400M', description: 'Quebec integrated graphite-to-anode project.' },
      { symbol: 'NVDA', name: 'NVIDIA', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$3T', description: 'AI data centers drive battery storage demand.' }
    ]
  },
  {
    id: 'lipf6', name: 'LiPF6', category: CommodityCategory.BatteryMaterials,
    desc: 'Electrolyte salt.', producer: 'China', symbol: 'LIPF6', price: 12, risk: 'Critical',
    processes: ['Synthesis'], layers: ['Electrolyte'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '99.9%', form: 'Crystal', criticalProcesses: ['Fluorination'], alternativeMaterials: [] },
    companies: [
      { symbol: 'ESGC', name: 'Enson Tech', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$500M', description: 'Electrolyte salt specialist, fluorine chemistry.' },
      { symbol: 'SOLT.V', name: 'Lithium Americas', exchange: 'TSX', role: 'Supplier', marketCap: '$2B', description: 'Lithium feedstock for LiPF6 synthesis.' }
    ]
  }
];

const SUPERCONDUCTOR_MATERIALS: CommodityDefinition[] = [
  {
    id: 'niobium', name: 'Niobium', category: CommodityCategory.SuperconductorMaterials,
    desc: 'LTS wires (NbTi, Nb3Sn).', producer: 'Brazil', symbol: 'NB', price: 45, risk: 'Critical',
    processes: ['Melting'], layers: ['Wire'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 60 },
    sectorDependencies: { semiconductors: false, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '3N', form: 'Ingot', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'CBMM', name: 'CBMM', exchange: 'Private', role: 'Producer', marketCap: '$15B', description: 'Brazilian company, controls 80% of global niobium supply.' },
      { symbol: 'VALE', name: 'Vale S.A.', exchange: 'NYSE', role: 'Producer', marketCap: '$70B', description: 'Produces niobium from Araxá, Brazil.' },
      { symbol: 'IBM', name: 'IBM', exchange: 'NYSE', role: 'Consumer', marketCap: '$150B', description: 'Quantum computers use niobium superconducting qubits.' }
    ]
  },
  {
    id: 'yttrium', name: 'Yttrium', category: CommodityCategory.SuperconductorMaterials,
    desc: 'REBCO HTS tapes.', producer: 'China', symbol: 'Y', price: 35, risk: 'Critical',
    processes: ['Deposition'], layers: ['Superconductor'],
    supplyChainRisk: { primaryProducerShare: 95, top3ProducerShare: 99, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: true, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Oxide', criticalProcesses: ['Separation'], alternativeMaterials: [] },
    companies: [
      { symbol: '600111.SS', name: 'Northern Rare Earth', exchange: 'SSE', role: 'Producer', marketCap: '$15B', description: 'Major yttrium producer, byproduct of REE processing.' },
      { symbol: 'AMSC', name: 'American Superconductor', exchange: 'NASDAQ', role: 'Processor', marketCap: '$1B', description: 'HTS wire manufacturer, YBCO tapes.' },
      { symbol: 'CFS', name: 'Commonwealth Fusion', exchange: 'Private', role: 'Consumer', marketCap: '$3B', description: 'Uses HTS magnets for tokamak fusion reactors.' }
    ]
  },
  {
    id: 'helium_liquid', name: 'Liquid Helium', category: CommodityCategory.SuperconductorMaterials,
    desc: 'Cryogenic cooling (4.2K).', producer: 'USA', symbol: 'LHE', price: 120, risk: 'Critical',
    processes: ['Liquefaction'], layers: ['Cooling'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 85, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Liquid', criticalProcesses: ['Extraction'], alternativeMaterials: [] },
    companies: [
      { symbol: 'APD', name: 'Air Products', exchange: 'NYSE', role: 'Producer', marketCap: '$65B', description: 'Global helium producer and distributor.' },
      { symbol: 'LIN', name: 'Linde', exchange: 'NYSE', role: 'Producer', marketCap: '$180B', description: 'Major helium supplier, Qatar/US operations.' },
      { symbol: 'GOOG', name: 'Alphabet', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$2T', description: 'Quantum computing division uses cryogenic helium.' }
    ]
  }
];

const INDUSTRIAL_GASES: CommodityDefinition[] = [
  {
    id: 'neon', name: 'Neon Gas', category: CommodityCategory.IndustrialGases,
    desc: 'DUV lithography buffer gas.', producer: 'Ukraine', symbol: 'NE', price: 150, risk: 'Critical',
    processes: ['Lithography'], layers: ['Patterning'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 70, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 90 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Gas', criticalProcesses: ['Distillation'], alternativeMaterials: [] },
    companies: [
      { symbol: 'LIN', name: 'Linde', exchange: 'NYSE', role: 'Producer', marketCap: '$180B', description: 'Ramping neon capacity to offset Ukraine supply disruption.' },
      { symbol: 'APD', name: 'Air Products', exchange: 'NYSE', role: 'Producer', marketCap: '$65B', description: 'Industrial gases including neon purification.' },
      { symbol: 'ASML', name: 'ASML', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$300B', description: 'DUV/EUV lithography systems require neon gas.' }
    ]
  },
  {
    id: 'helium_gas', name: 'Helium Gas', category: CommodityCategory.IndustrialGases,
    desc: 'Cooling and purging.', producer: 'USA', symbol: 'HE', price: 400, risk: 'Elevated',
    processes: ['Cooling'], layers: ['Chamber'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 75, exportControlled: false, substitutability: 'None', recyclingRate: 10, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '6N', form: 'Gas', criticalProcesses: ['Extraction'], alternativeMaterials: [] },
    companies: [
      { symbol: 'LIN', name: 'Linde', exchange: 'NYSE', role: 'Producer', marketCap: '$180B', description: 'Global helium leader, Qatar LNG byproduct.' },
      { symbol: 'APD', name: 'Air Products', exchange: 'NYSE', role: 'Producer', marketCap: '$65B', description: 'Major US helium producer, Texas/Wyoming fields.' },
      { symbol: 'IONQ', name: 'IonQ', exchange: 'NYSE', role: 'Consumer', marketCap: '$3B', description: 'Trapped ion quantum computers require helium cooling.' }
    ]
  },
  {
    id: 'nf3', name: 'Nitrogen Trifluoride', category: CommodityCategory.IndustrialGases,
    desc: 'Chamber cleaning gas.', producer: 'China', symbol: 'NF3', price: 80, risk: 'Elevated',
    processes: ['Cleaning'], layers: ['Chamber'],
    supplyChainRisk: { primaryProducerShare: 45, top3ProducerShare: 80, exportControlled: false, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Gas', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'SK.KR', name: 'SK Specialty', exchange: 'KRX', role: 'Producer', marketCap: '$4B', description: 'Korean specialty gas producer, major NF3 supplier.' },
      { symbol: 'ENTG', name: 'Entegris', exchange: 'NASDAQ', role: 'Supplier', marketCap: '$18B', description: 'Gas delivery systems and purification.' },
      { symbol: 'LRCX', name: 'Lam Research', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$100B', description: 'Etch/deposition tools use NF3 for chamber cleaning.' }
    ]
  },
  {
    id: 'silane', name: 'Silane', category: CommodityCategory.IndustrialGases,
    desc: 'Silicon deposition precursor.', producer: 'Japan', symbol: 'SIH4', price: 110, risk: 'Critical',
    processes: ['CVD'], layers: ['Silicon'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '6N', form: 'Gas', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'REC', name: 'REC Silicon', exchange: 'OSE', role: 'Producer', marketCap: '$800M', description: 'High-purity silane for semiconductor and solar.' },
      { symbol: '4063.T', name: 'Shin-Etsu Chemical', exchange: 'TSE', role: 'Producer', marketCap: '$80B', description: 'Major silane supplier, integrated silicon producer.' },
      { symbol: 'AMAT', name: 'Applied Materials', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$150B', description: 'CVD equipment uses silane as precursor.' }
    ]
  }
];

const SPECIALTY_CHEMICALS: CommodityDefinition[] = [
  {
    id: 'hf', name: 'Hydrofluoric Acid', category: CommodityCategory.SpecialtyChemicals,
    desc: 'Oxide etching.', producer: 'China', symbol: 'HF', price: 2.5, risk: 'Critical',
    processes: ['Etching'], layers: ['Oxide'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 85, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 15 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: 'UP-S', form: 'Liquid', criticalProcesses: ['Purification'], alternativeMaterials: [] },
    companies: [
      { symbol: 'SLCA', name: 'Stella Chemifa', exchange: 'TSE', role: 'Producer', marketCap: '$500M', description: 'Ultra-pure HF for semiconductor etching.' },
      { symbol: 'SHLX', name: 'Solvay', exchange: 'ENXT', role: 'Producer', marketCap: '$10B', description: 'Global fluorine chemistry leader.' },
      { symbol: 'TSM', name: 'TSMC', exchange: 'NYSE', role: 'Consumer', marketCap: '$700B', description: 'Largest semiconductor consumer of ultra-pure HF.' }
    ]
  },
  {
    id: 'photoresist_euv', name: 'EUV Photoresist', category: CommodityCategory.SpecialtyChemicals,
    desc: 'Patterning material.', producer: 'Japan', symbol: 'PR-EUV', price: 5000, risk: 'Critical',
    processes: ['Lithography'], layers: ['Patterning'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: 'Ultra', form: 'Liquid', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'JSR', name: 'JSR Corporation', exchange: 'TSE', role: 'Producer', marketCap: '$8B', description: 'Leading EUV photoresist developer, acquired by JIC.' },
      { symbol: 'TOKCF', name: 'Tokyo Ohka Kogyo', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$3B', description: 'Premium photoresist manufacturer for sub-3nm.' },
      { symbol: 'ASML', name: 'ASML', exchange: 'NASDAQ', role: 'Supplier', marketCap: '$300B', description: 'EUV scanner requires compatible photoresists.' }
    ]
  },
  {
    id: 'cmp_slurry', name: 'CMP Slurry', category: CommodityCategory.SpecialtyChemicals,
    desc: 'Planarization.', producer: 'USA', symbol: 'CMP', price: 45, risk: 'Elevated',
    processes: ['CMP'], layers: ['Interconnects'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Ultra', form: 'Slurry', criticalProcesses: ['Mixing'], alternativeMaterials: [] },
    companies: [
      { symbol: 'CCMP', name: 'CMC Materials', exchange: 'NASDAQ', role: 'Producer', marketCap: '$6B', description: 'CMP slurry market leader (acquired by Entegris).' },
      { symbol: 'ENTG', name: 'Entegris', exchange: 'NASDAQ', role: 'Producer', marketCap: '$18B', description: 'Specialty materials including CMP slurries.' },
      { symbol: '4186.T', name: 'Fujimi', exchange: 'TSE', role: 'Producer', marketCap: '$2B', description: 'Japanese CMP slurry manufacturer.' }
    ]
  }
];

const PACKAGING_MATERIALS: CommodityDefinition[] = [
  {
    id: 'abf_substrate', name: 'ABF Substrate', category: CommodityCategory.PackagingMaterials,
    desc: 'High-performance CPU/GPU packaging.', producer: 'Japan', symbol: 'ABF', price: 200, risk: 'Critical',
    processes: ['Packaging'], layers: ['Substrate'],
    supplyChainRisk: { primaryProducerShare: 95, top3ProducerShare: 99, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 15 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: 'N/A', form: 'Film', criticalProcesses: ['Lamination'], alternativeMaterials: [] },
    companies: [
      { symbol: 'AJINY', name: 'Ajinomoto', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$25B', description: 'Monopoly on ABF substrate material (Ajinomoto Build-up Film).' },
      { symbol: 'IBIDEN', name: 'Ibiden', exchange: 'TSE', role: 'Processor', marketCap: '$8B', description: 'Leading ABF substrate manufacturer for Intel/AMD.' },
      { symbol: 'NVDA', name: 'NVIDIA', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$3T', description: 'AI GPUs require high-layer ABF substrates.' }
    ]
  },
  {
    id: 'bonding_wire_au', name: 'Gold Bonding Wire', category: CommodityCategory.PackagingMaterials,
    desc: 'Interconnects.', producer: 'Japan', symbol: 'BW-AU', price: 2500, risk: 'Elevated',
    processes: ['Wire Bonding'], layers: ['Packaging'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'Moderate', recyclingRate: 10, stockpileDays: 20 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Wire', criticalProcesses: ['Drawing'], alternativeMaterials: ['Copper'] },
    companies: [
      { symbol: 'HXSCL', name: 'Heraeus', exchange: 'Private', role: 'Producer', marketCap: '$30B', description: 'German precious metals, bonding wire leader.' },
      { symbol: 'MKSI', name: 'MKS Instruments', exchange: 'NASDAQ', role: 'Supplier', marketCap: '$6B', description: 'Wire bonding equipment manufacturer.' },
      { symbol: 'TXN', name: 'Texas Instruments', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$180B', description: 'Analog chips use gold wire bonding.' }
    ]
  }
];

const ADVANCED_MATERIALS: CommodityDefinition[] = [
  {
    id: 'graphene', name: 'Graphene', category: CommodityCategory.AdvancedMaterials,
    desc: '2D material.', producer: 'Global', symbol: 'GRPH', price: 100, risk: 'Stable',
    processes: ['R&D'], layers: ['Active'],
    supplyChainRisk: { primaryProducerShare: 20, top3ProducerShare: 50, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 0 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Electronic', form: 'Sheet', criticalProcesses: ['CVD'], alternativeMaterials: [] },
    companies: [
      { symbol: 'GRPH', name: 'Graphene Manufacturing Group', exchange: 'TSX-V', role: 'Producer', marketCap: '$100M', description: 'Australian graphene producer, battery applications.' },
      { symbol: 'FGPHF', name: 'First Graphene', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$50M', description: 'Commercial graphene production, PureGRAPH brand.' },
      { symbol: 'SMSN.L', name: 'Samsung', exchange: 'LSE', role: 'Consumer', marketCap: '$300B', description: 'R&D on graphene batteries and transistors.' }
    ]
  },
  {
    id: 'quantum_dots', name: 'Quantum Dots', category: CommodityCategory.AdvancedMaterials,
    desc: 'Photonics.', producer: 'USA', symbol: 'QD', price: 500, risk: 'Elevated',
    processes: ['Synthesis'], layers: ['Photonics'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 80, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 0 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Electronic', form: 'Solution', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'NANX', name: 'Nanoco Group', exchange: 'LSE', role: 'Producer', marketCap: '$150M', description: 'Cadmium-free quantum dot technology.' },
      { symbol: 'SMSN.L', name: 'Samsung', exchange: 'LSE', role: 'Consumer', marketCap: '$300B', description: 'QLED displays use quantum dot technology.' },
      { symbol: 'OLED', name: 'Universal Display', exchange: 'NASDAQ', role: 'Supplier', marketCap: '$8B', description: 'Competes with QD in display tech space.' }
    ]
  }
];

const DOPANTS: CommodityDefinition[] = [
  {
    id: 'boron', name: 'Boron', category: CommodityCategory.Dopants,
    desc: 'P-type dopant for silicon.', producer: 'Turkey', symbol: 'B', price: 3.5, risk: 'Elevated',
    processes: ['Ion Implantation', 'Diffusion'], layers: ['Active'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 60 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '6N', form: 'Gas (B2H6)', criticalProcesses: ['Implantation'], alternativeMaterials: ['Aluminum'] },
    companies: [
      { symbol: 'ETI.IS', name: 'Eti Maden', exchange: 'BIST', role: 'Producer', marketCap: '$5B', description: 'Turkish state company, 70% of global boron reserves.' },
      { symbol: 'ENTG', name: 'Entegris', exchange: 'NASDAQ', role: 'Supplier', marketCap: '$18B', description: 'Ultra-pure diborane (B2H6) for ion implantation.' },
      { symbol: 'AMAT', name: 'Applied Materials', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$150B', description: 'Ion implantation equipment manufacturer.' }
    ]
  },
  {
    id: 'phosphorus', name: 'Phosphorus', category: CommodityCategory.Dopants,
    desc: 'N-type dopant for silicon.', producer: 'China', symbol: 'P', price: 2.8, risk: 'Elevated',
    processes: ['Ion Implantation', 'Diffusion'], layers: ['Active'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 85, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 45 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '6N', form: 'Gas (PH3)', criticalProcesses: ['Implantation'], alternativeMaterials: ['Arsenic'] },
    companies: [
      { symbol: 'VNTR', name: 'Venator Materials', exchange: 'NYSE', role: 'Producer', marketCap: '$200M', description: 'Specialty phosphorus compounds.' },
      { symbol: 'AXTA', name: 'Axalta', exchange: 'NYSE', role: 'Supplier', marketCap: '$8B', description: 'Electronic-grade phosphine supplier.' },
      { symbol: 'TSM', name: 'TSMC', exchange: 'NYSE', role: 'Consumer', marketCap: '$700B', description: 'Major consumer for n-type doping in advanced nodes.' }
    ]
  },
  {
    id: 'arsenic', name: 'Arsenic', category: CommodityCategory.Dopants,
    desc: 'N-type dopant, III-V compounds.', producer: 'China', symbol: 'AS', price: 1.5, risk: 'Critical',
    processes: ['Ion Implantation', 'MBE'], layers: ['Active'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: true, substitutability: 'Limited', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '7N', form: 'Gas (AsH3)', criticalProcesses: ['Epitaxy'], alternativeMaterials: ['Phosphorus'] },
    companies: [
      { symbol: 'UMC.TW', name: 'Umicore', exchange: 'ENXT', role: 'Producer', marketCap: '$10B', description: 'Semiconductor-grade arsenic compounds.' },
      { symbol: 'IIVI', name: 'Coherent', exchange: 'NYSE', role: 'Consumer', marketCap: '$7B', description: 'GaAs laser and photonics manufacturing.' },
      { symbol: 'SWKS', name: 'Skyworks', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$15B', description: 'GaAs RF components for 5G.' }
    ]
  },
  {
    id: 'antimony', name: 'Antimony', category: CommodityCategory.Dopants,
    desc: 'N-type dopant, thermoelectrics.', producer: 'China', symbol: 'SB', price: 12, risk: 'Critical',
    processes: ['Alloying', 'Implantation'], layers: ['Active'],
    supplyChainRisk: { primaryProducerShare: 80, top3ProducerShare: 95, exportControlled: true, substitutability: 'Limited', recyclingRate: 20, stockpileDays: 45 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: true, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Metal', criticalProcesses: ['Refining'], alternativeMaterials: [] },
    companies: [
      { symbol: 'HUNAN', name: 'Hunan Antimony', exchange: 'SZSE', role: 'Producer', marketCap: '$1B', description: 'Chinese antimony leader, 50% global supply.' },
      { symbol: 'USAS', name: 'Americas Gold and Silver', exchange: 'NYSE', role: 'Producer', marketCap: '$200M', description: 'North American antimony producer.' },
      { symbol: 'II-VI', name: 'Coherent', exchange: 'NYSE', role: 'Consumer', marketCap: '$7B', description: 'Thermoelectric materials manufacturing.' }
    ]
  }
];

const HYDROGEN_ECONOMY: CommodityDefinition[] = [
  {
    id: 'green_hydrogen', name: 'Green Hydrogen', category: CommodityCategory.HydrogenEconomy,
    desc: 'Electrolysis-produced H2.', producer: 'Global', symbol: 'H2-G', price: 5, risk: 'Elevated',
    processes: ['Electrolysis'], layers: ['Fuel'],
    supplyChainRisk: { primaryProducerShare: 20, top3ProducerShare: 50, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 3 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Gas', criticalProcesses: ['Electrolysis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'PLUG', name: 'Plug Power', exchange: 'NASDAQ', role: 'Producer', marketCap: '$5B', description: 'Green hydrogen production and fuel cells.' },
      { symbol: 'BE', name: 'Bloom Energy', exchange: 'NYSE', role: 'Producer', marketCap: '$3B', description: 'Solid oxide electrolyzer technology.' },
      { symbol: 'NEL.OL', name: 'Nel ASA', exchange: 'OSE', role: 'Producer', marketCap: '$2B', description: 'Norwegian electrolyzer manufacturer.' },
      { symbol: 'APD', name: 'Air Products', exchange: 'NYSE', role: 'Supplier', marketCap: '$65B', description: 'Hydrogen infrastructure and distribution.' }
    ]
  },
  {
    id: 'pem_membrane', name: 'PEM Membrane', category: CommodityCategory.HydrogenEconomy,
    desc: 'Proton exchange membrane.', producer: 'USA', symbol: 'PEM', price: 800, risk: 'Critical',
    processes: ['Extrusion'], layers: ['Membrane'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 90, exportControlled: false, substitutability: 'None', recyclingRate: 10, stockpileDays: 20 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: 'N/A', form: 'Film', criticalProcesses: ['Fluorination'], alternativeMaterials: [] },
    companies: [
      { symbol: 'CHMA', name: 'Chemours (Nafion)', exchange: 'NYSE', role: 'Producer', marketCap: '$5B', description: 'Nafion PEM membrane monopoly holder.' },
      { symbol: 'W.L.GF', name: 'W.L. Gore', exchange: 'Private', role: 'Producer', marketCap: '$5B', description: 'Gore-Select membrane technology.' },
      { symbol: 'BLDP', name: 'Ballard Power', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$1B', description: 'Fuel cell manufacturer, PEM consumer.' }
    ]
  },
  {
    id: 'catalyst_platinum_h2', name: 'Platinum Catalyst', category: CommodityCategory.HydrogenEconomy,
    desc: 'Fuel cell catalyst.', producer: 'South Africa', symbol: 'PT-CAT', price: 35000, risk: 'Critical',
    processes: ['Coating'], layers: ['Catalyst'],
    supplyChainRisk: { primaryProducerShare: 70, top3ProducerShare: 90, exportControlled: false, substitutability: 'Limited', recyclingRate: 50, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Nanoparticle', criticalProcesses: ['Coating'], alternativeMaterials: ['Iridium'] },
    companies: [
      { symbol: 'JM.L', name: 'Johnson Matthey', exchange: 'LSE', role: 'Producer', marketCap: '$5B', description: 'Global leader in fuel cell catalysts.' },
      { symbol: 'BASFY', name: 'BASF', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$45B', description: 'Catalyst technology for hydrogen applications.' },
      { symbol: 'HYLN', name: 'Hyliion', exchange: 'NYSE', role: 'Consumer', marketCap: '$500M', description: 'Hydrogen fuel cell trucks.' }
    ]
  },
  {
    id: 'carbon_fiber_h2', name: 'Carbon Fiber (H2 Tanks)', category: CommodityCategory.HydrogenEconomy,
    desc: 'Type IV hydrogen storage tanks.', producer: 'Japan', symbol: 'CF-H2', price: 25, risk: 'Elevated',
    processes: ['Winding'], layers: ['Tank'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 85, exportControlled: false, substitutability: 'None', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Aerospace', form: 'Fiber', criticalProcesses: ['Weaving'], alternativeMaterials: [] },
    companies: [
      { symbol: '3407.T', name: 'Toray Industries', exchange: 'TSE', role: 'Producer', marketCap: '$15B', description: 'World largest carbon fiber producer.' },
      { symbol: 'HEXC', name: 'Hexcel', exchange: 'NYSE', role: 'Producer', marketCap: '$6B', description: 'Aerospace-grade carbon fiber composites.' },
      { symbol: 'TM', name: 'Toyota', exchange: 'NYSE', role: 'Consumer', marketCap: '$250B', description: 'Mirai hydrogen fuel cell vehicle manufacturer.' }
    ]
  }
];

const SOLAR_MATERIALS: CommodityDefinition[] = [
  {
    id: 'solar_grade_silicon', name: 'Solar-Grade Silicon', category: CommodityCategory.SolarMaterials,
    desc: '6N-7N polysilicon for PV.', producer: 'China', symbol: 'SI-SOL', price: 8, risk: 'Stable',
    processes: ['Siemens Process'], layers: ['Wafer'],
    supplyChainRisk: { primaryProducerShare: 80, top3ProducerShare: 95, exportControlled: false, substitutability: 'None', recyclingRate: 10, stockpileDays: 45 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '7N', form: 'Chunk', criticalProcesses: ['Purification'], alternativeMaterials: [] },
    companies: [
      { symbol: 'GCL', name: 'GCL-Poly', exchange: 'HKEX', role: 'Producer', marketCap: '$8B', description: 'Chinese polysilicon giant, granular technology.' },
      { symbol: 'DAQO', name: 'Daqo New Energy', exchange: 'NYSE', role: 'Producer', marketCap: '$2B', description: 'High-purity polysilicon producer.' },
      { symbol: 'WCH.DE', name: 'Wacker Chemie', exchange: 'XETRA', role: 'Producer', marketCap: '$10B', description: 'German polysilicon, non-China alternative.' },
      { symbol: 'FSLR', name: 'First Solar', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$20B', description: 'US solar panel manufacturer.' }
    ]
  },
  {
    id: 'silver_paste', name: 'Silver Paste', category: CommodityCategory.SolarMaterials,
    desc: 'Front contact metallization.', producer: 'Japan', symbol: 'AG-PST', price: 900, risk: 'Elevated',
    processes: ['Screen Printing'], layers: ['Contact'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 75, exportControlled: false, substitutability: 'Limited', recyclingRate: 30, stockpileDays: 20 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Paste', criticalProcesses: ['Sintering'], alternativeMaterials: ['Copper'] },
    companies: [
      { symbol: 'HXSCL', name: 'Heraeus', exchange: 'Private', role: 'Producer', marketCap: '$30B', description: 'Market leader in solar silver paste.' },
      { symbol: 'DUPNT', name: 'DuPont', exchange: 'NYSE', role: 'Producer', marketCap: '$35B', description: 'Solamet silver paste product line.' },
      { symbol: 'JKS', name: 'JinkoSolar', exchange: 'NYSE', role: 'Consumer', marketCap: '$2B', description: 'World largest solar panel producer.' }
    ]
  },
  {
    id: 'eva_encapsulant', name: 'EVA Encapsulant', category: CommodityCategory.SolarMaterials,
    desc: 'Solar cell protection film.', producer: 'China', symbol: 'EVA', price: 2.5, risk: 'Stable',
    processes: ['Lamination'], layers: ['Encapsulant'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 80, exportControlled: false, substitutability: 'Moderate', recyclingRate: 5, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Solar', form: 'Film', criticalProcesses: ['Extrusion'], alternativeMaterials: ['POE'] },
    companies: [
      { symbol: '601138.SS', name: 'Hangzhou First', exchange: 'SSE', role: 'Producer', marketCap: '$5B', description: 'Chinese EVA film leader.' },
      { symbol: 'STLD', name: 'STR Holdings', exchange: 'Private', role: 'Producer', marketCap: '$500M', description: 'Solar encapsulant specialist.' },
      { symbol: 'CSIQ', name: 'Canadian Solar', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$2B', description: 'Major module manufacturer.' }
    ]
  },
  {
    id: 'perovskite_precursor', name: 'Perovskite Precursor', category: CommodityCategory.SolarMaterials,
    desc: 'Lead halide perovskite materials.', producer: 'Global', symbol: 'PROV', price: 500, risk: 'Elevated',
    processes: ['Deposition'], layers: ['Absorber'],
    supplyChainRisk: { primaryProducerShare: 30, top3ProducerShare: 60, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: false, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: false },
    materialProperties: { purityGrade: '4N', form: 'Powder', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'OXFDY', name: 'Oxford PV', exchange: 'Private', role: 'Producer', marketCap: '$500M', description: 'Perovskite-silicon tandem leader.' },
      { symbol: 'ENPH', name: 'Enphase Energy', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$25B', description: 'Evaluating perovskite integration.' },
      { symbol: 'SEDG', name: 'SolarEdge', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$5B', description: 'Solar inverter technology.' }
    ]
  }
];

const ALD_PRECURSORS: CommodityDefinition[] = [
  {
    id: 'tma', name: 'Trimethylaluminum (TMA)', category: CommodityCategory.ALDPrecursors,
    desc: 'Al2O3 ALD precursor.', producer: 'USA', symbol: 'TMA', price: 250, risk: 'Elevated',
    processes: ['ALD'], layers: ['Gate Oxide', 'Passivation'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 80, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 15 },
    sectorDependencies: { semiconductors: true, cleanEnergy: true, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '6N', form: 'Liquid', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'VRS', name: 'Versum Materials', exchange: 'Acquired', role: 'Producer', marketCap: 'N/A', description: 'Acquired by Merck KGaA, TMA leader.' },
      { symbol: 'MKKGY', name: 'Merck KGaA', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$60B', description: 'Global leader in ALD precursors.' },
      { symbol: 'LRCX', name: 'Lam Research', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$100B', description: 'ALD equipment manufacturer.' }
    ]
  },
  {
    id: 'tdmat', name: 'TDMAT', category: CommodityCategory.ALDPrecursors,
    desc: 'TiN ALD precursor.', producer: 'Japan', symbol: 'TDMAT', price: 400, risk: 'Critical',
    processes: ['ALD'], layers: ['Barrier', 'Electrode'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 85, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '5N', form: 'Liquid', criticalProcesses: ['Purification'], alternativeMaterials: ['TEMAT'] },
    companies: [
      { symbol: 'STREM', name: 'Strem Chemicals', exchange: 'Private', role: 'Producer', marketCap: '$100M', description: 'Specialty organometallic precursors.' },
      { symbol: '4063.T', name: 'Shin-Etsu Chemical', exchange: 'TSE', role: 'Producer', marketCap: '$80B', description: 'Japanese electronic materials giant.' },
      { symbol: 'INTC', name: 'Intel', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$200B', description: 'Advanced node ALD processes.' }
    ]
  },
  {
    id: 'temaz', name: 'TEMAZ', category: CommodityCategory.ALDPrecursors,
    desc: 'ZrO2 high-k ALD precursor.', producer: 'USA', symbol: 'TEMAZ', price: 600, risk: 'Critical',
    processes: ['ALD'], layers: ['Gate Oxide'],
    supplyChainRisk: { primaryProducerShare: 45, top3ProducerShare: 80, exportControlled: true, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: true },
    materialProperties: { purityGrade: '5N', form: 'Liquid', criticalProcesses: ['Synthesis'], alternativeMaterials: ['TDMAZ'] },
    companies: [
      { symbol: 'MKKGY', name: 'Merck KGaA', exchange: 'OTCMKTS', role: 'Producer', marketCap: '$60B', description: 'High-k dielectric precursor supplier.' },
      { symbol: 'AMSC', name: 'Air Liquide', exchange: 'ENXT', role: 'Producer', marketCap: '$90B', description: 'Electronic specialty gases and precursors.' },
      { symbol: 'TSM', name: 'TSMC', exchange: 'NYSE', role: 'Consumer', marketCap: '$700B', description: 'High-k metal gate process leader.' }
    ]
  },
  {
    id: 'ru_precursor', name: 'Ruthenium Precursor', category: CommodityCategory.ALDPrecursors,
    desc: 'Ru interconnect ALD.', producer: 'Belgium', symbol: 'RU-ALD', price: 2000, risk: 'Critical',
    processes: ['ALD'], layers: ['Interconnects'],
    supplyChainRisk: { primaryProducerShare: 60, top3ProducerShare: 90, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: true, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: false, aiInfrastructure: true },
    materialProperties: { purityGrade: '5N', form: 'Liquid', criticalProcesses: ['Synthesis'], alternativeMaterials: [] },
    companies: [
      { symbol: 'JM.L', name: 'Johnson Matthey', exchange: 'LSE', role: 'Producer', marketCap: '$5B', description: 'PGM precursor synthesis.' },
      { symbol: 'UMC.BB', name: 'Umicore', exchange: 'ENXT', role: 'Producer', marketCap: '$10B', description: 'Ruthenium precursor development.' },
      { symbol: 'INTC', name: 'Intel', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$200B', description: 'Ruthenium interconnect R&D for sub-2nm.' }
    ]
  }
];

const QUANTUM_MATERIALS: CommodityDefinition[] = [
  {
    id: 'dilution_fridge_he3', name: 'Helium-3', category: CommodityCategory.QuantumMaterials,
    desc: 'Dilution refrigerator coolant.', producer: 'USA', symbol: 'HE3', price: 2000, risk: 'Critical',
    processes: ['Dilution'], layers: ['Cooling'],
    supplyChainRisk: { primaryProducerShare: 80, top3ProducerShare: 95, exportControlled: true, substitutability: 'None', recyclingRate: 90, stockpileDays: 60 },
    sectorDependencies: { semiconductors: false, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Gas', criticalProcesses: ['Tritium Decay'], alternativeMaterials: [] },
    companies: [
      { symbol: 'DOE', name: 'US DOE', exchange: 'Government', role: 'Producer', marketCap: 'N/A', description: 'Primary global He-3 source from tritium decay.' },
      { symbol: 'BLDR', name: 'Bluefors', exchange: 'Private', role: 'Consumer', marketCap: '$500M', description: 'Dilution refrigerator manufacturer.' },
      { symbol: 'IBM', name: 'IBM', exchange: 'NYSE', role: 'Consumer', marketCap: '$150B', description: 'Quantum computer systems require mK cooling.' }
    ]
  },
  {
    id: 'josephson_junction', name: 'Josephson Junction Material', category: CommodityCategory.QuantumMaterials,
    desc: 'Al/AlOx/Al superconducting junctions.', producer: 'USA', symbol: 'JJ', price: 5000, risk: 'Critical',
    processes: ['Shadow Evaporation'], layers: ['Qubit'],
    supplyChainRisk: { primaryProducerShare: 50, top3ProducerShare: 85, exportControlled: true, substitutability: 'None', recyclingRate: 0, stockpileDays: 10 },
    sectorDependencies: { semiconductors: false, cleanEnergy: false, batteries: false, superconductors: true, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '6N', form: 'Thin Film', criticalProcesses: ['Oxidation'], alternativeMaterials: [] },
    companies: [
      { symbol: 'GOOG', name: 'Alphabet (Google Quantum)', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$2T', description: 'Sycamore quantum processor development.' },
      { symbol: 'IBM', name: 'IBM', exchange: 'NYSE', role: 'Consumer', marketCap: '$150B', description: 'Transmon qubit manufacturing.' },
      { symbol: 'RIGR', name: 'Rigetti Computing', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$200M', description: 'Superconducting qubit systems.' }
    ]
  },
  {
    id: 'trapped_ion_ytterbium', name: 'Ytterbium Ions', category: CommodityCategory.QuantumMaterials,
    desc: 'Trapped ion qubit atoms.', producer: 'China', symbol: 'YB', price: 1500, risk: 'Critical',
    processes: ['Purification'], layers: ['Qubit'],
    supplyChainRisk: { primaryProducerShare: 90, top3ProducerShare: 98, exportControlled: true, substitutability: 'Limited', recyclingRate: 0, stockpileDays: 30 },
    sectorDependencies: { semiconductors: false, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: '5N', form: 'Metal', criticalProcesses: ['Separation'], alternativeMaterials: ['Barium', 'Calcium'] },
    companies: [
      { symbol: 'IONQ', name: 'IonQ', exchange: 'NYSE', role: 'Consumer', marketCap: '$3B', description: 'Trapped ion quantum computer leader.' },
      { symbol: 'QNCC', name: 'Quantinuum', exchange: 'Private', role: 'Consumer', marketCap: '$5B', description: 'Honeywell quantum spin-off, Yb ions.' },
      { symbol: '600111.SS', name: 'Northern Rare Earth', exchange: 'SSE', role: 'Producer', marketCap: '$15B', description: 'Ytterbium separation from rare earths.' }
    ]
  },
  {
    id: 'diamond_nv_center', name: 'NV Diamond', category: CommodityCategory.QuantumMaterials,
    desc: 'Nitrogen-vacancy diamond qubits.', producer: 'USA', symbol: 'NV-D', price: 10000, risk: 'Elevated',
    processes: ['CVD Growth', 'Implantation'], layers: ['Qubit'],
    supplyChainRisk: { primaryProducerShare: 40, top3ProducerShare: 70, exportControlled: false, substitutability: 'None', recyclingRate: 0, stockpileDays: 20 },
    sectorDependencies: { semiconductors: false, cleanEnergy: false, batteries: false, superconductors: false, quantumComputing: true, aiInfrastructure: false },
    materialProperties: { purityGrade: 'Electronic', form: 'Crystal', criticalProcesses: ['Ion Implantation'], alternativeMaterials: ['SiC'] },
    companies: [
      { symbol: 'ELMS', name: 'Element Six', exchange: 'Private', role: 'Producer', marketCap: '$1B', description: 'De Beers synthetic diamond division.' },
      { symbol: 'QBTS', name: 'D-Wave Quantum', exchange: 'NYSE', role: 'Consumer', marketCap: '$300M', description: 'Exploring diamond NV sensors.' },
      { symbol: 'QSI', name: 'Quantum-Si', exchange: 'NASDAQ', role: 'Consumer', marketCap: '$500M', description: 'Quantum sensing applications.' }
    ]
  }
];

const ALL_COMMODITIES = [
  ...RAW_SILICON,
  ...CRITICAL_METALS,
  ...SEMICONDUCTOR_ELEMENTS,
  ...PRECIOUS_METALS,
  ...PLATINUM_GROUP,
  ...RARE_EARTHS,
  ...BATTERY_MATERIALS,
  ...SUPERCONDUCTOR_MATERIALS,
  ...INDUSTRIAL_GASES,
  ...SPECIALTY_CHEMICALS,
  ...PACKAGING_MATERIALS,
  ...ADVANCED_MATERIALS,
  ...DOPANTS,
  ...HYDROGEN_ECONOMY,
  ...SOLAR_MATERIALS,
  ...ALD_PRECURSORS,
  ...QUANTUM_MATERIALS
];

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

// Generate Forecasting Data with Confidence Intervals
const generateAvailabilityForecast = (riskLevel: string, volatility: string): AvailabilityMetric[] => {
    const months = ['M+1', 'M+2', 'M+3', 'M+4', 'M+5', 'M+6'];
    const baseScore = riskLevel === 'Critical' ? 30 : riskLevel === 'Elevated' ? 60 : 85;
    
    return months.map((m, idx) => {
        // Random fluctuation based on volatility
        const variance = volatility === 'High' ? 40 : volatility === 'Medium' ? 20 : 10;
        const randomShift = (Math.random() - 0.5) * variance;
        let score = Math.max(0, Math.min(100, baseScore + randomShift));
        
        // Confidence interval widens over time (uncertainty increases)
        const margin = (variance * 0.5) + (idx * 5); 
        const lowerBound = Math.max(0, score - margin);
        const upperBound = Math.min(100, score + margin);

        let status: 'Surplus' | 'Stable' | 'Tight' | 'Shortage';
        if (score < 30) status = 'Shortage';
        else if (score < 60) status = 'Tight';
        else if (score < 80) status = 'Stable';
        else status = 'Surplus';

        return { 
          month: m, 
          status, 
          score: Math.floor(score),
          lowerBound: Math.floor(lowerBound),
          upperBound: Math.floor(upperBound)
        };
    });
};

// Fetch real data from Alpha Vantage with timeout and error handling
const fetchRealData = async (apiFunc: string): Promise<PricePoint[] | null> => {
  try {
    // 3 second timeout to prevent hanging on slow API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT_MS);

    const response = await fetch(
        `${CONFIG.API.BASE_URL}?function=${apiFunc}&interval=monthly&apikey=${CONFIG.API.KEY}`,
        { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
        return data.data.slice(0, 30).reverse().map((pt: { date: string; value: string }) => ({
            date: new Date(pt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: parseFloat(pt.value)
        }));
    }
    return null;
  } catch (error) {
    // Silent fail to fallback
    return null;
  }
};

export const getCommodities = async (): Promise<Commodity[]> => {
  const commodities: Commodity[] = [];

  for (const def of ALL_COMMODITIES) {
      let history: PricePoint[] | null = null;

      if (def.apiFunc) {
          history = await fetchRealData(def.apiFunc);
      }

      // Fallback if API fails or no API func
      if (!history || history.length === 0) {
          history = generateSimulation(def.price, def.risk === 'Critical' ? 0.05 : 0.03);
      }
      
      const currentPrice = history[history.length - 1].value;
      const prevPrice = history[history.length - 2].value;
      const change = currentPrice - prevPrice;
      const changePercent = (change / prevPrice) * 100;

      // Determine Volatility dynamically
      const vol = Math.abs(changePercent) > 5 ? 'High' : Math.abs(changePercent) > 2 ? 'Medium' : 'Low';

      commodities.push({
          id: def.id,
          symbol: def.symbol,
          name: def.name,
          category: def.category,
          price: currentPrice,
          currency: def.price > 1000 ? 'USD/t' : 'USD/kg',
          change24h: parseFloat(change.toFixed(2)),
          changePercentage: parseFloat(changePercent.toFixed(2)),
          volatility: vol,
          riskLevel: def.risk,
          description: def.desc,
          topProducer: def.producer,
          history: history,
          forecast: generateAvailabilityForecast(def.risk, vol),
          forecastConfidence: 85,
          usage: {
              processes: def.processes,
              layers: def.layers
          },
          supplyChainRisk: def.supplyChainRisk,
          sectorDependencies: def.sectorDependencies,
          materialProperties: def.materialProperties,
          relatedCompanies: def.companies
      });
  }

  return commodities;
};

interface RiskAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  affectedMaterials: string[];
  timestamp: string;
  category: 'geopolitical' | 'supply' | 'price' | 'logistics';
}

// Calculate aggregate risk score from commodity data
const calculateCategoryRisk = (commodities: CommodityDefinition[], category: CommodityCategory): number => {
  const items = commodities.filter(c => c.category === category);
  if (items.length === 0) return 50; // neutral baseline
  
  let totalRisk = 0;
  items.forEach(item => {
    const risk = item.supplyChainRisk;
    // Weighted risk formula
    const concentrationRisk = (risk.primaryProducerShare * 0.4) + (risk.top3ProducerShare * 0.2);
    const controlRisk = risk.exportControlled ? 20 : 0;
    const substitutionRisk = risk.substitutability === 'None' ? 25 : risk.substitutability === 'Limited' ? 15 : 5;
    const bufferRisk = Math.max(0, 30 - risk.stockpileDays) * 0.5;
    
    totalRisk += concentrationRisk + controlRisk + substitutionRisk + bufferRisk;
  });
  
  return Math.min(100, Math.round(totalRisk / items.length));
};

// Calculate sector-specific risk
const calculateSectorRisk = (commodities: CommodityDefinition[], sector: keyof SectorDependencies): number => {
  const relevantItems = commodities.filter(c => c.sectorDependencies[sector]);
  if (relevantItems.length === 0) return 30;
  
  let riskSum = 0;
  relevantItems.forEach(item => {
    const baseRisk = item.risk === 'Critical' ? 85 : item.risk === 'Elevated' ? 60 : 35;
    const concentrationPenalty = item.supplyChainRisk.primaryProducerShare > 60 ? 15 : 0;
    riskSum += baseRisk + concentrationPenalty;
  });
  
  return Math.min(100, Math.round(riskSum / relevantItems.length));
};

// Generate real-time alerts based on thresholds
export const getRiskAlerts = async (): Promise<RiskAlert[]> => {
  const allCommodities = ALL_COMMODITIES;
  
  const alerts: RiskAlert[] = [];
  const now = new Date().toISOString();
  
  // Check for critical materials
  const criticalItems = allCommodities.filter(c => c.risk === 'Critical');
  if (criticalItems.length > 5) {
    alerts.push({
      id: 'alert-critical-mass',
      severity: 'critical',
      title: 'Multiple Critical Materials',
      message: `${criticalItems.length} materials are at critical supply levels. Immediate procurement review recommended.`,
      affectedMaterials: criticalItems.slice(0, 5).map(c => c.name),
      timestamp: now,
      category: 'supply'
    });
  }
  
  // Check for high concentration risks
  const highConcentration = allCommodities.filter(c => c.supplyChainRisk.primaryProducerShare > 70);
  if (highConcentration.length > 0) {
    alerts.push({
      id: 'alert-concentration',
      severity: 'warning',
      title: 'Supply Concentration Risk',
      message: `${highConcentration.length} materials have >70% single-country production concentration.`,
      affectedMaterials: highConcentration.map(c => c.name),
      timestamp: now,
      category: 'geopolitical'
    });
  }
  
  // Check for export controlled materials
  const exportControlled = allCommodities.filter(c => c.supplyChainRisk.exportControlled);
  if (exportControlled.length > 10) {
    alerts.push({
      id: 'alert-export-controls',
      severity: 'warning',
      title: 'Export Control Exposure',
      message: `${exportControlled.length} tracked materials are subject to export controls.`,
      affectedMaterials: exportControlled.slice(0, 8).map(c => c.name),
      timestamp: now,
      category: 'geopolitical'
    });
  }
  
  // Low stockpile warning
  const lowStockpile = allCommodities.filter(c => c.supplyChainRisk.stockpileDays < 30);
  if (lowStockpile.length > 0) {
    alerts.push({
      id: 'alert-stockpile',
      severity: 'info',
      title: 'Low Buffer Stock',
      message: `${lowStockpile.length} materials have less than 30 days of strategic reserve.`,
      affectedMaterials: lowStockpile.slice(0, 6).map(c => c.name),
      timestamp: now,
      category: 'logistics'
    });
  }
  
  return alerts;
};

export const getSupplyChainIndices = async (): Promise<SupplyChainIndex[]> => {
  const allCommodities = ALL_COMMODITIES;
  
  // Calculate dynamic indices
  const semiRisk = calculateSectorRisk(allCommodities, 'semiconductors');
  const cleanEnergyRisk = calculateSectorRisk(allCommodities, 'cleanEnergy');
  const batteryRisk = calculateSectorRisk(allCommodities, 'batteries');
  const aiRisk = calculateSectorRisk(allCommodities, 'aiInfrastructure');
  
  const rareEarthRisk = calculateCategoryRisk(allCommodities, CommodityCategory.RareEarths);
  const criticalMetalsRisk = calculateCategoryRisk(allCommodities, CommodityCategory.CriticalMetals);
  
  // Add small random variance to simulate live updates
  const variance = () => (Math.random() - 0.5) * 2;
  
  return [
    {
      id: 'sci-semi-global',
      name: 'Semiconductor Supply Stress',
      value: Math.round(semiRisk + variance()),
      change: parseFloat((variance() * 1.5).toFixed(1)),
      unit: 'pts',
      description: 'Aggregate supply chain stress across all semiconductor materials',
      dataSource: 'SemiTrace Analytics'
    },
    {
      id: 'sci-ai-infra',
      name: 'AI Infrastructure Index',
      value: Math.round(aiRisk + variance()),
      change: parseFloat((variance() * 2).toFixed(1)),
      unit: 'pts',
      description: 'Material availability for AI/HPC systems',
      dataSource: 'SemiTrace Analytics'
    },
    {
      id: 'sci-rare-earth',
      name: 'Rare Earth Availability',
      value: Math.round(100 - rareEarthRisk + variance()),
      change: parseFloat((variance()).toFixed(1)),
      unit: 'pts',
      description: 'Rare earth element supply security score',
      dataSource: 'SemiTrace Analytics'
    },
    {
      id: 'sci-clean-energy',
      name: 'Clean Energy Materials',
      value: Math.round(cleanEnergyRisk + variance()),
      change: parseFloat((variance() * 1.2).toFixed(1)),
      unit: 'pts',
      description: 'Supply risk for solar, battery, and hydrogen materials',
      dataSource: 'SemiTrace Analytics'
    },
    {
      id: 'sci-battery',
      name: 'Battery Supply Chain',
      value: Math.round(batteryRisk + variance()),
      change: parseFloat((variance() * 1.8).toFixed(1)),
      unit: 'pts',
      description: 'Critical battery material supply stress',
      dataSource: 'SemiTrace Analytics'
    },
    {
      id: 'sci-critical-metals',
      name: 'Critical Metals Index',
      value: Math.round(100 - criticalMetalsRisk + variance()),
      change: parseFloat((variance()).toFixed(1)),
      unit: 'pts',
      description: 'Availability score for critical industrial metals',
      dataSource: 'SemiTrace Analytics'
    }
  ];
};

export const getGeoRisks = async (): Promise<GeoRisk[]> => {
  const allCommodities = ALL_COMMODITIES;
  
  // Group commodities by producer country and calculate risk
  const countryData: Record<string, { materials: string[], riskSum: number, count: number }> = {};
  
  allCommodities.forEach(c => {
    const country = c.producer;
    if (!countryData[country]) {
      countryData[country] = { materials: [], riskSum: 0, count: 0 };
    }
    countryData[country].materials.push(c.name);
    countryData[country].riskSum += c.supplyChainRisk.primaryProducerShare + (c.supplyChainRisk.exportControlled ? 20 : 0);
    countryData[country].count++;
  });
  
  const geoRisks: GeoRisk[] = Object.entries(countryData)
    .map(([country, data]) => ({
      country,
      riskScore: Math.min(100, Math.round(data.riskSum / data.count)),
      controlledMaterials: data.materials.slice(0, 6),
      description: generateCountryDescription(country, data.materials.length)
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10); // Top 10 risk countries
  
  return geoRisks;
};

const generateCountryDescription = (country: string, materialCount: number): string => {
  const descriptions: Record<string, string> = {
    'China': 'Dominant supplier of rare earths, gallium, and germanium. Export controls on critical semiconductor inputs remain in effect.',
    'DRC': 'Primary source of artisanal cobalt. Political instability and ESG concerns create chronic supply volatility.',
    'Russia': 'Key supplier of palladium and neon gas. Ongoing sanctions create supply uncertainty for western fabs.',
    'South Africa': 'Controls majority of platinum group metals. Power grid instability affects mining operations.',
    'Chile': 'Major copper producer. Water rights and environmental regulations impact expansion capacity.',
    'Australia': 'Significant lithium and rare earth reserves. Long shipping distances to Asian markets.',
    'Japan': 'Critical wafer and specialty chemical supplier. Earthquake and tsunami risk to coastal facilities.',
    'USA': 'Reshoring efforts face permitting and labor challenges. Water scarcity in Arizona fab corridor.',
    'Taiwan': 'Produces >90% of advanced logic chips. Geopolitical tensions create strategic vulnerability.',
    'Germany': 'Key specialty chemical and gas supplier. Energy cost volatility affects production economics.'
  };
  
  return descriptions[country] || `Supplies ${materialCount} tracked materials. Regional factors may affect supply continuity.`;
};
