"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicInfoStep } from "./basic-info-step";
import { PreferencesStep } from "./preferences-step";
import { VerificationStep } from "./verification-step";
import { Stepper } from "../global/stepper";
import { updateUserProfile } from "@/actions/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const steps = [
  {
    id: 0,
    title: "Informations personnelles",
    description: "Complétez votre profil",
  },
  { id: 1, title: "Préférences", description: "Définissez vos critères" },
  {
    id: 2,
    title: "Vérification d'identité",
    description: "Téléchargez vos documents",
  },
];

export function OnboardingWizard({ user }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phonenumber: "",
    dob: undefined,
    gender: "",
    city: "",
    occupation: "",
    university: "",
    yearStady: "",
    company: "",
    jobTitle: "",
    genderPreference: "",
    maxBudget: 2000,
    minBudget: 500,
    smokingAllowed: false,
    petsAllowed: false,
    visitorsAllowed: true,
    partyAllowed: false,
    bio: "",
    idType: "", // Will be set when user selects
    frontImage: null,
    backImage: null,
    selfieImage: null,
  });
  const updateData = (newData) => {
    console.log("Updating wizard data:", newData);
    setData((prev) => {
      const updated = { ...prev, ...newData };
      console.log("Updated wizard data:", updated);
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async (verificationData = null) => {
    setIsLoading(true);
    try {
      // Use the verification data passed from the step, or fall back to the wizard's data
      const finalData = verificationData
        ? { ...data, ...verificationData }
        : data;

      console.log("Submitting onboarding data:", finalData);

      // Validate required data before submission
      if (!finalData.idType) {
        throw new Error("Please select an ID type for verification");
      }

      if (
        !finalData.frontImage ||
        !finalData.backImage ||
        !finalData.selfieImage
      ) {
        throw new Error("Please upload all required verification documents");
      }

      // Show loading toast
      // const loadingToast = toast.loading("Updating your profile...");

      // Submit data using server action
      const result = await updateUserProfile(finalData);

      if (result.success) {
        console.log("Profile updated successfully:", result);
        // Refresh session to update isProfileComplete in token
        await fetch("/api/auth/session?update");
        router.push("/");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error submitting onboarding data:", error);

      // Show specific error message
      // toast.error(
      //   error.message || "Failed to update profile. Please try again.",
      //   {
      //     duration: 4000,
      //   }
      // );

      // If validation failed, go back to verification step
      if (
        error.message?.includes("ID type") ||
        error.message?.includes("verification documents")
      ) {
        setCurrentStep(2); // Go back to verification step
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={data}
            updateData={updateData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PreferencesStep
            data={data}
            updateData={updateData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <VerificationStep
            data={data}
            updateData={updateData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">
          Complétez votre profil
        </h1>
        <p className="text-muted-foreground">
          Finalisez votre inscription en quelques étapes simples
        </p>
      </div>

      {/* Step Indicator */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => {}}
      />

      {/* Main Content */}
      <div className="mt-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {renderStep()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
