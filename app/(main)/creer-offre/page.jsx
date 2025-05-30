"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/global/stepper";
import { Save } from "lucide-react";
import { BasicInfoForm } from "@/components/create-offer/basic-info-form";
import { LocationForm } from "@/components/create-offer/location-form";
import { PropertyDetailsForm } from "@/components/create-offer/property-details-form";
import { RoomDetailsForm } from "@/components/create-offer/room-details-form";
import { RulesPreferencesForm } from "@/components/create-offer/rules-preferences-form";
import { ListingSummary } from "@/components/create-offer/listing-summary";
import { listingFormSchema } from "@/lib/schema";
import { createOffer } from "@/actions/colocation";
import toast from "react-hot-toast";

// Données initiales du formulaire
const initialFormData = {
  title: "",
  description: "",
  price: 0,
  availableDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  images: [],

  address: "",
  city: "",
  zipCode: "",
  state: "",
  country: "",
  latitude: undefined,
  longitude: undefined,

  propertyType: "apartment",
  hasWifi: false,
  hasHeating: false,
  hasAirCon: false,
  hasWasher: false,
  hasKitchen: false,
  hasParking: false,
  hasLivingRoom: false,
  hasBalcony: false,
  hasElevator: false,

  roomType: "private",
  roomFurnished: false,
  privateToilet: false,

  genderPreference: "any",
  smokingAllowed: false,
  petsAllowed: false,
  visitorsAllowed: true,
  partyAllowed: false,
};

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialiser le formulaire avec React Hook Form
  const form = useForm({
    resolver: zodResolver(listingFormSchema),
    defaultValues: initialFormData,
    // mode: "onChange",
  });

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
      description: "Vérifiez et publiez votre annonce",
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

      const loadingToast = toast.loading("creating your offer...");

      // Call the createOffer action
      const result = await createOffer(data);

      if (result.success) {
        // toast({
        //   title: "Succès!",
        //   description: result.message,
        // });
        toast.success(result.message, {
          id: loadingToast,
        });

        // Redirect to the offer page or offers list
        router.push(`/colocation/${result.offer.id}`);
      } else {
        // toast({
        //   variant: "destructive",
        //   title: "Erreur",
        //   description:
        //     result.error ||
        //     "Une erreur s'est produite lors de la création de l'offre.",
        // });
        toast.error(
          result.message ||
            "Une erreur s'est produite lors de la création de l'offre.",
          {
            duration: 4000,
          }
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // toast({
      //   variant: "destructive",
      //   title: "Erreur",
      //   description:
      //     "Une erreur inattendue s'est produite. Veuillez réessayer.",
      // });
      toast.error(
        error.message ||
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sauvegarde en brouillon
  const saveAsDraft = async () => {
    // Logique pour sauvegarder en brouillon
  };

  // Rendu du formulaire actuel en fonction de l'étape
  const renderStepContent = () => {
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mb-8 md:flex items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            Créer une annonce de colocation
          </h1>
          <p className="text-muted-foreground">
            Publiez votre annonce en quelques étapes simples
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={saveAsDraft}
        >
          <Save className="h-4 w-4" />
          Enregistrer en brouillon
        </Button>
      </div>

      <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />

      <Card className="mt-8 p-6">{renderStepContent()}</Card>
    </main>
  );
}
