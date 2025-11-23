import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database - OkabaliTravel: Wisata Bali");

  // Delete existing data
  await prisma.reviewImage.deleteMany();
  await prisma.reviewResponse.deleteMany();
  await prisma.review.deleteMany();
  await prisma.traveler.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.tourAvailability.deleteMany();
  await prisma.tourImage.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.destinationImage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create Ubud destination
  const ubud = await prisma.destination.create({
    data: {
      name: "Ubud",
      slug: "ubud-bali",
      description:
        "Ubud adalah jantung budaya Bali yang dikelilingi oleh sawah terasering hijau, hutan tropis, dan sungai-sungai yang indah. Terkenal dengan seni, kerajinan tangan, tarian tradisional, dan yoga retreat. Ubud menawarkan pengalaman spiritual dan budaya yang otentik dengan banyak pura suci, museum seni, pasar tradisional, dan pusat seni pertunjukan.",
      shortDescription: "Pusat budaya dan seni Bali dengan sawah terasering yang memukau",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.5069,
      longitude: 115.2625,
      featured: true,
      rating: 4.9,
      reviewCount: 1543,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "Mei", "Juni", "Juli", "Agustus", "September"]),
      languages: JSON.stringify(["Bahasa Indonesia", "Bahasa Bali", "English"]),
      tags: JSON.stringify(["Budaya", "Seni", "Sawah", "Yoga", "Pura", "Alam"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
            alt: "Sawah Terasering Tegalalang",
            caption: "Sawah terasering yang indah di Tegalalang, Ubud",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
            alt: "Pura di Ubud",
            caption: "Pura tradisional Bali di Ubud",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  // Create Seminyak destination
  const seminyak = await prisma.destination.create({
    data: {
      name: "Seminyak",
      slug: "seminyak-bali",
      description:
        "Seminyak adalah kawasan pantai yang trendi di Bali dengan pantai pasir hitam yang indah, restoran kelas dunia, beach club eksklusif, dan kehidupan malam yang semarak. Dikenal sebagai surga belanja dengan butik-butik desainer, spa mewah, dan hotel berbintang. Seminyak menawarkan pengalaman liburan yang modern dan sophisticated sambil tetap mempertahankan pesona Bali yang otentik.",
      shortDescription: "Kawasan pantai trendi dengan beach club, restoran, dan shopping",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.6919,
      longitude: 115.1721,
      featured: true,
      rating: 4.7,
      reviewCount: 1289,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober"]),
      languages: JSON.stringify(["Bahasa Indonesia", "English"]),
      tags: JSON.stringify(["Pantai", "Beach Club", "Shopping", "Kuliner", "Sunset", "Nightlife"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
            alt: "Sunset di Seminyak",
            caption: "Sunset yang memukau di Pantai Seminyak",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200",
            alt: "Beach Club Seminyak",
            caption: "Beach club eksklusif di Seminyak",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  // Create Nusa Penida destination
  const nusaPenida = await prisma.destination.create({
    data: {
      name: "Nusa Penida",
      slug: "nusa-penida-bali",
      description:
        "Nusa Penida adalah pulau indah di tenggara Bali yang terkenal dengan pemandangan tebing dramatis, pantai-pantai tersembunyi, dan air laut yang jernih. Destinasi favorit untuk snorkeling dan diving dengan kesempatan melihat Manta Ray. Kelilingbatu Beach (T-Rex), Angel's Billabong, dan Broken Beach adalah beberapa spot ikonik yang wajib dikunjungi. Pulau ini menawarkan petualangan alam yang menakjubkan.",
      shortDescription: "Pulau eksotis dengan tebing dramatis dan pantai tersembunyi",
      country: "Indonesia",
      continent: "Asia",
      latitude: -8.7289,
      longitude: 115.5442,
      featured: true,
      rating: 4.8,
      reviewCount: 987,
      currency: "IDR",
      timezone: "Asia/Makassar",
      bestTimeToVisit: JSON.stringify(["April", "Mei", "Juni", "Juli", "Agustus", "September"]),
      languages: JSON.stringify(["Bahasa Indonesia", "Bahasa Bali", "English"]),
      tags: JSON.stringify(["Pulau", "Pantai", "Snorkeling", "Diving", "Petualangan", "Alam"]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
            alt: "Kelingking Beach Nusa Penida",
            caption: "Kelingking Beach yang terkenal dengan bentuk T-Rex",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
            alt: "Angel's Billabong",
            caption: "Kolam alami Angel's Billabong",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  console.log("✅ Destinations created");

  // Create Ubud Culture Tour
  await prisma.tour.create({
    data: {
      title: "Paket Wisata Budaya Ubud 3 Hari 2 Malam",
      slug: "paket-wisata-budaya-ubud-3-hari",
      description:
        "Jelajahi jantung budaya Bali dengan paket wisata Ubud 3 hari 2 malam. Kunjungi sawah terasering Tegalalang yang ikonik, Monkey Forest yang penuh dengan monyet lucu, pura-pura suci seperti Tirta Empul dan Gunung Kawi. Nikmati pertunjukan tari Kecak dan Barong, belajar membuat canang sari, dan merasakan pengalaman yoga di tengah alam. Paket ini sudah termasuk akomodasi hotel berbintang, sarapan, guide berpengalaman, dan transportasi AC.",
      shortDescription: "Eksplorasi budaya Bali autentik di Ubud dengan sawah, pura, dan seni tradisional",
      destinationId: ubud.id,
      price: 2500000,
      currency: "IDR",
      discountPercent: 15,
      duration: 3,
      nights: 2,
      minGroupSize: 2,
      maxGroupSize: 8,
      difficulty: "EASY",
      includes: JSON.stringify([
        "2 malam akomodasi hotel bintang 4",
        "Sarapan setiap hari",
        "Transport AC selama tour",
        "Guide berbahasa Indonesia/Inggris",
        "Tiket masuk semua objek wisata",
        "Pertunjukan tari Kecak & Barong",
        "Penjemputan & pengantaran hotel/bandara",
      ]),
      excludes: JSON.stringify([
        "Tiket pesawat",
        "Asuransi perjalanan",
        "Makan siang dan malam",
        "Pengeluaran pribadi",
        "Tips untuk guide & driver",
      ]),
      amenities: JSON.stringify([
        "Free WiFi di hotel",
        "Kolam Renang",
        "Spa & Wellness",
        "Airport Transfer",
        "Laundry Service",
      ]),
      travelStyle: JSON.stringify(["Budaya", "Santai", "Fotografi", "Spiritual"]),
      featured: true,
      rating: 4.9,
      reviewCount: 234,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
            alt: "Sawah Tegalalang",
            isPrimary: true,
            order: 1,
          },
        ],
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Tiba di Bali & Ubud Tour",
            description: "Penjemputan di bandara Ngurah Rai atau hotel Anda. Perjalanan menuju Ubud dengan singgah di Celuk (desa perak), Batuan (lukisan tradisional), dan Mas (ukiran kayu). Check-in hotel di Ubud. Sore hari kunjungi Monkey Forest dan jalan-jalan di Pasar Seni Ubud. Malam hari nikmati pertunjukan tari Barong.",
            meals: JSON.stringify(["Makan Malam"]),
            accommodation: "Hotel di Ubud",
            activities: JSON.stringify([
              "Penjemputan bandara/hotel",
              "Kunjungi desa seni (Celuk, Batuan, Mas)",
              "Check-in hotel",
              "Monkey Forest",
              "Pasar Seni Ubud",
              "Pertunjukan Tari Barong",
            ]),
          },
          {
            day: 2,
            title: "Sawah Terasering & Pura Suci",
            description: "Sarapan di hotel. Pagi hari kunjungi sawah terasering Tegalalang yang terkenal, sempat foto di Bali Swing. Lanjut ke Tirta Empul untuk upacara pembersihan spiritual (opsional). Makan siang di restoran dengan view sawah. Sore kunjungi Pura Gunung Kawi dan air terjun Tegenungan. Malam bebas untuk exploring Ubud town atau yoga session.",
            meals: JSON.stringify(["Sarapan", "Makan Siang"]),
            accommodation: "Hotel di Ubud",
            activities: JSON.stringify([
              "Sawah Terasering Tegalalang",
              "Bali Swing",
              "Pura Tirta Empul",
              "Makan siang view sawah",
              "Pura Gunung Kawi",
              "Air Terjun Tegenungan",
              "Free time di Ubud",
            ]),
          },
          {
            day: 3,
            title: "Workshop & Transfer Out",
            description: "Sarapan di hotel. Pagi hari ikuti workshop membuat canang sari (sesajen Bali) dan belajar tentang filosofi Hindu Bali. Kunjungi kopi luwak plantation dan cicipi kopi Bali yang terkenal. Check-out hotel. Transfer ke bandara atau hotel area lain di Bali. Tour selesai dengan kenangan indah.",
            meals: JSON.stringify(["Sarapan"]),
            accommodation: "-",
            activities: JSON.stringify([
              "Workshop membuat canang sari",
              "Kopi Luwak plantation",
              "Check-out hotel",
              "Transfer bandara/hotel",
            ]),
          },
        ],
      },
    },
  });

  // Create Seminyak Beach Tour
  await prisma.tour.create({
    data: {
      title: "Paket Liburan Seminyak Beach 4 Hari 3 Malam",
      slug: "paket-liburan-seminyak-beach-4-hari",
      description:
        "Nikmati liburan pantai yang sempurna di Seminyak dengan paket 4 hari 3 malam. Bersantai di beach club terkenal seperti Potato Head dan Ku De Ta, menikmati sunset di Tanah Lot, berbelanja di butik-butik trendi, dan merasakan kehidupan malam Seminyak yang semarak. Paket ini cocok untuk honeymoon, couple getaway, atau liburan bersama teman. Sudah termasuk hotel berbintang 5 dengan kolam renang infinity, spa treatment, dan welcome drink.",
      shortDescription: "Liburan pantai mewah di Seminyak dengan beach club dan sunset romantis",
      destinationId: seminyak.id,
      price: 4500000,
      currency: "IDR",
      discountPercent: 10,
      duration: 4,
      nights: 3,
      minGroupSize: 2,
      maxGroupSize: 6,
      difficulty: "EASY",
      includes: JSON.stringify([
        "3 malam hotel bintang 5 dengan breakfast",
        "Airport transfer private",
        "1x Beach club day pass",
        "1x Spa treatment (60 menit)",
        "Sunset tour ke Tanah Lot",
        "Welcome drink & fruit basket",
        "Complimentary upgrade (jika tersedia)",
      ]),
      excludes: JSON.stringify([
        "Tiket pesawat",
        "Makan siang dan malam",
        "Aktivitas water sports",
        "Shopping",
        "Pengeluaran pribadi",
      ]),
      amenities: JSON.stringify([
        "Infinity Pool",
        "Beachfront Access",
        "Spa & Wellness Center",
        "Fitness Center",
        "Restaurant & Bar",
        "Free WiFi",
        "Concierge Service",
      ]),
      travelStyle: JSON.stringify(["Pantai", "Luxury", "Romantic", "Santai"]),
      featured: true,
      rating: 4.8,
      reviewCount: 189,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
            alt: "Seminyak Beach",
            isPrimary: true,
            order: 1,
          },
        ],
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Arrival & Beach Relaxation",
            description: "Penjemputan di bandara dengan mobil private. Check-in di hotel bintang 5 di Seminyak dan nikmati welcome drink. Sore hari bersantai di pantai atau infinity pool hotel. Malam bebas untuk menjelajahi restoran dan bar di Seminyak.",
            meals: JSON.stringify(["Makan Malam (optional)"]),
            accommodation: "Hotel Bintang 5 Seminyak",
            activities: JSON.stringify([
              "Airport pickup",
              "Hotel check-in",
              "Beach time",
              "Pool relaxation",
              "Explore Seminyak",
            ]),
          },
          {
            day: 2,
            title: "Beach Club & Spa Day",
            description: "Sarapan di hotel. Pagi hari free time untuk berbelanja di butik-butik Seminyak atau jalan-jalan ke Oberoi street. Siang hari nikmati beach club experience dengan day pass (Potato Head atau similar). Sore spa treatment 60 menit untuk relaksasi maksimal. Malam jelajahi kuliner Seminyak.",
            meals: JSON.stringify(["Sarapan"]),
            accommodation: "Hotel Bintang 5 Seminyak",
            activities: JSON.stringify([
              "Shopping time",
              "Beach club day pass",
              "Spa treatment 60 menit",
              "Dinner di restoran pilihan",
            ]),
          },
          {
            day: 3,
            title: "Tanah Lot Sunset Tour",
            description: "Sarapan di hotel. Pagi dan siang free leisure - bisa bermain di pantai, surfing, atau spa tambahan. Sore hari tour ke Pura Tanah Lot untuk melihat sunset paling romantis di Bali. Kembali ke hotel. Malam bebas atau optional dinner di restoran beach front.",
            meals: JSON.stringify(["Sarapan"]),
            accommodation: "Hotel Bintang 5 Seminyak",
            activities: JSON.stringify([
              "Free morning",
              "Beach activities (optional)",
              "Tanah Lot sunset tour",
              "Dinner recommendation",
            ]),
          },
          {
            day: 4,
            title: "Departure",
            description: "Sarapan di hotel. Check-out dan free time sampai jadwal transfer ke bandara. Jika penerbangan sore/malam, bisa last minute shopping atau spa. Transfer ke bandara sesuai jadwal penerbangan. Tour selesai.",
            meals: JSON.stringify(["Sarapan"]),
            accommodation: "-",
            activities: JSON.stringify([
              "Hotel check-out",
              "Last minute shopping (optional)",
              "Airport transfer",
            ]),
          },
        ],
      },
    },
  });

  // Create Nusa Penida Day Trip
  await prisma.tour.create({
    data: {
      title: "One Day Trip Nusa Penida - Kelingking Beach & Snorkeling",
      slug: "one-day-trip-nusa-penida",
      description:
        "Jelajahi keindahan Nusa Penida dalam sehari penuh! Paket ini mengunjungi spot-spot ikonik seperti Kelingking Beach (T-Rex), Broken Beach, Angel's Billabong, dan Crystal Bay. Nikmati snorkeling di perairan jernih untuk melihat ikan tropis dan jika beruntung, Manta Ray! Paket sudah termasuk fast boat PP dari Sanur, makan siang, guide, dan peralatan snorkeling. Cocok untuk yang ingin petualangan seru dalam waktu singkat.",
      shortDescription: "Petualangan seru ke Nusa Penida: Kelingking Beach & snorkeling dengan Manta Ray",
      destinationId: nusaPenida.id,
      price: 850000,
      currency: "IDR",
      discountPercent: 0,
      duration: 1,
      nights: 0,
      minGroupSize: 2,
      maxGroupSize: 15,
      difficulty: "MODERATE",
      includes: JSON.stringify([
        "Fast boat PP Sanur-Nusa Penida",
        "Mobil + bensin keliling Nusa Penida",
        "Driver/guide lokal",
        "Tiket masuk objek wisata",
        "Makan siang di lokal resto",
        "Peralatan snorkeling",
        "Life jacket",
        "Mineral water",
        "Insurance boat",
      ]),
      excludes: JSON.stringify([
        "Pick up hotel (available dengan tambahan biaya)",
        "Breakfast",
        "Dinner",
        "Personal expenses",
        "Tips",
      ]),
      amenities: JSON.stringify([
        "Life Jacket",
        "Snorkeling Equipment",
        "Fast Boat",
        "Local Guide",
        "Drinking Water",
      ]),
      travelStyle: JSON.stringify(["Petualangan", "Snorkeling", "Fotografi", "Alam"]),
      featured: true,
      rating: 4.7,
      reviewCount: 412,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
            alt: "Kelingking Beach",
            isPrimary: true,
            order: 1,
          },
        ],
      },
      itinerary: {
        create: [
          {
            day: 1,
            title: "Full Day Nusa Penida Adventure",
            description: "Berkumpul di Sanur Harbor pukul 06:30. Berangkat dengan fast boat ke Nusa Penida (30-45 menit). Tiba di Nusa Penida dan langsung tour mengunjungi Kelingking Beach untuk foto ikonik T-Rex (trek menurun opsional), Angel's Billabong dan Broken Beach untuk pemandangan spektakuler. Makan siang di local warung. Lanjut snorkeling di Crystal Bay atau Manta Point. Kembali ke harbor Nusa Penida sekitar pukul 15:00 dan naik fast boat kembali ke Sanur. Tiba di Sanur sekitar pukul 16:00-16:30. Tour selesai.",
            meals: JSON.stringify(["Makan Siang"]),
            accommodation: "-",
            activities: JSON.stringify([
              "Fast boat Sanur-Nusa Penida",
              "Kelingking Beach visit & photo",
              "Angel's Billabong",
              "Broken Beach",
              "Lunch break",
              "Snorkeling di Crystal Bay/Manta Point",
              "Fast boat kembali ke Sanur",
            ]),
          },
        ],
      },
    },
  });

  console.log("✅ Tours created");

  // Create sample users
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
      name: "Admin OkabaliTravel",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Users created (1 regular, 1 admin)");
  console.log("🎉 Database seeded successfully - OkabaliTravel!");
  console.log("");
  console.log("=== INFORMASI LOGIN ===");
  console.log("Regular User:");
  console.log("  Email: demo@okabalitravel.com");
  console.log("  Password: demo123");
  console.log("");
  console.log("Admin:");
  console.log("  Email: admin@okabalitravel.com");
  console.log("  Password: admin123");
  console.log("");
  console.log("Destinasi: Ubud, Seminyak, Nusa Penida");
  console.log("Tours: 3 paket wisata Bali");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
