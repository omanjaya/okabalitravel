import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/server/db/client";
import {
  Clock,
  Users,
  TrendingUp,
  Star,
  Check,
  X,
  Calendar,
  Shield,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourBookingSection } from "@/components/features/TourBookingSection";
import { ReviewForm } from "@/components/features/ReviewForm";
import { ReviewsList } from "@/components/features/ReviewsList";
import { formatCurrency, formatDuration, formatGroupSize } from "@/lib/helpers";
import type { Metadata } from "next";

interface TourPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getTour(slug: string) {
  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      destination: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
      images: {
        orderBy: { order: "asc" },
      },
      itinerary: {
        orderBy: { day: "asc" },
      },
    },
  });

  if (!tour) return null;

  return {
    ...tour,
    includes: JSON.parse(tour.includes),
    excludes: JSON.parse(tour.excludes),
    amenities: JSON.parse(tour.amenities),
    travelStyle: JSON.parse(tour.travelStyle),
    itinerary: tour.itinerary.map((day) => ({
      ...day,
      meals: JSON.parse(day.meals),
      activities: JSON.parse(day.activities),
    })),
  };
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return {
      title: "Tour Not Found",
    };
  }

  return {
    title: `${tour.title} - ${tour.destination.name} Tour Package`,
    description: tour.shortDescription,
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    notFound();
  }

  const discountedPrice = tour.discountPercent
    ? tour.price * (1 - tour.discountPercent / 100)
    : null;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={tour.images[0]?.url || tour.destination.images[0]?.url || "/placeholder.jpg"}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            {tour.featured && (
              <Badge className="mb-3 bg-amber-500">Featured Tour</Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{tour.rating}</span>
                <span className="text-sm">({tour.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium">{formatDuration(tour.duration, tour.nights)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Users className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-xs text-gray-500">Group Size</p>
                      <p className="font-medium">
                        {formatGroupSize(tour.minGroupSize, tour.maxGroupSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <TrendingUp className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <p className="font-medium capitalize">{tour.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Award className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-xs text-gray-500">Style</p>
                      <p className="font-medium">{tour.travelStyle[0]}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Includes/Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-emerald-600">
                    <Check className="mr-2 h-5 w-5" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-red-600">
                    <X className="mr-2 h-5 w-5" />
                    What's Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.excludes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.id} className="border-l-4 border-sky-500 pl-6 pb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {day.day}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-3">{day.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {day.meals.length > 0 && (
                        <div>
                          <span className="font-medium">Meals:</span> {day.meals.join(", ")}
                        </div>
                      )}
                      {day.accommodation && (
                        <div>
                          <span className="font-medium">Stay:</span> {day.accommodation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>

              {/* Reviews List */}
              <ReviewsList tourId={tour.id} />

              {/* Review Form */}
              <ReviewForm tourId={tour.id} tourTitle={tour.title} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <Card className="shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Price per person</p>
                    <div className="flex items-baseline space-x-2">
                      {discountedPrice ? (
                        <>
                          <span className="text-3xl font-bold text-sky-600">
                            {formatCurrency(discountedPrice, tour.currency)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatCurrency(tour.price, tour.currency)}
                          </span>
                          <Badge className="bg-red-500">{tour.discountPercent}% OFF</Badge>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-sky-600">
                          {formatCurrency(tour.price, tour.currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <TourBookingSection
                    tour={{
                      id: tour.id,
                      title: tour.title,
                      price: tour.price,
                      currency: tour.currency,
                      discountPercent: tour.discountPercent,
                      minGroupSize: tour.minGroupSize,
                      maxGroupSize: tour.maxGroupSize,
                    }}
                  />

                  <div className="pt-6 border-t space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                      <span>Free cancellation up to 24 hours</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-emerald-500 mr-2" />
                      <span>Best price guarantee</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-5 w-5 text-emerald-500 mr-2" />
                      <span>Expert local guides</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Our travel experts are here to help you plan the perfect trip
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
