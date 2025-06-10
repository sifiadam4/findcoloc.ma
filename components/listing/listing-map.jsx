"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Leaflet marker fix (optional if you have marker issues)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Navigation, Loader } from "lucide-react";
import { bg } from "date-fns/locale";

let DefaultIcon = L.icon({
  iconUrl: icon.src || icon,
  shadowUrl: iconShadow.src || iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function ListingMap({ listings }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const calculateMapCenter = () => {
    if (!listings || listings.length === 0) return [33.5731, -7.5898]; // Casablanca
    const sumLat = listings.reduce((sum, l) => sum + l.latitude, 0);
    const sumLng = listings.reduce((sum, l) => sum + l.longitude, 0);
    return [sumLat / listings.length, sumLng / listings.length];
  };

  return (
    <MapContainer
      center={calculateMapCenter()}
      zoom={13}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.latitude, listing.longitude]}
        >
          <Popup maxWidth={280}>
            <Card className="p-0 shadow-none rounded-xl border-none">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="h-32 w-full object-cover rounded-xl"
              />
              <CardContent className="px-0 py-2 space-y-1">
                <h3 className="text-sm font-semibold">{listing.title}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span className="line-clamp-1">{listing.address}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                    <span>{listing.rating}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    {listing.price} MAD
                  </span>
                </div>
                <Button
                  className="w-full mt-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/colocation/${listing.id}`;
                  }}
                >
                  Voir l'annonce
                </Button>
              </CardContent>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
