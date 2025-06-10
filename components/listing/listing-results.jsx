"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import ListingHeader from "@/components/listing/listing-header";
import ListingCard from "@/components/listing/listing-card";
import Pagination from "@/components/global/pagination";

// Dynamically import the map component to avoid SSR issues
const ListingMap = dynamic(() => import("@/components/listing/listing-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      Chargement de la carte...
    </div>
  ),
});

const ListingResults = ({
  listings,
  filters = {},
  pagination = {},
  initialSort = "recommended",
}) => {
  const [viewMode, setViewMode] = React.useState("list");
  const [sort, setSort] = React.useState(initialSort);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Since we now have server-side pagination, filtering, and sorting,
  // we can use the listings directly
  const displayListings = listings || [];

  // Handle sort change by updating URL
  const handleSortChange = (newSort) => {
    setSort(newSort);

    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1"); // Reset to first page when sorting

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="md:col-span-3 space-y-6">
      {/* Results Header */}
      <ListingHeader
        totalResults={pagination.totalCount || displayListings.length}
        query={query}
        city={filters.location}
        sort={sort}
        setSort={handleSortChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div
        className={`flex flex-col gap-6 ${
          viewMode === "split" ? "lg:flex-row" : ""
        }`}
      >
        <div
          className={`${
            viewMode === "split" ? "lg:w-1/2" : "w-full"
          } space-y-6`}
        >
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-1 ${
              viewMode === "list" ? "lg:grid-cols-3" : ""
            }`}
          >
            {displayListings.length > 0 ? (
              displayListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  Aucun résultat trouvé
                </div>
                <div className="text-gray-400 text-sm">
                  Essayez d'ajuster vos filtres pour voir plus d'annonces
                </div>
              </div>
            )}
          </div>

          {/* Pagination Component */}
          {pagination.totalPages > 1 && (
            <div className="space-y-4">
              {/* Pagination Info */}
              <div className="text-center text-sm text-gray-600">
                Page {pagination.currentPage} sur {pagination.totalPages}{" "}
                {pagination.totalCount > 0 && (
                  <span className="ml-2">
                    ({(pagination.currentPage - 1) * pagination.pageSize + 1}-
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalCount
                    )}{" "}
                    sur {pagination.totalCount} résultats)
                  </span>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center">
                <Pagination
                  totalPages={pagination.totalPages}
                  currentPage={pagination.currentPage}
                />
              </div>
            </div>
          )}
        </div>

        {viewMode === "split" && (
          <div
            className={`${
              viewMode === "split" ? "lg:w-1/2" : "w-full"
            } h-[500px] rounded-lg md:h-[700px] lg:sticky lg:top-20`}
          >
            <ListingMap listings={displayListings} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingResults;
