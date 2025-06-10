import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ListingCard from "../listing/listing-card";
import Pagination from "../global/pagination";

const FavorisResults = ({ data }) => {
  const { favorites, pagination } = data || {};

  if (!favorites || favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
          <p className="mt-2 text-gray-500">
            {!favorites || favorites.length === 0
              ? "Vous n'avez pas encore ajouté d'offres à vos favoris."
              : "Aucun favori ne correspond à vos critères de recherche."}
          </p>
          <Link href="/" className="mt-4">
            <Button className="mt-4">Parcourir les annonces</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pagination info */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Affichage de{" "}
            {Math.min(
              (pagination.currentPage - 1) * pagination.pageSize + 1,
              pagination.totalCount
            )}{" "}
            à{" "}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalCount
            )}{" "}
            sur {pagination.totalCount} favoris
          </p>
        </div>
      )}

      {/* Favorites grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <ListingCard
            listing={{
              ...favorite.offer,
              isFavorited: true, // Mark as favorited since this is the favorites page
            }}
            key={favorite.id}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination pagination={pagination} />
      )}
    </div>
  );
};

export default FavorisResults;
