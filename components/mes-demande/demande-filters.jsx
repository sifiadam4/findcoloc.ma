"use client";

import React from "react";
import { useState } from "react";
import { Search, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const DemandeFilters = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("recent");
    const [filterByListing, setFilterByListing] = useState("all");

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Rechercher un candidat..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white">
              <div className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Trier par" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="oldest">Plus anciennes</SelectItem>
              <SelectItem value="name_asc">Nom (A-Z)</SelectItem>
              <SelectItem value="name_desc">Nom (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Filtrer par annonce
              </label>
              <Select
                value={filterByListing}
                onValueChange={setFilterByListing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les annonces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les annonces</SelectItem>
                  {listings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id.toString()}>
                      {listing.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Date de candidature
              </label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois-ci</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" variant="outline" size="sm">
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemandeFilters;
