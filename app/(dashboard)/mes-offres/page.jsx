
import OffreStats from "@/components/mes-offres/offre-stats";
import OfferResults from "@/components/mes-offres/offre-results";
import { getMyOffers } from "@/actions/colocation";
import OfferFilters from "@/components/mes-offres/offre-filters";

export default async function MesOffresPage() {


  const offers = await getMyOffers();

  console.log("Mes offres:", offers);

  // Compter les offres par statut
  const counts = {
    all: offers.length,
    active: offers.filter((o) => o.status === "active").length,
    draft: offers.filter((o) => o.status === "draft").length,
    archived: offers.filter((o) => o.status === "archived").length,
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
      <OfferResults offers={offers} />

    </main>
  );
}
