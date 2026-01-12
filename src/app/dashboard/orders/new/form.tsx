"use client";

import { useState } from "react";
import StepOne from "./steps/step-1";
import StepTwo from "./steps/step-2";
import StepThree from "./steps/step-3";
import StepFour from "./steps/step-4";

export type OrderDraft = {
  customerId: string | null;
};

export default function OrderForm() {
  const [step, setStep] = useState(1);

  // 🔑 ÉTAT GLOBAL UNIQUE
  const [draft, setDraft] = useState<OrderDraft>({
    customerId: null,
  });

  // 🔑 PATCHER PROPREMENT
  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="space-y-6">
      {step === 1 && <StepOne onNext={() => setStep(2)} />}

      {step === 2 && (
        <StepTwo
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepThree
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && <StepFour draft={draft} onBack={() => setStep(3)} />}
    </div>
  );
}
