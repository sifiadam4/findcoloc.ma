import CandidatureStats from "@/components/candidature/candidature-stats";
import CandidatureFilters from "@/components/candidature/candidature-filters";
import CandidatureResults from "@/components/candidature/candidature-results";
import { getCandidatures } from "@/actions/application";

export default async function MesCandidaturesPage({ searchParams }) {
  // Extract pagination and filter parameters from URL
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = parseInt(searchParams?.pageSize) || 12;
  const query = searchParams?.search || "";
  const sort = searchParams?.sort || "recent";

  // Fetch candidatures on the server with pagination
  const result = await getCandidatures(query, sort, page, pageSize);
  const { applications, pagination } = result;

  // Calculate stats for all applications (not just current page)
  const counts = {
    all: pagination.totalCount,
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

      {/* Filtres */}
      <CandidatureFilters />

      {/* Résultats */}
      <CandidatureResults data={result} />
    </main>
  );
}
