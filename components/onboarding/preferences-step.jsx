"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  Cigarette,
  Heart,
  PartyPopper,
  UserCheck,
  UserIcon as Male,
  UserIcon as Female,
  UserRound,
  PawPrint,
} from "lucide-react";
import { Separator } from "../ui/separator";

const formSchema = z
  .object({
    genderPreference: z.string().min(1, "Please select your gender preference"),
    minBudget: z.number().min(100, "Minimum budget must be at least $100"),
    maxBudget: z.number().min(200, "Maximum budget must be at least $200"),
    smokingAllowed: z.boolean(),
    petsAllowed: z.boolean(),
    visitorsAllowed: z.boolean(),
    partyAllowed: z.boolean(),
  })
  .refine((data) => data.maxBudget > data.minBudget, {
    message: "Maximum budget must be higher than minimum budget",
    path: ["maxBudget"],
  });

export function PreferencesStep({ data, updateData, onNext, onPrevious }) {
  const id = useId();

  // Gender preferences with icons
  const genderPreferences = [
    { value: "male", label: "Male", Icon: Male },
    { value: "female", label: "Female", Icon: Female },
    { value: "any", label: "No preference", Icon: Users },
  ];
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
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genderPreference: data.genderPreference,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
      smokingAllowed: data.smokingAllowed,
      petsAllowed: data.petsAllowed,
      visitorsAllowed: data.visitorsAllowed,
      partyAllowed: data.partyAllowed,
    },
  });

  const watchBudget = form.watch(["minBudget", "maxBudget"]);

  const onSubmit = (values) => {
    updateData(values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="space-y-6">
          {/* gender preference */}
          <FormField
            control={form.control}
            name="genderPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender Preference*</FormLabel>
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
                {/* <FormDescription>
                  Specify if you have any preference for roommate gender
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* colocation preference */}
          <div className="space-y-3">
            <FormLabel>Colocation Preference*</FormLabel>
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

          <div>
            <h3 className="text-lg font-medium">Budget Range</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Set your minimum and maximum budget for rent
            </p>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="minBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Budget (MAD)*</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{field.value} MAD</div>
                        </div>
                        <Slider
                          min={100}
                          max={5000}
                          step={100}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Budget (MAD)*</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{field.value} MAD</div>
                        </div>
                        <Slider
                          min={200}
                          max={10000}
                          step={100}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Separator className="" />
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onPrevious}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
