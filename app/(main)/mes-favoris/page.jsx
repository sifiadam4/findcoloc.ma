import FavorisFilters from "@/components/favoris/favoris-filters";
import FavorisResults from "@/components/favoris/favoris-results";
import { getFavorites } from "@/actions/favorite";

export default async function FavorisPage({ searchParams }) {
  // Extract pagination and filter parameters from URL
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = parseInt(searchParams?.pageSize) || 12;
  const query = searchParams?.search || "";
  const sort = searchParams?.sort || "recent";

  // Fetch favorites on the server with pagination
  const result = await getFavorites(query, sort, page, pageSize);

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

      <FavorisResults data={result} />
    </main>
  );
}
