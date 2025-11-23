import { Suspense } from "react";
import { prisma } from "@/server/db/client";
import { DestinationCard } from "@/components/features/DestinationCard";
import { FilterSidebar } from "@/components/features/FilterSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchParams {
  q?: string;
  continent?: string;
  priceMin?: string;
  priceMax?: string;
  rating?: string;
}

async function getDestinations(searchParams: SearchParams) {
  const { q, continent, priceMin, priceMax, rating } = searchParams;

  const destinations = await prisma.destination.findMany({
    where: {
      AND: [
        // Filter untuk Bali saja
        {
          OR: [
            { country: { contains: "Indonesia" } },
            { name: { contains: "Bali" } },
          ],
        },
        q
          ? {
              OR: [
                { name: { contains: q } },
                { country: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {},
        continent ? { continent } : {},
        rating ? { rating: { gte: parseFloat(rating) } } : {},
      ],
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      tours: {
        where:
          priceMin || priceMax
            ? {
                AND: [
                  priceMin ? { price: { gte: parseFloat(priceMin) } } : {},
                  priceMax ? { price: { lte: parseFloat(priceMax) } } : {},
                ],
              }
            : {},
        take: 1,
        orderBy: { price: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return destinations.map((dest) => ({
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    country: dest.country,
    continent: dest.continent,
    shortDescription: dest.shortDescription,
    image: dest.images[0]?.url || "/placeholder.jpg",
    rating: dest.rating,
    reviewCount: dest.reviewCount,
    price: dest.tours[0]?.price,
    currency: dest.tours[0]?.currency,
    tags: JSON.parse(dest.tags),
    featured: dest.featured,
  }));
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const destinations = await getDestinations(params);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jelajahi Destinasi Bali
          </h1>
          <p className="text-xl text-gray-600">
            Temukan tempat-tempat menakjubkan di Pulau Dewata
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form action="/destinations" method="get">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                name="q"
                placeholder="Cari destinasi wisata di Bali..."
                defaultValue={params.q}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar searchParams={params} />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{destinations.length}</span>{" "}
                destinasi ditemukan
              </p>
            </div>

            {/* Results Grid */}
            {destinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                  <DestinationCard key={destination.id} {...destination} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  Tidak ada destinasi yang ditemukan.
                </p>
                <p className="text-gray-500 mt-2">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
