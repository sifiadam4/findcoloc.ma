import { getReceivedApplications } from "@/actions/application";
import CandidatureStats from "@/components/candidature/candidature-stats";
import DemandeFilters from "@/components/mes-demande/demande-filters";
import DemandeResults from "@/components/mes-demande/demande-results";

export default async function MesDemandesPage() {
  const applications = await getReceivedApplications();

  console.log("Applications reçues:", applications);

  // Compter les candidatures par statut
  const counts = {
    all: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tighter">
          Gestion des demandes
        </h1>
        <p className="text-muted-foreground">
          Consultez et gérez les demandes de colocation pour vos annonces
        </p>
      </div>

      {/* Statistiques */}
      <CandidatureStats counts={counts} />

      {/* Filtres et recherche */}
      <DemandeFilters />

      {/* Onglets de statut */}
      <DemandeResults applications={applications} />
    </main>
  );
}
