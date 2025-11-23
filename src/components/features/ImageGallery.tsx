"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { modalVariants, backdropVariants } from "@/lib/animations";

interface ImageData {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
}

interface ImageGalleryProps {
  images: ImageData[];
  destinationName: string;
}

export function ImageGallery({ images, destinationName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const primaryImage = images[0];
  const secondaryImages = images.slice(1, 5);

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px]">
        <div className="grid grid-cols-4 gap-2 h-full">
          {/* Primary Image */}
          <motion.div
            className="col-span-4 md:col-span-2 relative cursor-pointer overflow-hidden rounded-l-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => openLightbox(0)}
          >
            <Image
              src={primaryImage?.url || "/placeholder.jpg"}
              alt={primaryImage?.alt || destinationName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
          </motion.div>

          {/* Secondary Images */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
            {secondaryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">
                      +{images.length - 5} more
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Photos Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => openLightbox(0)}
          >
            View All {images.length} Photos
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-12 w-12" />
            </button>

            <button
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            {/* Image */}
            <motion.div
              className="relative max-w-7xl max-h-[90vh] mx-auto px-16"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].alt}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>

              {/* Caption */}
              {images[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 text-center">
                  <p>{images[selectedIndex].caption}</p>
                </div>
              )}

              {/* Counter */}
              <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
