"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PackageBookingCardProps {
  packageId: string;
  packageName: string;
  price: number;
  discountedPrice: number | null;
  currency: string;
  duration: number;
  nights: number;
  minGroupSize: number;
  maxGroupSize: number;
}

interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
}

export function PackageBookingCard({
  packageId,
  packageName,
  price,
  discountedPrice,
  currency,
  duration,
  nights,
  minGroupSize,
  maxGroupSize,
}: PackageBookingCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations();

  const [startDate, setStartDate] = useState<Date>();
  const [numberOfTravelers, setNumberOfTravelers] = useState(minGroupSize);
  const [showTravelersDialog, setShowTravelersDialog] = useState(false);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const finalPrice = discountedPrice || price;
  const totalPrice = finalPrice * numberOfTravelers;
  const endDate = startDate ? addDays(startDate, duration - 1) : undefined;

  const handleBookNow = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=" + window.location.pathname);
      return;
    }

    if (!startDate) {
      setError("Please select a start date");
      return;
    }

    // Initialize travelers if not already done
    if (travelers.length !== numberOfTravelers) {
      const newTravelers: Traveler[] = Array.from(
        { length: numberOfTravelers },
        () => ({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          passportNumber: "",
        })
      );
      setTravelers(newTravelers);
    }

    setShowTravelersDialog(true);
  };

  const handleTravelerChange = (
    index: number,
    field: keyof Traveler,
    value: string
  ) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);
  };

  const validateTravelers = (): boolean => {
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (
        !traveler.firstName ||
        !traveler.lastName ||
        !traveler.email ||
        !traveler.phone
      ) {
        setError(`Please complete all required fields for Traveler ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateTravelers()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/package-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          numberOfTravelers,
          totalPrice,
          currency,
          travelers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/bookings/${data.booking.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-xl">
        <CardContent className="p-6">
          {/* Price Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">From</p>
            <div className="flex items-baseline space-x-2">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-sky-600">
                    ${discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${price.toFixed(0)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-sky-600">
                  ${price.toFixed(0)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">per person</p>
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <Label htmlFor="startDate" className="mb-2 block">
              {t("booking.selectDate")}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {startDate && endDate && (
              <p className="text-sm text-gray-500 mt-2">
                End Date: {format(endDate, "PPP")}
              </p>
            )}
          </div>

          {/* Number of Travelers */}
          <div className="mb-6">
            <Label htmlFor="travelers" className="mb-2 block">
              {t("booking.travelers")}
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setNumberOfTravelers(Math.max(minGroupSize, numberOfTravelers - 1))
                }
                disabled={numberOfTravelers <= minGroupSize}
              >
                -
              </Button>
              <div className="flex items-center justify-center min-w-[60px]">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-semibold">{numberOfTravelers}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setNumberOfTravelers(Math.min(maxGroupSize, numberOfTravelers + 1))
                }
                disabled={numberOfTravelers >= maxGroupSize}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Min: {minGroupSize}, Max: {maxGroupSize}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Total Price */}
          <div className="mb-4 p-4 bg-sky-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                ${finalPrice.toFixed(0)} x {numberOfTravelers} travelers
              </span>
              <span className="font-semibold">${totalPrice.toFixed(0)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">{t("booking.total")}</span>
              <span className="text-2xl font-bold text-sky-600">
                ${totalPrice.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Book Now Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleBookNow}
            disabled={!startDate || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              t("tours.bookNow")
            )}
          </Button>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold">
                {duration}D / {nights}N
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Group Size</span>
              <span className="font-semibold">
                {minGroupSize}-{maxGroupSize} people
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t space-y-3 text-sm">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{t("tours.features.freeCancellation")}</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{t("tours.features.bestPrice")}</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{t("tours.features.expertGuides")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travelers Information Dialog */}
      <Dialog open={showTravelersDialog} onOpenChange={setShowTravelersDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("booking.personalInfo")}</DialogTitle>
            <DialogDescription>
              Please provide information for all travelers
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600">Redirecting to booking details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {travelers.map((traveler, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Traveler {index + 1}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`firstName-${index}`}>
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`firstName-${index}`}
                        value={traveler.firstName}
                        onChange={(e) =>
                          handleTravelerChange(index, "firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`lastName-${index}`}>
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`lastName-${index}`}
                        value={traveler.lastName}
                        onChange={(e) =>
                          handleTravelerChange(index, "lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`email-${index}`}>
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={traveler.email}
                        onChange={(e) =>
                          handleTravelerChange(index, "email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`phone-${index}`}>
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`phone-${index}`}
                        type="tel"
                        value={traveler.phone}
                        onChange={(e) =>
                          handleTravelerChange(index, "phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                      <Input
                        id={`dob-${index}`}
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) =>
                          handleTravelerChange(index, "dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                      <Input
                        id={`passport-${index}`}
                        value={traveler.passportNumber}
                        onChange={(e) =>
                          handleTravelerChange(
                            index,
                            "passportNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
            </div>
          )}

          {!success && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTravelersDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t("booking.confirmBooking")
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
