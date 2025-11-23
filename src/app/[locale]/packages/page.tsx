import { prisma } from "@/server/db/client";
import { PackageCard } from "@/components/features/PackageCard";
import { getTranslations } from "next-intl/server";

interface SearchParams {
  type?: string;
  regency?: string;
  priceMin?: string;
  priceMax?: string;
  duration?: string;
}

async function getPackages(searchParams: SearchParams) {
  const { type, regency, priceMin, priceMax, duration } = searchParams;

  const where: any = {};

  if (type) {
    where.type = type;
  }

  if (regency) {
    where.regency = regency;
  }

  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = parseFloat(priceMin);
    if (priceMax) where.price.lte = parseFloat(priceMax);
  }

  if (duration) {
    where.duration = parseInt(duration);
  }

  const packages = await prisma.package.findMany({
    where,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      packageTours: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    shortDescription: pkg.shortDescription,
    image: pkg.images[0]?.url || "/placeholder.jpg",
    type: pkg.type,
    price: pkg.price,
    currency: pkg.currency,
    discountPercent: pkg.discountPercent,
    duration: pkg.duration,
    nights: pkg.nights,
    regency: pkg.regency || undefined,
    rating: pkg.rating,
    reviewCount: pkg.reviewCount,
    featured: pkg.featured,
    tourCount: pkg.packageTours.length,
  }));
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const packages = await getPackages(params);
  const t = await getTranslations();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('packages.pageTitle')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('packages.pageSubtitle')}
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{packages.length}</span>{" "}
            {t('packages.resultsCount')}
          </p>
        </div>

        {/* Results Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {t('packages.noResults')}
            </p>
            <p className="text-gray-500 mt-2">
              {t('packages.noResultsHint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
