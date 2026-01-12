"use client";
import { useState } from "react";
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
  const [isNewClient, setIsNewClient] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    });
    setIsNewClient(false);
  };

  const handleSubmitNewClient = () => {
    // Ici tu pourrais appeler ton API pour créer le client et récupérer son id
    console.log("Nouveau client créé :", form);

    // Exemple : on simule un client créé
    const newCustomer: CustomerLite = {
      id: "temp-id",
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      companyName: null,
    };

    setSelected(newCustomer);
    onChange({ customerId: newCustomer.id });
    setIsNewClient(false);
    handleReset();
  };
  const [selected, setSelected] = useState<CustomerLite | null>(null);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              type="button"
              className="bg-[#0f172a]"
              onClick={() => setIsNewClient(true)}
            >
              Nouveau client
            </Button>
            <Button
              type="button"
              className="bg-transparent border border-black text-black hover:bg-gray-200"
              onClick={() => {
                setSelected(null);
                onChange({ customerId: null });
              }}
            >
              Sans client
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Nouveau client</span>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              X Effacer
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Prénom"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required={true}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Nom"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required={true}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required={true}
              className="border rounded-md p-2 w-full"
            />
            <input
              placeholder="Téléphone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required={true}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <textarea
            placeholder="Adresse"
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            required={true}
            className="w-full border rounded-md p-2"
          />

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
          <Button type="button" onClick={onBack}>
            ← Retour
          </Button>

          <Button
            type="button"
            onClick={onNext}
            disabled={!draft.customerId && !isNewClient}
          >
            Continuer →
          </Button>
        </div>
      )}
    </div>
  );
}
