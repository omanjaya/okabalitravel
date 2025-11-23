"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icons } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardHoverVariants } from "@/lib/animations";
import { formatCurrency } from "@/lib/helpers";
import { getPackageTypeInfo } from "@/lib/constants/package-types";
import { useTranslations } from "next-intl";
import { WishlistButton } from "./WishlistButton";
import { ShareButton } from "./ShareButton";
import { CompareButton } from "./CompareButton";

interface PackageData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  type: string;
  price: number;
  currency: string;
  discountPercent: number | null;
  duration: number;
  nights: number;
  regency?: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tourCount: number;
}

interface PackageCardProps {
  package: PackageData;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const t = useTranslations();
  const typeInfo = getPackageTypeInfo(pkg.type);

  const discountedPrice = pkg.discountPercent
    ? pkg.price * (1 - pkg.discountPercent / 100)
    : null;

  const packageUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/packages/${pkg.slug}`;

  return (
    <Link href={`/packages/${pkg.slug}`} aria-label={`View ${pkg.name} package details`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover-lift shadow-lg hover:shadow-ocean transition-all duration-300 group">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

            {pkg.featured && (
              <Badge className="absolute top-3 left-3 bg-gradient-sunset text-white border-0 shadow-sunset flex items-center gap-1">
                <Icons.fire size={14} weight="fill" />
                Featured
              </Badge>
            )}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              {pkg.discountPercent && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {pkg.discountPercent}% OFF
                </Badge>
              )}
              <Badge className={`${typeInfo.color} text-white`}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>
            </div>

            {/* Wishlist, Compare and Share Buttons */}
            <div
              className="absolute bottom-3 right-3 flex items-center space-x-2"
              onClick={(e) => e.preventDefault()}
            >
              <CompareButton
                packageData={{
                  id: pkg.id,
                  name: pkg.name,
                  slug: pkg.slug,
                  image: pkg.image,
                  price: pkg.price,
                  currency: pkg.currency,
                }}
                variant="default"
                size="icon"
                className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm"
              />
              <WishlistButton
                packageId={pkg.id}
                variant="default"
                size="icon"
                className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm"
              />
              <ShareButton
                url={packageUrl}
                title={pkg.name}
                description={pkg.shortDescription}
                variant="default"
                size="icon"
                className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm"
              />
            </div>

            <div className="absolute bottom-3 left-3 glass px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-md border border-white/20">
              <Icons.star size={16} weight="fill" className="text-amber-400" />
              <span className="font-bold text-sm text-white drop-shadow">{pkg.rating}</span>
              <span className="text-xs text-white/90">({pkg.reviewCount})</span>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{pkg.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{pkg.shortDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                <Icons.clock size={16} weight="duotone" className="mr-1.5 flex-shrink-0 text-bali-ocean" />
                <span className="font-medium">{pkg.duration}D/{pkg.nights}N</span>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
                <Icons.package size={16} weight="duotone" className="mr-1.5 flex-shrink-0 text-bali-sunset" />
                <span className="font-medium">{pkg.tourCount} Tours</span>
              </div>
              {pkg.regency && (
                <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg px-3 py-2 col-span-2 transition-colors hover:bg-gray-100">
                  <Icons.mapPin size={16} weight="duotone" className="mr-1.5 flex-shrink-0 text-bali-palm" />
                  <span className="font-medium">{pkg.regency}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">{t('destinations.from')}</p>
                  <div className="flex items-baseline space-x-2">
                    {discountedPrice ? (
                      <>
                        <span className="text-xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                          {formatCurrency(discountedPrice, pkg.currency)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(pkg.price, pkg.currency)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                        {formatCurrency(pkg.price, pkg.currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{t('destinations.perPerson')}</p>
                </div>
                <Button
                  size="sm"
                  className="btn-premium shadow-ocean"
                  aria-label={`View details for ${pkg.name}`}
                >
                  {t('common.viewAll')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
