"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Limiter le nombre de pages affichées
  let pagesToShow = pages;
  if (totalPages > 7) {
    if (currentPage <= 3) {
      pagesToShow = [...pages.slice(0, 5), -1, totalPages];
    } else if (currentPage >= totalPages - 2) {
      pagesToShow = [1, -1, ...pages.slice(totalPages - 5)];
    } else {
      pagesToShow = [
        1,
        -1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        -1,
        totalPages,
      ];
    }
  }

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    if (onPageChange) {
      onPageChange(page);
    } else {
      // Default behavior: update URL
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        aria-label="Page précédente"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pagesToShow.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={
              currentPage === page ? "bg-primary hover:bg-primary/90" : ""
            }
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
