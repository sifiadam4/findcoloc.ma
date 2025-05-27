import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListingsTab({ offers, favorites, isCurrentUser }) {
  const hasOffers = offers && offers.length > 0;
  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <Tabs
        defaultValue={hasOffers ? "offers" : "favorites"}
        className="w-full"
      >
        <TabsList className="mb-6">
          {hasOffers && (
            <TabsTrigger value="offers">Annonces publiées</TabsTrigger>
          )}
          {hasFavorites && (
            <TabsTrigger value="favorites">Annonces favorites</TabsTrigger>
          )}
        </TabsList>

        {hasOffers && (
          <TabsContent value="offers">
            <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
            {offers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Vous n'avez pas encore publié d'annonces.
                </p>
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  Publier une annonce
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {hasFavorites && (
          <TabsContent value="favorites">
            <h2 className="text-xl font-semibold mb-4">Annonces favorites</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Vous n'avez pas encore d'annonces favorites.
                </p>
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  Parcourir les annonces
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <OfferCard
                    key={favorite.id}
                    offer={favorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function OfferCard({ offer, isFavorite = false }) {
  // Get the first image or use placeholder
  const imageUrl =
    offer.images && offer.images.length > 0
      ? offer.images[0].url
      : "/placeholder.svg";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={imageUrl}
          alt={offer.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/80 text-white">
            {offer.propertyType === "apartment"
              ? "Appartement"
              : offer.propertyType === "house"
              ? "Maison"
              : offer.propertyType === "studio"
              ? "Studio"
              : offer.propertyType}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full bg-white/80 hover:bg-white ${
            isFavorite ? "text-red-500" : "text-gray-600"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {offer.title}
          </h3>
          <p className="text-secondary font-semibold whitespace-nowrap">
            {offer.price} MAD
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{offer.address}</span>
        </div>

        {offer.owner && (
          <div className="text-xs text-gray-500">Par {offer.owner.name}</div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 border-t flex justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <span className="capitalize">
            {offer.roomType === "private"
              ? "Chambre privée"
              : "Chambre partagée"}
          </span>
        </div>
        <div className="text-xs">
          {new Date(offer.createdAt).toLocaleDateString("fr-FR")}
        </div>
      </CardFooter>
    </Card>
  );
}
