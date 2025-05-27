"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import CandidatureCard from "@/components/candidature/candidature-card";


const CandidatureResults = ({ candidatures }) => {
  const [activeTab, setActiveTab] = useState("all");

  const sortedApplications = candidatures
    .filter((application) => {
      if (activeTab === "all") return true;
      return application.status === activeTab;
    })

  return (
    <>
      {/* Onglets de statut */}
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
      <div className="space-y-4">
        {sortedApplications.length > 0 ? (
          sortedApplications.map((application) => (
            <CandidatureCard key={application.id} application={application} />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">
                Aucune candidature trouvée
              </h3>
              <p className="mt-2 text-gray-500">
                {activeTab === "all"
                  ? "Vous n'avez pas encore envoyé de demandes de colocation."
                  : `Aucune candidature avec le statut "${
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
              <div className="flex flex-col gap-2">
                <Link href="/">
                  <Button className="mt-4">Parcourir les annonces</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CandidatureResults;
