"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  destinationId?: string;
  tourId?: string;
  packageId?: string;
  variant?: "default" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function WishlistButton({
  destinationId,
  tourId,
  packageId,
  variant = "icon",
  size,
  className,
}: WishlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      checkWishlistStatus();
    }
  }, [status, destinationId, tourId, packageId]);

  const checkWishlistStatus = async () => {
    try {
      // Use different endpoints for packages vs destinations/tours
      const endpoint = packageId ? "/api/wishlist/packages" : "/api/wishlist";
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        // Different response structure for packages vs destinations/tours
        const items = packageId ? data.items : data.wishlist;
        const item = items?.find(
          (w: any) =>
            (destinationId && w.destinationId === destinationId) ||
            (tourId && w.tourId === tourId) ||
            (packageId && w.packageId === packageId)
        );
        if (item) {
          setIsInWishlist(true);
          setWishlistId(item.id);
        }
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist && wishlistId) {
        // Remove from wishlist - use different endpoints and params
        if (packageId) {
          const response = await fetch(`/api/wishlist/packages?packageId=${packageId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            setIsInWishlist(false);
            setWishlistId(null);
          }
        } else {
          const response = await fetch(`/api/wishlist?id=${wishlistId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            setIsInWishlist(false);
            setWishlistId(null);
          }
        }
      } else {
        // Add to wishlist - use different endpoints
        if (packageId) {
          const response = await fetch("/api/wishlist/packages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ packageId }),
          });

          const data = await response.json();

          if (response.ok) {
            setIsInWishlist(true);
            setWishlistId(data.item.id);
          }
        } else {
          const response = await fetch("/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ destinationId, tourId }),
          });

          const data = await response.json();

          if (response.ok) {
            setIsInWishlist(true);
            setWishlistId(data.wishlist.id);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "rounded-full hover:scale-110 transition-transform",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isInWishlist
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      onClick={handleToggle}
      disabled={loading}
      className={className}
    >
      <Heart
        className={cn(
          "mr-2 h-4 w-4",
          isInWishlist && "fill-current"
        )}
      />
      {isInWishlist ? "Saved" : "Save to Wishlist"}
    </Button>
  );
}
