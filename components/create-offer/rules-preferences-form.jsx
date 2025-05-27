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

import {
  UserIcon as Male,
  UserIcon as Female,
  Users,
  Cigarette,
  PawPrint,
  UserRound,
  PartyPopper,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

export function RulesPreferencesForm({ form, onNext, onPrevious }) {
  const id = useId();

  // Préférences de genre avec icônes
  const genderPreferences = [
    { value: "male", label: "Hommes uniquement", Icon: Male },
    { value: "female", label: "Femmes uniquement", Icon: Female },
    { value: "any", label: "Tous genres", Icon: Users },
  ];

  // Règles avec icônes
  const rules = [
    {
      name: "smokingAllowed",
      label: "Fumeur autorisé",
      description: "Les colocataires peuvent-ils fumer dans le logement ?",
      Icon: Cigarette,
    },
    {
      name: "petsAllowed",
      label: "Animaux autorisés",
      description: "Les colocataires peuvent-ils avoir des animaux ?",
      Icon: PawPrint,
    },
    {
      name: "visitorsAllowed",
      label: "Visiteurs autorisés",
      description: "Les colocataires peuvent-ils recevoir des visiteurs ?",
      Icon: UserRound,
    },
    {
      name: "partyAllowed",
      label: "Fêtes autorisées",
      description: "Les colocataires peuvent-ils organiser des fêtes ?",
      Icon: PartyPopper,
    },
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
            Règles et préférences
          </h2>
          <p className="text-muted-foreground">
            Définissez les règles de vie et vos préférences pour la colocation.
          </p>
        </div>

        <FormField
          control={form.control}
          name="genderPreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Préférence de genre*</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {genderPreferences.map((preference) => (
                    <div
                      key={`${id}-${preference.value}`}
                      className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
                    >
                      <div className="flex justify-between gap-2">
                        <RadioGroupItem
                          id={`${id}-${preference.value}`}
                          value={preference.value}
                          className="order-1 after:absolute after:inset-0"
                        />
                        <preference.Icon
                          className="opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <Label htmlFor={`${id}-${preference.value}`}>
                        {preference.label}
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
          <FormLabel>Règles de la colocation</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <FormField
                key={rule.name}
                control={form.control}
                name={rule.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <rule.Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {rule.label}
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {rule.description}
                        </div>
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
