import { prisma } from "@/server/db/client";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  MapPin,
  Plane,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

async function getDashboardStats() {
  const [
    totalBookings,
    totalUsers,
    totalDestinations,
    totalTours,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    totalReviews,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count(),
    prisma.destination.count(),
    prisma.tour.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.review.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { title: true } },
      },
    }),
  ]);

  // Calculate total revenue from confirmed bookings
  const confirmedBookingData = await prisma.booking.findMany({
    where: { status: "CONFIRMED" },
    select: { totalPrice: true },
  });
  const totalRevenue = confirmedBookingData.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0
  );

  return {
    totalBookings,
    totalUsers,
    totalDestinations,
    totalTours,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    totalReviews,
    totalRevenue,
    recentBookings,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: `From ${stats.confirmedBookings} confirmed bookings`,
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      description: `${stats.pendingBookings} pending approval`,
      icon: Calendar,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews.toString(),
      description: "Customer reviews",
      icon: Star,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const quickStats = [
    {
      label: "Destinations",
      value: stats.totalDestinations,
      icon: MapPin,
      href: "/admin/destinations",
    },
    {
      label: "Tours",
      value: stats.totalTours,
      icon: Plane,
      href: "/admin/tours",
    },
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle,
      href: "/admin/bookings?status=confirmed",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      href: "/admin/bookings?status=pending",
    },
    {
      label: "Cancelled",
      value: stats.cancelledBookings,
      icon: XCircle,
      href: "/admin/bookings?status=cancelled",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your travel platform.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-gray-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {stat.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Bookings
          </CardTitle>
          <Link
            href="/admin/bookings"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings yet
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-sky-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {booking.tour.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{booking.user.name || booking.user.email}</span>
                      <span>•</span>
                      <span>{booking.numberOfTravelers} travelers</span>
                      <span>•</span>
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.currency}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              Booking Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-green-600">
                    {stats.confirmedBookings}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        stats.totalBookings > 0
                          ? (stats.confirmedBookings / stats.totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-amber-600">
                    {stats.pendingBookings}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        stats.totalBookings > 0
                          ? (stats.pendingBookings / stats.totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">
                    {stats.cancelledBookings}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${
                        stats.totalBookings > 0
                          ? (stats.cancelledBookings / stats.totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Booking Conversion
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.totalBookings > 0
                      ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Percentage of confirmed bookings
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Average Booking Value
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    $
                    {stats.confirmedBookings > 0
                      ? (stats.totalRevenue / stats.confirmedBookings).toFixed(0)
                      : 0}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Per confirmed booking</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Active Tours</span>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.totalTours}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Across {stats.totalDestinations} destinations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
