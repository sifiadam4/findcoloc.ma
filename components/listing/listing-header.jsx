"use client";

import {
  SlidersHorizontal,
  Grid3x3,
  LayoutList,
  ChevronDown,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ListingHeader({
  totalResults,
  query,
  city,
  sort,
  setSort,
  viewMode,
  setViewMode,
  isLoading = false,
}) {
  // Get sort label
  const getSortLabel = () => {
    switch (sort) {
      case "recommended":
        return "Recommandé";
      case "price-low":
        return "Prix: croissant";
      case "price-high":
        return "Prix: décroissant";
      case "oldest":
        return "Date: plus ancienne";
      case "newest":
        return "Date: plus récente";
      default:
        return "Recommandé";
    }
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSort(value);
  };

  // Build title based on search params
  const getTitle = () => {
    if (query) {
      return `Résultats pour "${query}"`;
    } else if (city) {
      return `Colocations à ${city}`;
    } else {
      return "Toutes les colocations";
    }
  };

  return (
    <div className="bg-white rounded-lg border mb-6">
      <div className="p-4">
        {" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {totalResults}{" "}
              {totalResults === 1 ? "offre trouvée" : "offres trouvées"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="p-4 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2 hidden sm:block">
            Trier par:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {getSortLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleSortChange("recommended")}>
                Recommandé
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("price-low")}>
                Prix: croissant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("price-high")}>
                Prix: décroissant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("oldest")}>
                Date: plus ancienne
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("newest")}>
                Date: plus récente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2 hidden sm:block">
              Affichage:
            </span>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none px-2 ${
                  viewMode === "list" ? "bg-gray-100" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none px-2 ${
                  viewMode === "split" ? "bg-gray-100" : ""
                }`}
                onClick={() => setViewMode("split")}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
