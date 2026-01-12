"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { CustomerSearch } from "@/components/dashboard/customer-search";
// 👇 On importe le type ClientDetails
import { OrderDraft, ClientDetails } from "../page"; // ou "../form" selon votre fichier

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

export type CustomerLite = {
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
  const [isNewClient, setIsNewClient] = React.useState(false);

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  // État local pour l'UI (CustomerSearch)
  const [selected, setSelected] = useState<CustomerLite | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    setIsNewClient(false);
  };

  // --- CAS 1 : CRÉATION NOUVEAU CLIENT ---
  const handleSubmitNewClient = () => {
    const fakeId = `new-${Date.now()}`;
    const fullName = `${form.firstName} ${form.lastName}`;

    const newCustomer: CustomerLite = {
      id: fakeId,
      name: fullName,
      email: form.email,
      phone: form.phone,
      companyName: null,
    };

    setSelected(newCustomer);

    // 👇 ON SAUVEGARDE TOUT DANS LE DRAFT
    onChange({
      customerId: newCustomer.id,
      clientDetails: {
        name: fullName,
        email: form.email,
        phone: form.phone,
      },
    });

    setIsNewClient(false);
    // handleReset(); // Optionnel
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Informations client
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Recherchez un client existant ou créez-en un nouveau
        </p>
      </div>

      {!isNewClient ? (
        <>
          {/* --- CAS 2 : RECHERCHE CLIENT EXISTANT --- */}
          <CustomerSearch
            value={selected}
            onPick={(c) => {
              setSelected(c);
              // 👇 ON SAUVEGARDE TOUT DANS LE DRAFT
              onChange({
                customerId: c.id,
                clientDetails: {
                  name: c.name || "Nom inconnu",
                  email: c.email || "",
                  phone: c.phone || "",
                },
              });
            }}
            onClear={() => {
              setSelected(null);
              onChange({ customerId: null, clientDetails: null });
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Button
              type="button"
              className="bg-[#0f172a]"
              onClick={() => setIsNewClient(true)}
            >
              Nouveau client
            </Button>
          </div>
        </>
      ) : (
        // ... (Le formulaire de création reste identique, voir plus haut) ...
        <div className="rounded-lg border p-4 space-y-4">
          {/* ... Champs inputs ... */}
          {/* Je ne remets pas tout le JSX des inputs pour abréger,
               gardez votre code existant ici */}

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Nom"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Téléphone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
          </div>
          {/* ... */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleReset}>
              Retour
            </Button>
            <Button onClick={handleSubmitNewClient}>Continuer →</Button>
          </div>
        </div>
      )}

      {!isNewClient && (
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-32"
          >
            ← Retour
          </Button>
          <Button
            type="button"
            onClick={onNext}
            className="w-32 bg-slate-800"
            disabled={!draft.customerId}
          >
            Continuer →
          </Button>
        </div>
      )}
    </div>
  );
}
