"use client";
import React from "react";
import StepOne from "./step-one";
import StepTwo from "./step-two";
import { Progress } from "../ui/progress";
import { useRouter } from "next/navigation";

const MultiStep = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({});

  const handleNextStep = (data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (data) => {
      const finalData = { ...formData, ...data };
      console.log(finalData);
      router.push('/');

  }


  const progressValue = (currentStep / 2) * 100;

  const renderView = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={handleNextStep} data={formData} />;
      case 2:
        return (
          <StepTwo
          onPrev={handlePrevStep}
          onSubmit={handleSubmit}
          data={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <Progress value={progressValue} />
        <h1 className="text-lg md:text-xl font-bold">
          {currentStep === 1 && "Step 1: Personal Information"}
          {currentStep === 2 && "Step 2: Preferences"}
        </h1>
      </div>
      {renderView()}
    </div>
  );
};

export default MultiStep;
