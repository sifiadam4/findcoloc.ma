'use client';

import { useEffect, useState } from "react";
import CandidatureStats from "@/components/candidature/candidature-stats";
import CandidatureFilters from "@/components/candidature/candidature-filters";
import CandidatureResults from "@/components/candidature/candidature-results";
import { getCandidatures } from "@/actions/application"; // Must be client-safe or replaced with API call

export default function MesCandidaturesPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const data = await getCandidatures(); // Or fetch from /api/candidatures
        setApplications(data);

        const stats = {
          all: data.length,
          pending: data.filter((a) => a.status === "pending").length,
          accepted: data.filter((a) => a.status === "accepted").length,
          rejected: data.filter((a) => a.status === "rejected").length,
        };

        setCounts(stats);
      } catch (error) {
        console.error("Erreur lors du chargement des candidatures :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, []);

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

      {loading ? (
        <div>Chargement des candidatures...</div>
      ) : (
        <>
          {/* Statistiques */}
          <CandidatureStats counts={counts} />

          {/* Filtres */}
          <CandidatureFilters />

          {/* Résultats */}
          <CandidatureResults candidatures={applications} />
        </>
      )}
    </main>
  );
}
