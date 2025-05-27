"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2, ChevronRight } from "lucide-react";
import { LocationPicker } from "@/components/ui/location-picker";
import dynamic from "next/dynamic";

// Importer la carte de manière dynamique pour éviter les erreurs SSR
// const MapComponent = dynamic(() => import("@/components/global/map-preview"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-[300px] bg-muted rounded-md flex items-center justify-center">
//       <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//     </div>
//   ),
// });

// Liste des pays
const countries = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Luxembourg",
  "Allemagne",
  "Espagne",
  "Italie",
  "Royaume-Uni",
  "Pays-Bas",
];

export function LocationForm({ form, onNext, onPrevious }) {
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Handle location selection from map picker
  const handleLocationSelect = (locationData) => {
    const { coordinates, locationInfo } = locationData;

    // Update form values with the selected location data
    if (coordinates.lat && coordinates.lng) {
      form.setValue("latitude", parseFloat(coordinates.lat));
      form.setValue("longitude", parseFloat(coordinates.lng));
    }

    if (locationInfo.city) {
      form.setValue("city", locationInfo.city);
    }

    if (locationInfo.country) {
      form.setValue("country", locationInfo.country);
    }

    if (locationInfo.zipCode) {
      form.setValue("zipCode", locationInfo.zipCode);
    }

    if (locationInfo.state) {
      form.setValue("state", locationInfo.state);
    }

    // Try to extract address from full address
    if (locationInfo.fullAddress) {
      // Simple extraction - take the first part before the first comma
      const addressParts = locationInfo.fullAddress.split(",");
      if (addressParts.length > 0) {
        form.setValue("address", addressParts[0].trim());
      }
    }
  };
  // Fonction pour soumettre le formulaire et passer à l'étape suivante
  const onSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Localisation du logement
          </h2>
          <p className="text-muted-foreground">
            Indiquez l'adresse précise de votre logement.
          </p>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse*</FormLabel>
              <FormControl>
                <Input placeholder="123 rue de la République" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville*</FormLabel>
                <FormControl>
                  <Input placeholder="Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal*</FormLabel>
                <FormControl>
                  <Input placeholder="75001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Région/Département</FormLabel>
                <FormControl>
                  <Input placeholder="Île-de-France" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Interactive Map Picker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Localisation précise</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMapPicker(!showMapPicker)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {showMapPicker ? "Masquer la carte" : "Sélectionner sur la carte"}
            </Button>
          </div>

          {showMapPicker && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLat={form.getValues("latitude")}
                initialLng={form.getValues("longitude")}
                height="350px"
              />
            </div>
          )}

          {/* Show current coordinates if available */}
          {form.getValues("latitude") && form.getValues("longitude") && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Position sélectionnée
              </p>
              <p className="text-sm text-green-700 mt-1">
                Coordonnées: {form.getValues("latitude")?.toFixed(6)},{" "}
                {form.getValues("longitude")?.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
          <Button type="submit">
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
