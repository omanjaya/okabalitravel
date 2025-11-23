"use client";

import { WishlistButton } from "./WishlistButton";
import { ShareButton } from "./ShareButton";

interface PackageActionButtonsProps {
  packageId: string;
  packageName: string;
  packageSlug: string;
  description: string;
}

export function PackageActionButtons({
  packageId,
  packageName,
  packageSlug,
  description,
}: PackageActionButtonsProps) {
  const packageUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/packages/${packageSlug}`;

  return (
    <div className="flex items-center space-x-2">
      <WishlistButton
        packageId={packageId}
        variant="default"
        size="icon"
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30"
      />
      <ShareButton
        url={packageUrl}
        title={packageName}
        description={description}
        variant="default"
        size="icon"
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30"
      />
    </div>
  );
}
