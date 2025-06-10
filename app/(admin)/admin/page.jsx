import { StatsCards } from "@/components/admin/stats-cards";
import { PendingProperties } from "@/components/admin/pending-properties";
import { UsersManagement } from "@/components/admin/users-management";
import { RecentActivity } from "@/components/admin/recent-activity";
import { getAdminStats } from "@/actions/admin";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Administration
        </h1>
        <p className="text-muted-foreground">
          Gérez votre plateforme de colocation, validez les annonces et vérifiez
          les utilisateurs.
        </p>
      </div>

      <StatsCards stats={stats} />

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <PendingProperties />
        </div>
        <div className="col-span-3">
          <RecentActivity />
        </div>
      </div> */}

      <PendingProperties />

      <UsersManagement />
    </div>
  );
}
