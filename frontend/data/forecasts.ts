import { GrowthForecast, CityId } from '@/types';

export const GROWTH_FORECASTS: Record<CityId, GrowthForecast[]> = {
  koraput: [
    { year: '2024', statusQuo: 54.7, acceleratedPolicy: 54.7, benchmarkPace: 82.6 },
    { year: '2025', statusQuo: 56.9, acceleratedPolicy: 56.9, benchmarkPace: 83.9 },
    { year: '2026', statusQuo: 58.4, acceleratedPolicy: 61.2, benchmarkPace: 84.7, milestone: 'Mobile Medical Van & Jal Jeevan Grid Launch' },
    { year: '2027', statusQuo: 60.1, acceleratedPolicy: 66.8, benchmarkPace: 86.2, milestone: 'Jeypore Agro-Processing Park Commissioned' },
    { year: '2028', statusQuo: 61.8, acceleratedPolicy: 72.4, benchmarkPace: 87.8, milestone: 'BharatNet 100% GP Fiber Bandwidth Active' },
    { year: '2029', statusQuo: 63.2, acceleratedPolicy: 77.1, benchmarkPace: 89.1, milestone: 'Eco-Tourism & Tribal Bio-Reserve Corridor' },
    { year: '2030', statusQuo: 64.9, acceleratedPolicy: 81.5, benchmarkPace: 90.5, milestone: 'Sub-Divisional Hospital Trauma Centre Upgrades' },
    { year: '2032', statusQuo: 67.5, acceleratedPolicy: 86.8, benchmarkPace: 92.5, milestone: 'Convergence with Tier-2 State Benchmark Achieved' },
  ],
  bhubaneswar: [
    { year: '2024', statusQuo: 82.6, acceleratedPolicy: 82.6, benchmarkPace: 85.0 },
    { year: '2025', statusQuo: 83.9, acceleratedPolicy: 83.9, benchmarkPace: 86.8 },
    { year: '2026', statusQuo: 84.7, acceleratedPolicy: 85.6, benchmarkPace: 88.0, milestone: 'AI Stormwater Basin Telemetry Deployed' },
    { year: '2027', statusQuo: 85.8, acceleratedPolicy: 88.2, benchmarkPace: 89.8, milestone: 'Bhubaneswar Metro Phase 1 Inauguration' },
    { year: '2028', statusQuo: 86.9, acceleratedPolicy: 90.7, benchmarkPace: 91.2, milestone: 'Net-Zero Municipal Solid Waste Processing' },
    { year: '2029', statusQuo: 87.8, acceleratedPolicy: 92.8, benchmarkPace: 92.6, milestone: 'Semiconductor Fabrication Pilot Operational' },
    { year: '2030', statusQuo: 88.6, acceleratedPolicy: 94.6, benchmarkPace: 94.0, milestone: '100% Piped Reclaimed Water for Urban Cooling' },
    { year: '2032', statusQuo: 90.1, acceleratedPolicy: 96.9, benchmarkPace: 96.0, milestone: 'Global Top-50 Liveable Smart Cities Ranking' },
  ],
};
