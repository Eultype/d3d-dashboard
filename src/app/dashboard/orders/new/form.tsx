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

export type OrderDraft = {
  // Infos Step 1 (à adapter selon ce que Step 1 renvoie)
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  // Infos Step 2
  customerId: string | null;
  // Infos Step 3
  products: ProductItem[];
  // Infos Step 4 (saisies directement au récap)
  discountType: string;
  internalNote: string;
};

// --- Composant Principal ---

export default function OrderForm() {
  const [step, setStep] = useState(1);

  // 🔑 ÉTAT GLOBAL UNIQUE INITIALISÉ
  const [draft, setDraft] = useState<OrderDraft>({
    info: { prefix: "", channel: "", delivery: "" },
    customerId: null,
    products: [],
    discountType: "none",
    internalNote: "",
  });

  // 🔑 PATCHER PROPREMENT
  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    console.log("Draft Updated:", { ...draft, ...patch }); // Utile pour débugger
  };

  const handleSubmit = () => {
    // Ici, appel à ton API (Server Action ou fetch)
    console.log("Envoi de la commande finale : ", draft);
  };

  return (
    <div className="space-y-6">
      {/* Note: J'assume que StepOne accepte aussi onChange.
         Sinon, il faudra l'adapter comme StepThree ci-dessous.
      */}
      {step === 1 && (
        <StepOne
          onNext={() => setStep(2)}
          // draft={draft}
          // onChange={updateDraft}
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
          draft={draft} // On passe les données actuelles
          onChange={updateDraft} // On passe la fonction de mise à jour
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <StepFour
          draft={draft}
          onChange={updateDraft} // Step 4 modifie aussi le draft (note, remise)
          onBack={() => setStep(3)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
