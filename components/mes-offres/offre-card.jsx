"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Users,
  Calendar,
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Clock,
  Heart,
  Star,
  Wifi,
  Car,
  Utensils,
  Home,
  Bath,
  Wind,
  Zap,
  Building,
  TrendingUp,
  AlertTriangle,
  Copy,
  Share2,
  Camera,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { duplicateOffer, deleteOffer, publishOffer } from "@/actions/colocation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const OfferCard = ({ offer, formatDate }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();const handleDeleteOffer = async () => {
    try {
      const result = await deleteOffer(offer.id);
      
      if (result.success) {
        toast({
          title: "Succès!",
          description: result.message,
        });
        
        setDeleteDialogOpen(false);
        // Refresh the page to update the offer list
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handlePublishOffer = async () => {
    setIsPublishing(true);
    
    try {
      const result = await publishOffer(offer.id);
      
      if (result.success) {
        toast({
          title: "Succès!",
          description: result.message,
        });
        
        // Refresh the page to update the offer list
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDuplicateOffer = async () => {
    setIsDuplicating(true);
    
    try {
      const result = await duplicateOffer(offer.id);
      
      if (result.success) {
        toast({
          title: "Succès!",
          description: result.message,
        });
        
        // Redirect to edit the duplicated offer
        router.push(`/modifier-offre/${result.offer.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Impossible de dupliquer l'offre.",
        });
      }
    } catch (error) {
      console.error("Error duplicating offer:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
      });
    } finally {
      setIsDuplicating(false);
    }
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

  // Helper function to render amenities icons
  const getAmenityIcons = (offer) => {
    const amenities = [
      { key: "hasWifi", icon: Wifi, label: "WiFi" },
      { key: "hasParking", icon: Car, label: "Parking" },
      { key: "hasKitchen", icon: Utensils, label: "Cuisine" },
      { key: "hasAirCon", icon: Wind, label: "Climatisation" },
      { key: "hasHeating", icon: Zap, label: "Chauffage" },
      { key: "hasElevator", icon: Building, label: "Ascenseur" },
    ];

    return amenities
      .filter((amenity) => offer[amenity.key])
      .slice(0, 4) // Show max 4 amenities
      .map((amenity) => (
        <TooltipProvider key={amenity.key}>
          <Tooltip>
            <TooltipTrigger>
              <div className="p-1.5 bg-gray-100 rounded-full">
                <amenity.icon className="w-3 h-3 text-gray-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs py-0">{amenity.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ));
  };

  // Calculate profile completion percentage
  const calculateCompletionRate = (offer) => {
    const requiredFields = [
      "title",
      "description",
      "price",
      "address",
      "images",
      "propertyType",
      "roomType",
      "availableDate",
    ];
    const optionalFields = [
      "hasWifi",
      "hasParking",
      "hasKitchen",
      "genderPreference",
    ];

    let completed = 0;
    const total = requiredFields.length + optionalFields.length;

    requiredFields.forEach((field) => {
      if (field === "images" && offer.images?.length > 0) completed++;
      else if (offer[field]) completed++;
    });

    optionalFields.forEach((field) => {
      if (offer[field] !== null && offer[field] !== undefined) completed++;
    });

    return Math.round((completed / total) * 100);
  };

  const completionRate = calculateCompletionRate(offer);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">          {/* Image Section with Enhanced Info Overlay */}
          <div className="relative h-48 w-full lg:h-auto lg:w-1/3">
            <Image
              src={(offer.images && offer.images.length > 0 && offer.images[0]?.url) || "/placeholder.svg"}
              alt={offer.title}
              fill
              className="object-cover"
            />

            {/* Status Badge */}
            <div className="absolute left-3 top-3">
              {getStatusBadge(offer.status)}
            </div>

            {/* Image Count Badge */}
            {offer.images?.length > 1 && (
              <div className="absolute right-3 top-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                <div className="flex items-center">
                  <Camera className="mr-2 size-3.5" /> {offer.images.length}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-4">
              {/* Header with Title and Price */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/colocation/${offer.id}`}
                    className="text-lg font-semibold line-clamp-2 tracking-tight"
                  >
                    {offer.title}
                  </Link>

                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {offer.address}, {offer.city}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end ml-4">
                  <div className="text-xl font-bold text-primary tracking-tighter">
                    {new Intl.NumberFormat("fr-MA", {
                      style: "currency",
                      currency: "MAD",
                    }).format(offer.price)}
                  </div>
                  <div className="text-sm text-gray-500">/mois</div>
                  {/* <div className="text-xs text-gray-400 mt-1">
                    Créée il y a {daysOnline}j
                  </div> */}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {offer.description}
              </p>

              {/* Amenities Icons */}
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Équipements:
                </span>
                <div className="flex gap-1">{getAmenityIcons(offer)}</div>
              </div> */}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">
                      {offer.applications?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Candidats</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-semibold text-sm">
                      {offer.favorites?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Favoris</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-semibold text-xs">
                      {new Date(offer.availableDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Disponible</div>
                  </div>
                </div>
              </div>

              {/* Profile Completion (for drafts) */}
              {offer.status === "draft" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Profil d'annonce à {completionRate}%
                      </span>
                    </div>
                    <span className="text-xs text-amber-600">
                      {completionRate}%
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <p className="text-xs text-amber-700 mt-1">
                    Complétez votre annonce pour améliorer sa visibilité
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t">
              {/* Quick Actions */}              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleDuplicateOffer}
                  disabled={isDuplicating}
                >
                  <Copy className="h-3 w-3" />
                  {isDuplicating ? "Duplication..." : "Dupliquer"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-3 w-3" />
                  Partager
                </Button>
              </div>

              {/* Main Actions */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href={`/colocation/${offer.id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir l'annonce
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Link
                        href={`/dashboard/mes-demandes/${offer.id}`}
                        className="flex w-full items-center"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Voir les demandes
                      </Link>
                    </DropdownMenuItem>{" "}
                    <Link href={`/modifier-offre/${offer.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                    </Link>
                    {offer.status === "draft" && (
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Publier
                      </DropdownMenuItem>
                    )}
                    {offer.status === "active" && (
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        Archiver
                      </DropdownMenuItem>
                    )}
                    {offer.status === "archived" && (
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Réactiver
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => {
                            e.preventDefault();
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'offre</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette offre "
                            {offer.title}" ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteOffer}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>                {/* Show Demandes button only for active offers */}
                {offer.status !== "draft" && (
                  <Link href={`/mes-demandes/${offer.id}`}>
                    <Button size="sm" variant="outline" className="relative">
                      <Users className="h-4 w-4 mr-1" />
                      Demandes
                      {offer.applications?.length > 0 && (
                        <Badge className="ml-2 bg-primary text-white h-5 w-5 p-0 text-xs flex items-center justify-center">
                          {offer.applications.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}                {/* Show Publish button for drafts, Edit button for others */}
                {offer.status === "draft" ? (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handlePublishOffer}
                    disabled={isPublishing}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    {isPublishing ? "Publication..." : "Poster"}
                  </Button>
                ) : (
                  <Link href={`/modifier-offre/${offer.id}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Edit className="mr-1 h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
