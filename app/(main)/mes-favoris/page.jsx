import FavorisFilters from "@/components/favoris/favoris-filters";
import FavorisResults from "@/components/favoris/favoris-results";
import { getFavorites } from "@/actions/favorite";
import { Suspense } from "react";

export default async function FavorisPage() {
  const favorites = await getFavorites();

  // console.log("Favoris:", favorites);

  return (
    <main className="space-y-6 ">
      <div>
        <h1 className="text-3xl tracking-tighter font-bold text-foreground">
          Mes favoris
        </h1>
        <p className="text-muted-foreground">
          Retrouvez les offres de colocation que vous avez sauvegardées
        </p>
      </div>

      {/* Barre d'actions */}
      <FavorisFilters />

      {/* Liste des favoris */}
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <FavorisResults favorites={favorites} />
      {/* </Suspense> */}
    </main>
  );
}
