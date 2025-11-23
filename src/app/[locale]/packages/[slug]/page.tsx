import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Star, Clock, Users, MapPin, Package as PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPackageTypeInfo } from "@/lib/constants/package-types";
import { PackageBookingCard } from "@/components/features/PackageBookingCard";
import { PackageActionButtons } from "@/components/features/PackageActionButtons";
import { PackageReviewsSection } from "@/components/features/PackageReviewsSection";

async function getPackage(slug: string) {
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      packageTours: {
        include: {
          tour: {
            include: {
              destination: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!pkg) {
    return null;
  }

  return pkg;
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const packageData = await getPackage(slug);
  const t = await getTranslations();

  if (!packageData) {
    notFound();
  }

  const typeInfo = getPackageTypeInfo(packageData.type);
  const primaryImage = packageData.images.find((img) => img.isPrimary) || packageData.images[0];
  const includes = JSON.parse(packageData.includes);
  const excludes = JSON.parse(packageData.excludes);
  const highlights = JSON.parse(packageData.highlights);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-96 mb-8">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={packageData.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge className={`${typeInfo.color} text-white`}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>
              {packageData.featured && (
                <Badge className="bg-amber-500">Featured</Badge>
              )}
            </div>
            <PackageActionButtons
              packageId={packageData.id}
              packageName={packageData.name}
              packageSlug={packageData.slug}
              description={packageData.description}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {packageData.name}
          </h1>
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-semibold">{packageData.rating}</span>
              <span className="ml-1">({packageData.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{packageData.duration}D/{packageData.nights}N</span>
            </div>
            <div className="flex items-center">
              <PackageIcon className="h-5 w-5 mr-1" />
              <span>{packageData.packageTours.length} Tours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">{t('tours.overview')}</h2>
              <p className="text-gray-700 whitespace-pre-line">{packageData.description}</p>
            </section>

            {/* Included Tours */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Included Tours</h2>
              <div className="space-y-4">
                {packageData.packageTours.map((pt, index) => (
                  <div key={pt.id} className="border rounded-lg p-4 flex items-start space-x-4">
                    {pt.tour.images[0] && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={pt.tour.images[0].url}
                          alt={pt.tour.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Day {pt.day}</p>
                          <h3 className="text-lg font-semibold">{pt.tour.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{pt.tour.destination.name}</p>
                        </div>
                        {pt.optional && (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                <ul className="space-y-2">
                  {highlights.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Includes / Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-xl font-bold mb-4">{t('tours.included')}</h3>
                <ul className="space-y-2">
                  {includes.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-bold mb-4">{t('tours.excluded')}</h3>
                <ul className="space-y-2">
                  {excludes.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Reviews Section */}
            <section>
              <PackageReviewsSection
                packageId={packageData.id}
                packageName={packageData.name}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PackageBookingCard
                packageId={packageData.id}
                packageName={packageData.name}
                price={packageData.price}
                discountedPrice={packageData.discountPercent ? packageData.price * (1 - packageData.discountPercent / 100) : null}
                currency={packageData.currency}
                duration={packageData.duration}
                nights={packageData.nights}
                minGroupSize={packageData.minGroupSize}
                maxGroupSize={packageData.maxGroupSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
