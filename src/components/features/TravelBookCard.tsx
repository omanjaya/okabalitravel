"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Book, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardHoverVariants } from "@/lib/animations";
import { useTranslations } from "next-intl";

interface TravelBookData {
  id: string;
  title: string;
  slug: string;
  description: string;
  regency: string;
  coverImage: string;
  chapterCount?: number;
  entryCount?: number;
}

interface TravelBookCardProps {
  book: TravelBookData;
}

export function TravelBookCard({ book }: TravelBookCardProps) {
  const t = useTranslations();

  return (
    <Link href={`/travel-book/${book.slug}`}>
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="h-full"
      >
        <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-64 overflow-hidden">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">
                <Book className="h-3 w-3 mr-1" />
                Travel Guide
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">{book.regency}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-sm text-gray-200 line-clamp-2">{book.description}</p>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {book.chapterCount !== undefined && (
                  <div>
                    <span className="font-semibold text-gray-900">{book.chapterCount}</span> Chapters
                  </div>
                )}
                {book.entryCount !== undefined && (
                  <div>
                    <span className="font-semibold text-gray-900">{book.entryCount}</span> Places
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" className="group">
                Read Guide
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
