import { z } from "zod";

export const listingFormSchema = z.object({
  // Étape 1: Informations de base
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  availableDate: z.date().min(new Date(), "La date doit être dans le futur"),
  images: z.array(z.string()).optional().default([]),

  // Étape 2: Localisation
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  zipCode: z.string().min(1, "Le code postal est requis"),
  state: z.string().optional(),
  country: z.string().min(1, "Le pays est requis"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Étape 3: Détails de la propriété
  propertyType: z.enum(["apartment", "house", "studio", "coliving", "other"]),
  hasWifi: z.boolean().default(false),
  hasHeating: z.boolean().default(false),
  hasAirCon: z.boolean().default(false),
  hasWasher: z.boolean().default(false),
  hasKitchen: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasLivingRoom: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasElevator: z.boolean().default(false),

  // Étape 4: Détails de la chambre
  roomType: z.enum(["private", "shared"]),
  roomFurnished: z.boolean().default(false),
  privateToilet: z.boolean().default(false),

  // Étape 5: Règles et préférences
  genderPreference: z.enum(["male", "female", "any"]),
  smokingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  visitorsAllowed: z.boolean().default(true),
  partyAllowed: z.boolean().default(false),
});
