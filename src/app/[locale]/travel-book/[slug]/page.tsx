import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { MapPin, Book, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryInfo } from "@/lib/constants/package-types";

async function getTravelBook(slug: string) {
  const book = await prisma.travelBook.findUnique({
    where: { slug },
    include: {
      chapters: {
        include: {
          entries: {
            include: {
              images: {
                orderBy: { order: "asc" },
                take: 1,
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!book || !book.published) {
    return null;
  }

  return book;
}

export default async function TravelBookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const book = await getTravelBook(slug);
  const t = await getTranslations();

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-96 mb-12">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-emerald-500 text-white">
              <Book className="h-3 w-3 mr-1" />
              Travel Guide
            </Badge>
            <Badge variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {book.regency}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {book.title}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            {book.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Chapters */}
        <div className="space-y-12">
          {book.chapters.map((chapter, chapterIndex) => (
            <section key={chapter.id} className="scroll-mt-24" id={chapter.slug}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {chapterIndex + 1}. {chapter.title}
                </h2>
                <p className="text-lg text-gray-600">{chapter.description}</p>
              </div>

              {/* Entries Grid */}
              {chapter.entries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapter.entries.map((entry) => {
                    const categoryInfo = getCategoryInfo(entry.category);
                    return (
                      <div
                        key={entry.id}
                        className="group bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all"
                      >
                        {entry.images[0] && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={entry.images[0].url}
                              alt={entry.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge className={`${categoryInfo.color} text-white`}>
                                {categoryInfo.icon} {categoryInfo.label}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {entry.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                            {entry.description}
                          </p>
                          {entry.address && (
                            <div className="flex items-start text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{entry.address}</span>
                            </div>
                          )}
                          {entry.entryFee && (
                            <div className="mt-2 text-xs font-semibold text-emerald-600">
                              Entry: {entry.entryFee}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No entries yet in this chapter.</p>
              )}
            </section>
          ))}
        </div>

        {/* Empty State */}
        {book.chapters.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              This travel guide is being prepared.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for exciting content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
