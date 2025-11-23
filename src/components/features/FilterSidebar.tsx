"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { useState } from "react";

interface FilterSidebarProps {
  searchParams: {
    q?: string;
    continent?: string;
    priceMin?: string;
    priceMax?: string;
    rating?: string;
  };
}

// Kabupaten/Kota di Bali
const BALI_REGIONS = [
  "Badung",
  "Gianyar",
  "Tabanan",
  "Klungkung",
  "Bangli",
  "Karangasem",
  "Buleleng",
  "Jembrana",
  "Denpasar"
];

const RATING_OPTIONS = [
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4.0", label: "4.0+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
  { value: "3.0", label: "3.0+ Stars" },
];

export function FilterSidebar({ searchParams }: FilterSidebarProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [filters, setFilters] = useState({
    continent: searchParams.continent || "",
    priceMin: searchParams.priceMin || "",
    priceMax: searchParams.priceMax || "",
    rating: searchParams.rating || "",
  });

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Build query string
    const params = new URLSearchParams(urlSearchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/destinations?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      continent: "",
      priceMin: "",
      priceMax: "",
      rating: "",
    });
    const params = new URLSearchParams(urlSearchParams.toString());
    params.delete("continent");
    params.delete("priceMin");
    params.delete("priceMax");
    params.delete("rating");
    router.push(`/destinations?${params.toString()}`);
  };

  const hasActiveFilters =
    filters.continent || filters.priceMin || filters.priceMax || filters.rating;

  return (
    <aside
      className="space-y-6"
      aria-label="Destination filters"
      role="complementary"
    >
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filter Aktif</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                aria-label="Clear all active filters"
                className="focus-premium"
              >
                Hapus Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filters.continent && (
              <Badge variant="secondary" className="mr-2">
                {filters.continent}
              </Badge>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <Badge variant="secondary" className="mr-2">
                Rp {filters.priceMin || "0"} - Rp {filters.priceMax || "∞"}
              </Badge>
            )}
            {filters.rating && (
              <Badge variant="secondary" className="mr-2">
                {filters.rating}+ ⭐
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wilayah Bali Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icons.mapPin size={20} weight="duotone" className="mr-2 text-bali-ocean" />
            Wilayah Bali
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {BALI_REGIONS.map((region) => (
            <button
              key={region}
              onClick={() =>
                updateFilters("continent", filters.continent === region ? "" : region)
              }
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                filters.continent === region
                  ? "bg-sky-100 text-sky-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {region}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icons.money size={20} weight="duotone" className="mr-2 text-bali-sunset" />
            Rentang Harga
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="priceMin" className="text-sm">
              Harga Minimum (Rp)
            </Label>
            <Input
              id="priceMin"
              type="number"
              min="0"
              placeholder="0"
              value={filters.priceMin}
              onChange={(e) => updateFilters("priceMin", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="priceMax" className="text-sm">
              Harga Maksimum (Rp)
            </Label>
            <Input
              id="priceMax"
              type="number"
              min="0"
              placeholder="10000000"
              value={filters.priceMax}
              onChange={(e) => updateFilters("priceMax", e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Icons.star size={20} weight="duotone" className="mr-2 text-amber-500" />
            Rating Minimum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilters("rating", filters.rating === option.value ? "" : option.value)
              }
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                filters.rating === option.value
                  ? "bg-sky-100 text-sky-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
