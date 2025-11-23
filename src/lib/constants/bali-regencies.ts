// Bali Regencies (Kabupaten/Kota) Constants
export const BALI_REGENCIES = [
  {
    id: "badung",
    name: "Badung",
    nameId: "Kabupaten Badung",
    description: "South Bali - Home to Kuta, Seminyak, Nusa Dua, and Jimbaran",
    highlights: ["Kuta Beach", "Seminyak", "Nusa Dua", "Jimbaran Bay", "Uluwatu Temple"],
    area: "418.52 km²",
    population: "543,332",
  },
  {
    id: "gianyar",
    name: "Gianyar",
    nameId: "Kabupaten Gianyar",
    description: "Cultural heart of Bali - Ubud, Tegallalang, and traditional arts",
    highlights: ["Ubud", "Tegallalang Rice Terraces", "Tegenungan Waterfall", "Goa Gajah", "Tirta Empul"],
    area: "368 km²",
    population: "515,344",
  },
  {
    id: "tabanan",
    name: "Tabanan",
    nameId: "Kabupaten Tabanan",
    description: "Rice terraces and temples - Tanah Lot and Jatiluwih",
    highlights: ["Tanah Lot Temple", "Jatiluwih Rice Terraces", "Bali Butterfly Park", "Alas Kedaton"],
    area: "839.33 km²",
    population: "461,602",
  },
  {
    id: "klungkung",
    name: "Klungkung",
    nameId: "Kabupaten Klungkung",
    description: "East Bali islands - Nusa Penida, Nusa Lembongan, Nusa Ceningan",
    highlights: ["Nusa Penida", "Nusa Lembongan", "Kelingking Beach", "Angel's Billabong", "Broken Beach"],
    area: "315 km²",
    population: "179,446",
  },
  {
    id: "karangasem",
    name: "Karangasem",
    nameId: "Kabupaten Karangasem",
    description: "Far east Bali - Mount Agung, Amed diving, and traditional villages",
    highlights: ["Mount Agung", "Amed", "Candidasa", "Tirta Gangga", "Lempuyang Temple"],
    area: "839.54 km²",
    population: "427,837",
  },
  {
    id: "bangli",
    name: "Bangli",
    nameId: "Kabupaten Bangli",
    description: "Central highlands - Kintamani, Mount Batur, and volcanic lakes",
    highlights: ["Mount Batur", "Kintamani", "Lake Batur", "Besakih Temple", "Penglipuran Village"],
    area: "520.81 km²",
    population: "215,353",
  },
  {
    id: "buleleng",
    name: "Buleleng",
    nameId: "Kabupaten Buleleng",
    description: "North Bali - Lovina beaches, waterfalls, and Singaraja city",
    highlights: ["Lovina Beach", "Gitgit Waterfall", "Singaraja", "Brahma Vihara Arama", "Sekumpul Waterfall"],
    area: "1,365.88 km²",
    population: "624,125",
  },
  {
    id: "denpasar",
    name: "Denpasar",
    nameId: "Kota Denpasar",
    description: "Provincial capital - Urban center, markets, and museums",
    highlights: ["Bajra Sandhi Monument", "Sanur Beach", "Bali Museum", "Badung Market", "Renon Square"],
    area: "127.78 km²",
    population: "897,300",
  },
  {
    id: "jembrana",
    name: "Jembrana",
    nameId: "Kabupaten Jembrana",
    description: "West Bali - National park, surfing, and quiet beaches",
    highlights: ["West Bali National Park", "Medewi Beach", "Rambut Siwi Temple", "Perancak Beach"],
    area: "841.80 km²",
    population: "271,387",
  },
] as const;

export type BaliRegency = (typeof BALI_REGENCIES)[number];
export type BaliRegencyId = (typeof BALI_REGENCIES)[number]["id"];

// Helper functions
export function getRegencyById(id: string): BaliRegency | undefined {
  return BALI_REGENCIES.find((regency) => regency.id === id);
}

export function getRegencyByName(name: string): BaliRegency | undefined {
  return BALI_REGENCIES.find((regency) => regency.name === name || regency.nameId === name);
}

export const REGENCY_IDS = BALI_REGENCIES.map((r) => r.id);
