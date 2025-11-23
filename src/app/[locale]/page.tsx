import { prisma } from "@/server/db/client";
import { HeroSection } from "@/components/features/HeroSection";
import { FeaturedDestinations } from "@/components/features/FeaturedDestinations";

async function getFeaturedDestinations() {
  const destinations = await prisma.destination.findMany({
    where: { featured: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      tours: {
        take: 1,
        orderBy: { price: "asc" },
      },
    },
    take: 6,
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

export default async function HomePage() {
  const featuredDestinations = await getFeaturedDestinations();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedDestinations destinations={featuredDestinations} />
    </div>
  );
}
