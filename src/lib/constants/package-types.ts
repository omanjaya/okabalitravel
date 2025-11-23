// Package Types Constants
export const PACKAGE_TYPES = {
  BUNDLE: "BUNDLE",
  DEAL: "DEAL",
  PRE_DESIGNED: "PRE_DESIGNED",
  CUSTOM: "CUSTOM",
} as const;

export type PackageType = (typeof PACKAGE_TYPES)[keyof typeof PACKAGE_TYPES];

// Package Type Info
export const PACKAGE_TYPE_INFO = {
  BUNDLE: {
    id: "BUNDLE",
    label: "Bundle Package",
    labelId: "Paket Bundel",
    description: "Multiple tours and destinations combined into one package",
    descriptionId: "Beberapa tur dan destinasi digabungkan dalam satu paket",
    icon: "📦",
    color: "bg-blue-500",
  },
  DEAL: {
    id: "DEAL",
    label: "Special Deal",
    labelId: "Penawaran Spesial",
    description: "Promotional packages with special discounts and offers",
    descriptionId: "Paket promosi dengan diskon dan penawaran khusus",
    icon: "🎁",
    color: "bg-red-500",
  },
  PRE_DESIGNED: {
    id: "PRE_DESIGNED",
    label: "Pre-Designed Itinerary",
    labelId: "Itinerary Siap Pakai",
    description: "Complete travel itinerary with accommodation, transport, and activities",
    descriptionId: "Itinerary perjalanan lengkap dengan akomodasi, transportasi, dan aktivitas",
    icon: "🗺️",
    color: "bg-green-500",
  },
  CUSTOM: {
    id: "CUSTOM",
    label: "Custom Package",
    labelId: "Paket Custom",
    description: "Build your own package by selecting tours and activities",
    descriptionId: "Buat paket Anda sendiri dengan memilih tur dan aktivitas",
    icon: "⚙️",
    color: "bg-purple-500",
  },
} as const;

// Travel Book Categories
export const TRAVEL_BOOK_CATEGORIES = {
  BEACH: "BEACH",
  TEMPLE: "TEMPLE",
  CULTURE: "CULTURE",
  NATURE: "NATURE",
  RESTAURANT: "RESTAURANT",
  SHOPPING: "SHOPPING",
  ADVENTURE: "ADVENTURE",
} as const;

export type TravelBookCategory = (typeof TRAVEL_BOOK_CATEGORIES)[keyof typeof TRAVEL_BOOK_CATEGORIES];

export const CATEGORY_INFO = {
  BEACH: {
    id: "BEACH",
    label: "Beach",
    labelId: "Pantai",
    icon: "🏖️",
    color: "bg-cyan-500",
  },
  TEMPLE: {
    id: "TEMPLE",
    label: "Temple",
    labelId: "Pura",
    icon: "🛕",
    color: "bg-orange-500",
  },
  CULTURE: {
    id: "CULTURE",
    label: "Culture",
    labelId: "Budaya",
    icon: "🎭",
    color: "bg-pink-500",
  },
  NATURE: {
    id: "NATURE",
    label: "Nature",
    labelId: "Alam",
    icon: "🌿",
    color: "bg-green-500",
  },
  RESTAURANT: {
    id: "RESTAURANT",
    label: "Restaurant",
    labelId: "Restoran",
    icon: "🍽️",
    color: "bg-yellow-500",
  },
  SHOPPING: {
    id: "SHOPPING",
    label: "Shopping",
    labelId: "Belanja",
    icon: "🛍️",
    color: "bg-purple-500",
  },
  ADVENTURE: {
    id: "ADVENTURE",
    label: "Adventure",
    labelId: "Petualangan",
    icon: "🏄",
    color: "bg-red-500",
  },
} as const;

// Helper functions
export function getPackageTypeInfo(type: string) {
  return PACKAGE_TYPE_INFO[type as PackageType] || PACKAGE_TYPE_INFO.BUNDLE;
}

export function getCategoryInfo(category: string) {
  return CATEGORY_INFO[category as TravelBookCategory] || CATEGORY_INFO.NATURE;
}
