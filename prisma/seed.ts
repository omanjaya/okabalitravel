import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with Bali destinations...");

  // Create Ubud destination
  const ubud = await prisma.destination.create({
    data: {
      name: "Ubud",
      slug: "ubud-bali",
      description:
        "Ubud adalah jantung budaya Bali yang dikelilingi oleh sawah terasering hijau, hutan tropis, dan sungai-sungai yang indah. Terkenal dengan seni, kerajinan tangan, tarian tradisional, dan yoga retreat. Ubud menawarkan pengalaman spiritual dan budaya yang otentik dengan banyak pura suci, museum seni, dan pasar tradisional.",
      shortDescription: "Pusat budaya dan seni Bali dengan sawah terasering yang memukau",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.5069,
      longitude: 115.2625,
      featured: true,
      rating: 4.9,
      reviewCount: 2156,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "May", "Juni", "Juli", "Agustus", "September"]),
      languages: JSON.stringify(["Indonesian", "Balinese", "English"]),
      tags: JSON.stringify(["Budaya", "Seni", "Sawah", "Yoga", "Pura", "Alam"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
            alt: "Bali Rice Terraces",
            caption: "Beautiful rice terraces in Ubud",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
            alt: "Bali Temple",
            caption: "Traditional Balinese temple",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  const seminyak = await prisma.destination.create({
    data: {
      name: "Seminyak",
      slug: "seminyak-bali",
      description:
        "Seminyak adalah kawasan pantai yang trendi di Bali, terkenal dengan resort mewah, restoran kelas dunia, beach club eksklusif, dan kehidupan malam yang vibrant. Pantai Seminyak menawarkan sunset yang spektakuler, perfect untuk surfing, dan suasana kosmopolitan yang memadukan kemewahan modern dengan pesona tradisional Bali. Area ini juga dikenal dengan boutique shopping, spa berkelas, dan tempat yoga yang populer.",
      shortDescription: "Pantai trendi dengan resort mewah, beach club, dan kehidupan malam",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.6919,
      longitude: 115.1685,
      featured: true,
      rating: 4.8,
      reviewCount: 1876,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "May", "Juni", "Juli", "Agustus", "September"]),
      languages: JSON.stringify(["Indonesian", "Balinese", "English"]),
      tags: JSON.stringify(["Pantai", "Surfing", "Beach Club", "Shopping", "Kuliner", "Nightlife"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
            alt: "Seminyak Beach",
            caption: "Beautiful sunset at Seminyak Beach",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
            alt: "Seminyak Beach Club",
            caption: "Trendy beach clubs in Seminyak",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  const uluwatu = await prisma.destination.create({
    data: {
      name: "Uluwatu",
      slug: "uluwatu-bali",
      description:
        "Uluwatu adalah destinasi spektakuler di ujung selatan Bali, terkenal dengan pura di atas tebing yang menghadap Samudera Hindia. Kawasan ini menawarkan pemandangan sunset yang menakjubkan, pantai-pantai tersembunyi dengan pasir putih, spot surfing kelas dunia, dan pertunjukan Tarian Kecak yang ikonik. Uluwatu juga dikenal dengan beach club eksklusif dan resort mewah yang terletak di atas tebing.",
      shortDescription: "Pura tebing ikonik dengan sunset spektakuler dan pantai-pantai tersembunyi",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.8290,
      longitude: 115.0852,
      featured: true,
      rating: 4.9,
      reviewCount: 2341,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "May", "Juni", "Juli", "Agustus", "September"]),
      languages: JSON.stringify(["Indonesian", "Balinese", "English"]),
      tags: JSON.stringify(["Pura", "Sunset", "Surfing", "Pantai", "Tebing", "Budaya"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
            alt: "Uluwatu Temple",
            caption: "Magnificent Uluwatu Temple on the cliff",
            isPrimary: true,
            order: 1,
          },
        ],
      },
    },
  });

  console.log("✅ Destinations created");

  // Create tours for Bali
  await prisma.tour.create({
    data: {
      title: "Ultimate Bali Adventure - 7 Days",
      slug: "ultimate-bali-adventure-7-days",
      description:
        "Experience the best of Bali in this comprehensive 7-day tour. Visit ancient temples, explore lush rice terraces, relax on pristine beaches, and immerse yourself in Balinese culture. This tour includes accommodation, meals, transportation, and expert guides who will show you the hidden gems of this tropical paradise.",
      shortDescription: "7-day journey through Bali's temples, beaches, and rice terraces",
      destinationId: ubud.id,
      price: 1299,
      currency: "USD",
      discountPercent: 10,
      duration: 7,
      nights: 6,
      minGroupSize: 2,
      maxGroupSize: 12,
      difficulty: "MODERATE",
      includes: JSON.stringify([
        "6 nights accommodation",
        "Daily breakfast",
        "Airport transfers",
        "Professional English-speaking guide",
        "All entrance fees",
        "Transportation in AC vehicle",
      ]),
      excludes: JSON.stringify([
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Lunches and dinners",
        "Tips and gratuities",
      ]),
      amenities: JSON.stringify([
        "Free WiFi",
        "Swimming Pool",
        "Spa & Wellness",
        "Airport Transfer",
        "Room Service",
      ]),
      travelStyle: JSON.stringify(["Adventure", "Culture", "Beach"]),
      featured: true,
      rating: 4.9,
      reviewCount: 156,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
            alt: "Bali Tour",
            isPrimary: true,
            order: 1,
          },
        ],
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Arrival in Bali",
            description: "Welcome to Bali! Upon arrival at Ngurah Rai International Airport, you'll be met by our representative and transferred to your hotel in Ubud. Take time to relax and adjust to the tropical climate. In the evening, enjoy a welcome dinner at a local restaurant.",
            meals: JSON.stringify(["Dinner"]),
            accommodation: "Ubud Resort",
            activities: JSON.stringify(["Airport pickup", "Hotel check-in", "Welcome dinner"]),
          },
          {
            day: 2,
            title: "Ubud Cultural Experience",
            description: "Explore the cultural heart of Bali. Visit the Sacred Monkey Forest, Tegalalang Rice Terraces, and the Royal Palace. Learn about traditional Balinese arts and crafts at local workshops. End the day with a traditional Balinese dance performance.",
            meals: JSON.stringify(["Breakfast", "Lunch"]),
            accommodation: "Ubud Resort",
            activities: JSON.stringify([
              "Monkey Forest visit",
              "Rice terraces tour",
              "Royal Palace tour",
              "Traditional dance show",
            ]),
          },
          {
            day: 3,
            title: "Temple Trail",
            description: "Visit Bali's most iconic temples including Besakih Temple (Mother Temple), Tirta Empul water temple, and Gunung Kawi ancient complex. Learn about Hindu traditions and participate in a purification ceremony.",
            meals: JSON.stringify(["Breakfast", "Lunch"]),
            accommodation: "Ubud Resort",
            activities: JSON.stringify([
              "Temple visits",
              "Purification ceremony",
              "Cultural immersion",
            ]),
          },
        ],
      },
    },
  });

  // Create Seminyak Beach tour
  await prisma.tour.create({
    data: {
      title: "Seminyak Beach & Sunset Experience - 5 Days",
      slug: "seminyak-beach-sunset-experience-5-days",
      description:
        "Nikmati pengalaman pantai yang sempurna di Seminyak dengan paket 5 hari ini. Kunjungi beach club terbaik, rasakan surfing lesson, manjakan diri dengan spa treatment, dan saksikan sunset spektakuler sambil menikmati kuliner kelas dunia. Paket ini cocok untuk mereka yang mencari kombinasi relaksasi, petualangan, dan kehidupan malam yang vibrant.",
      shortDescription: "5 hari pengalaman beach club, surfing, spa, dan kuliner di Seminyak",
      destinationId: seminyak.id,
      price: 1499,
      currency: "USD",
      duration: 5,
      nights: 4,
      minGroupSize: 2,
      maxGroupSize: 10,
      difficulty: "EASY",
      includes: JSON.stringify([
        "4 malam di luxury beach resort",
        "Sarapan harian",
        "2x makan malam di beach club",
        "Surfing lesson (1 sesi)",
        "Spa treatment (1 sesi)",
        "Beach club day pass",
        "Airport transfer",
      ]),
      excludes: JSON.stringify([
        "Penerbangan internasional",
        "Asuransi perjalanan",
        "Beberapa makan siang dan makan malam",
        "Transportasi pribadi",
        "Pengeluaran pribadi",
      ]),
      amenities: JSON.stringify([
        "Free WiFi",
        "Beach Access",
        "Swimming Pool",
        "Spa",
        "Restaurant & Bar",
      ]),
      travelStyle: JSON.stringify(["Beach", "Relaxation", "Culinary", "Surfing"]),
      featured: true,
      rating: 4.8,
      reviewCount: 287,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            alt: "Seminyak Beach Tour",
            isPrimary: true,
            order: 1,
          },
        ],
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Selamat Datang di Seminyak!",
            description: "Tiba di Ngurah Rai Airport dan transfer ke resort di Seminyak. Check-in dan nikmati welcome drink. Sore hari jalan-jalan di Seminyak Beach dan nikmati sunset pertama Anda. Makan malam di beach club terkenal.",
            meals: JSON.stringify(["Dinner"]),
            accommodation: "Luxury Beach Resort Seminyak",
            activities: JSON.stringify(["Airport transfer", "Hotel check-in", "Beach walk", "Sunset viewing", "Beach club dinner"]),
          },
          {
            day: 2,
            title: "Beach Club & Surfing",
            description: "Mulai hari dengan surfing lesson di Seminyak Beach dengan instruktur berpengalaman. Setelah itu, relaks di beach club dengan infinity pool dan ocean view. Sore hari bebas untuk shopping di boutique Seminyak atau spa treatment.",
            meals: JSON.stringify(["Breakfast"]),
            accommodation: "Luxury Beach Resort Seminyak",
            activities: JSON.stringify([
              "Surfing lesson",
              "Beach club relaxation",
              "Optional shopping or spa",
            ]),
          },
          {
            day: 3,
            title: "Kuliner & Spa Day",
            description: "Hari ini fokus pada relaksasi dan kuliner. Nikmati spa treatment di resort, lanjut dengan kulinary tour mencicipi makanan lokal dan internasional. Malam hari makan malam di rooftop restaurant dengan view sunset.",
            meals: JSON.stringify(["Breakfast", "Dinner"]),
            accommodation: "Luxury Beach Resort Seminyak",
            activities: JSON.stringify([
              "Spa treatment",
              "Culinary exploration",
              "Rooftop sunset dinner",
            ]),
          },
        ],
      },
    },
  });

  console.log("✅ Tours created");

  // Create a sample user
  const hashedPassword = await bcrypt.hash("demo123", 10);
  await prisma.user.create({
    data: {
      email: "demo@okabalitravel.com",
      name: "Demo User",
      password: hashedPassword,
      role: "USER",
    },
  });

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@okabalitravel.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Users created (1 regular, 1 admin)");

  // Create Packages
  console.log("🌱 Creating packages...");

  const bundlePackage = await prisma.package.create({
    data: {
      name: "Bali Complete Experience",
      slug: "bali-complete-experience",
      description:
        "Discover the complete beauty of Bali with this comprehensive package. Visit Ubud's cultural sites, explore pristine beaches in Seminyak, witness stunning sunsets at Uluwatu Temple, and experience the spiritual heart of Bali. This bundle includes accommodation, meals, and all major attractions.",
      shortDescription: "Complete 10-day Bali adventure combining culture, beaches, and adventure",
      type: "BUNDLE",
      price: 2499,
      currency: "USD",
      discountPercent: 15,
      duration: 10,
      nights: 9,
      regency: "badung",
      featured: true,
      rating: 4.9,
      reviewCount: 234,
      includes: JSON.stringify([
        "9 nights accommodation in 4-star hotels",
        "Daily breakfast and 5 dinners",
        "Airport transfers",
        "Professional English-speaking guide",
        "All entrance fees",
        "Transportation in AC vehicle",
        "Ubud cultural tour",
        "Beach activities in Seminyak",
        "Uluwatu sunset tour",
      ]),
      excludes: JSON.stringify([
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Some lunches and dinners",
        "Optional activities",
      ]),
      highlights: JSON.stringify([
        "Tegallalang Rice Terraces",
        "Sacred Monkey Forest Sanctuary",
        "Tirta Empul Water Temple",
        "Seminyak Beach",
        "Uluwatu Temple sunset",
        "Traditional Kecak Dance",
        "Balinese cooking class",
      ]),
      minGroupSize: 2,
      maxGroupSize: 15,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
            alt: "Bali Complete Package",
            caption: "Experience the best of Bali",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
            alt: "Bali Temple",
            caption: "Visit ancient temples",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  const dealPackage = await prisma.package.create({
    data: {
      name: "Bali Honeymoon Special",
      slug: "bali-honeymoon-special",
      description:
        "Celebrate your love in paradise with our exclusive honeymoon package. Enjoy romantic dinners, couple spa treatments, private villa accommodation, and unforgettable experiences designed for newlyweds. Limited time offer with special discounts!",
      shortDescription: "Romantic 7-day honeymoon package with special perks",
      type: "DEAL",
      price: 3299,
      currency: "USD",
      discountPercent: 25,
      duration: 7,
      nights: 6,
      regency: "gianyar",
      featured: true,
      rating: 5.0,
      reviewCount: 156,
      includes: JSON.stringify([
        "6 nights private villa with pool",
        "Daily breakfast in bed",
        "Romantic candle-light dinner (3x)",
        "Couple spa treatment (2 sessions)",
        "Private sunset cruise",
        "Professional photographer (1 session)",
        "Flower decorations",
        "Champagne and cake",
        "Airport transfers in luxury car",
      ]),
      excludes: JSON.stringify([
        "International flights",
        "Travel insurance",
        "Lunches",
        "Additional activities",
      ]),
      highlights: JSON.stringify([
        "Private villa with infinity pool",
        "Romantic beach dinners",
        "Couple spa treatments",
        "Sunset cruise",
        "Professional photoshoot",
        "Ubud rice terrace visit",
      ]),
      minGroupSize: 2,
      maxGroupSize: 2,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1200",
            alt: "Romantic Bali",
            caption: "Perfect honeymoon destination",
            isPrimary: true,
            order: 1,
          },
        ],
      },
    },
  });

  const preDesignedPackage = await prisma.package.create({
    data: {
      name: "Bali Wellness Retreat",
      slug: "bali-wellness-retreat",
      description:
        "Rejuvenate your mind, body, and soul with our carefully curated wellness retreat. This package includes daily yoga sessions, meditation classes, spa treatments, healthy organic meals, and wellness workshops in the peaceful surroundings of Ubud.",
      shortDescription: "7-day wellness retreat with yoga, meditation, and spa",
      type: "PRE_DESIGNED",
      price: 1899,
      currency: "USD",
      discountPercent: 10,
      duration: 7,
      nights: 6,
      regency: "gianyar",
      featured: true,
      rating: 4.8,
      reviewCount: 189,
      includes: JSON.stringify([
        "6 nights wellness resort accommodation",
        "3 healthy meals per day",
        "Daily yoga sessions (morning & evening)",
        "Meditation classes",
        "3 spa treatments",
        "Wellness workshops",
        "Herbal tea ceremony",
        "Airport transfers",
      ]),
      excludes: JSON.stringify(["International flights", "Travel insurance", "Personal expenses"]),
      highlights: JSON.stringify([
        "Daily yoga and meditation",
        "Balinese massage therapy",
        "Organic vegetarian meals",
        "Wellness workshops",
        "Rice field walks",
        "Sound healing session",
      ]),
      minGroupSize: 1,
      maxGroupSize: 12,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200",
            alt: "Yoga in Bali",
            caption: "Wellness and relaxation",
            isPrimary: true,
            order: 1,
          },
        ],
      },
    },
  });

  const customPackage = await prisma.package.create({
    data: {
      name: "Bali Adventure Custom",
      slug: "bali-adventure-custom",
      description:
        "Create your perfect Bali adventure! This customizable package allows you to choose your preferred activities, accommodation style, and destinations. Whether you want surfing, diving, trekking, or cultural experiences, we'll design the perfect itinerary for you.",
      shortDescription: "Fully customizable Bali adventure - you choose the activities",
      type: "CUSTOM",
      price: 1599,
      currency: "USD",
      duration: 8,
      nights: 7,
      regency: "badung",
      featured: false,
      rating: 4.7,
      reviewCount: 98,
      includes: JSON.stringify([
        "7 nights accommodation (style of your choice)",
        "Daily breakfast",
        "Choose 5 activities from our list",
        "Transportation for selected activities",
        "English-speaking guide",
        "Airport transfers",
      ]),
      excludes: JSON.stringify([
        "International flights",
        "Travel insurance",
        "Meals not specified",
        "Activities beyond included 5",
      ]),
      highlights: JSON.stringify([
        "Fully customizable itinerary",
        "Choose from 20+ activities",
        "Flexible accommodation options",
        "Personal travel consultant",
        "Activity options: surfing, diving, trekking, temples, cooking class, and more",
      ]),
      minGroupSize: 1,
      maxGroupSize: 20,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
            alt: "Bali Adventure",
            caption: "Your custom adventure awaits",
            isPrimary: true,
            order: 1,
          },
        ],
      },
    },
  });

  console.log("✅ Packages created");

  // Create Travel Books for Bali Regencies
  console.log("🌱 Creating travel books...");

  const badungBook = await prisma.travelBook.create({
    data: {
      title: "Discover Badung - South Bali Paradise",
      slug: "discover-badung",
      description:
        "Explore the vibrant south of Bali including Kuta, Seminyak, Nusa Dua, Jimbaran, and the iconic Uluwatu Temple.",
      regency: "Badung",
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
      order: 1,
      published: true,
      chapters: {
        create: [
          {
            title: "Beaches & Coastal Life",
            slug: "beaches-coastal-life",
            description: "Discover the stunning beaches and coastal attractions of Badung",
            order: 1,
            entries: {
              create: [
                {
                  title: "Seminyak Beach",
                  description:
                    "Trendy beach area known for upscale resorts, beach clubs, and spectacular sunsets. Perfect for surfing, dining, and nightlife.",
                  category: "BEACH",
                  latitude: -8.6919,
                  longitude: 115.1685,
                  address: "Seminyak, Kuta Utara, Badung",
                  tips: "Visit during sunset for the best views. Book beach clubs in advance during peak season.",
                  bestTime: "April to October (dry season)",
                  entryFee: "Free (beach clubs have minimum spend)",
                  order: 1,
                  images: {
                    create: [
                      {
                        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
                        caption: "Beautiful sunset at Seminyak",
                        order: 1,
                      },
                    ],
                  },
                },
                {
                  title: "Jimbaran Bay",
                  description:
                    "Famous for its seafood restaurants right on the beach. Enjoy fresh grilled seafood while watching the sunset over the Indian Ocean.",
                  category: "BEACH",
                  latitude: -8.7895,
                  longitude: 115.1635,
                  address: "Jimbaran, Kuta Selatan, Badung",
                  tips: "Arrive before sunset to get the best tables. Bargain for seafood prices before ordering.",
                  bestTime: "Evening for sunset dinner",
                  entryFee: "Free (pay for food)",
                  order: 2,
                  images: {
                    create: [
                      {
                        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
                        caption: "Sunset dining at Jimbaran",
                        order: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Temples & Culture",
            slug: "temples-culture",
            description: "Sacred temples and cultural sites in Badung",
            order: 2,
            entries: {
              create: [
                {
                  title: "Uluwatu Temple",
                  description:
                    "Spectacular cliff-top temple overlooking the Indian Ocean. Famous for Kecak fire dance performances at sunset and resident monkeys.",
                  category: "TEMPLE",
                  latitude: -8.8290,
                  longitude: 115.0852,
                  address: "Pecatu, Kuta Selatan, Badung",
                  tips: "Watch your belongings around monkeys. Book Kecak dance tickets early. Wear sarong (provided at entrance).",
                  bestTime: "Late afternoon for sunset and dance performance",
                  entryFee: "IDR 30,000 (temple) + IDR 100,000 (Kecak dance)",
                  order: 1,
                  images: {
                    create: [
                      {
                        url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
                        caption: "Majestic Uluwatu Temple",
                        order: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const gianyarBook = await prisma.travelBook.create({
    data: {
      title: "Gianyar - The Cultural Heart of Bali",
      slug: "gianyar-cultural-heart",
      description: "Immerse yourself in Ubud's art, culture, and natural beauty in the heart of Bali.",
      regency: "Gianyar",
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
      order: 2,
      published: true,
      chapters: {
        create: [
          {
            title: "Rice Terraces & Nature",
            slug: "rice-terraces-nature",
            description: "Stunning natural landscapes and rice field experiences",
            order: 1,
            entries: {
              create: [
                {
                  title: "Tegallalang Rice Terraces",
                  description:
                    "Iconic terraced rice paddies offering breathtaking views and photo opportunities. Walk through the terraces and learn about traditional Subak irrigation system.",
                  category: "NATURE",
                  latitude: -8.4366,
                  longitude: 115.2797,
                  address: "Tegallalang, Gianyar",
                  tips: "Visit early morning to avoid crowds. Bring small bills for donations. Wear comfortable shoes for walking.",
                  bestTime: "Early morning (6-9 AM) for best light",
                  entryFee: "Donations requested (IDR 10,000-20,000)",
                  order: 1,
                  images: {
                    create: [
                      {
                        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
                        caption: "Beautiful rice terraces",
                        order: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Sacred Sites & Temples",
            slug: "sacred-sites-temples",
            description: "Spiritual destinations and holy water temples",
            order: 2,
            entries: {
              create: [
                {
                  title: "Tirta Empul Water Temple",
                  description:
                    "Holy spring water temple where Balinese people come for ritual purification. Visitors can participate in the cleansing ceremony.",
                  category: "TEMPLE",
                  latitude: -8.4150,
                  longitude: 115.3153,
                  address: "Tampaksiring, Gianyar",
                  tips: "Bring change of clothes if you want to participate in purification ritual. Sarong and sash required (can rent on site).",
                  bestTime: "Morning before 10 AM",
                  entryFee: "IDR 50,000",
                  order: 1,
                  images: {
                    create: [
                      {
                        url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
                        caption: "Holy water temple",
                        order: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Travel books created");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
