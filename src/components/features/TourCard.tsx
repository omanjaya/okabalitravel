"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Users, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/features/WishlistButton";
import { cardHoverVariants } from "@/lib/animations";
import { formatCurrency, formatDuration, formatGroupSize } from "@/lib/helpers";

interface Tour {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  price: number;
  currency: string;
  discountPercent: number | null;
  duration: number;
  nights: number;
  minGroupSize: number;
  maxGroupSize: number;
  difficulty: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  travelStyle: string[];
}

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const discountedPrice = tour.discountPercent
    ? tour.price * (1 - tour.discountPercent / 100)
    : null;

  return (
    <Link href={`/tours/${tour.slug}`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
            {tour.featured && (
              <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600">
                Featured
              </Badge>
            )}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              {tour.discountPercent && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {tour.discountPercent}% OFF
                </Badge>
              )}
              <div className="bg-white/90 backdrop-blur-sm rounded-full">
                <WishlistButton tourId={tour.id} variant="icon" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-sm">{tour.rating}</span>
              <span className="text-xs text-gray-600">({tour.reviewCount})</span>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{tour.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{tour.shortDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>{formatDuration(tour.duration, tour.nights)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>{formatGroupSize(tour.minGroupSize, tour.maxGroupSize)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="capitalize">{tour.difficulty}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>{tour.travelStyle?.[0] || "N/A"}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <div className="flex items-baseline space-x-2">
                    {discountedPrice ? (
                      <>
                        <span className="text-xl font-bold text-sky-600">
                          {formatCurrency(discountedPrice, tour.currency)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(tour.price, tour.currency)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-sky-600">
                        {formatCurrency(tour.price, tour.currency)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
