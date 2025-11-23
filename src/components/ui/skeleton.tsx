import { cn } from "@/lib/utils";

/**
 * Base Skeleton Component
 * Displays an animated placeholder while content is loading
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

/**
 * Package Card Skeleton
 * Skeleton placeholder for PackageCard component
 */
function PackageCardSkeleton() {
  return (
    <div className="overflow-hidden h-full rounded-2xl border border-gray-200 shadow-lg">
      {/* Image Skeleton */}
      <div className="relative h-56 bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Destination Card Skeleton
 */
function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden h-full rounded-2xl border border-gray-200 shadow-lg">
      <div className="relative h-64 bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Tour Card Skeleton
 */
function TourCardSkeleton() {
  return (
    <div className="overflow-hidden h-full rounded-2xl border border-gray-200 shadow-lg">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Booking Card Skeleton
 */
function BookingCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-md">
      <div className="flex items-start space-x-4">
        <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/**
 * Review Card Skeleton
 */
function ReviewCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 p-6 shadow-md">
      <div className="flex items-start space-x-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
      </div>
      <Skeleton className="h-5 w-2/3 mb-2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Grid Skeletons for List Pages
 */
function PackagesGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

function DestinationsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ToursGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <TourCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * List Skeletons
 */
function BookingsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ReviewsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Page Header Skeleton
 */
function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
  );
}

/**
 * Detail Page Skeleton
 */
function DetailPageSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Image */}
      <div className="relative h-96 mb-8">
        <Skeleton className="absolute inset-0" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  PackageCardSkeleton,
  DestinationCardSkeleton,
  TourCardSkeleton,
  BookingCardSkeleton,
  ReviewCardSkeleton,
  PackagesGridSkeleton,
  DestinationsGridSkeleton,
  ToursGridSkeleton,
  BookingsListSkeleton,
  ReviewsListSkeleton,
  PageHeaderSkeleton,
  DetailPageSkeleton,
};
