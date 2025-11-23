"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Heart,
  User,
  Clock,
  TrendingUp,
  Plane,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const stats = [
    {
      title: "Upcoming Trips",
      value: "0",
      icon: Plane,
      color: "bg-sky-500",
      description: "No trips booked yet",
    },
    {
      title: "Total Bookings",
      value: "0",
      icon: Calendar,
      color: "bg-emerald-500",
      description: "All time bookings",
    },
    {
      title: "Wishlist Items",
      value: "0",
      icon: Heart,
      color: "bg-rose-500",
      description: "Saved destinations",
    },
    {
      title: "Member Since",
      value: new Date().getFullYear().toString(),
      icon: TrendingUp,
      color: "bg-purple-500",
      description: "Active traveler",
    },
  ];

  const quickActions = [
    {
      title: "Browse Destinations",
      description: "Explore amazing places around the world",
      href: "/destinations",
      icon: MapPin,
      color: "bg-sky-50 hover:bg-sky-100 border-sky-200",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      href: "/bookings",
      icon: Calendar,
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
    },
    {
      title: "My Wishlist",
      description: "See your saved destinations and tours",
      href: "/wishlist",
      icon: Heart,
      color: "bg-rose-50 hover:bg-rose-100 border-rose-200",
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      href: "/settings",
      icon: Settings,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-xl">
                {getInitials(session.user.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name?.split(" ")[0]}!
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Clock className="h-4 w-4 mr-2" />
                Ready to plan your next adventure?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className={`${action.color} border-2 transition-all hover:shadow-md cursor-pointer`}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-gray-700" />
                        <div>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {action.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Bookings
              </CardTitle>
              <CardDescription>Your scheduled trips and adventures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No upcoming bookings yet</p>
                <Link href="/destinations">
                  <Button>
                    <MapPin className="mr-2 h-4 w-4" />
                    Explore Destinations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
