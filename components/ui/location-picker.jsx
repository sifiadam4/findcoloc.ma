"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Copy, RotateCcw, Search } from "lucide-react";

export function LocationPicker({
  onLocationSelect,
  initialLat = null,
  initialLng = null,
  className = "",
  showCoordinatesCard = false,
  height = "400px",
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: initialLat,
    lng: initialLng,
  });
  const [cursorCoordinates, setCursorCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [locationInfo, setLocationInfo] = useState({
    city: "",
    quartier: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const updateTimeoutRef = useRef(null);

  // Auto-update map when coordinates change
  useEffect(() => {
    if (coordinates.lat && coordinates.lng && map) {
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Set a small delay to avoid too many updates while typing
      updateTimeoutRef.current = setTimeout(() => {
        updateMapFromInputs();
      }, 500);
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [coordinates.lat, coordinates.lng, map]);

  // Initialize Leaflet map
  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window.L !== "undefined") {
        initializeMap();
        return;
      }

      // Load CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !map) {
        const defaultLat = initialLat || 48.8566;
        const defaultLng = initialLng || 2.3522;
        const leafletMap = window.L.map(mapRef.current).setView(
          [defaultLat, defaultLng],
          initialLat ? 15 : 10
        );

        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(leafletMap);

        // Add click event listener
        leafletMap.on("click", handleMapClick);

        // Add mousemove event listener for cursor tracking
        leafletMap.on("mousemove", handleMouseMove);

        setMap(leafletMap);

        // If initial coordinates are provided, add a marker
        if (initialLat && initialLng) {
          const initialMarker = window.L.marker([initialLat, initialLng]).addTo(
            leafletMap
          );
          setMarker(initialMarker);
          reverseGeocode(initialLat, initialLng);
        }
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    const { lat, lng } = e.latlng;
    setCursorCoordinates({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    const newCoordinates = { lat: lat.toFixed(6), lng: lng.toFixed(6) };
    setCoordinates(newCoordinates);

    // Remove existing marker
    if (marker) {
      map.removeLayer(marker);
    }

    // Add new marker
    const newMarker = window.L.marker([lat, lng]).addTo(map);
    setMarker(newMarker);

    // Reverse geocoding to get location info
    const locationData = await reverseGeocode(lat, lng);

    // Call the callback with the location data
    if (onLocationSelect) {
      onLocationSelect({
        coordinates: newCoordinates,
        locationInfo: locationData,
        address: locationData.fullAddress || "",
      });
    }
  };

  const updateMapFromInputs = async () => {
    if (coordinates.lat && coordinates.lng) {
      const lat = parseFloat(coordinates.lat);
      const lng = parseFloat(coordinates.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        // Remove existing marker
        if (marker) {
          map.removeLayer(marker);
        }

        // Add new marker and center map
        const newMarker = window.L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
        map.setView([lat, lng], 15);

        // Update location info
        const locationData = await reverseGeocode(lat, lng);

        // Call the callback with the location data
        if (onLocationSelect) {
          onLocationSelect({
            coordinates: { lat: coordinates.lat, lng: coordinates.lng },
            locationInfo: locationData,
            address: locationData.fullAddress || "",
          });
        }
      }
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const address = data.address;
        const locationData = {
          city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "Unknown",
          quartier:
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            address.hamlet ||
            "Unknown",
          country: address.country || "Unknown",
          fullAddress: data.display_name || "",
          zipCode: address.postcode || "",
          state: address.state || address.region || "",
        };
        setLocationInfo(locationData);
        return locationData;
      } else {
        const fallbackData = {
          city: "Unknown",
          quartier: "Unknown",
          country: "Unknown",
          fullAddress: "",
          zipCode: "",
          state: "",
        };
        setLocationInfo(fallbackData);
        return fallbackData;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      const errorData = {
        city: "Error",
        quartier: "Error",
        country: "Error",
        fullAddress: "",
        zipCode: "",
        state: "",
      };
      setLocationInfo(errorData);
      return errorData;
    } finally {
      setIsLoading(false);
    }
  };

  const copyCoordinates = () => {
    if (coordinates.lat && coordinates.lng) {
      navigator.clipboard.writeText(`${coordinates.lat}, ${coordinates.lng}`);
    }
  };

  const resetMap = () => {
    if (marker) {
      map.removeLayer(marker);
      setMarker(null);
    }
    setCoordinates({ lat: null, lng: null });
    setLocationInfo({
      city: "",
      quartier: "",
      country: "",
      fullAddress: "",
      zipCode: "",
      state: "",
    });
    map.setView([48.8566, 2.3522], 10);

    if (onLocationSelect) {
      onLocationSelect({
        coordinates: { lat: null, lng: null },
        locationInfo: {
          city: "",
          quartier: "",
          country: "",
          fullAddress: "",
          zipCode: "",
          state: "",
        },
        address: "",
      });
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        map.setView([lat, lng], 15);

        // Simulate a click at this location
        handleMapClick({ latlng: { lat, lng } });
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              searchLocation();
            }
          }}
          className="flex-1"
        />
        <Button onClick={searchLocation} variant="outline" size="icon">
          <Search className="w-4 h-4" />
        </Button>
        <Button onClick={resetMap} variant="outline" size="icon">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full rounded-lg border border-gray-300"
        style={{ height }}
      />

      <p className="text-sm text-gray-600">
        Click anywhere on the map to select a location. You can also search for
        an address above.
      </p>

      {/* Live Cursor Coordinates */}
      {cursorCoordinates.lat && cursorCoordinates.lng && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-900">
            Cursor: {cursorCoordinates.lat}°, {cursorCoordinates.lng}°
          </p>
        </div>
      )}

      {/* Coordinates and Location Info Card (optional) */}
      {showCoordinatesCard && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Coordinates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={coordinates.lat || ""}
                    onChange={(e) =>
                      setCoordinates((prev) => ({
                        ...prev,
                        lat: e.target.value,
                      }))
                    }
                    placeholder="Click on map"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={coordinates.lng || ""}
                    onChange={(e) =>
                      setCoordinates((prev) => ({
                        ...prev,
                        lng: e.target.value,
                      }))
                    }
                    placeholder="Click on map"
                  />
                </div>
              </div>
              <Button
                onClick={copyCoordinates}
                disabled={!coordinates.lat || !coordinates.lng}
                className="w-full"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Coordinates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label>City</Label>
                    <Input value={locationInfo.city} readOnly />
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input value={locationInfo.quartier} readOnly />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={locationInfo.country} readOnly />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Location Summary */}
      {coordinates.lat && coordinates.lng && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Location Selected</p>
              <p className="text-sm text-green-700">
                {locationInfo.fullAddress ||
                  `${coordinates.lat}, ${coordinates.lng}`}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Coordinates: {coordinates.lat}, {coordinates.lng}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
