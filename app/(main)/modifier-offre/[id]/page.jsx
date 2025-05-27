"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/global/stepper";
import { Save, ArrowLeft } from "lucide-react";
import { BasicInfoForm } from "@/components/create-offer/basic-info-form";
import { LocationForm } from "@/components/create-offer/location-form";
import { PropertyDetailsForm } from "@/components/create-offer/property-details-form";
import { RoomDetailsForm } from "@/components/create-offer/room-details-form";
import { RulesPreferencesForm } from "@/components/create-offer/rules-preferences-form";
import { ListingSummary } from "@/components/create-offer/listing-summary";
import { listingFormSchema } from "@/lib/schema";
import { getOfferById, updateOffer } from "@/actions/colocation";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditOfferPage({ params }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offer, setOffer] = useState(null);
  const router = useRouter();
  const offerId = params.id;

  // Initialiser le formulaire avec React Hook Form
  const form = useForm({
    resolver: zodResolver(listingFormSchema),
    mode: "onChange",
  });

  // Charger les données de l'offre existante
  useEffect(() => {
    const loadOffer = async () => {
      try {
        setIsLoading(true);
        const existingOffer = await getOfferById(offerId);

        if (!existingOffer) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Offre introuvable.",
          });
          router.push("/mes-offres");
          return;
        }

        setOffer(existingOffer);

        // Préparer les données pour le formulaire
        const formData = {
          title: existingOffer.title || "",
          description: existingOffer.description || "",
          price: existingOffer.price || 0,
          availableDate: existingOffer.availableDate
            ? new Date(existingOffer.availableDate)
            : new Date(),
          images: existingOffer.images?.map((img) => img.url) || [],

          address: existingOffer.address || "",
          city: existingOffer.city || "",
          zipCode: existingOffer.zipCode || "",
          state: existingOffer.state || "",
          country: existingOffer.country || "",
          latitude: existingOffer.latitude || undefined,
          longitude: existingOffer.longitude || undefined,

          propertyType: existingOffer.propertyType || "apartment",
          hasWifi: existingOffer.hasWifi || false,
          hasHeating: existingOffer.hasHeating || false,
          hasAirCon: existingOffer.hasAirCon || false,
          hasWasher: existingOffer.hasWasher || false,
          hasKitchen: existingOffer.hasKitchen || false,
          hasParking: existingOffer.hasParking || false,
          hasLivingRoom: existingOffer.hasLivingRoom || false,
          hasBalcony: existingOffer.hasBalcony || false,
          hasElevator: existingOffer.hasElevator || false,

          roomType: existingOffer.roomType || "private",
          roomFurnished: existingOffer.roomFurnished || false,
          privateToilet: existingOffer.privateToilet || false,

          genderPreference: existingOffer.genderPreference || "any",
          smokingAllowed: existingOffer.smokingAllowed || false,
          petsAllowed: existingOffer.petsAllowed || false,
          visitorsAllowed: existingOffer.visitorsAllowed !== false, // default to true
          partyAllowed: existingOffer.partyAllowed || false,
        };

        // Réinitialiser le formulaire avec les données existantes
        form.reset(formData);
      } catch (error) {
        console.error("Error loading offer:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'offre.",
        });
        router.push("/mes-offres");
      } finally {
        setIsLoading(false);
      }
    };

    if (offerId) {
      loadOffer();
    }
  }, [offerId, form, router]);

  // Étapes du formulaire
  const steps = [
    {
      title: "Informations de base",
      description: "Titre, description, prix",
    },
    {
      title: "Localisation",
      description: "Adresse et emplacement",
    },
    {
      title: "Détails du logement",
      description: "Type et équipements",
    },
    {
      title: "Détails de la chambre",
      description: "Type et caractéristiques",
    },
    {
      title: "Règles et préférences",
      description: "Préférences et règles de vie",
    },
    {
      title: "Récapitulatif",
      description: "Vérifiez et modifiez votre annonce",
    },
  ];

  // Navigation entre les étapes
  const goToNextStep = async () => {
    try {
      // Validate the current step fields based on which step we're on
      let fieldsToValidate = [];

      switch (currentStep) {
        case 0: // Basic info
          fieldsToValidate = ["title", "description", "price", "availableDate"];
          break;
        case 1: // Location
          fieldsToValidate = ["address", "city", "zipCode", "country"];
          break;
        case 2: // Property details
          fieldsToValidate = ["propertyType"];
          break;
        case 3: // Room details
          fieldsToValidate = ["roomType"];
          break;
        case 4: // Rules and preferences
          fieldsToValidate = ["genderPreference"];
          break;
        default:
          break;
      }

      // Validate the fields
      let isValid = true;

      if (fieldsToValidate.length > 0) {
        await Promise.all(
          fieldsToValidate.map(async (field) => {
            const result = await form.trigger(field);
            if (!result) isValid = false;
          })
        );
      }

      if (isValid && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error during form validation:", error);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      console.log("Form data submitted:", data);

      // Call the updateOffer action
      const result = await updateOffer(offerId, data);

      if (result.success) {
        toast({
          title: "Succès!",
          description: result.message,
        });

        // Redirect to the offer page
        router.push(`/colocation/${result.offer.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description:
            result.error ||
            "Une erreur s'est produite lors de la modification de l'offre.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sauvegarde en brouillon
  const saveAsDraft = async () => {
    // Logique pour sauvegarder en brouillon
    const data = form.getValues();
    try {
      const result = await updateOffer(offerId, data);
      if (result.success) {
        toast({
          title: "Brouillon sauvegardé",
          description: "Vos modifications ont été sauvegardées.",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Retour aux offres
  const goBackToOffers = () => {
    router.push("/mes-offres");
  };

  // Rendu du formulaire actuel en fonction de l'étape
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <BasicInfoForm form={form} onNext={() => goToNextStep()} />;
      case 1:
        return (
          <LocationForm
            form={form}
            onNext={() => goToNextStep()}
            onPrevious={goToPreviousStep}
          />
        );
      case 2:
        return (
          <PropertyDetailsForm
            form={form}
            onNext={() => goToNextStep()}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <RoomDetailsForm
            form={form}
            onNext={() => goToNextStep()}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <RulesPreferencesForm
            form={form}
            onNext={() => goToNextStep()}
            onPrevious={goToPreviousStep}
          />
        );
      case 5:
        return (
          <ListingSummary
            data={form.getValues()}
            onSubmit={() => handleSubmit(form.getValues())}
            onPrevious={goToPreviousStep}
            onEdit={goToStep}
            isSubmitting={isSubmitting}
            isEditing={true}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="mb-8">
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-16 w-full mb-8" />
        <Card className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mb-8 md:flex items-center justify-between space-y-2 md:space-y-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBackToOffers}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">
            Modifier l'annonce de colocation
          </h1>
          <p className="text-muted-foreground">
            Modifiez votre annonce en quelques étapes simples
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={saveAsDraft}
        >
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />

      <Card className="mt-8 p-6">{renderStepContent()}</Card>
    </main>
  );
}
