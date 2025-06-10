"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Plus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import OfferCard from "./offre-card";
import Pagination from "../global/pagination";

const OfferResults = ({ data }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const { offers, pagination } = data || {};

  if (!offers) {
    return <div>Loading...</div>;
  }

  const filteredOffers = offers.filter((offer) => {
    if (activeTab === "all") return true;
    return offer.status === activeTab;
  });

  // Supprimer une offre
  const deleteOffer = (id) => {
    // setOffers(offers.filter((offer) => offer.id !== id));
    setDeleteDialogOpen(false);
    setOfferToDelete(null);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            En attente
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "rented":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Louée
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Brouillon
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Fermée
          </Badge>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="rented">Louées</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
          <TabsTrigger value="closed">Fermées</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Liste des offres */}
      <div className="space-y-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              offerToDelete={offerToDelete}
              setOfferToDelete={setOfferToDelete}
              deleteOffer={deleteOffer}
              formatDate={formatDate}
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">Aucune offre trouvée</h3>{" "}
              <p className="mt-2 text-gray-500">
                {activeTab === "all"
                  ? "Vous n'avez pas encore créé d'offres de colocation."
                  : `Aucune offre avec le statut "${
                      activeTab === "pending"
                        ? "en attente"
                        : activeTab === "active"
                        ? "active"
                        : activeTab === "rented"
                        ? "louée"
                        : activeTab === "draft"
                        ? "brouillon"
                        : activeTab === "closed"
                        ? "fermée"
                        : activeTab
                    }".`}
              </p>
              {/* {searchQuery && (
                <p className="mt-1 text-gray-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              )} */}
              <Link href="/creer-offre">
                <Button className="mt-4 ">
                  <Plus className="mr-1 h-4 w-4" />
                  Créer une offre
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="space-y-4">
          {/* Pagination info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Affichage de{" "}
              {Math.min(
                (pagination.currentPage - 1) * pagination.pageSize + 1,
                pagination.totalCount
              )}{" "}
              à{" "}
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalCount
              )}{" "}
              sur {pagination.totalCount} offres
            </p>
          </div>

          {/* Pagination controls */}
          <Pagination pagination={pagination} />
        </div>
      )}
    </>
  );
};

export default OfferResults;
