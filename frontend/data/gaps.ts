import { DevelopmentGap } from '@/types';

export const DEVELOPMENT_GAPS: DevelopmentGap[] = [
  {
    id: 'gap-k-01',
    title: 'Emergency Maternal & Pediatric Healthcare Response Transit Lag',
    cityId: 'koraput',
    sector: 'healthcare',
    severity: 'Critical',
    gapMetric: 'Average Emergency Response Time: 58 mins vs 14 mins Benchmark',
    currentStatus: '58 min average ambulance dispatch-to-hospital transit in interior blocks like Bandhugaon & Narayanpatna.',
    benchmarkStatus: '14 min transit in Bhubaneswar via dedicated GPS fleet and 108 trauma ambulances.',
    rootCauses: [
      'Ghat terrain with unpaved road gradients connecting interior tribal hamlets',
      'Shortage of ALS (Advanced Life Support) ambulances deployed at Sub-Divisional Hospital level',
      'Lack of real-time telemetry connectivity across hilly dead-zones',
    ],
    affectedPopulation: 'Approx. 410,000 rural and tribal residents across 6 hilly blocks',
    recommendedIntervention:
      'Deploy 24 all-terrain 4x4 mobile medical units equipped with satellite telemetry, paired with drone-based emergency medicine delivery hubs at Jeypore and Koraput District HQ.',
    estimatedInvestmentCr: 28.5,
    projectedImpact: 'Reduce emergency transit time by 52%; cut maternal complication referral delays by 40%.',
    targetStakeholders: ['government', 'ngo', 'citizen'],
  },
  {
    id: 'gap-k-02',
    title: 'Agro-Forestry & Coffee Value-Addition Deficit',
    cityId: 'koraput',
    sector: 'employment',
    severity: 'High',
    gapMetric: 'Local Agro-Processing Ratio: 14.2% vs 64.5% Benchmark',
    currentStatus:
      'Over 85% of Koraput arabica coffee, ginger, and turmeric exported as raw unroasted/unprocessed commodities with minimal local value realization.',
    benchmarkStatus:
      'Bhubaneswar ecosystem hosts food-testing labs, packaged food logistics hubs, and export certification agencies.',
    rootCauses: [
      'Absence of organized farmer producer organization (FPO) primary processing centers',
      'Limited commercial cold-chain storage facilities (only 2 operational across district)',
      'High logistics friction to Visakhapatnam and Paradip export ports',
    ],
    affectedPopulation: 'Over 120,000 tribal smallholder farmers and SHG micro-entrepreneurs',
    recommendedIntervention:
      'Establish a 50-acre Mega Food Park & Organic Agro-Processing Hub in Jeypore corridor with common curing, roasting, solar drying, and vacuum packaging facilities.',
    estimatedInvestmentCr: 85.0,
    projectedImpact: 'Generate 4,800 direct non-farm jobs; increase farmgate realization by 38-45%.',
    targetStakeholders: ['government', 'investor', 'business'],
  },
  {
    id: 'gap-k-03',
    title: 'Secondary-to-Higher Secondary STEM Transition Dropoff',
    cityId: 'koraput',
    sector: 'education',
    severity: 'High',
    gapMetric: 'STEM Stream Retention: 28.5% vs 68.2% Benchmark',
    currentStatus:
      'While 5T High School transformation modernised 180+ schools, transition into science/math streams at +2 level plummets due to lack of trained science educators and lab infrastructure.',
    benchmarkStatus:
      'Bhubaneswar has comprehensive science faculties in every government higher secondary school, backed by university mentorship.',
    rootCauses: [
      'Educator vacancy in physics, chemistry, and mathematics in interior colleges',
      'Language barrier during shift from Kui/Odia to technical English textbooks',
      'Long commuting distance to designated science colleges forcing hostel-dependent dropouts',
    ],
    affectedPopulation: 'Approx. 34,000 secondary students annually',
    recommendedIntervention:
      'Introduce hybrid digital science learning labs with vernacular bilingual AI tutors, paired with incentive stipends for STEM teachers in tribal blocks.',
    estimatedInvestmentCr: 19.2,
    projectedImpact: 'Increase STEM enrollment to 45% within 3 years; reduce transition dropout by 30%.',
    targetStakeholders: ['government', 'ngo', 'citizen'],
  },
  {
    id: 'gap-k-04',
    title: 'Highland Habitation Solar-Gravity Piped Drinking Water Deficit',
    cityId: 'koraput',
    sector: 'infrastructure',
    severity: 'Moderate',
    gapMetric: 'Household Piped Water: 48.2% vs 93.8% Benchmark',
    currentStatus:
      'Conventional groundwater drilling fails in rocky highland plateaus; many habitations still rely on surface streams susceptible to seasonal turbidity.',
    benchmarkStatus:
      'Bhubaneswar municipal network provides 24x7 Drink from Tap (Sujal) in majority wards.',
    rootCauses: [
      'Rugged elevation profiles render traditional electrical pump grids vulnerable to line faults',
      'Dispersed hamlet settlement pattern (under 100 households per tola)',
    ],
    affectedPopulation: '320,000 rural residents across 11 highland blocks',
    recommendedIntervention:
      'Scale solar-powered multi-stage gravity flow piped water schemes utilizing perennial hill stream intakes, managed by women SHGs (Jal Sathis).',
    estimatedInvestmentCr: 42.0,
    projectedImpact: 'Achieve 82% household tap coverage by 2028; eliminate water-borne gastroenteritis peaks.',
    targetStakeholders: ['government', 'ngo', 'citizen'],
  },
  {
    id: 'gap-b-01',
    title: 'Peri-Urban Stormwater Drainage Inundation & Runoff Overload',
    cityId: 'bhubaneswar',
    sector: 'infrastructure',
    severity: 'High',
    gapMetric: 'Secondary Storm Drain Adequacy: 61% vs 90% National Benchmark',
    currentStatus:
      'Intense monsoon downpours cause flash waterlogging along Gangua Nallah catchment, Jayadev Vihar underpasses, and Old Town heritage perimeter.',
    benchmarkStatus:
      'Modern smart cities utilize automated flood gates, sponge-city retention basins, and permeable pavements.',
    rootCauses: [
      'Rapid concretization and loss of natural water bodies (pari-urban wetlands encroachment)',
      'Outdated natural drainage alignment unable to handle peak 70mm/hr precipitation events',
    ],
    affectedPopulation: 'Over 280,000 urban residents across 18 vulnerable wards',
    recommendedIntervention:
      'Implement an Integrated Urban Sponge Basin & Stormwater Master Plan: desilt 10 primary drainage channels, create 4 eco-retention lakes, and install telemetry-linked automated sluices.',
    estimatedInvestmentCr: 145.0,
    projectedImpact: 'Eliminate chronic waterlogging hotspots; augment urban groundwater recharge by 22%.',
    targetStakeholders: ['government', 'citizen', 'business'],
  },
  {
    id: 'gap-b-02',
    title: 'Peak-Hour Traffic Congestion on Capital-Industrial Corridors',
    cityId: 'bhubaneswar',
    sector: 'infrastructure',
    severity: 'Moderate',
    gapMetric: 'Average Peak Travel Speed: 18.5 km/h vs 32 km/h Target',
    currentStatus:
      'Heavy vehicular bottlenecks on Khandagiri-Patia arterial corridor and Rasulgarh-Cuttack expressway junction during 09:00-11:00 and 18:00-21:00.',
    benchmarkStatus:
      'Leading global cities integrate multi-modal transit ticketing and grade-separated BRTS lanes.',
    rootCauses: [
      'High personal two-wheeler and four-wheeler ownership growth (9.8% YoY)',
      'Last-mile integration gaps between Mo Bus routes and peripheral IT parks',
    ],
    affectedPopulation: 'Approx. 450,000 daily commuters',
    recommendedIntervention:
      'Accelerate Bhubaneswar Metro Phase-1 execution, deploy 300 additional Mo E-Ride feeder shuttles, and activate adaptive dynamic AI traffic signal sequencing at 42 major junctions.',
    estimatedInvestmentCr: 210.0,
    projectedImpact: 'Increase public transit mode share from 34% to 48%; reduce peak corridor transit time by 28%.',
    targetStakeholders: ['government', 'business', 'citizen', 'investor'],
  },
];
