import { PowerHub, GlobalEnergyMetrics, PowerForecast } from '../types';
import { CONFIG } from '../constants/config';

interface WeatherData {
    hourly: {
        temperature_2m: number[];
        shortwave_radiation: number[];
        wind_speed_10m: number[];
    };
}

// Helper: Fetch weather from Open-Meteo with wind
async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
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
async function fetchUKCarbon(): Promise<number> {
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
    
    const { ASHBURN, LONDON, SINGAPORE, LULEA, FRANKFURT, TOKYO, SILICON_VALLEY, DUBLIN } = CONFIG.COORDINATES;

    const [ashburnW, londonW, singaporeW, luleaW, frankfurtW, tokyoW, svW, dublinW] = await Promise.all([
        fetchWeatherData(ASHBURN.lat, ASHBURN.lng),
        fetchWeatherData(LONDON.lat, LONDON.lng),
        fetchWeatherData(SINGAPORE.lat, SINGAPORE.lng),
        fetchWeatherData(LULEA.lat, LULEA.lng),
        fetchWeatherData(FRANKFURT.lat, FRANKFURT.lng),
        fetchWeatherData(TOKYO.lat, TOKYO.lng),
        fetchWeatherData(SILICON_VALLEY.lat, SILICON_VALLEY.lng),
        fetchWeatherData(DUBLIN.lat, DUBLIN.lng)
    ]);

    // Helper to generate Forecast Array with Wind and Solar AND Carbon
    const createForecast = (weatherData: WeatherData, baseCarbon: number): PowerForecast[] => {
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

    interface EnergyMix {
      nuclear: number;
      gas: number;
      renewables: number;
      coal: number;
    }
    const buildHub = (id: string, name: string, region: string, weather: WeatherData, baseCarbon: number, basePrice: number, mix: EnergyMix): PowerHub => {
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
      globalPUE: parseFloat((basePUE + tempPenalty).toFixed(2)),
      aiTrainingLoad: 45.2, // GW
      totalCarbonFootprint: 850, // Million Tonnes
      globalRenewableUsage: Math.round(totalRenewablePct)
  };
};
