import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ListingCard from "../listing/listing-card";

const FavorisResults = ({ favorites }) => {
  if (!favorites || favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
          <p className="mt-2 text-gray-500">
            {favorites.length === 0
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((favorite) => (
        <ListingCard
          listing={favorite.offer}
          key={favorite.id}
        />
      ))}
    </div>
  );
};

export default FavorisResults;
