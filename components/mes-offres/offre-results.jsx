"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import OfferCard from "./offre-card";

const OfferResults = ({ offers }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

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
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Brouillon
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Archivée
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
          <TabsTrigger
            value="all"
            // className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Toutes
          </TabsTrigger>
          <TabsTrigger
            value="active"
            // className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
          >
            Actives
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            // className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            Brouillons
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            // className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Archivées
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des offres */}
      <div className="space-y-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            // <Card key={offer.id} className="overflow-hidden">
            //   <CardContent className="p-0">
            //     <div className="flex flex-col md:flex-row">
            //       <div className="relative h-48 w-full md:h-auto md:w-1/3 lg:w-1/4">
            //         <Image
            //           src={offer.images[0].url || "/placeholder.svg"}
            //           alt={offer.title}
            //           fill
            //           className="object-cover"
            //         />
            //         <div className="absolute left-2 top-2">
            //           {getStatusBadge(offer.status)}
            //         </div>
            //       </div>

            //       <div className="flex flex-1 flex-col justify-between p-4">
            //         <div>
            //           <div className="mb-2 flex items-start justify-between">
            //             <div>
            //               <Link
            //                 href={`/colocation/${offer.id}`}
            //                 className="text-lg font-semibold hover:underline"
            //               >
            //                 {offer.title}
            //               </Link>
            //               <div className="flex items-center text-sm text-gray-500">
            //                 <MapPin className="mr-1 h-4 w-4" />
            //                 {offer.address}
            //               </div>
            //             </div>
            //             <div className="flex flex-col items-end">
            //               <div className="flex items-center">
            //                 <span className="font-medium">
            //                   {offer.price}€/mois
            //                 </span>
            //               </div>
            //               <div className="mt-1 text-sm text-gray-500">
            //                 Créée le {formatDate(offer.createdAt)}
            //               </div>
            //             </div>
            //           </div>

            //           <p className="text-gray-700">
            //             {offer.description.length > 150
            //               ? `${offer.description.substring(0, 150)}...`
            //               : offer.description}
            //           </p>

            //           <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            //             {/* <div className="flex items-center">
            //               <Eye className="mr-1 h-4 w-4 text-gray-500" />
            //               <span>{offer.views} vues</span>
            //             </div> */}
            //             <div className="flex items-center">
            //               <Users className="mr-1 h-4 w-4 text-gray-500" />
            //               <span>{offer.applications.length} candidats</span>
            //             </div>
            //             <div className="flex items-center">
            //               <Calendar className="mr-1 h-4 w-4 text-gray-500" />
            //               <span>
            //                 Dispo le{" "}
            //                 {new Date(offer.availableDate).toLocaleDateString(
            //                   "fr-FR",
            //                   {
            //                     day: "numeric",
            //                     month: "long",
            //                   }
            //                 )}
            //               </span>
            //             </div>
            //           </div>
            //         </div>

            //         <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            //           {/* <div className="flex items-center gap-2">
            //             {offer.status === "active" && (
            //               <Badge className="bg-primary/10 text-primary">
            //                 {offer.roommates} colocataire
            //                 {offer.roommates > 1 ? "s" : ""}
            //               </Badge>
            //             )}
            //             {offer.status === "draft" && (
            //               <Badge variant="outline" className="text-amber-500">
            //                 À compléter
            //               </Badge>
            //             )}
            //           </div> */}

            //           <div className="flex gap-2">
            //             <DropdownMenu>
            //               <DropdownMenuTrigger asChild>
            //                 <Button variant="outline" size="sm">
            //                   <MoreHorizontal className="h-4 w-4" />
            //                   Actions
            //                 </Button>
            //               </DropdownMenuTrigger>
            //               <DropdownMenuContent align="end">
            //                 <Link href={`/colocation/${offer.id}`}>
            //                   <DropdownMenuItem>
            //                     <Eye className="mr-2 h-4 w-4" />
            //                     Voir l'annonce
            //                   </DropdownMenuItem>
            //                 </Link>
            //                 <DropdownMenuItem>
            //                   <Link
            //                     href={`/dashboard/mes-demandes/${offer.id}`}
            //                     className="flex w-full items-center"
            //                   >
            //                     <Users className="mr-2 h-4 w-4" />
            //                     Voir les demandes
            //                   </Link>
            //                 </DropdownMenuItem>
            //                 <Link href={`/creer-offre?edit=${offer.id}`}>
            //                   <DropdownMenuItem>
            //                     <Edit className="mr-2 h-4 w-4" />
            //                     Modifier
            //                   </DropdownMenuItem>
            //                 </Link>
            //                 {offer.status === "draft" && (
            //                   <DropdownMenuItem>
            //                     <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            //                     Publier
            //                   </DropdownMenuItem>
            //                 )}
            //                 {offer.status === "active" && (
            //                   <DropdownMenuItem>
            //                     <Clock className="mr-2 h-4 w-4 text-gray-500" />
            //                     Archiver
            //                   </DropdownMenuItem>
            //                 )}
            //                 {offer.status === "archived" && (
            //                   <DropdownMenuItem>
            //                     <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            //                     Réactiver
            //                   </DropdownMenuItem>
            //                 )}
            //                 <DropdownMenuSeparator />
            //                 <AlertDialog
            //                   open={
            //                     deleteDialogOpen && offerToDelete === offer.id
            //                   }
            //                   onOpenChange={setDeleteDialogOpen}
            //                 >
            //                   <AlertDialogTrigger asChild>
            //                     <DropdownMenuItem
            //                       className="text-red-600"
            //                       onClick={() => setOfferToDelete(offer.id)}
            //                     >
            //                       <Trash2 className="mr-2 h-4 w-4" />
            //                       Supprimer
            //                     </DropdownMenuItem>
            //                   </AlertDialogTrigger>
            //                   <AlertDialogContent>
            //                     <AlertDialogHeader>
            //                       <AlertDialogTitle>
            //                         Supprimer l'offre
            //                       </AlertDialogTitle>
            //                       <AlertDialogDescription>
            //                         Êtes-vous sûr de vouloir supprimer cette
            //                         offre ? Cette action est irréversible.
            //                       </AlertDialogDescription>
            //                     </AlertDialogHeader>
            //                     <AlertDialogFooter>
            //                       <AlertDialogCancel
            //                         onClick={() => setOfferToDelete(null)}
            //                       >
            //                         Annuler
            //                       </AlertDialogCancel>
            //                       <AlertDialogAction
            //                         className="bg-red-600 hover:bg-red-700"
            //                         onClick={() => deleteOffer(offer.id)}
            //                       >
            //                         Supprimer
            //                       </AlertDialogAction>
            //                     </AlertDialogFooter>
            //                   </AlertDialogContent>
            //                 </AlertDialog>
            //               </DropdownMenuContent>
            //             </DropdownMenu>
            //             <Link href={`/mes-demandes/${offer.id}`}>
            //               <Button
            //                 size="sm"
            //                 variant="outline"
            //                 className="flex items-center gap-1"
            //               >
            //                 <Users className="h-4 w-4" />
            //                 Demandes{" "}
            //                 {offer.applications.length > 0 && (
            //                   <span className="ml-1 bg-primary text-white size-5 flex items-center justify-center rounded-full ">
            //                     {offer.applications.length}
            //                   </span>
            //                 )}
            //               </Button>
            //             </Link>
            //             <Link href={`/creer-offre?edit=${offer.id}`}>
            //               <Button
            //                 size="sm"
            //                 className="bg-primary hover:bg-primary/90"
            //               >
            //                 <Edit className="mr-1 h-4 w-4" />
            //                 Modifier
            //               </Button>
            //             </Link>
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>
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
              <h3 className="text-lg font-medium">Aucune offre trouvée</h3>
              <p className="mt-2 text-gray-500">
                {activeTab === "all"
                  ? "Vous n'avez pas encore créé d'offres de colocation."
                  : `Aucune offre avec le statut "${
                      activeTab === "active"
                        ? "active"
                        : activeTab === "draft"
                        ? "brouillon"
                        : "archivée"
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
    </>
  );
};

export default OfferResults;
