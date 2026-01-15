"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { CustomerSearch } from "@/components/dashboard/CustomerSearch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Assurez-vous que le chemin est bon vers votre page.tsx où sont définis les types
import { OrderDraft, NewClientData } from "@/types/order";

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
  vatNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
};

export default function StepTwo({
  draft,
  onChange,
  onNext,
  onBack,
  currentStep = 2,
}: Props) {
  const [isNewClient, setIsNewClient] = useState(false);

  // Initialisation du formulaire avec les données existantes du draft si on revient en arrière
  const [formData, setFormData] = useState<NewClientData>(
    draft.newClientData || {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      vatNumber: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      city: "",
      country: "",
      isActive: true,
    },
  );

  // État local pour afficher le client sélectionné dans la barre de recherche
  const [selected, setSelected] = useState<CustomerLite | null>(null);

  // Met à jour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Réinitialise le formulaire et retourne à la recherche
  const handleReset = () => {
    setIsNewClient(false);
    // On ne vide pas forcément le formData pour garder les infos si on ré-ouvre,
    // mais on peut le faire si vous préférez.
  };

  // --- LOGIQUE : CRÉATION NOUVEAU CLIENT (SANS DB) ---
  const handleValidateNewClient = () => {
    // 1. ID Temporaire
    const tempId = `TEMP_${Date.now()}`;

    // 2. Objet visuel pour l'UI
    const newCustomerLite: CustomerLite = {
      id: tempId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      vatNumber: formData.vatNumber,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
    };

    setSelected(newCustomerLite);

    // 3. MISE À JOUR DU DRAFT GLOBAL
    onChange({
      customerId: tempId,
      clientDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        vatNumber: formData.vatNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
      },
      newClientData: {
        ...formData,
        isActive: true,
      },
    });

    // On ferme le mode édition
    setIsNewClient(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Titre */}
      <div className="pb-2">
        <h2 className="text-2xl font-bold ">Informations client</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Recherchez un client existant ou créez-en un nouveau
        </p>
      </div>

      {/* --- CAS 1 : MODE RECHERCHE --- */}
      {!isNewClient ? (
        <>
          <CustomerSearch
            value={selected}
            onPick={(c) => {
              setSelected(c);
              // Si on choisit un existant, on vide newClientData pour éviter de créer un doublon
              onChange({
                customerId: c.id,
                clientDetails: {
                  name: c.name || "Inconnu",
                  email: c.email || "",
                  phone: c.phone || "",
                  companyName: c.companyName,
                  vatNumber: c.vatNumber,
                  addressLine1: c.addressLine1,
                  addressLine2: c.addressLine2,
                  postalCode: c.postalCode,
                  city: c.city,
                  country: c.country,
                },
                newClientData: null, // IMPORTANT
              });
            }}
            onClear={() => {
              setSelected(null);
              onChange({
                customerId: null,
                clientDetails: null,
                newClientData: null,
              });
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Si un client TEMP est sélectionné, on peut proposer de le modifier */}
            {draft.customerId?.startsWith("TEMP") && (
              <div className="p-4 rounded-md text-sm mb-2">
                Nouveau client en cours de création :{" "}
                <strong>{draft.clientDetails?.name}</strong>. Il sera enregistré
                lors de la validation finale.
              </div>
            )}

            <Button type="button" onClick={() => setIsNewClient(true)}>
              {draft.customerId?.startsWith("TEMP")
                ? "Modifier ce nouveau client"
                : "Nouveau client"}
            </Button>
          </div>
        </>
      ) : (
        // --- CAS 2 : MODE FORMULAIRE CRÉATION ---
        <div className="rounded-lg border p-6  shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-semibold text-lg">Nouveau Client</h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Annuler
            </Button>
          </div>

          <div className="space-y-6">
            {/* Champs principaux */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom complet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@mail.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone *</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06..."
                />
              </div>
              <div className="space-y-2">
                <Label>Société</Label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div className="space-y-2">
                <Label>TVA</Label>
                <Input
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  placeholder="Numéro de TVA"
                />
              </div>
            </div>

            {/* Champs Adresse */}
            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              <div className="space-y-2">
                <Label>Adresse ligne 1 *</Label>
                <Input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Adresse ligne 2</Label>
                <Input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Code postal *</Label>
                <Input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Ville *</Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Pays *</Label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleReset}>
              Retour
            </Button>
            <Button
              onClick={handleValidateNewClient}
              disabled={
                !formData.name ||
                !formData.email ||
                !formData.phone ||
                !formData.addressLine1 ||
                !formData.postalCode ||
                !formData.city ||
                !formData.country
              }
            >
              Confirmer ce client
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Globale */}
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
            className="w-32"
            disabled={!draft.customerId}
          >
            Continuer →
          </Button>
        </div>
      )}
    </div>
  );
}
