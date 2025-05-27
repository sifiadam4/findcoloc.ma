import { getOffers } from "@/actions/colocation";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingResults from "@/components/listing/listing-results";
import { Suspense } from "react";

export default async function Home() {
  const listings = await getOffers();
  // console.log("Fetched listings:", listings);

  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FilterSidebar />

        {/* Main Content */}
        {/* <Suspense fallback={<div>Loading...</div>}> */}
          <ListingResults listings={listings} />
        {/* </Suspense> */}
      </div>
    </main>
  );
}
