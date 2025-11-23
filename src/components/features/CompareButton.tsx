"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/contexts/ComparisonContext";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompareButtonProps {
  packageData: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    currency: string;
  };
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CompareButton({
  packageData,
  variant = "outline",
  size = "icon",
  className,
}: CompareButtonProps) {
  const { addPackage, removePackage, isInComparison, packages, maxPackages } =
    useComparison();
  const [showTooltip, setShowTooltip] = useState(false);

  const isComparing = isInComparison(packageData.id);
  const isMaxReached = packages.length >= maxPackages && !isComparing;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing) {
      removePackage(packageData.id);
    } else if (!isMaxReached) {
      addPackage(packageData);
    } else {
      // Show tooltip when max reached
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const getTooltipText = () => {
    if (isMaxReached) {
      return `Maximum ${maxPackages} packages can be compared`;
    }
    return isComparing ? "Remove from comparison" : "Add to comparison";
  };

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip || undefined}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={className}
            disabled={isMaxReached && !isComparing}
            aria-label={getTooltipText()}
          >
            {isComparing ? (
              <Check className="h-4 w-4" />
            ) : (
              <GitCompareArrows className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
