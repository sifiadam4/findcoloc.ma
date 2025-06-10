import OffreStats from "@/components/mes-offres/offre-stats";
import OfferResults from "@/components/mes-offres/offre-results";
import { getMyOffers } from "@/actions/colocation";
import OfferFilters from "@/components/mes-offres/offre-filters";

export default async function MesOffresPage({ searchParams }) {
  // Extract pagination and filter parameters from URL
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = parseInt(searchParams?.pageSize) || 12;
  const query = searchParams?.search || "";
  const sort = searchParams?.sort || "recent";
  const status = searchParams?.status || "all";

  // Fetch offers on the server with pagination
  const result = await getMyOffers(query, sort, status, page, pageSize);
  const { offers, pagination } = result;

  console.log("Mes offres:", offers);

  // Compter les offres par statut (from all offers, not just current page)
  const counts = {
    all: pagination.totalCount,
    pending: offers.filter((o) => o.status === "pending").length,
    active: offers.filter((o) => o.status === "active").length,
    rented: offers.filter((o) => o.status === "rented").length,
    draft: offers.filter((o) => o.status === "draft").length,
    closed: offers.filter((o) => o.status === "closed").length,
  };

  return (
    <main className="space-y-6">
      {/* Titre et sous-titre */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tighter">
          Mes offres
        </h1>
        <p className="text-muted-foreground">
          Gérez vos annonces de colocation
        </p>
      </div>

      {/* Statistiques */}
      <OffreStats counts={counts} />

      {/* Filtres et recherche */}
      <OfferFilters />

      {/* Onglets de statut */}
      <OfferResults data={result} />
    </main>
  );
}
