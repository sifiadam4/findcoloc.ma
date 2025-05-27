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

const offers = [
  {
    id: 1,
    title: "Bel appartement au cœur de Paris",
    address: "Quartier Latin, Paris",
    price: 650,
    imageUrl: "/placeholder.svg?height=250&width=400",
    status: "active",
    createdAt: "2023-08-15",
    views: 120,
    applicants: 8,
    surface: 85,
    roommates: 3,
    availableDate: "2023-09-01",
  },
  {
    id: 2,
    title: "Colocation spacieuse proche campus",
    address: "Villeurbanne, Lyon",
    price: 450,
    imageUrl: "/placeholder.svg?height=250&width=400",
    status: "active",
    createdAt: "2023-08-10",
    views: 85,
    applicants: 5,
    surface: 110,
    roommates: 4,
    availableDate: "2023-08-15",
  },
  {
    id: 3,
    title: "Studio partagé rénové",
    address: "Vieux Port, Marseille",
    price: 380,
    imageUrl: "/placeholder.svg?height=250&width=400",
    status: "draft",
    createdAt: "2023-08-05",
    views: 0,
    applicants: 0,
    surface: 45,
    roommates: 2,
    availableDate: "2023-09-15",
  },
  {
    id: 4,
    title: "Maison avec jardin pour étudiants",
    address: "Rangueil, Toulouse",
    price: 420,
    imageUrl: "/placeholder.svg?height=250&width=400",
    status: "archived",
    createdAt: "2023-07-12",
    views: 210,
    applicants: 12,
    surface: 140,
    roommates: 5,
    availableDate: "2023-08-30",
  },
];

const listings = [
  {
    id: 1,
    title: "Bel appartement au cœur de Paris",
    address: "Quartier Latin, Paris",
    price: 650,
    imageUrl: "/placeholder.svg?height=250&width=400",
    applicants: [
      {
        id: 1,
        name: "Marie Dupont",
        age: 23,
        occupation: "Étudiante en droit",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=MD",
        applicationDate: "2023-08-15",
        message:
          "Bonjour, je suis très intéressée par votre colocation. Je suis étudiante en droit à la Sorbonne et je recherche un logement proche de l'université.",
        status: "pending",
      },
      {
        id: 2,
        name: "Thomas Martin",
        age: 25,
        occupation: "Jeune actif en marketing",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=TM",
        applicationDate: "2023-08-14",
        message:
          "Bonjour, votre annonce correspond parfaitement à ce que je recherche. Je travaille dans une agence de marketing à 15 minutes à pied.",
        status: "accepted",
      },
      {
        id: 3,
        name: "Julie Lefebvre",
        age: 22,
        occupation: "Étudiante en médecine",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=JL",
        applicationDate: "2023-08-12",
        message:
          "Bonjour, je suis en 3ème année de médecine et je cherche un logement calme pour pouvoir étudier sereinement.",
        status: "rejected",
      },
    ],
  },
  {
    id: 2,
    title: "Colocation spacieuse proche campus",
    address: "Villeurbanne, Lyon",
    price: 450,
    imageUrl: "/placeholder.svg?height=250&width=400",
    applicants: [
      {
        id: 4,
        name: "Lucas Bernard",
        age: 24,
        occupation: "Doctorant en physique",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=LB",
        applicationDate: "2023-08-16",
        message:
          "Bonjour, je suis doctorant à l'université Lyon 1 et je cherche un logement proche du campus pour les 3 prochaines années.",
        status: "pending",
      },
      {
        id: 5,
        name: "Emma Petit",
        age: 21,
        occupation: "Étudiante en informatique",
        avatarUrl: "/placeholder.svg?height=100&width=100&text=EP",
        applicationDate: "2023-08-13",
        message:
          "Bonjour, je suis en L3 informatique et je cherche une colocation conviviale avec d'autres étudiants.",
        status: "pending",
      },
    ],
  },
];

// Recent applications with pending status
const recentApplications = [
  {
    id: 1,
    applicant: {
      name: "Sophie Martin",
      age: 24,
      occupation: "Étudiante en architecture",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
    },
    offer: {
      id: 1,
      title: "Bel appartement au cœur de Paris",
      address: "Quartier Latin, Paris",
    },
    status: "pending",
    createdAt: "2025-05-24T10:30:00Z",
    message:
      "Bonjour, je suis très intéressée par votre colocation. Je suis étudiante en architecture et recherche un logement calme.",
  },
  {
    id: 2,
    applicant: {
      name: "Alexandre Dubois",
      age: 26,
      occupation: "Développeur web",
      avatar: "/placeholder.svg?height=40&width=40&text=AD",
    },
    offer: {
      id: 2,
      title: "Colocation spacieuse proche campus",
      address: "Villeurbanne, Lyon",
    },
    status: "pending",
    createdAt: "2025-05-23T16:45:00Z",
    message:
      "Salut ! Votre annonce m'intéresse beaucoup. Je travaille en remote et cherche un environnement sympa.",
  },
  {
    id: 3,
    applicant: {
      name: "Camille Laurent",
      age: 22,
      occupation: "Étudiante en médecine",
      avatar: "/placeholder.svg?height=40&width=40&text=CL",
    },
    offer: {
      id: 1,
      title: "Bel appartement au cœur de Paris",
      address: "Quartier Latin, Paris",
    },
    status: "pending",
    createdAt: "2025-05-22T14:20:00Z",
    message:
      "Bonjour, je suis en 3ème année de médecine et cherche une colocation proche de l'hôpital.",
  },
];

// Recent reviews and roommates
const recentReviews = [
  {
    id: 1,
    reviewer: {
      name: "Marie Dupont",
      avatar: "/placeholder.svg?height=40&width=40&text=MD",
    },
    rating: 5,
    comment:
      "Excellente colocataire, très propre et respectueuse. Je recommande vivement !",
    createdAt: "2025-05-20T09:15:00Z",
    offer: "Appartement Quartier Latin",
  },
  {
    id: 2,
    reviewer: {
      name: "Thomas Martin",
      avatar: "/placeholder.svg?height=40&width=40&text=TM",
    },
    rating: 4,
    comment:
      "Très bonne expérience de colocation, ambiance conviviale et lieu bien entretenu.",
    createdAt: "2025-05-18T11:30:00Z",
    offer: "Colocation Lyon Campus",
  },
];

// Current roommates
const currentRoommates = [
  {
    id: 1,
    name: "Julie Lefebvre",
    avatar: "/placeholder.svg?height=40&width=40&text=JL",
    occupation: "Étudiante en médecine",
    moveInDate: "2025-01-15",
    hasReview: false,
    offerId: 1,
  },
  {
    id: 2,
    name: "Lucas Bernard",
    avatar: "/placeholder.svg?height=40&width=40&text=LB",
    occupation: "Doctorant en physique",
    moveInDate: "2025-03-01",
    hasReview: true,
    offerId: 2,
  },
];

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

export default function DashboardPage() {
  const offerCounts = {
    all: offers.length,
    active: offers.filter((o) => o.status === "active").length,
    draft: offers.filter((o) => o.status === "draft").length,
    archived: offers.filter((o) => o.status === "archived").length,
  };

  const demandeCounts = {
    all: listings.flatMap((l) => l.applicants).length,
    pending: listings.flatMap((l) =>
      l.applicants.filter((a) => a.status === "pending")
    ).length,
    accepted: listings.flatMap((l) =>
      l.applicants.filter((a) => a.status === "accepted")
    ).length,
    rejected: listings.flatMap((l) =>
      l.applicants.filter((a) => a.status === "rejected")
    ).length,
  };

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
              <p className="text-2xl font-bold">{demandeCounts.pending}</p>
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
              <p className="text-2xl font-bold">{demandeCounts.accepted}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Vues totales</p>
              <p className="text-2xl font-bold">
                {offers.reduce((sum, offer) => sum + offer.views, 0)}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Recent Applications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    src={application.applicant.avatar}
                    alt={application.applicant.name}
                  />
                  <AvatarFallback>
                    {application.applicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {application.applicant.name}
                    </h4>
                    <Badge variant="secondary" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      En attente
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {application.applicant.occupation}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{application.offer.title}</span>
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
                    <Link href={`/mes-demandes/${application.offer.id}`}>
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

        {/* Reviews Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Évaluations & Colocataires
            </CardTitle>
            <Link href="/evaluations">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Reviews */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">
                Évaluations récentes
              </h5>
              {recentReviews.map((review) => (
                <div key={review.id} className="p-3 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                      />
                      <AvatarFallback>
                        {review.reviewer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-medium">
                          {review.reviewer.name}
                        </h6>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {review.offer}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {review.comment}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Roommates */}
            <div className="space-y-3 border-t pt-4">
              <h5 className="text-sm font-medium text-gray-700">
                Colocataires actuels
              </h5>
              {currentRoommates.map((roommate) => (
                <div
                  key={roommate.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={roommate.avatar} alt={roommate.name} />
                      <AvatarFallback>
                        {roommate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h6 className="text-sm font-medium">{roommate.name}</h6>
                      <p className="text-xs text-gray-500">
                        {roommate.occupation}
                      </p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Depuis{" "}
                        {new Date(roommate.moveInDate).toLocaleDateString(
                          "fr-FR",
                          { month: "short", year: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {roommate.hasReview ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Évalué
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Évaluer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {currentRoommates.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Aucun colocataire actuel</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
