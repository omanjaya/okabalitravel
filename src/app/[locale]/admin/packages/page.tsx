"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Filter,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PACKAGE_TYPES } from "@/lib/constants/package-types";
import { BALI_REGENCIES } from "@/lib/constants/bali-regencies";

interface PackageData {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: number;
  discountPercent: number | null;
  duration: number;
  nights: number;
  regency: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  packageTours: Array<{
    id: string;
    tour: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
  _count: {
    bookings: number;
    reviews: number;
    wishlists: number;
  };
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [regencyFilter, setRegencyFilter] = useState<string>("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, typeFilter, regencyFilter, featuredFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/packages");
      if (!response.ok) throw new Error("Failed to fetch packages");
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    // Type filter
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((pkg) => pkg.type === typeFilter);
    }

    // Regency filter
    if (regencyFilter !== "ALL") {
      filtered = filtered.filter((pkg) => pkg.regency === regencyFilter);
    }

    // Featured filter
    if (featuredFilter !== "ALL") {
      const isFeatured = featuredFilter === "FEATURED";
      filtered = filtered.filter((pkg) => pkg.featured === isFeatured);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query) ||
          pkg.slug.toLowerCase().includes(query) ||
          pkg.id.toLowerCase().includes(query)
      );
    }

    setFilteredPackages(filtered);
  };

  const toggleFeatured = async (packageId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to update package");

      await fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package");
    }
  };

  const deletePackage = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete package");

      await fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BUNDLE":
        return "bg-blue-100 text-blue-800";
      case "DEAL":
        return "bg-red-100 text-red-800";
      case "PRE_DESIGNED":
        return "bg-green-100 text-green-800";
      case "CUSTOM":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: packages.length,
    featured: packages.filter((p) => p.featured).length,
    bundle: packages.filter((p) => p.type === "BUNDLE").length,
    deals: packages.filter((p) => p.type === "DEAL").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Package Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and create travel packages
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Packages</div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </div>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Featured</div>
                <div className="text-3xl font-bold text-amber-600">
                  {stats.featured}
                </div>
              </div>
              <Star className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Bundle Packages</div>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.bundle}
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Special Deals</div>
                <div className="text-3xl font-bold text-red-600">
                  {stats.deals}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="BUNDLE">Bundle</SelectItem>
                <SelectItem value="DEAL">Special Deal</SelectItem>
                <SelectItem value="PRE_DESIGNED">Pre-Designed</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regencyFilter} onValueChange={setRegencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by regency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Regencies</SelectItem>
                {BALI_REGENCIES.map((regency) => (
                  <SelectItem key={regency.id} value={regency.name}>
                    {regency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Packages</SelectItem>
                <SelectItem value="FEATURED">Featured Only</SelectItem>
                <SelectItem value="NOT_FEATURED">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading packages...
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No packages found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Tours</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            {pkg.images[0] ? (
                              <Image
                                src={pkg.images[0].url}
                                alt={pkg.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {pkg.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pkg.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            pkg.type
                          )}`}
                        >
                          {pkg.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">
                            ${pkg.price.toLocaleString()}
                          </div>
                          {pkg.discountPercent && (
                            <Badge variant="destructive" className="text-xs">
                              {pkg.discountPercent}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {pkg.duration}D / {pkg.nights}N
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {pkg.packageTours.length} tours
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400" />
                            <span>{pkg.rating}</span>
                            <span className="text-gray-400">
                              ({pkg._count.reviews})
                            </span>
                          </div>
                          <div className="text-gray-500">
                            {pkg._count.bookings} bookings
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {pkg.featured && (
                            <Badge className="bg-amber-500">Featured</Badge>
                          )}
                          {pkg.regency && (
                            <Badge variant="outline">{pkg.regency}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
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
                              <Link href={`/packages/${pkg.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Package
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/packages/${pkg.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Package
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleFeatured(pkg.id, pkg.featured)
                              }
                            >
                              <Star
                                className={`mr-2 h-4 w-4 ${
                                  pkg.featured
                                    ? "text-amber-500"
                                    : "text-gray-400"
                                }`}
                              />
                              {pkg.featured
                                ? "Remove from Featured"
                                : "Mark as Featured"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deletePackage(pkg.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
