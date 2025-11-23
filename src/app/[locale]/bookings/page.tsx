"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/helpers";
import { format } from "date-fns";

interface TourBooking {
  id: string;
  type: "tour";
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  tour: {
    id: string;
    title: string;
    slug: string;
    duration: number;
    nights: number;
    destination: {
      name: string;
      country: string;
    };
    images: Array<{
      url: string;
      alt: string;
    }>;
  };
  travelers: Array<{
    firstName: string;
    lastName: string;
  }>;
}

interface PackageBooking {
  id: string;
  type: "package";
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  package: {
    id: string;
    name: string;
    slug: string;
    duration: number;
    nights: number;
    regency: string | null;
    images: Array<{
      url: string;
      alt: string;
    }>;
  };
  travelers: Array<{
    firstName: string;
    lastName: string;
  }>;
}

type Booking = TourBooking | PackageBooking;

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      // Fetch both tour and package bookings
      const [tourResponse, packageResponse] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/package-bookings"),
      ]);

      const [tourData, packageData] = await Promise.all([
        tourResponse.json(),
        packageResponse.json(),
      ]);

      if (!tourResponse.ok && !packageResponse.ok) {
        throw new Error("Failed to fetch bookings");
      }

      // Combine and tag bookings
      const tourBookings: Booking[] = (tourData.bookings || []).map((b: any) => ({
        ...b,
        type: "tour" as const,
      }));

      const packageBookings: Booking[] = (packageData.bookings || []).map((b: any) => ({
        ...b,
        type: "package" as const,
      }));

      // Combine and sort by creation date
      const allBookings = [...tourBookings, ...packageBookings].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setBookings(allBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterBookings = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case "upcoming":
        return bookings.filter(
          (b) =>
            new Date(b.startDate) > now &&
            b.status !== "CANCELLED"
        );
      case "past":
        return bookings.filter((b) => new Date(b.endDate) < now);
      case "cancelled":
        return bookings.filter((b) => b.status === "CANCELLED");
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings(activeTab);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your trip bookings</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="all">
                All ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({filterBookings("upcoming").length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({filterBookings("past").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({filterBookings("cancelled").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {activeTab === "all"
                        ? "You haven't made any bookings yet"
                        : `No ${activeTab} bookings`}
                    </p>
                    <Link href="/destinations">
                      <Button>
                        <MapPin className="mr-2 h-4 w-4" />
                        Explore Destinations
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                            {/* Image */}
                            <div className="relative h-48 md:h-auto md:col-span-1 rounded-lg overflow-hidden">
                              <Image
                                src={
                                  booking.type === "tour"
                                    ? booking.tour.images[0]?.url || "/placeholder.jpg"
                                    : booking.package.images[0]?.url || "/placeholder.jpg"
                                }
                                alt={
                                  booking.type === "tour"
                                    ? booking.tour.title
                                    : booking.package.name
                                }
                                fill
                                className="object-cover"
                              />
                              {booking.type === "package" && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-purple-500">Package</Badge>
                                </div>
                              )}
                            </div>

                            {/* Booking Details */}
                            <div className="md:col-span-2 space-y-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  {getStatusIcon(booking.status)}
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {booking.type === "tour"
                                    ? booking.tour.title
                                    : booking.package.name}
                                </h3>
                                <div className="flex items-center text-gray-600 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.type === "tour"
                                    ? `${booking.tour.destination.name}, ${booking.tour.destination.country}`
                                    : booking.package.regency || "Bali, Indonesia"}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="h-4 w-4 mr-2 text-sky-500" />
                                  <span>
                                    {format(new Date(booking.startDate), "PP")} -{" "}
                                    {format(new Date(booking.endDate), "PP")}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Users className="h-4 w-4 mr-2 text-sky-500" />
                                  <span>{booking.numberOfTravelers} travelers</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                  <Clock className="h-4 w-4 mr-2 text-sky-500" />
                                  <span>
                                    {booking.type === "tour"
                                      ? `${booking.tour.duration} days, ${booking.tour.nights} nights`
                                      : `${booking.package.duration} days, ${booking.package.nights} nights`}
                                  </span>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                Booked on {format(new Date(booking.createdAt), "PP")}
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="md:col-span-1 flex flex-col justify-between">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                <p className="text-2xl font-bold text-sky-600">
                                  {formatCurrency(booking.totalPrice, booking.currency)}
                                </p>
                              </div>

                              <Link href={`/bookings/${booking.id}`}>
                                <Button className="w-full mt-4">
                                  View Details
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
