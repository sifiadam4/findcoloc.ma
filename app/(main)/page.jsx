import { getOffers } from "@/actions/colocation";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingResults from "@/components/listing/listing-results";

export default async function Home({ searchParams }) {
  // Extract pagination parameters
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = parseInt(searchParams?.pageSize) || 12;
  const sortBy = searchParams?.sort || "recommended";

  // Extract filter parameters from searchParams
  const filters = {
    minPrice: parseInt(searchParams?.minPrice || "0"),
    maxPrice: parseInt(searchParams?.maxPrice || "999999"),
    location: searchParams?.location || "",
    types: searchParams?.types?.split(",").filter(Boolean) || [],
    features: searchParams?.features?.split(",").filter(Boolean) || [],
    options: searchParams?.options?.split(",").filter(Boolean) || [],
    availableDate: searchParams?.availableDate || "",
    minDuration: searchParams?.minDuration || "",
    status: searchParams?.status || "all",
  };

  // Fetch listings on the server with pagination, filters, and sorting
  const result = await getOffers(page, pageSize, filters, sortBy);
  const listings = result?.offers || [];
  const pagination = result?.pagination || {};

  return (
    <main className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ListingResults
            listings={listings}
            filters={filters}
            pagination={pagination}
            initialSort={sortBy}
          />
        </div>
      </div>
    </main>
  );
}
