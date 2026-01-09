"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { CustomerSearch } from "@/components/dashboard/customer-search";
import type { OrderDraft } from "../form";

type Props = {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep?: number;
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

type CustomerLite = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
};

export default function StepTwo({
  draft,
  onChange,
  onNext,
  onBack,
  currentStep = 2,
}: Props) {
  const [selected, setSelected] = React.useState<CustomerLite | null>(null); // Si tu veux : quand on revient sur l’étape, tu peux refetch le client par id.
  // Pour faire simple: on garde juste customerId dans draft.

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900">Information client</h2>

        <p className="text-sm text-gray-600 mt-1">
          Recherchez un client existant ou créez-en un nouveau
        </p>
      </div>

      <CustomerSearch
        value={selected}
        onPick={(c) => {
          setSelected(c);
          onChange({ customerId: c.id });
        }}
        onClear={() => {
          setSelected(null);
          onChange({ customerId: null });
        }}
      />

      <div className="flex justify-between pt-4">
        <Button type="button" onClick={onBack}>
          ← Retour
        </Button>

        <Button
          type="button"
          onClick={onNext} // si tu veux rendre le client obligatoire :
          // disabled={!draft.customerId}
        >
          Continuer →
        </Button>
      </div>
    </div>
  );
}
