"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { PackageReviewForm } from "./PackageReviewForm";
import { PackageReviewsList } from "./PackageReviewsList";

interface PackageReviewsSectionProps {
  packageId: string;
  packageName: string;
}

export function PackageReviewsSection({
  packageId,
  packageName,
}: PackageReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    // Trigger a refresh of the reviews list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
        </div>
        <p className="text-gray-600">
          Share your experience and help others make informed decisions
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* Review Form */}
      <PackageReviewForm
        packageId={packageId}
        packageName={packageName}
        onSuccess={handleReviewSubmitted}
      />

      <hr className="border-gray-200" />

      {/* Reviews List */}
      <PackageReviewsList
        packageId={packageId}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
