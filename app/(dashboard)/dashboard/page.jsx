import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  Eye,
  Home,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  getDashboardStats,
  getCurrentRoommates,
  getRecentReviews,
} from "@/actions/dashboard";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Il y a quelques minutes";
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  if (diffInHours < 48) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

// Helper function to render star rating
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default async function DashboardPage() {
  // Fetch real data from database
  const dashboardStats = await getDashboardStats();
  const currentRoommates = await getCurrentRoommates();
  const recentReviews = await getRecentReviews();

  const { offerCounts, applicationCounts, recentApplications, totalViews } =
    dashboardStats;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tighter">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Gérez vos offres et demandes de colocation
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Offres actives
              </p>
              <p className="text-2xl font-bold">{offerCounts.active}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Home className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Demandes en attente
              </p>
              <p className="text-2xl font-bold">{applicationCounts.pending}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Demandes acceptées
              </p>
              <p className="text-2xl font-bold">{applicationCounts.accepted}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Demandes récentes
          </CardTitle>
          <Link href="/mes-demandes">
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentApplications.map((application) => (
            <div
              key={application.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={application.user?.image}
                  alt={application.user?.name}
                />
                <AvatarFallback>
                  {application.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {application.user?.name || "Utilisateur inconnu"}
                  </h4>
                  <Badge variant="secondary" className="ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {application.user?.occupation
                    ? application.user.occupation.charAt(0).toUpperCase() +
                      application.user.occupation.slice(1)
                    : "Profession non renseignée"}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{application.offer?.title}</span>
                </div>
                <p
                  className="text-sm text-gray-600 mt-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {application.message}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">
                    {formatDate(application.createdAt)}
                  </span>
                  <Link href={`/mes-demandes/${application.offer?.id}`}>
                    <Button size="sm" variant="outline">
                      Répondre
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {recentApplications.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Aucune demande récente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
