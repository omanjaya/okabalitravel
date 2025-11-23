"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { BookingModal } from "./BookingModal";

interface TourBookingSectionProps {
  tour: {
    id: string;
    title: string;
    price: number;
    currency: string;
    discountPercent: number | null;
    minGroupSize: number;
    maxGroupSize: number;
  };
}

export function TourBookingSection({ tour }: TourBookingSectionProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-3 mb-6">
        <Button
          className="w-full h-12 text-lg"
          size="lg"
          onClick={() => setIsBookingModalOpen(true)}
        >
          Book Now
        </Button>
        <Button
          variant="outline"
          className="w-full h-12"
          size="lg"
          onClick={() => setIsBookingModalOpen(true)}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Check Availability
        </Button>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={tour}
      />
    </>
  );
}
