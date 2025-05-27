"use client";

import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { DemandeCard } from "./demande-card";



const DemandeResults = ({applications}) => {
    const [activeTab, setActiveTab] = useState("all");

    const filteredApplications = applications.filter((application) => {
        if (activeTab === "all") return true;
        return application.status === activeTab;
    });
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="">
          <TabsTrigger
            value="all"
            // className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Toutes
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            // className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            En attente
          </TabsTrigger>
          <TabsTrigger
            value="accepted"
            // className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
          >
            Acceptées
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            // className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
          >
            Refusées
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des candidatures */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <DemandeCard
              key={application.id}
              application={application}
            //   onUpdateStatus={updateApplicationStatus}
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
              <p className="mt-2 text-gray-500">
                {activeTab === "all"
                  ? "Vous n'avez pas encore reçu de demandes pour vos annonces."
                  : `Aucune demande avec le statut "${
                      activeTab === "pending"
                        ? "en attente"
                        : activeTab === "accepted"
                        ? "acceptée"
                        : "refusée"
                    }".`}
              </p>
              {/* {searchQuery && (
                <p className="mt-1 text-gray-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              )} */}
              {/* <Button className="mt-4" variant="outline">
                Voir toutes les demandes
              </Button> */}
              <Link href="/creer-offre" className="mt-2">
                <Button variant="outline">Créer une offre</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default DemandeResults;
