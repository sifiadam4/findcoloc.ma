"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import FavorisButton from "../favoris/favoris-button";
import { format } from "date-fns";
import { Button } from "../ui/button";
import Link from "next/link";
import { candidat_offer_compatibilityScore } from "@/actions/colocation";

export default function ListingCard({ listing }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [compatibilityScore, setCompatibilityScore] = useState(0);

  // Use server-provided favorite status
  const isFavorited = listing.isFavorited || false;

  const amenities = [];
  if (listing.hasWifi) amenities.push("WiFi");
  if (listing.hasHeating) amenities.push("Chauffage");
  if (listing.hasAirCon) amenities.push("Climatisation");
  if (listing.hasWasher) amenities.push("Lave-linge");
  if (listing.hasKitchen) amenities.push("Cuisine");
  if (listing.hasParking) amenities.push("Parking");
  if (listing.hasLivingRoom) amenities.push("Salon");
  if (listing.hasBalcony) amenities.push("Balcon");
  if (listing.hasElevator) amenities.push("Ascenseur");

  // const compatibilityScore = 76;

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
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (listing?.images && listing.images.length > 0) {
      if (currentImageIndex < listing.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        setCurrentImageIndex(0);
      }
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (listing?.images && listing.images.length > 0) {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else {
        setCurrentImageIndex(listing.images.length - 1);
      }
    }
  };
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // This function is no longer needed since we're using server actions
  };

  useEffect(() => {
    const getCompatibilityScore = async () => {
      const response = await candidat_offer_compatibilityScore(listing);
      if (response) {
        setCompatibilityScore(response);
      }
    };
    getCompatibilityScore();
  }, [listing]);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <div className="relative">
        {/* Image carousel */}{" "}
        <div className="relative h-56 bg-gray-100">
          <img
            src={
              listing?.images?.[currentImageIndex]?.url || "/placeholder.svg"
            }
            alt={listing?.title}
            className="w-full h-full object-cover"
          />{" "}
          {/* Image navigation */}
          {listing?.images && listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {listing.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.isNew && (
              <Badge className="bg-green-500 text-white">Nouveau</Badge>
            )}
            {listing.roomType === "private" && (
              <Badge className="bg-primary text-white">
                {RoomTypeLabels[listing.roomType]}
              </Badge>
            )}
          </div>
          <FavorisButton offerId={listing.id} isFavorited={isFavorited} />
          {/* Compatibility score */}
          {compatibilityScore > 0 && (
            <div className="absolute bottom-3 right-3 bg-white rounded-full px-2 py-1 flex items-center text-xs font-medium">
              <div
                className="h-2 w-2 rounded-full mr-1"
                style={{
                  backgroundColor:
                    compatibilityScore >= 85
                      ? "#10b981"
                      : compatibilityScore >= 70
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              ></div>
              {compatibilityScore}% compatible
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          {/* Price */}
          <div className="text-lg font-semibold flex items-center tracking-tighter">
            {new Intl.NumberFormat("fr-MA", {
              style: "currency",
              currency: "MAD",
            }).format(listing.price)}
            <span className="text-sm ml-1 font-normal text-gray-500">
              /mois
            </span>{" "}
            <Badge
              variant="outline"
              className="bg-gray-50 h-auto text-x ml-2 tracking-normal"
            >
              Charge Incluse
            </Badge>
          </div>

          {/* Address, Available */}
          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              {listing.address}
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
              Available from{" "}
              {format(new Date(listing.availableDate), "MMM d, yyyy")}
            </div>
          </div>

          {/* Property Amenities */}
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="bg-gray-50">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="bg-gray-50">
                +{amenities.length - 3}
              </Badge>
            )}
          </div>

          {/* Property description */}
          <p className="text-gray-500 text-sm line-clamp-2">
            {listing.description}
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`/colocation/${listing.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Voir détails
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
