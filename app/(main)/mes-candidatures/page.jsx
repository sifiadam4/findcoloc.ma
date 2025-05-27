"use server";

import CandidatureStats from "@/components/candidature/candidature-stats";
import CandidatureFilters from "@/components/candidature/candidature-filters";
import CandidatureResults from "@/components/candidature/candidature-results";
import { getCandidatures } from "@/actions/application";

export default async function MesCandidaturesPage() {


  const applications = await getCandidatures();

  // console.log("first:", applications[0]);

  // Compter les candidatures par statut
  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };


  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tighter font-bold text-foreground">
          Mes candidatures
        </h1>
        <p className="text-muted-foreground">
          Suivez l'état de vos demandes de colocation
        </p>
      </div>

      {/* Statistiques */}
      <CandidatureStats counts={counts} />

      {/* Filtres et recherche */}
      <CandidatureFilters />

      {/* Liste des candidatures */}
      <CandidatureResults candidatures={applications} />

    </main>
  );
}
