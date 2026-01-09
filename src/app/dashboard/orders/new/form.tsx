"use client";

import { useState } from "react";
import StepOne from "./steps/step-1";
import StepTwo from "./steps/step-2";
import StepThree from "./steps/step-3";
import StepFour from "./steps/step-4";

export default function OrderForm() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {step === 1 && <StepOne onNext={() => setStep(2)} />}
      {step === 2 && (
        <StepTwo onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && <StepThree onBack={() => setStep(2)} />}
      {step === 4 && <StepFour onBack={() => setStep(3)} />}
    </div>
  );
}
