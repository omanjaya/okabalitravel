import { prisma } from "@/server/db/client";
import { TravelBookCard } from "@/components/features/TravelBookCard";
import { getTranslations } from "next-intl/server";
import { Book } from "lucide-react";

async function getTravelBooks() {
  const books = await prisma.travelBook.findMany({
    where: {
      published: true,
    },
    include: {
      chapters: {
        include: {
          entries: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return books.map((book) => ({
    id: book.id,
    title: book.title,
    slug: book.slug,
    description: book.description,
    regency: book.regency,
    coverImage: book.coverImage,
    chapterCount: book.chapters.length,
    entryCount: book.chapters.reduce((sum, chapter) => sum + chapter.entries.length, 0),
  }));
}

export default async function TravelBookIndexPage() {
  const books = await getTravelBooks();
  const t = await getTranslations();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Book className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('travelBook.pageTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('travelBook.pageSubtitle')}
          </p>
        </div>

        {/* Travel Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <TravelBookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {t('travelBook.noBooks')}
            </p>
            <p className="text-gray-500 mt-2">
              {t('travelBook.comingSoon')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
