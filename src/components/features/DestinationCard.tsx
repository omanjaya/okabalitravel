"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icons } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/features/WishlistButton";
import { cardHoverVariants } from "@/lib/animations";
import { formatCurrency } from "@/lib/helpers";

interface DestinationCardProps {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  shortDescription: string;
  image: string;
  rating: number;
  reviewCount: number;
  price?: number;
  currency?: string;
  tags: string[];
  featured?: boolean;
}

export function DestinationCard({
  id,
  name,
  slug,
  country,
  continent,
  shortDescription,
  image,
  rating,
  reviewCount,
  price,
  currency = "USD",
  tags,
  featured = false,
}: DestinationCardProps) {
  return (
    <Link href={`/destinations/${slug}`} aria-label={`View ${name} destination details`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover-lift shadow-lg hover:shadow-tropical transition-all duration-300 border-0 group">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

            {featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-sunset text-white border-0 shadow-sunset flex items-center gap-1">
                <Icons.trending size={14} weight="fill" />
                Featured
              </Badge>
            )}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="glass px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-md border border-white/20">
                <Icons.star size={16} weight="fill" className="text-amber-400" />
                <span className="font-bold text-sm text-white drop-shadow">{rating}</span>
                <span className="text-xs text-white/90">({reviewCount})</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                <WishlistButton destinationId={id} variant="icon" />
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1.5 group-hover:text-bali-ocean transition-colors">
                  {name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 space-x-1.5 bg-gray-50 rounded-full px-3 py-1 w-fit">
                  <Icons.mapPin size={14} weight="duotone" className="text-bali-palm" />
                  <span className="font-medium">
                    {country}, {continent}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-medium bg-gradient-to-r from-sky-50 to-emerald-50 text-gray-700 border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {price && (
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Starting from</p>
                  <p className="text-2xl font-bold bg-gradient-tropical bg-clip-text text-transparent">
                    {formatCurrency(price, currency)}
                  </p>
                </div>
                <motion.div
                  className="flex items-center space-x-1 text-sm font-semibold text-bali-ocean hover:text-bali-lagoon group/link"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span>View Tours</span>
                  <Icons.arrowRight size={16} weight="bold" className="group-hover/link:translate-x-1 transition-transform" />
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
