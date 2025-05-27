"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Building2,
  Home,
  Hotel,
  Users,
  MoreHorizontal,
  Wifi,
  Thermometer,
  Wind,
  Shirt,
  UtensilsCrossed,
  Car,
  Sofa,
  BuildingIcon as Balcony,
  CableCarIcon as Elevator,
  ChevronRight,
} from "lucide-react";

export function PropertyDetailsForm({ form, onNext, onPrevious }) {
  const id = useId();

  // Types de propriété avec icônes
  const propertyTypes = [
    { value: "apartment", label: "Appartement", Icon: Building2 },
    { value: "house", label: "Maison", Icon: Home },
    { value: "studio", label: "Studio", Icon: Hotel },
    { value: "coliving", label: "Coliving", Icon: Users },
    { value: "other", label: "Autre", Icon: MoreHorizontal },
  ];

  // Équipements avec icônes
  const amenities = [
    { value: "hasWifi", label: "WiFi", Icon: Wifi },
    { value: "hasHeating", label: "Chauffage", Icon: Thermometer },
    { value: "hasAirCon", label: "Climatisation", Icon: Wind },
    { value: "hasWasher", label: "Lave-linge", Icon: Shirt },
    { value: "hasKitchen", label: "Cuisine équipée", Icon: UtensilsCrossed },
    { value: "hasParking", label: "Parking", Icon: Car },
    { value: "hasLivingRoom", label: "Salon", Icon: Sofa },
    { value: "hasBalcony", label: "Balcon", Icon: Balcony },
    { value: "hasElevator", label: "Ascenseur", Icon: Elevator },
  ]; // Fonction pour soumettre le formulaire et passer à l'étape suivante
  const onSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Détails du logement
          </h2>
          <p className="text-muted-foreground">
            Décrivez le type de logement et ses équipements.
          </p>
        </div>

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type de logement*</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {propertyTypes.map((type) => (
                    <div
                      key={`${id}-${type.value}`}
                      className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
                    >
                      <div className="flex justify-between gap-2">
                        <RadioGroupItem
                          id={`${id}-${type.value}`}
                          value={type.value}
                          className="order-1 after:absolute after:inset-0"
                        />
                        <type.Icon
                          className="opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <Label htmlFor={`${id}-${type.value}`}>
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Équipements disponibles</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((amenity) => (
              <FormField
                key={`${id}-${amenity.value}`}
                control={form.control}
                name={amenity.value}
                render={({ field }) => (
                  <div className="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none">
                    <div className="flex justify-between gap-2">
                      <Checkbox
                        id={`${id}-${amenity.value}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="order-1 after:absolute after:inset-0"
                      />
                      <amenity.Icon
                        className="opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    </div>
                    <Label htmlFor={`${id}-${amenity.value}`}>
                      {amenity.label}
                    </Label>
                  </div>
                )}
              />
            ))}
          </div>
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
