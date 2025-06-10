"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const OfferFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recent");

  // Update URL when filters change
  const updateURL = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/mes-offres?${params.toString()}`);
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL("search", searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    updateURL("sort", value);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Rechercher une offre..."
          className="pl-10 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="bg-white">
            <div className="flex items-center">
              <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Trier par" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récentes</SelectItem>
            <SelectItem value="oldest">Plus anciennes</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
            <SelectItem value="title">Titre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OfferFilters;
