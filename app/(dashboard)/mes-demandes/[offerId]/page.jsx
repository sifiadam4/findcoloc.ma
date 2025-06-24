"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { DemandeCard } from "@/components/mes-demande/demande-card";
import { getReceivedApplicationsByOfferId } from "@/actions/application";

export default function OfferDemandesPage({ params }) {
  const { offerId } = React.use(params);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [offerData, setOfferData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Offer ID:", offerId);
  console.log("Offer Data:", offerData);
  console.log("Applications:", applications);

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getReceivedApplicationsByOfferId(offerId);
        setOfferData(data.offer);
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOfferData(null);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [offerId]);

  // Filtrer les candidatures en fonction de l'onglet actif et de la recherche
  const filteredApplications = applications.filter((application) => {
    // Filtre par statut
    if (activeTab !== "all" && application.status !== activeTab) return false;

    // Filtre par recherche
    if (
      searchQuery &&
      !application.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  // Trier les candidatures
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  // Compter les candidatures par statut
  const counts = {
    all: applications.length || 0,
    pending: applications.filter((a) => a.status === "pending").length || 0,
    accepted: applications.filter((a) => a.status === "accepted").length || 0,
    rejected: applications.filter((a) => a.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
          <Loader className="mb-4 h-5 w-5 animate-spin"/>
      </div>
    );
  }

  if (!offerData) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Offre non trouvée</h2>
          <p className="mb-4 text-muted-foreground">
            L'offre que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link href="/mes-offres">
            <Button>Retour à mes offres</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              {offerData.title}
            </h1>
            <p className="text-muted-foreground">{offerData.address}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Badge className="bg-primary text-white">{offerData.price}€/mois</Badge> */}
            <Link href={`/colocation/${offerData.id}`}>
              <Button variant="outline" size="sm">
                Voir l'annonce
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Résumé des candidatures */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold">{counts.all}</p>
            </div>
            <div className="rounded-full bg-muted p-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-bold">{counts.pending}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Acceptées</p>
              <p className="text-2xl font-bold">{counts.accepted}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Refusées</p>
              <p className="text-2xl font-bold">{counts.rejected}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Rechercher un candidat..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Trier par" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="oldest">Plus anciennes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onglets de statut */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Toutes
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            En attente
          </TabsTrigger>
          <TabsTrigger
            value="accepted"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
          >
            Acceptées
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
          >
            Refusées
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des candidatures */}
      <div>
        {sortedApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full">
            {sortedApplications.map((application) => (
              <DemandeCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
              <p className="mt-2 text-gray-500">
                {activeTab === "all"
                  ? "Vous n'avez pas encore reçu de demandes pour cette annonce."
                  : `Aucune demande avec le statut "${
                      activeTab === "pending"
                        ? "en attente"
                        : activeTab === "accepted"
                        ? "acceptée"
                        : "refusée"
                    }".`}
              </p>
              {searchQuery && (
                <p className="mt-1 text-gray-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              )}
              <Link href="/dashboard/mes-offres">
                <Button className="mt-4" variant="outline">
                  Retour à mes offres
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
