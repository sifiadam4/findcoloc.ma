"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  Home,
  Wifi,
  Wind,
  Shirt,
  UtensilsCrossed,
  Car,
  Sofa,
  BuildingIcon as Balcony,
  CableCarIcon as Elevator,
  Thermometer,
  Loader,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DemandeButton from "@/components/detail/detail-demande-button";
import DetailMap from "@/components/detail/detail-map";
import { getOfferById } from "@/actions/colocation";
import { useParams } from "next/navigation";

export default function ColocationDetail() {
  const { id } = useParams(); // Get ID from route params
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getOfferById(id);
        setListing(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'offre :", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Loader className="h-5 w-5 animate-spin" />
    </div>
  }

  if (!listing) {
    return <div className="text-center py-10 text-destructive">Aucune offre trouvée.</div>;
  }

  // Prepare amenities
  const amenities = [];
  if (listing.hasWifi) amenities.push({ label: "WiFi", icon: Wifi });
  if (listing.hasHeating) amenities.push({ label: "Chauffage", icon: Thermometer });
  if (listing.hasAirCon) amenities.push({ label: "Climatisation", icon: Wind });
  if (listing.hasWasher) amenities.push({ label: "Lave-linge", icon: Shirt });
  if (listing.hasKitchen) amenities.push({ label: "Cuisine", icon: UtensilsCrossed });
  if (listing.hasParking) amenities.push({ label: "Parking", icon: Car });
  if (listing.hasLivingRoom) amenities.push({ label: "Salon", icon: Sofa });
  if (listing.hasBalcony) amenities.push({ label: "Balcon", icon: Balcony });
  if (listing.hasElevator) amenities.push({ label: "Ascenseur", icon: Elevator });

  // Prepare rules
  const rules = [];
  if (!listing.smokingAllowed) rules.push("Fumer non autorisé");
  if (!listing.petsAllowed) rules.push("Animaux non autorisés");
  if (!listing.visitorsAllowed) rules.push("Visiteurs non autorisés");
  if (!listing.partyAllowed) rules.push("Fêtes non autorisées");

  const RoomTypeLabels = {
    private: "Chambre Privée",
    shared: "Chambre Partagée",
  };

  const PropertyTypeLabels = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
    villa: "Villa",
  };

  const formattedDate = new Date(listing.availableDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl tracking-tighter font-bold text-foreground">
            {listing.title}
          </h1>
          <p className="flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {listing.address}
          </p>
        </div>
        <DemandeButton offerId={listing.id} />
      </div>

      {listing.images.length > 0 && (
        <div className="w-full relative">
          <Carousel className="w-full">
            <CarouselContent>
              {listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] w-full">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${listing.title} - image ${index + 1}`}
                      className="object-cover rounded-lg"
                      fill
                      sizes="100vw"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2" />
            <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p className="text-card-foreground">{listing.description}</p>

              <h2 className="mb-4 mt-8 text-xl font-semibold">Équipements</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{amenity.label}</span>
                    </div>
                  );
                })}
              </div>

              <h2 className="mb-4 mt-8 text-xl font-semibold">Règles de la colocation</h2>
              <ul className="list-inside list-disc space-y-2 text-card-foreground">
                {rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>

              <h2 className="mb-4 mt-8 text-xl font-semibold">Localisation</h2>
              <DetailMap
                latitude={listing.latitude}
                longitude={listing.longitude}
                title={listing.title}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold tracking-tighter mr-1">
                    {new Intl.NumberFormat("fr-MA", {
                      style: "currency",
                      currency: "MAD",
                    }).format(listing.price)}
                  </span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <Badge variant="outline" className="text-primary">
                  {listing.applications.length} intéressé
                  {listing.applications.length > 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Disponible à partir du</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {PropertyTypeLabels[listing.propertyType]}
                    </p>
                    <p className="text-muted-foreground">
                      {RoomTypeLabels[listing.roomType]}
                    </p>
                  </div>
                </div>
              </div>

              <DemandeButton offerId={listing.id} className="w-full" />

              <p className="mt-2 text-center text-xs text-muted-foreground">
                Réponse généralement en moins de 24h
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
