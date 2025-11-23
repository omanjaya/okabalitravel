"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Star,
  DollarSign,
  Trash2,
  Loader2,
  ArrowRight,
  Calendar,
  Users,
  Package as PackageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helpers";
import { ShareButton } from "@/components/features/ShareButton";

interface WishlistItem {
  id: string;
  createdAt: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    country: string;
    continent: string;
    rating: number;
    reviewCount: number;
    images: Array<{
      url: string;
      alt: string;
    }>;
  };
  tour?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    price: number;
    currency: string;
    discountPercent: number | null;
    duration: number;
    nights: number;
    rating: number;
    reviewCount: number;
    destination: {
      name: string;
      country: string;
    };
    images: Array<{
      url: string;
      alt: string;
    }>;
  };
  package?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    discountPercent: number | null;
    duration: number;
    nights: number;
    regency: string | null;
    featured: boolean;
    minGroupSize: number;
    maxGroupSize: number;
    images: Array<{
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      // Fetch both general wishlist and package wishlist
      const [wishlistResponse, packageWishlistResponse] = await Promise.all([
        fetch("/api/wishlist"),
        fetch("/api/wishlist/packages"),
      ]);

      const [wishlistData, packageWishlistData] = await Promise.all([
        wishlistResponse.json(),
        packageWishlistResponse.json(),
      ]);

      if (!wishlistResponse.ok && !packageWishlistResponse.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      // Combine wishlist items
      const generalWishlist = wishlistData.wishlist || [];
      const packageWishlist = (packageWishlistData.items || []).map((item: any) => ({
        id: item.id,
        createdAt: item.createdAt,
        package: item.package,
      }));

      // Merge and sort by createdAt
      const allWishlist = [...generalWishlist, ...packageWishlist].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setWishlist(allWishlist);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string, packageId?: string) => {
    setRemovingId(id);
    try {
      let response;
      if (packageId) {
        // Remove from package wishlist
        response = await fetch(`/api/wishlist/packages?packageId=${packageId}`, {
          method: "DELETE",
        });
      } else {
        // Remove from general wishlist (destinations/tours)
        response = await fetch(`/api/wishlist?id=${id}`, {
          method: "DELETE",
        });
      }

      if (response.ok) {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding your favorite destinations, tours, and packages to your wishlist
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/destinations">
                  <Button variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    Explore Destinations
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button>
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Browse Packages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item, index) => {
              const isDestination = !!item.destination;
              const isTour = !!item.tour;
              const isPackage = !!item.package;

              let imageUrl = "/placeholder.jpg";
              let link = "#";
              let title = "";
              let shortDescription = "";
              let rating = 0;
              let reviewCount = 0;

              if (isDestination) {
                imageUrl = item.destination!.images[0]?.url || "/placeholder.jpg";
                link = `/destinations/${item.destination!.slug}`;
                title = item.destination!.name;
                shortDescription = item.destination!.shortDescription;
                rating = item.destination!.rating;
                reviewCount = item.destination!.reviewCount;
              } else if (isTour) {
                imageUrl = item.tour!.images[0]?.url || "/placeholder.jpg";
                link = `/tours/${item.tour!.slug}`;
                title = item.tour!.title;
                shortDescription = item.tour!.shortDescription;
                rating = item.tour!.rating;
                reviewCount = item.tour!.reviewCount;
              } else if (isPackage) {
                const primaryImage = item.package!.images.find(img => img.isPrimary);
                imageUrl = primaryImage?.url || item.package!.images[0]?.url || "/placeholder.jpg";
                link = `/packages/${item.package!.slug}`;
                title = item.package!.name;
                shortDescription = item.package!.description;
              }

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all overflow-hidden">
                    <div className="relative">
                      {/* Image */}
                      <Link href={link}>
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                          {/* Badge */}
                          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
                            {isDestination ? "Destination" : isTour ? "Tour" : "Package"}
                          </Badge>

                          {/* Rating (not for packages) */}
                          {!isPackage && (
                            <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-lg">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold">{rating}</span>
                              <span className="text-xs text-gray-500">({reviewCount})</span>
                            </div>
                          )}

                          {/* Featured badge for packages */}
                          {isPackage && item.package!.featured && (
                            <div className="absolute bottom-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              <span className="text-xs font-semibold">Featured</span>
                            </div>
                          )}

                          {/* Discount badge for packages */}
                          {isPackage && item.package!.discountPercent && (
                            <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-1 rounded-lg">
                              <span className="text-xs font-bold">{item.package!.discountPercent}% OFF</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id, isPackage ? item.package!.id : undefined)}
                        disabled={removingId === item.id}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 rounded-full"
                      >
                        {removingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>

                    <CardContent className="p-5">
                      {/* Title */}
                      <Link href={link}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1">
                          {title}
                        </h3>
                      </Link>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {isDestination
                          ? `${item.destination!.country}, ${item.destination!.continent}`
                          : isTour
                          ? `${item.tour!.destination.name}, ${item.tour!.destination.country}`
                          : `${item.package!.regency || "Bali"}, Indonesia`}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {shortDescription}
                      </p>

                      {/* Duration & Group Size (for packages) */}
                      {isPackage && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {item.package!.duration}D/{item.package!.nights}N
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {item.package!.minGroupSize}-{item.package!.maxGroupSize}
                          </div>
                        </div>
                      )}

                      {/* Price (for tours) */}
                      {isTour && item.tour && (
                        <div className="mb-4">
                          <div className="flex items-baseline space-x-2">
                            {item.tour.discountPercent ? (
                              <>
                                <span className="text-xl font-bold text-sky-600">
                                  {formatCurrency(
                                    item.tour.price * (1 - item.tour.discountPercent / 100),
                                    item.tour.currency
                                  )}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {formatCurrency(item.tour.price, item.tour.currency)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-sky-600">
                                {formatCurrency(item.tour.price, item.tour.currency)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.tour.duration} days, {item.tour.nights} nights
                          </p>
                        </div>
                      )}

                      {/* Price (for packages) */}
                      {isPackage && (
                        <div className="border-t pt-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              {item.package!.discountPercent ? (
                                <>
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatCurrency(item.package!.price, item.package!.currency)}
                                  </p>
                                  <p className="text-xl font-bold text-sky-600">
                                    {formatCurrency(
                                      item.package!.price * (1 - item.package!.discountPercent / 100),
                                      item.package!.currency
                                    )}
                                  </p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-sky-600">
                                  {formatCurrency(item.package!.price, item.package!.currency)}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">per person</p>
                            </div>
                            <ShareButton
                              url={`${typeof window !== "undefined" ? window.location.origin : ""}/packages/${item.package!.slug}`}
                              title={item.package!.name}
                              description={item.package!.description}
                              variant="outline"
                              size="icon"
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <Link href={link}>
                        <Button className="w-full">
                          {isDestination ? "View Destination" : isTour ? "View Tour" : "View Package"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
