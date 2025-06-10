"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Calendar,
  User,
  Star,
  MessageSquare,
  StopCircle,
  Loader2,
} from "lucide-react";
import { endSejour } from "@/actions/sejour";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SejourCard({
  sejour,
  currentUserId,
  showActions = false,
}) {
  const [isEndingStay, setIsEndingStay] = useState(false);
  const router = useRouter();

  const isOwner = sejour.ownerId === currentUserId;
  const isTenant = sejour.tenantId === currentUserId;
  const otherUser = isOwner ? sejour.tenant : sejour.owner;
  const role = isOwner ? "Propriétaire" : "Colocataire";

  const handleEndStay = async () => {
    setIsEndingStay(true);
    try {
      const result = await endSejour(
        sejour.id,
        isTenant ? "ended_by_tenant" : "ended_by_owner"
      );
      if (result.success) {
        toast.success("Séjour terminé avec succès");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la fin du séjour");
      }
    } catch (error) {
      console.error("Error ending stay:", error);
      toast.error("Erreur lors de la fin du séjour");
    } finally {
      setIsEndingStay(false);
    }
  };

  const needsFeedback =
    sejour.status === "ended" &&
    ((isOwner && !sejour.ownerFeedbackGiven) ||
      (isTenant && !sejour.tenantFeedbackGiven));

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Property Image */}
          <div className="relative h-48 md:h-auto md:w-96 flex-shrink-0">
            <Image
              src={sejour.offer.images?.[0]?.url || "/placeholder.svg"}
              alt={sejour.offer.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge
                variant={sejour.status === "active" ? "default" : "secondary"}
              >
                {sejour.status === "active" ? "En cours" : "Terminé"}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {sejour.offer.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {sejour.offer.address}, {sejour.offer.city}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {new Intl.NumberFormat("fr-MA", {
                        style: "currency",
                        currency: "MAD",
                      }).format(sejour.offer.price)}
                      <span className="text-sm font-normal text-gray-500">
                        /mois
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{role}</Badge>
                </div>

                {/* Other User Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser.image} />
                    <AvatarFallback>
                      {otherUser.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{otherUser.name}</p>
                    <p className="text-sm text-gray-600">
                      {isOwner ? "Colocataire" : "Propriétaire"}
                    </p>
                  </div>
                  <Link href={`/profile/${otherUser.id}`}>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Début:{" "}
                      {new Date(sejour.startDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {sejour.endDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Fin:{" "}
                        {new Date(sejour.endDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {(showActions || needsFeedback) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {needsFeedback && (
                    <Link href={`/feedback?sejourId=${sejour.id}`}>
                      <Button size="sm" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Laisser un avis
                      </Button>
                    </Link>
                  )}

                  {showActions && sejour.status === "active" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contacter
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <StopCircle className="h-4 w-4" />
                            Terminer le séjour
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Terminer le séjour
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir terminer ce séjour ?
                              Cette action est irréversible et des notifications
                              seront envoyées aux deux parties.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleEndStay}
                              disabled={isEndingStay}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isEndingStay && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Terminer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
