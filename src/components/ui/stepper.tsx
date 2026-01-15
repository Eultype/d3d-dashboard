// components/ui/stepper.tsx
"use client";

import React, { useState, useEffect } from "react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const [animatedActiveStep, setAnimatedActiveStep] = useState(currentStep);

  useEffect(() => {
    const delay = 500; // ms, matches the duration of animate-fill-ltr

    const timer = setTimeout(() => {
      setAnimatedActiveStep(currentStep);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep]);

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
                    animatedActiveStep > step.number
                      ? "bg-[#1e40af] border-[#1e40af] text-white"
                      : "bg-gray-400 border-gray-300 "
                  }
                  ${
                    animatedActiveStep === step.number
                      ? "animate-fill-circle"
                      : ""
                  }
                `}
              >
                {step.number}
              </div>
              <span className="mt-2 text-sm font-medium ">{step.label}</span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-300 -mt-6">
                <div
                  className={`h-full bg-[#1e40af] ${
                    currentStep > step.number ? "w-full" : "w-0"
                  } ${
                    currentStep === step.number + 1 ? "animate-fill-ltr" : ""
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
