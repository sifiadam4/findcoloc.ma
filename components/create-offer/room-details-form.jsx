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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { User, Users, Check, X, ChevronRight } from "lucide-react";

export function RoomDetailsForm({ form, onNext, onPrevious }) {
  const id = useId();

  // Types de chambre avec icônes
  const roomTypes = [
    { value: "private", label: "Chambre privée", Icon: User },
    { value: "shared", label: "Chambre partagée", Icon: Users },
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
            Détails de la chambre
          </h2>
          <p className="text-muted-foreground">
            Précisez les caractéristiques de la chambre disponible.
          </p>
        </div>

        <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type de chambre*</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-2 gap-3"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {roomTypes.map((type) => (
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="roomFurnished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Chambre meublée</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      La chambre est-elle équipée de meubles ?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privateToilet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Salle de bain privée
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      La chambre dispose-t-elle d'une salle de bain privée ?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
