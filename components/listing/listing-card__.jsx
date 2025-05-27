"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { RatingStars } from "@/components/global/rating-stars"
import { Wifi, Thermometer, Wind, Waves, UtensilsCrossed, Car, Sofa, Building, CableCar, Heart } from "lucide-react"
import { useState } from "react"


export default function ListingCard({ listing}) {
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite || false)

  // Format availability date
  const formattedDate = new Date(listing.availableDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  })

  // Get image URL (compatible with old and new format)
  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : listing.imageUrl || "/placeholder.svg?height=250&width=400"

  // Select first 3 amenities to display (if available)
  const amenities = [
    { name: "WiFi", icon: Wifi, value: listing.hasWifi },
    { name: "Chauffage", icon: Thermometer, value: listing.hasHeating },
    { name: "Climatisation", icon: Wind, value: listing.hasAirCon },
    { name: "Lave-linge", icon: Waves, value: listing.hasWasher },
    { name: "Cuisine", icon: UtensilsCrossed, value: listing.hasKitchen },
    { name: "Parking", icon: Car, value: listing.hasParking },
    { name: "Salon", icon: Sofa, value: listing.hasLivingRoom },
    { name: "Balcon", icon: Building, value: listing.hasBalcony },
    { name: "Ascenseur", icon: CableCar, value: listing.hasElevator },
  ]
    .filter((amenity) => amenity.value)
    .slice(0, 3)

  // Translate property type
  const propertyTypeLabels = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
    coliving: "Coliving",
    other: "Autre",
  }

  // Translate room type
  const roomTypeLabels = {
    private: "privée",
    shared: "partagée",
  }

  // Toggle favorite
  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md`}
    >
      <div className="relative">
        <Link href={`/colocation/${listing.id}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </Link>
        <button
          onClick={toggleFavorite}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground transition-colors hover:bg-background"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        <Badge className="absolute left-2 top-2 bg-primary">{listing.price}€/mois</Badge>
        {/* {listing.roomType && (
          <Badge variant="outline" className="absolute left-2 top-10 bg-background/80">
            {roomTypeLabels[listing.roomType]}
          </Badge>
        )} */}
      </div>

      <CardContent className="p-4">
        <Link href={`/colocation/${listing.id}`} className="hover:underline">
          <h3 className="mb-1 font-semibold text-foreground">{listing.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {listing.address}
          {/* {listing.city && `, ${listing.city}`} */}
          {/* {listing.zipCode && ` ${listing.zipCode}`} */}
        </p>

        {listing.rating !== undefined && listing.ratingCount !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <RatingStars rating={listing.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({listing.ratingCount} {listing.ratingCount > 1 ? "avis" : "avis"})
            </span>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {listing.propertyType ? (
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">{propertyTypeLabels[listing.propertyType]}</p>
            </div>
          ) : listing.surface ? (
            <div>
              <p className="text-muted-foreground">Surface</p>
              <p className="font-medium">{listing.surface} m²</p>
            </div>
          ) : null}

          <div>
            <p className="text-muted-foreground">Disponibilité</p>
            <p className="font-medium">{formattedDate}</p>
          </div>

          {listing.roommates && (
            <div>
              <p className="text-muted-foreground">Chambre</p>
              <p className="font-medium capitalize">{roomTypeLabels[listing.roomType]}</p>
            </div>
          )}

          {listing.popularity && (
            <div>
              <p className="text-muted-foreground">Popularité</p>
              <p className="font-medium">{listing.popularity} demandes</p>
            </div>
          )}
        </div>


        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Icon size={14} />
                  <span>{amenity.name}</span>
                </Badge>
              )
            })}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-muted/50 p-4">
        <Link href={`/colocation/${listing.id}`} className="w-full">
          <Button className="w-full bg-[#3B6790] text-white hover:bg-[#3B6790]/80">
            Voir détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
