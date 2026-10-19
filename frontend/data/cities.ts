import { CityProfile } from '@/types';

export const CITIES_DATA: Record<string, CityProfile> = {
  koraput: {
    id: 'koraput',
    name: 'Koraput',
    regionalTitle: 'Koraput District & Urban Cluster',
    state: 'Odisha',
    category: 'Aspirational District Hub',
    population: 1379647,
    populationLabel: '1.38 Million (District)',
    areaSqKm: 8807,
    literacyRate: 49.2,
    perCapitaIncomeInr: 68500,
    subdivisionsOrZones: 2, // Koraput & Jeypore
    blocksOrWardsCount: 14, // 14 Blocks (Jeypore, Sunabeda, Kotpad, etc.)
    description:
      'A bio-diverse, tribal-majority district situated in the picturesque Eastern Ghats of Southern Odisha. A designated aspirational zone endowed with rich horticultural resources (Koraput Organic Coffee, millets, spices), defense manufacturing (HAL Sunabeda, NALCO Damanjodi), and tremendous eco-tourism potential, while tackling structural deficits in secondary health outreach, all-weather connectivity in hinterlands, and technical higher education.',
    geography: 'Highland plateau & hills, average elevation 870m MSL, Eastern Ghats agro-climatic zone.',
    administrativeHQ: 'Koraput Town (Collectorate & DRDA)',
    keyStrengths: [
      'GI-tagged Koraput Coffee & Indigenous Organic Millet biodiversity',
      'Strategic Defense & Metallurgical clusters (HAL Aeronautics & NALCO Alumina)',
      'High forest canopy cover (38.5%) and rich watershed ecology',
      'Dedicated District Mineral Foundation (DMF) and OMBADC funding corpus',
    ],
    coreChallenges: [
      'Dispersed rural habitations causing last-mile healthcare transport lag',
      'Secondary-to-higher education dropout rates in interior tribal blocks',
      'Deficit in agro-processing cold-storage and value-addition infrastructure',
      'Lower formal non-agricultural employment generation for youth',
    ],
    coordinates: {
      lat: 18.8135,
      lng: 82.7123,
    },
  },
  bhubaneswar: {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    regionalTitle: 'Bhubaneswar Smart City & Capital Region',
    state: 'Odisha',
    category: 'Tier-2 Capital / Benchmark Smart City',
    population: 1115000,
    populationLabel: '1.12 Million (BMC Area)',
    areaSqKm: 422,
    literacyRate: 91.8,
    perCapitaIncomeInr: 215400,
    subdivisionsOrZones: 3, // North, South-West, Central
    blocksOrWardsCount: 67, // 67 Municipal Wards
    description:
      'The administrative, educational, and information-technology powerhouse of Odisha. Ranked globally in early Smart City Mission phases, Bhubaneswar features state-of-the-art public transit (Mo Bus / Mo E-Ride), premier medical hubs (AIIMS, SUM, KIMS), prominent technology parks (Infocity, DLF Cybercity), and integrated municipal operations (Bhubaneswar Operations Centre - BOC).',
    geography: 'Coastal plains region, Mahanadi delta fringe, tropical savanna climate.',
    administrativeHQ: 'Bhubaneswar Municipal Corporation (BMC) & Secretariat',
    keyStrengths: [
      'Eastern India educational hub (IIT, NISER, AIIMS, KIIT, SOA, Utkal)',
      'Integrated public transit system (Mo Bus network with >250,000 daily ridership)',
      'Expanding IT & ESDM ecosystem with TCS, Infosys, Wipro, and semiconductor pilots',
      'High municipal digital governance index and centralized command center (BOC)',
    ],
    coreChallenges: [
      'Urban runoff & storm-water drainage overload in low-lying suburban wards',
      'Affordable housing and formal service delivery to peri-urban migrant clusters',
      'Peak summer urban heat island effects and peak electricity demand surges',
      'Traffic congestion on Cuttack-Bhubaneswar-Puri economic growth spine',
    ],
    coordinates: {
      lat: 20.2961,
      lng: 85.8245,
    },
  },
};
