"use client"

import { Check } from "lucide-react"


export function Stepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? "border-primary bg-primary text-white"
                    : index === currentStep
                      ? "border-primary bg-white text-primary"
                      : "border-gray-300 bg-white text-gray-300"
                } ${onStepClick && index <= currentStep ? "cursor-pointer" : ""}`}
                onClick={() => onStepClick && index <= currentStep && onStepClick(index)}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                  {step.title}
                </div>
                <div className="mt-1 hidden text-xs text-gray-500 lg:block">{step.description}</div>
              </div>
            </div>
          ))}

          {/* Ligne de connexion entre les étapes */}
          {/* <div className="absolute left-0 top-5 h-0.5 w-full -translate-y-1/2 transform bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            />
          </div> */}
        </div>
      </div>

      {/* Version mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Étape {currentStep + 1}/{steps.length}
            </span>
            <span className="text-base font-semibold text-primary">{steps[currentStep].title}</span>
          </div>
          {/* <div className="text-sm text-gray-500">{steps[currentStep].description}</div> */}
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
