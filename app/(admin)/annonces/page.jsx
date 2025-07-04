import { AnnouncesTable } from "@/components/admin/announces-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { getAdminStats } from "@/actions/admin";

export default async function AnnouncesPage() {
  const stats = await getAdminStats();

  const announceStats = [
    {
      title: "Total Annonces",
      value: stats.offers.total.toString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "En Attente",
      value: stats.offers.pending.toString(),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Approuvées",
      value: stats.offers.approved.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rejetées",
      value: stats.offers.rejected.toString(),
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Annonces
        </h1>
        <p className="text-muted-foreground">
          Gérez toutes les annonces de votre plateforme de colocation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {announceStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnnouncesTable />
    </div>
  );
}
