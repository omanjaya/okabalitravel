import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  Users,
  MapPin,
  Check,
  X,
  Calendar,
  Package as PackageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/helpers";
import { getPackageTypeInfo } from "@/lib/constants/package-types";

async function getPackages(slugs: string[]) {
  const packages = await prisma.package.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      packageTours: {
        include: {
          tour: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return packages;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ packages?: string }>;
}) {
  const params = await searchParams;
  const slugsParam = params.packages;

  if (!slugsParam) {
    notFound();
  }

  const slugs = slugsParam.split(",").filter(Boolean);

  if (slugs.length < 2 || slugs.length > 3) {
    notFound();
  }

  const packages = await getPackages(slugs);

  if (packages.length < 2) {
    notFound();
  }

  const t = await getTranslations();

  // Comparison attributes
  const attributes = [
    { key: "image", label: "Image", type: "image" },
    { key: "name", label: "Package Name", type: "text" },
    { key: "type", label: "Package Type", type: "type" },
    { key: "price", label: "Price (per person)", type: "price" },
    { key: "duration", label: "Duration", type: "duration" },
    { key: "regency", label: "Location", type: "text" },
    { key: "minGroupSize", label: "Min Group Size", type: "number" },
    { key: "maxGroupSize", label: "Max Group Size", type: "number" },
    { key: "rating", label: "Rating", type: "rating" },
    { key: "tourCount", label: "Included Tours", type: "tours" },
    { key: "featured", label: "Featured", type: "boolean" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Package Comparison
          </h1>
          <p className="text-gray-600">
            Compare {packages.length} packages side by side
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${packages.length}, 1fr)` }}>
              {/* Header Row - Package Cards */}
              <div></div> {/* Empty cell for attribute names column */}
              {packages.map((pkg) => {
                const typeInfo = getPackageTypeInfo(pkg.type);
                const primaryImage = pkg.images[0];
                const discountedPrice = pkg.discountPercent
                  ? pkg.price * (1 - pkg.discountPercent / 100)
                  : null;

                return (
                  <Card key={pkg.id} className="overflow-hidden">
                    <div className="relative h-40">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={pkg.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      {pkg.featured && (
                        <Badge className="absolute top-2 left-2 bg-amber-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 text-center">
                      <Link href={`/packages/${pkg.slug}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Comparison Rows */}
              {attributes.map((attr) => (
                <>
                  {/* Attribute Name */}
                  <div
                    key={`label-${attr.key}`}
                    className="flex items-center font-semibold text-gray-700 bg-gray-100 p-4 rounded-lg"
                  >
                    {attr.label}
                  </div>

                  {/* Attribute Values */}
                  {packages.map((pkg: any) => (
                    <div
                      key={`${pkg.id}-${attr.key}`}
                      className="flex items-center justify-center p-4 bg-white rounded-lg border"
                    >
                      {attr.type === "image" && pkg.images[0] && (
                        <div className="relative w-full h-24">
                          <Image
                            src={pkg.images[0].url}
                            alt={pkg.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}

                      {attr.type === "text" && (
                        <span className="text-center">{pkg[attr.key] || "N/A"}</span>
                      )}

                      {attr.type === "type" && (
                        <Badge className={`${getPackageTypeInfo(pkg[attr.key]).color} text-white`}>
                          {getPackageTypeInfo(pkg[attr.key]).label}
                        </Badge>
                      )}

                      {attr.type === "price" && (
                        <div className="text-center">
                          {pkg.discountPercent ? (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {formatCurrency(pkg.price, pkg.currency)}
                              </p>
                              <p className="text-lg font-bold text-sky-600">
                                {formatCurrency(
                                  pkg.price * (1 - pkg.discountPercent / 100),
                                  pkg.currency
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-sky-600">
                              {formatCurrency(pkg.price, pkg.currency)}
                            </p>
                          )}
                        </div>
                      )}

                      {attr.type === "duration" && (
                        <div className="text-center">
                          <p className="font-semibold">{pkg.duration} days</p>
                          <p className="text-sm text-gray-500">{pkg.nights} nights</p>
                        </div>
                      )}

                      {attr.type === "number" && (
                        <span className="font-semibold">{pkg[attr.key]}</span>
                      )}

                      {attr.type === "rating" && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{pkg.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({pkg.reviewCount})
                          </span>
                        </div>
                      )}

                      {attr.type === "tours" && (
                        <span className="font-semibold">
                          {pkg.packageTours.length} tours
                        </span>
                      )}

                      {attr.type === "boolean" && (
                        pkg[attr.key] ? (
                          <Check className="h-6 w-6 text-green-500" />
                        ) : (
                          <X className="h-6 w-6 text-gray-300" />
                        )
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/packages">
            <Button variant="outline">Back to Packages</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
