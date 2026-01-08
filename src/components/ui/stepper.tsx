// components/ui/stepper.tsx
import React from "react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold border-2
                  ${
                    currentStep >= step.number
                      ? "bg-[#1e40af] border-[#1e40af] text-white"
                      : "bg-gray-300 border-gray-300 text-gray-600"
                  }
                `}
              >
                {step.number}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-300 -mt-6">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep > step.number ? "bg-[#1e40af]" : "bg-gray-300"
                  }`}
                  style={{
                    width: currentStep > step.number ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
