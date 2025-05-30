'use client';

import { useEffect, useState } from "react";
import FavorisFilters from "@/components/favoris/favoris-filters";
import FavorisResults from "@/components/favoris/favoris-results";
import { getFavorites } from "@/actions/favorite"; // Must be client-safe or fetch via API
import { Loader } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FavorisPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites(); // or fetch from `/api/favorites`
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <main className="space-y-6">
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
      {loading ? (
        <Card className="flex items-center justify-center h-96">
          <Loader className="h-5 w-5 animate-spin" />
        </Card>
      ) : (
        <FavorisResults favorites={favorites} />
      )}
    </main>
  );
}
