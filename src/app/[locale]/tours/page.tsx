import { Suspense } from "react";
import { prisma } from "@/server/db/client";
import { TourCard } from "@/components/features/TourCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchParams {
  q?: string;
  destination?: string;
  priceMin?: string;
  priceMax?: string;
  difficulty?: string;
  duration?: string;
}

async function getTours(searchParams: SearchParams) {
  const { q, destination, priceMin, priceMax, difficulty, duration } = searchParams;

  const tours = await prisma.tour.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { shortDescription: { contains: q } },
              ],
            }
          : {},
        destination ? { destination: { slug: destination } } : {},
        priceMin ? { price: { gte: parseFloat(priceMin) } } : {},
        priceMax ? { price: { lte: parseFloat(priceMax) } } : {},
        difficulty ? { difficulty } : {},
        duration ? { duration: { gte: parseInt(duration) } } : {},
      ],
    },
    include: {
      destination: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return tours.map((tour) => ({
    id: tour.id,
    title: tour.title,
    slug: tour.slug,
    destination: tour.destination.name,
    destinationSlug: tour.destination.slug,
    shortDescription: tour.shortDescription,
    image: tour.images[0]?.url || "/placeholder.jpg",
    price: tour.price,
    currency: tour.currency,
    duration: tour.duration,
    nights: tour.nights,
    difficulty: tour.difficulty,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    featured: tour.featured,
    travelStyle: JSON.parse(tour.travelStyle || "[]") as string[],
    minGroupSize: tour.minGroupSize,
    maxGroupSize: tour.maxGroupSize,
    discountPercent: tour.discountPercent,
  }));
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tours = await getTours(params);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jelajahi Tour Bali
          </h1>
          <p className="text-xl text-gray-600">
            Temukan pengalaman wisata terbaik di Pulau Dewata
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Cari tour berdasarkan nama atau lokasi..."
            className="pl-12 h-14 text-lg"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Filter Tour</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tingkat Kesulitan
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Tingkat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tingkat</SelectItem>
                      <SelectItem value="easy">Mudah</SelectItem>
                      <SelectItem value="moderate">Sedang</SelectItem>
                      <SelectItem value="challenging">Menantang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Durasi (Hari)
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Durasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Durasi</SelectItem>
                      <SelectItem value="1">1 Hari</SelectItem>
                      <SelectItem value="2">2-3 Hari</SelectItem>
                      <SelectItem value="4">4-7 Hari</SelectItem>
                      <SelectItem value="8">8+ Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Harga
                  </label>
                  <div className="space-y-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Tours Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Menampilkan {tours.length} tour
              </p>
              <Select defaultValue="featured">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Terpopuler</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Suspense fallback={<div>Loading tours...</div>}>
              {tours.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada tour yang ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
