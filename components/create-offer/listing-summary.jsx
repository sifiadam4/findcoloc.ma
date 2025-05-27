"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Euro,
  Home,
  Wifi,
  Thermometer,
  Wind,
  Shirt,
  UtensilsCrossed,
  Car,
  Sofa,
  BuildingIcon as Balcony,
  CableCarIcon as Elevator,
  User,
  Users,
  Check,
  X,
  UserIcon as Male,
  UserIcon as Female,
  Cigarette,
  PawPrint,
  UserRound,
  PartyPopper,
  Pencil,
  Loader,
} from "lucide-react";
import Image from "next/image";

export function ListingSummary({
  data,
  onSubmit,
  onPrevious,
  onEdit,
  isSubmitting,
  isEditing = false,
}) {
  // Fonction pour obtenir le libellé du type de propriété
  const getPropertyTypeLabel = (type) => {
    const types = {
      apartment: "Appartement",
      house: "Maison",
      studio: "Studio",
      coliving: "Coliving",
      other: "Autre",
    };
    return types[type] || type;
  };

  // Fonction pour obtenir le libellé du type de chambre
  const getRoomTypeLabel = (type) => {
    const types = {
      private: "Chambre privée",
      shared: "Chambre partagée",
    };
    return types[type] || type;
  };

  // Fonction pour obtenir le libellé de la préférence de genre
  const getGenderPreferenceLabel = (preference) => {
    const preferences = {
      male: "Hommes uniquement",
      female: "Femmes uniquement",
      any: "Tous genres",
    };
    return preferences[preference] || preference;
  };

  // Liste des équipements avec leurs icônes
  const amenities = [
    { name: "hasWifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
    {
      name: "hasHeating",
      label: "Chauffage",
      icon: <Thermometer className="h-4 w-4" />,
    },
    {
      name: "hasAirCon",
      label: "Climatisation",
      icon: <Wind className="h-4 w-4" />,
    },
    {
      name: "hasWasher",
      label: "Lave-linge",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "hasKitchen",
      label: "Cuisine équipée",
      icon: <UtensilsCrossed className="h-4 w-4" />,
    },
    { name: "hasParking", label: "Parking", icon: <Car className="h-4 w-4" /> },
    {
      name: "hasLivingRoom",
      label: "Salon",
      icon: <Sofa className="h-4 w-4" />,
    },
    {
      name: "hasBalcony",
      label: "Balcon",
      icon: <Balcony className="h-4 w-4" />,
    },
    {
      name: "hasElevator",
      label: "Ascenseur",
      icon: <Elevator className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Récapitulatif de votre annonce
        </h2>
        <p className="text-muted-foreground">
          Vérifiez les informations de votre annonce avant de la publier.
        </p>
      </div>

      {/* Aperçu des images */}
      <div className="space-y-4">
        {" "}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Photos</h3>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(0)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {data.images && data.images.length > 0 ? (
            data.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 3 && data.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                    +{data.images.length - 4}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-4 aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Aucune image disponible</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Informations de base */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Informations de base</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(0)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{data.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Euro className="h-4 w-4" />
              <span>{data.price} €/mois</span>
              <span className="mx-1">•</span>
              <Calendar className="h-4 w-4" />
              <span>
                Disponible à partir du{" "}
                {format(data.availableDate, "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Localisation</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(1)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p>{data.address}</p>
              <p>
                {data.zipCode} {data.city}
                {data.state ? `, ${data.state}` : ""}
              </p>
              <p>{data.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails du logement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Détails du logement</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(2)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {getPropertyTypeLabel(data.propertyType)}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) =>
                data[amenity.name] ? (
                  <Badge
                    key={amenity.name}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {amenity.icon}
                    {amenity.label}
                  </Badge>
                ) : null
              )}
              {!amenities.some((amenity) => data[amenity.name]) && (
                <span className="text-sm text-muted-foreground">
                  Aucun équipement sélectionné
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails de la chambre */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Détails de la chambre</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(3)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {data.roomType === "private" ? (
              <User className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Users className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-medium">
              {getRoomTypeLabel(data.roomType)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm">Chambre meublée</span>
              {data.roomFurnished ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-sm">Salle de bain privée</span>
              {data.privateToilet ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Règles et préférences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Règles et préférences</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={() => onEdit(4)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {data.genderPreference === "male" ? (
              <Male className="h-5 w-5 text-muted-foreground" />
            ) : data.genderPreference === "female" ? (
              <Female className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Users className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-medium">
              {getGenderPreferenceLabel(data.genderPreference)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <Cigarette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fumeur autorisé</span>
              </div>
              {data.smokingAllowed ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Animaux autorisés</span>
              </div>
              {data.petsAllowed ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Visiteurs autorisés</span>
              </div>
              {data.visitorsAllowed ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fêtes autorisées</span>
              </div>
              {data.partyAllowed ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>{" "}
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Modification" : "Publication"}
            </>
          ) : isEditing ? (
            "Modifier l'annonce"
          ) : (
            "Publier l'annonce"
          )}
        </Button>
      </div>
    </div>
  );
}
