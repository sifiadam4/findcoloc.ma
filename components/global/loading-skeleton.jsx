import { Card, CardContent } from "@/components/ui/card";

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ListingGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex justify-center space-x-2">
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
