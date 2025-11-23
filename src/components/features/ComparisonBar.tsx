"use client";

import { useComparison } from "@/contexts/ComparisonContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, GitCompareArrows } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function ComparisonBar() {
  const { packages, removePackage, clearComparison } = useComparison();
  const router = useRouter();

  if (packages.length === 0) {
    return null;
  }

  const handleCompare = () => {
    const slugs = packages.map((p) => p.slug).join(",");
    router.push(`/compare?packages=${slugs}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="container mx-auto bg-white shadow-2xl border-2">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <GitCompareArrows className="h-5 w-5 text-sky-600" />
                <h3 className="font-bold text-lg">Compare Packages</h3>
                <span className="text-sm text-gray-500">
                  ({packages.length}/3 selected)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearComparison}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleCompare}
                  disabled={packages.length < 2}
                  size="sm"
                >
                  Compare {packages.length > 1 && `(${packages.length})`}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="relative border rounded-lg p-3 bg-gray-50"
                >
                  <button
                    onClick={() => removePackage(pkg.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md z-10"
                    aria-label="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex space-x-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                        {pkg.name}
                      </h4>
                      <p className="text-lg font-bold text-sky-600">
                        {formatCurrency(pkg.price, pkg.currency)}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {[...Array(3 - packages.length)].map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-2 border-dashed rounded-lg p-3 flex items-center justify-center bg-gray-50"
                >
                  <div className="text-center text-gray-400">
                    <GitCompareArrows className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs">Add package to compare</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
