"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ComparisonPackage {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  currency: string;
}

interface ComparisonContextType {
  packages: ComparisonPackage[];
  addPackage: (pkg: ComparisonPackage) => void;
  removePackage: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
  maxPackages: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_PACKAGES = 3;
const STORAGE_KEY = "package-comparison";

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<ComparisonPackage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPackages(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse comparison data:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever packages change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    }
  }, [packages, isHydrated]);

  const addPackage = (pkg: ComparisonPackage) => {
    setPackages((prev) => {
      // Don't add if already in comparison
      if (prev.some((p) => p.id === pkg.id)) {
        return prev;
      }
      // Don't add if already at max
      if (prev.length >= MAX_PACKAGES) {
        return prev;
      }
      return [...prev, pkg];
    });
  };

  const removePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const isInComparison = (id: string) => {
    return packages.some((p) => p.id === id);
  };

  const clearComparison = () => {
    setPackages([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        packages,
        addPackage,
        removePackage,
        isInComparison,
        clearComparison,
        maxPackages: MAX_PACKAGES,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
