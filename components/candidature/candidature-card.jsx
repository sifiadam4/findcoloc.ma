import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Trash2,
  XCircle,
  Euro,
  Users,
  Calendar,
  Loader,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteApplication } from "@/actions/application";

const CandidatureCard = ({ application }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const deleteApplication = async (id) => {
    setIsDeleting(true);
    try {
      const result = await DeleteApplication(id);
      if (result) {
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting application:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 flex items-center gap-1"
          >
            <Clock className="size-3" />
            En attente
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 flex items-center gap-1"
          >
            <CheckCircle2 className="size-3" />
            Acceptée
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 flex items-center gap-1"
          >
            <XCircle className="size-3" />
            Refusée
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 w-full md:h-auto md:w-1/3 lg:w-1/4">
            <Image
              src={application.offer.images[0].url || "/placeholder.svg"}
              alt={application.offer.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-2 left-2">
              {getStatusBadge(application.status)}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <Link
                    href={`/colocation/${application.listingId}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {application.offer.title}
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {application.offer.address}
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="mt-1 text-sm text-gray-500">
                    Envoyée le {formatDate(application.createdAt)}
                  </div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                <div className="flex items-center">
                  <Euro className="mr-1 h-4 w-4 text-gray-500" />
                  <span>{application.offer.price}€/mois</span>
                </div>
                <div className="flex items-center col-span-2 md:col-span-1">
                  <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                  <span>
                    Disponible le {formatDate(application.offer.availableDate)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Votre message :</h4>
                <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                  {application.message}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {" "}
                <div className="flex items-center">
                  <div className="h-6 w-6 overflow-hidden rounded-full">
                    <Image
                      src={application.offer.user.image || "/placeholder.svg"}
                      alt={`Photo de profil`}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="ml-2 text-sm">
                    {application.offer.user.name}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <AlertDialog
                  open={
                    deleteDialogOpen && applicationToDelete === application.id
                  }
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setApplicationToDelete(application.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Supprimer la candidature
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette candidature ?
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setApplicationToDelete(null)}
                      >
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteApplication(application.id)}
                      >
                        {isDeleting && (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Link href={`/colocation/${application.listingId}`}>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Voir l'annonce
                  </Button>
                </Link>{" "}
                {/* {application.status === "accepted" && (
                  <>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Contacter
                    </Button>

                    <Link href={`/mes-sejours`}>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Calendar className="mr-1 h-4 w-4" />
                        Commencer le séjour
                      </Button>
                    </Link>
                  </>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidatureCard;
