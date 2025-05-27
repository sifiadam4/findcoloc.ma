"use client";

import React from 'react'
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";


const DetailMap = ({ latitude, longitude, title }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet only on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Import the CSS
        import("leaflet/dist/leaflet.css");

        // Fix Leaflet's icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });

        window.L = L;
        setLeafletLoaded(true);
      });
    }
  }, []);

  // Initialize map after Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;

    if (!mapRef.current) {
      // Create map centered on apartment location
    mapRef.current = L.map(mapContainerRef.current, {
      scrollWheelZoom: false  // This disables mouse wheel zooming

    }).setView([latitude, longitude], 15);

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Create custom icon for the apartment
      const apartmentIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div class="bg-primary text-white flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
            <span class="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </span>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });

      // Add marker for the apartment
      markerRef.current = L.marker([latitude, longitude], {
        icon: apartmentIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(`<b>${title}</b>`);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, latitude, longitude, title]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      {!leafletLoaded ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="h-full w-full z-10"></div>
      )}
    </div>
  );
}

export default DetailMap


