import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { ImageGallery } from "@/components/features/ImageGallery";
import { TourCard } from "@/components/features/TourCard";
import { MapPin, Calendar, Globe, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getDestination(slug: string) {
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      tours: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { featured: "desc" },
      },
    },
  });

  if (!destination) return null;

  return {
    ...destination,
    tags: JSON.parse(destination.tags),
    languages: JSON.parse(destination.languages),
    bestTimeToVisit: JSON.parse(destination.bestTimeToVisit),
    tours: destination.tours.map((tour) => ({
      ...tour,
      includes: JSON.parse(tour.includes),
      excludes: JSON.parse(tour.excludes),
      amenities: JSON.parse(tour.amenities),
      travelStyle: JSON.parse(tour.travelStyle),
      image: tour.images[0]?.url || "/placeholder.jpg",
    })),
  };
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
    };
  }

  return {
    title: `${destination.name}, ${destination.country} - Travel Tours & Packages`,
    description: destination.shortDescription,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Image Gallery */}
      <ImageGallery images={destination.images} destinationName={destination.name} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="h-5 w-5" />
                <span>
                  {destination.country}, {destination.continent}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {destination.name}
              </h1>
              <p className="text-xl text-gray-600">{destination.shortDescription}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {destination.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            </div>

            {/* Tours Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Available Tours ({destination.tours.length})
              </h2>
              {destination.tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No tours available at the moment.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Best Time to Visit</p>
                      <p className="text-sm text-gray-600">
                        {destination.bestTimeToVisit.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Languages</p>
                      <p className="text-sm text-gray-600">{destination.languages.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Currency</p>
                      <p className="text-sm text-gray-600">{destination.currency}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Timezone</p>
                      <p className="text-sm text-gray-600">{destination.timezone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" size="lg">
                    Contact Travel Expert
                  </Button>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Traveler Rating</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold">{destination.rating}</span>
                  <span className="text-xl">/ 5.0</span>
                </div>
                <p className="text-sm text-white/90 mt-2">
                  Based on {destination.reviewCount} reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
