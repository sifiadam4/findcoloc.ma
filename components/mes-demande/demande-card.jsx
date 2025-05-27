"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Clock,
  MoreHorizontal,
  XCircle,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { UpdateApplication } from "@/actions/application";
import { Separator } from "../ui/separator";

export function DemandeCard({ application }) {
  const [expanded, setExpanded] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const onUpdateStatus = async (id, status) => {
    try {
      await UpdateApplication(id, status);
      // Optionally, you can add a success notification here
    } catch (error) {
      console.error("Error updating application status:", error);
      // Optionally, you can add an error notification here
    }
  };

  const getCurrentAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (gender) => {
    return gender === "female"
      ? "Femme"
      : gender === "male"
      ? "Homme"
      : "Autre";
  };

  const getOccupationLabel = (occupation) => {
    switch (occupation) {
      case "student":
        return "Étudiant";
      case "employee":
        return "Employé";
      case "freelancer":
        return "Freelance";
      case "entrepreneur":
        return "Entrepreneur";
      default:
        return "Autre";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "rejected":
        return "Refusée";
      default:
        return "En attente";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "outline";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "il y a quelques minutes";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    if (diffInHours < 48) return "il y a 1 jour";
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays} jours`;
  };

  const getPreferenceTags = () => {
    const tags = [];
    if (!application.user.smokingAllowed) tags.push("Non-fumeur");
    if (!application.user.petsAllowed) tags.push("Animaux non permis");
    if (!application.user.visitorsAllowed) tags.push("Visiteurs non permis");
    if (application.user.partyAllowed) tags.push("Fêtes non autorisées");
    return tags;
  };
  return (
    <Card className="overflow-hidden max-w-2xl mx-auto">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={application.user.image}
                  alt={application.user.name}
                />
                <AvatarFallback>
                  {application.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{application.user.name}</h3>
                <p className="text-gray-500 text-sm">
                  {getCurrentAge(application.user.dob)} ans •{" "}
                  {getGenderLabel(application.user.gender)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={getStatusClass(application.status)}
              >
                {getStatusLabel(application.status)}
              </Badge>
              {/* <span className="text-gray-400 text-sm">
                {formatTimeAgo(application.createdAt)}
              </span> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/profile/${application.user.id}`}>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Voir le profil
                    </DropdownMenuItem>
                  </Link>
                  {application.status === "pending" ? (
                    <>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() =>
                          onUpdateStatus(application.id, "accepted")
                        }
                      >
                        <Check className="h-4 w-4" />
                        Accepter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() =>
                          onUpdateStatus(application.id, "rejected")
                        }
                      >
                        <X className="h-4 w-4" />
                        Refuser
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => onUpdateStatus(application.id, "pending")}
                    >
                      <User className="h-4 w-4" />
                      Remettre en attente
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">
              {getOccupationLabel(application.user.occupation)}
            </Badge>
            {getPreferenceTags().map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Message */}
          <div className="mb-6">
            <h4 className="font-medium mb-1">Message du candidat</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {application.message}
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Property Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <img
                src={application.offer.images[0].url}
                alt={application.offer.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h5 className="font-medium tracking-tight">
                {application.offer.title}
              </h5>
              <p className="text-lg font-semibold tracking-tighter">
                {new Intl.NumberFormat("fr-MA", {
                  style: "currency",
                  currency: "MAD",
                }).format(application.offer.price)}
                <span className="ml-1 text-gray-400 font-normal text-sm tracking-normal">
                  /mois
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <Link href={`/profile/${application.user.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <User className="mr-2 h-4 w-4" />
                Voir le profil
              </Button>
            </Link>
            {application.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <X className="h-4 w-4" />
                  Refuser
                </Button>

                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 sm:flex-none"
                  onClick={() => onUpdateStatus(application.id, "accepted")}
                >
                  <Check className="h-4 w-4" />
                  Accepter
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => onUpdateStatus(application.id, "pending")}
              >
                <Clock className="h-4 w-4" />
                Remettre en attente
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser la demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir refuser la demande de{" "}
              {application.user.name} ? Cette action peut être annulée
              ultérieurement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onUpdateStatus(application.id, "rejected");
                setShowRejectDialog(false);
              }}
            >
              Refuser la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
