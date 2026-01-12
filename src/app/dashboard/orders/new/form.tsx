"use client";

import { useState } from "react";
import StepOne from "./steps/step-1";
import StepTwo from "./steps/step-2";
import StepThree from "./steps/step-3";
import StepFour from "./steps/step-4";

// --- Définition des types globaux ---

export type ProductItem = {
  uniqueId: string;
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

// 👇 1. On définit la structure des détails client
export type ClientDetails = {
  name: string;
  email: string;
  phone: string;
};

export type OrderDraft = {
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  customerId: string | null;
  // 👇 2. On ajoute ce champ pour stocker les infos lisibles
  clientDetails: ClientDetails | null;
  products: ProductItem[];
  discountType: string;
  internalNote: string;
};

export default function OrderForm() {
  const [step, setStep] = useState(1);

  const [draft, setDraft] = useState<OrderDraft>({
    info: { prefix: "", channel: "", delivery: "" },
    customerId: null,
    clientDetails: null, // 👇 3. Initialisé à null
    products: [],
    discountType: "none",
    internalNote: "",
  });

  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = () => {
    console.log("Envoi de la commande finale : ", draft);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <StepOne
          draft={draft} // AJOUTÉ
          onChange={updateDraft} // AJOUTÉ
          onNext={() => setStep(2)}
          // onBack n'est pas nécessaire ici si c'est la page 1, ou redirige vers dashboard
        />
      )}

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

      {step === 4 && (
        <StepFour
          draft={draft}
          onChange={updateDraft}
          onBack={() => setStep(3)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
