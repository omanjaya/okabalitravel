"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  DollarSign,
  Info,
  ExternalLink,
} from "lucide-react";
import { PhotoGallery } from "./PhotoGallery";
import { Button } from "@/components/ui/button";

interface TravelEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  tips: string | null;
  bestTime: string | null;
  entryFee: string | null;
  images: Array<{
    url: string;
    caption: string | null;
  }>;
}

interface TravelEntryModalProps {
  entry: TravelEntry | null;
  isOpen: boolean;
  onClose: () => void;
  categoryInfo: {
    label: string;
    icon: string;
    color: string;
  };
}

export function TravelEntryModal({
  entry,
  isOpen,
  onClose,
  categoryInfo,
}: TravelEntryModalProps) {
  if (!entry) return null;

  const hasCoordinates = entry.latitude && entry.longitude;
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${entry.latitude},${entry.longitude}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold pr-8">
              {entry.title}
            </DialogTitle>
            <Badge className={`${categoryInfo.color} text-white`}>
              {categoryInfo.icon} {categoryInfo.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Gallery */}
          {entry.images.length > 0 && (
            <PhotoGallery photos={entry.images} title={entry.title} />
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-line">{entry.description}</p>
          </div>

          <Separator />

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            {entry.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">
                    Location
                  </p>
                  <p className="text-sm text-gray-700">{entry.address}</p>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 mt-1"
                    >
                      View on Google Maps
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Best Time to Visit */}
            {entry.bestTime && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">
                    Best Time to Visit
                  </p>
                  <p className="text-sm text-gray-700">{entry.bestTime}</p>
                </div>
              </div>
            )}

            {/* Entry Fee */}
            {entry.entryFee && (
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">
                    Entry Fee
                  </p>
                  <p className="text-sm text-gray-700">{entry.entryFee}</p>
                </div>
              </div>
            )}

            {/* Tips */}
            {entry.tips && (
              <div className="flex items-start space-x-3 md:col-span-2">
                <Info className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">
                    Tips
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {entry.tips}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map Preview */}
          {hasCoordinates && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Location Map</h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps?q=${entry.latitude},${entry.longitude}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          {googleMapsUrl && (
            <div className="flex justify-end">
              <Button asChild>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
