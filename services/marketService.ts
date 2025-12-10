
import { Commodity, CommodityCategory, PricePoint, PowerHub, GlobalEnergyMetrics, PowerForecast, AvailabilityMetric, ToolingEntity } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Commodities to fetch with their API function mapping
const COMMODITY_MAP: Record<string, { 
    func: string, 
    name: string, 
    category: CommodityCategory, 
    desc: string, 
    producer: string, 
    symbol: string,
    processes: string[],
    layers: string[]
}> = {
  'COPPER': { 
    func: 'COPPER', 
    name: 'Copper (HG)', 
    category: CommodityCategory.CriticalMetals,
    desc: 'Primary interconnect material replacing aluminum in most logic chips.',
    producer: 'Chile',
    symbol: 'HG=F',
    processes: ['Dual-Damascene Plating', 'CMP'],
    layers: ['BEOL Interconnects', 'Through-Silicon Vias (TSV)']
  },
  'ALUMINUM': { 
    func: 'ALUMINUM', 
    name: 'Aluminum', 
    category: CommodityCategory.CriticalMetals,
    desc: 'Used in legacy nodes and specific pad layers.',
    producer: 'China',
    symbol: 'ALI=F',
    processes: ['PVD Sputtering', 'Pad Etching'],
    layers: ['Bond Pads', 'Top Metal Layers', 'Legacy Wiring']
  },
  'GOLD': { 
    func: 'GOLD', 
    name: 'Gold', 
    category: CommodityCategory.PreciousMetals,
    desc: 'Corrosion-resistant bonding wires for packaging.',
    producer: 'China/Australia',
    symbol: 'GC=F',
    processes: ['Wire Bonding', 'Eutectic Die Attach'],
    layers: ['Packaging', 'Contacts', 'Bump Plating']
  },
  'SILVER': { 
    func: 'SILVER', 
    name: 'Silver', 
    category: CommodityCategory.PreciousMetals,
    desc: 'High conductivity pastes and lead frame plating.',
    producer: 'Mexico',
    symbol: 'SI=F',
    processes: ['Sintering', 'Epoxy Die Attach'],
    layers: ['Backside Metallization', 'Lead Frames']
  },
  'PLATINUM': { 
    func: 'PLATINUM', 
    name: 'Platinum', 
    category: CommodityCategory.PreciousMetals,
    desc: 'Critical for thin-film deposition and hard disk drives.',
    producer: 'South Africa',
    symbol: 'PL=F',
    processes: ['Thin Film Deposition', 'Silicide Formation'],
    layers: ['Schottky Diodes', 'MRAM Electrodes']
  },
  'NATURAL_GAS': { 
    func: 'NATURAL_GAS', 
    name: 'Natural Gas', 
    category: CommodityCategory.Chemicals,
    desc: 'Energy feedstock for high-temperature furnace operations.',
    producer: 'USA/Russia',
    symbol: 'NG=F',
    processes: ['Thermal Oxidation', 'Annealing', 'Abatement'],
    layers: ['Facility Operations', 'Base Infrastructure']
  }
};

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
const fetchRealData = async (commodityKey: string): Promise<PricePoint[] | null> => {
  try {
    // 3 second timeout to prevent hanging on slow API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
        `${BASE_URL}?function=${COMMODITY_MAP[commodityKey].func}&interval=monthly&apikey=${API_KEY}`,
        { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
        return data.data.slice(0, 30).reverse().map((pt: any) => ({
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

  // 1. Fetch Real Base Metals (with Simulation Fallback)
  for (const [key, config] of Object.entries(COMMODITY_MAP)) {
      let history = await fetchRealData(key);

      // Fallback if API fails
      if (!history || history.length === 0) {
          const basePrice = key === 'COPPER' ? 4.12 : key === 'ALUMINUM' ? 2300 : key === 'GOLD' ? 2000 : key === 'SILVER' ? 23 : 900;
          history = generateSimulation(basePrice, 0.03);
      }
      
      const currentPrice = history[history.length - 1].value;
      const prevPrice = history[history.length - 2].value;
      const change = currentPrice - prevPrice;
      const changePercent = (change / prevPrice) * 100;

      // Determine Volatility/Risk dynamically for display
      const vol = Math.abs(changePercent) > 5 ? 'High' : Math.abs(changePercent) > 2 ? 'Medium' : 'Low';
      const risk = key === 'ALUMINUM' || key === 'PLATINUM' ? 'Elevated' : 'Stable';

      commodities.push({
          id: key.toLowerCase(),
          symbol: config.symbol,
          name: config.name,
          category: config.category,
          price: currentPrice,
          currency: 'USD',
          change24h: parseFloat(change.toFixed(2)),
          changePercentage: parseFloat(changePercent.toFixed(2)),
          volatility: vol,
          riskLevel: risk,
          description: config.desc,
          topProducer: config.producer,
          history: history,
          forecast: generateAvailabilityForecast(risk, vol),
          forecastConfidence: 92,
          usage: {
              processes: config.processes,
              layers: config.layers
          }
      });
  }

  // 2. Add Specialized Semiconductor Commodities (Simulated/Modeled)
  const SPECIALTY_COMMODITIES = [
    {
        id: 'si',
        name: 'Polysilicon (9N)',
        price: 24.50,
        cat: CommodityCategory.RawSilicon,
        desc: 'Ultra-pure silicon (9N+) used as the base substrate for wafers.',
        producer: 'China',
        risk: 'Elevated',
        processes: ['Czochralski Crystal Growth', 'Wafer Slicing'],
        layers: ['Substrate', 'Bulk Silicon']
    },
    {
        id: 'ne',
        name: 'Neon Gas',
        price: 150.00,
        cat: CommodityCategory.Chemicals,
        desc: 'Buffer gas for DUV lithography lasers. Supply restricted by war.',
        producer: 'Ukraine',
        risk: 'Critical',
        processes: ['DUV Lithography', 'Excimer Laser Light Source'],
        layers: ['Critical Patterning', 'Active Areas']
    },
    {
        id: 'he',
        name: 'Helium',
        price: 400.00,
        cat: CommodityCategory.Chemicals,
        desc: 'Super-coolant for superconducting magnets and wafer cooling.',
        producer: 'USA/Qatar',
        risk: 'Elevated',
        processes: ['Cryogenic Cooling', 'Chamber Purging'],
        layers: ['Superconducting Magnets', 'Backside Cooling']
    },
    {
        id: 'co',
        name: 'Cobalt',
        price: 28500,
        cat: CommodityCategory.CriticalMetals,
        desc: 'Essential for advanced node barrier layers and battery tech.',
        producer: 'DRC',
        risk: 'Critical',
        processes: ['CVD Deposition', 'Barrier Formation'],
        layers: ['Advanced Node Contacts (M0)', 'Interconnect Liners']
    },
    {
        id: 'w',
        name: 'Tungsten',
        price: 320.00,
        cat: CommodityCategory.CriticalMetals,
        desc: 'High-density metal for contacts and vertical interconnects (vias).',
        producer: 'China',
        risk: 'Elevated',
        processes: ['CVD Gap Fill', 'CMP'],
        layers: ['Contact Plugs', 'Vertical Vias']
    },
    {
        id: 'ti',
        name: 'Titanium',
        price: 6.50,
        cat: CommodityCategory.CriticalMetals,
        desc: 'Lightweight, strong metal used in barrier phases and adhesion.',
        producer: 'China/Russia',
        risk: 'Stable',
        processes: ['PVD Sputtering', 'Nitridation'],
        layers: ['Barrier Metal', 'Adhesion Layer', 'Silicide Contacts']
    },
    {
        id: 'pd',
        name: 'Palladium',
        price: 980.50,
        cat: CommodityCategory.PreciousMetals,
        desc: 'Critical for plating and sensor applications.',
        producer: 'Russia',
        risk: 'Elevated',
        processes: ['Electroless Plating', 'Catalysis'],
        layers: ['Component Finishing', 'Sensor Electrodes']
    }
  ];

  SPECIALTY_COMMODITIES.forEach(item => {
      const history = generateSimulation(item.price, 0.05);
      const current = history[history.length - 1].value;
      const prev = history[history.length - 2].value;
      
      commodities.push({
          id: item.id,
          symbol: `OTC:${item.id.toUpperCase()}`,
          name: item.name,
          category: item.cat,
          price: current,
          currency: item.price > 1000 ? 'USD/t' : 'USD/kg',
          change24h: current - prev,
          changePercentage: ((current - prev) / prev) * 100,
          volatility: 'High',
          riskLevel: item.risk as any,
          description: item.desc,
          topProducer: item.producer,
          history: history,
          forecast: generateAvailabilityForecast(item.risk, 'High'),
          forecastConfidence: 85,
          usage: {
              processes: item.processes,
              layers: item.layers
          }
      });
  });

  return commodities;
};

// --- REAL ENERGY API IMPLEMENTATION ---

// Helper: Fetch weather from Open-Meteo with wind
async function fetchWeatherData(lat: number, lng: number) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,shortwave_radiation,wind_speed_10m&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        return await res.json();
    } catch (e) {
        // Return fallback structure if API fails
        return { 
            hourly: { 
                temperature_2m: Array(24).fill(20), 
                shortwave_radiation: Array(24).fill(100),
                wind_speed_10m: Array(24).fill(15) 
            } 
        };
    }
}

// Helper: Fetch UK Carbon Intensity
async function fetchUKCarbon() {
    try {
        const res = await fetch('https://api.carbonintensity.org.uk/intensity');
        if (!res.ok) throw new Error('Carbon API failed');
        const data = await res.json();
        return data.data[0].intensity.actual;
    } catch (e) {
        return 240; // Fallback gCO2/kWh
    }
}

export const getPowerHubs = async (): Promise<PowerHub[]> => {
    // 1. Fetch Real Data Sources
    const ukCarbon = await fetchUKCarbon();
    
    // Coordinates
    const COORDS = {
        ASHBURN: { lat: 39.04, lng: -77.48 },
        LONDON: { lat: 51.50, lng: -0.12 },
        SINGAPORE: { lat: 1.35, lng: 103.81 },
        LULEA: { lat: 65.58, lng: 22.15 },
        FRANKFURT: { lat: 50.11, lng: 8.68 },
        TOKYO: { lat: 35.67, lng: 139.65 },
        SILICON_VALLEY: { lat: 37.35, lng: -121.95 },
        DUBLIN: { lat: 53.34, lng: -6.26 }
    };

    const [ashburnW, londonW, singaporeW, luleaW, frankfurtW, tokyoW, svW, dublinW] = await Promise.all([
        fetchWeatherData(COORDS.ASHBURN.lat, COORDS.ASHBURN.lng),
        fetchWeatherData(COORDS.LONDON.lat, COORDS.LONDON.lng),
        fetchWeatherData(COORDS.SINGAPORE.lat, COORDS.SINGAPORE.lng),
        fetchWeatherData(COORDS.LULEA.lat, COORDS.LULEA.lng),
        fetchWeatherData(COORDS.FRANKFURT.lat, COORDS.FRANKFURT.lng),
        fetchWeatherData(COORDS.TOKYO.lat, COORDS.TOKYO.lng),
        fetchWeatherData(COORDS.SILICON_VALLEY.lat, COORDS.SILICON_VALLEY.lng),
        fetchWeatherData(COORDS.DUBLIN.lat, COORDS.DUBLIN.lng)
    ]);

    // Helper to generate Forecast Array with Wind and Solar AND Carbon
    const createForecast = (weatherData: any, baseCarbon: number): PowerForecast[] => {
        const nowHour = new Date().getHours();
        const temps = weatherData.hourly.temperature_2m;
        const rads = weatherData.hourly.shortwave_radiation;
        const winds = weatherData.hourly.wind_speed_10m;
        
        return temps.slice(0, 24).map((temp: number, i: number) => {
             const hour = (nowHour + i) % 24;
             
             // Cooling Demand (Strain)
             const rawTempStrain = Math.max(0, Math.min(100, (temp - 10) * 3)); // 10C-43C -> 0-100
             
             // Renewable Supply
             const solarGen = Math.max(0, Math.min(100, rads[i] / 8)); // Approx max rad 800
             const windGen = Math.max(0, Math.min(100, (winds[i] / 25) * 100)); // 25 km/h max util
             
             // Net Strain: Demand - (Supply * Factor)
             const renewableMitigation = (solarGen * 0.3) + (windGen * 0.2); 
             const netStrain = Math.max(10, Math.min(100, rawTempStrain - renewableMitigation));

             // Carbon Forecast: Higher renewables = lower carbon
             // If 100% solar+wind, carbon drops by 50% from base (assuming some baseload is always dirty unless Lulea)
             const renewableFactor = (solarGen + windGen) / 200; // 0 to 1
             const hourlyCarbon = Math.floor(baseCarbon * (1 - (renewableFactor * 0.5)));

             return {
                 hour: `${hour}:00`,
                 strain: Math.floor(netStrain),
                 solar: Math.floor(solarGen),
                 wind: Math.floor(windGen),
                 carbon: hourlyCarbon
             };
        });
    };

    // Helper: Determine Strain based on forecast calculation
    const getStrain = (forecast: PowerForecast[]): 'Low' | 'Moderate' | 'High' | 'Critical' => {
        const nextStrain = forecast[0].strain;
        if (nextStrain > 80) return 'Critical';
        if (nextStrain > 60) return 'High';
        if (nextStrain > 30) return 'Moderate';
        return 'Low';
    };

    // Helper: Calculate Spot Price based on Strain and Renewables
    const calcPrice = (base: number, strain: string, solar: number, wind: number) => {
        let mult = strain === 'Critical' ? 3 : strain === 'High' ? 1.8 : strain === 'Moderate' ? 1.2 : 1;
        // High renewables drive price down
        if (solar > 50 || wind > 50) mult *= 0.8; 
        return parseFloat((base * mult).toFixed(2));
    };

    const buildHub = (id: string, name: string, region: string, weather: any, baseCarbon: number, basePrice: number, mix: any): PowerHub => {
        // Pass baseCarbon to forecast logic
        const forecast = createForecast(weather, baseCarbon);
        const currentStrain = getStrain(forecast);
        const currentSolar = forecast[0].solar;
        const currentWind = forecast[0].wind;
        const currentCarbon = forecast[0].carbon;

        return {
            id,
            name,
            region,
            spotPrice: calcPrice(basePrice, currentStrain, currentSolar, currentWind),
            // Use forecasted carbon for current hour instead of static base, but override for UK as it has real API
            carbonIntensity: id === 'eu-west' ? ukCarbon : currentCarbon,
            gridStrain: currentStrain,
            renewables: {
                currentSolarLoad: currentSolar,
                currentWindLoad: currentWind
            },
            energyMix: mix,
            forecast
        };
    };

    return [
        buildHub('us-east', 'Ashburn, VA', 'USA East', ashburnW, 450, 35, { nuclear: 28, gas: 55, renewables: 5, coal: 12 }),
        buildHub('eu-west', 'London', 'UK', londonW, 200, 90, { nuclear: 15, gas: 35, renewables: 45, coal: 5 }), // Carbon overwritten by API
        buildHub('apac-sg', 'Singapore', 'APAC', singaporeW, 420, 140, { nuclear: 0, gas: 96, renewables: 4, coal: 0 }),
        buildHub('eu-nord', 'Luleå', 'Sweden', luleaW, 15, 15.50, { nuclear: 0, gas: 0, renewables: 100, coal: 0 }),
        buildHub('eu-cent', 'Frankfurt', 'Germany', frankfurtW, 380, 110, { nuclear: 0, gas: 35, renewables: 40, coal: 25 }),
        buildHub('apac-jp', 'Tokyo', 'Japan', tokyoW, 460, 160, { nuclear: 5, gas: 65, renewables: 10, coal: 20 }),
        buildHub('us-west', 'Santa Clara', 'USA West', svW, 240, 180, { nuclear: 8, gas: 45, renewables: 47, coal: 0 }),
        buildHub('eu-ie', 'Dublin', 'Ireland', dublinW, 300, 105, { nuclear: 0, gas: 50, renewables: 40, coal: 10 })
    ];
};

export const getEnergyMetrics = async (): Promise<GlobalEnergyMetrics> => {
  // Derive metrics from current "live" hub data
  const hubs = await getPowerHubs();
  
  // Avg PUE worsens with global temperature
  const avgTemp = hubs.reduce((acc, h) => {
      const strainScore = h.gridStrain === 'Critical' ? 35 : h.gridStrain === 'High' ? 30 : h.gridStrain === 'Moderate' ? 22 : 15;
      return acc + strainScore;
  }, 0) / hubs.length;

  const basePUE = 1.4;
  const tempPenalty = (avgTemp - 15) * 0.01;

  // Calculate Global Renewable Utilization (weighted by their mix)
  // This calculates how much of the grid is currently powered by renewables on average
  const totalRenewablePct = hubs.reduce((acc, hub) => {
      // Average current renewable load (Solar + Wind)
      const currentRenewableLoad = (hub.renewables.currentSolarLoad + hub.renewables.currentWindLoad) / 2;
      // We weight this by the hub's renewable capacity mix to get a realistic 'utilization'
      const mixWeight = hub.energyMix.renewables / 100; 
      return acc + (currentRenewableLoad * mixWeight);
  }, 0) / hubs.length;

  return {
    globalPUE: parseFloat((basePUE + Math.max(0, tempPenalty)).toFixed(3)),
    aiTrainingLoad: 16.4, // GW estimated
    totalCarbonFootprint: 2.3, // % of global emissions
    globalRenewableUsage: Math.round(totalRenewablePct * 100) / 100 // Normalized score
  };
};

// --- TOOLING & INDUSTRIAL BASE IMPLEMENTATION ---

export const getToolingEntities = async (): Promise<ToolingEntity[]> => {
    // Simulated data with realistic values for a demo
    // In a real app, price would come from Alpha Vantage, but complex metrics like Backlog need bespoke data sources.
    const entities: any[] = [
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
