export const CONFIG = {
  API: {
    KEY: import.meta.env.VITE_API_KEY || 'demo',
    BASE_URL: 'https://www.alphavantage.co/query',
    TIMEOUT_MS: 3000,
  },
  COLORS: {
    ACCENT: '#D94E28',
    TEXT: '#1A1918',
    SECONDARY: '#6B665F',
    SURFACE: '#EAE7E0',
    BACKGROUND: '#F4F1EA',
    SUBTLE: '#D1CDC7',
  },
  THRESHOLDS: {
    RISK: {
      CRITICAL: 30,
      ELEVATED: 60,
      STABLE: 80,
    },
    VOLATILITY: {
      HIGH: 5,
      MEDIUM: 2,
    },
    GRID_STRAIN: {
      CRITICAL: 80,
      HIGH: 60,
      MODERATE: 30,
    },
  },
  COORDINATES: {
    ASHBURN: { lat: 39.04, lng: -77.48 },
    LONDON: { lat: 51.50, lng: -0.12 },
    SINGAPORE: { lat: 1.35, lng: 103.81 },
    LULEA: { lat: 65.58, lng: 22.15 },
    FRANKFURT: { lat: 50.11, lng: 8.68 },
    TOKYO: { lat: 35.67, lng: 139.65 },
    SILICON_VALLEY: { lat: 37.35, lng: -121.95 },
    DUBLIN: { lat: 53.34, lng: -6.26 },
  },
};
