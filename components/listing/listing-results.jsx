"use client";
import React from "react";
import ListingHeader from "@/components/listing/listing-header";
import ListingCard from "@/components/listing/listing-card";
import ListingMap from "@/components/listing/listing-map";
import Pagination from "@/components/global/pagination";

const ListingResults = ({ listings }) => {
  const [viewMode, setViewMode] = React.useState("list");
  const [sort, setSort] = React.useState("recommended");
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState("New York");

  return (
    <div className="md:col-span-3 space-y-6">
      {/* Results Header */}
      <ListingHeader
        totalResults={listings.length}
        query={query}
        city={city}
        sort={sort}
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
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination totalPages={10} currentPage={1} />
          </div>
        </div>

        {viewMode === "split" && (
          <div
            className={`${
              viewMode === "split" ? "lg:w-1/2" : "w-full"
            } h-[500px] rounded-lg md:h-[700px] lg:sticky lg:top-20`}
          >
            <ListingMap listings={listings} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingResults;
