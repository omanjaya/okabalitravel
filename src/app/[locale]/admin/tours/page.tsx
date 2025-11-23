"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Plus,
  Trash2,
  Eye,
  Edit,
  Plane,
  Star,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TourData {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  discountPercent: number | null;
  duration: number;
  nights: number;
  difficulty: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  destination: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  _count: {
    bookings: number;
    reviews: number;
  };
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<TourData[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [tours, searchQuery]);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/admin/tours");
      if (response.ok) {
        const data = await response.json();
        setTours(data.tours);
        setFilteredTours(data.tours);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTours = () => {
    let filtered = [...tours];

    if (searchQuery) {
      filtered = filtered.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.destination.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTours(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTours();
      } else {
        alert("Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("Failed to delete tour");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (response.ok) {
        fetchTours();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const primaryImage = (tour: TourData) =>
    tour.images.find((img) => img.isPrimary) || tour.images[0];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MODERATE":
        return "bg-amber-100 text-amber-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tours</h1>
          <p className="mt-2 text-gray-600">
            Manage all tours in your platform
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tours/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Tour
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tours
            </CardTitle>
            <Plane className="h-5 w-5 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tours.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured
            </CardTitle>
            <Star className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tours.filter((t) => t.featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tours.reduce((sum, t) => sum + t._count.bookings, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredTours.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tours found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => {
                  const image = primaryImage(tour);
                  const finalPrice = tour.discountPercent
                    ? tour.price * (1 - tour.discountPercent / 100)
                    : tour.price;

                  return (
                    <TableRow key={tour.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {image && (
                            <div className="relative h-12 w-16 rounded overflow-hidden">
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{tour.title}</div>
                            <div className="text-sm text-gray-500">
                              {tour.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/destinations/${tour.destination.slug}`}
                          className="text-sky-600 hover:underline"
                        >
                          {tour.destination.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {tour.currency} ${finalPrice.toLocaleString()}
                          </div>
                          {tour.discountPercent && (
                            <div className="text-sm text-gray-500 line-through">
                              ${tour.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tour.duration}D / {tour.nights}N
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(tour.difficulty)}>
                          {tour.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{tour.rating}</span>
                          <span className="text-gray-500 text-sm">
                            ({tour.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={tour.featured ? "default" : "secondary"}
                        >
                          {tour.featured ? "Featured" : "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/tours/${tour.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/tours/${tour.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toggleFeatured(tour.id, tour.featured)
                              }
                            >
                              <Star className="h-4 w-4 mr-2" />
                              {tour.featured ? "Unfeature" : "Feature"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(tour.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
