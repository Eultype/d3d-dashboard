"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Pour rediriger après succès
import StepOne from "./steps/step-1";
import StepTwo from "./steps/step-2";
import StepThree from "./steps/step-3";
import StepFour from "./steps/step-4";

// 👇 Importez vos Server Actions réelles ici
import { createCustomer } from "@/actions/customer";
// import { createOrder } from "@/actions/order"; // Votre action pour créer la commande

// --- Types Globaux ---

export type ProductItem = {
  uniqueId: string;
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

// Type pour les données complètes du formulaire client (identique à votre schéma DB)
export type NewClientData = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  isActive: boolean;
};

export type ClientDetails = {
  name: string;
  email: string;
  phone: string;
};

export type OrderDraft = {
  info: { prefix: string; channel: string; delivery: string };
  customerId: string | null;
  clientDetails: ClientDetails | null;
  // 👇 Nouveau champ pour stocker les données brutes si c'est un nouveau client
  newClientData?: NewClientData | null;
  products: ProductItem[];
  discountType: string;
  internalNote: string;
};

export default function OrderForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draft, setDraft] = useState<OrderDraft>({
    info: { prefix: "", channel: "", delivery: "" },
    customerId: null,
    clientDetails: null,
    newClientData: null, // Initialisé à null
    products: [],
    discountType: "none",
    internalNote: "",
  });

  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  // 🚨 LA LOGIQUE FINALE D'INSERTION EN DB
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let finalCustomerId = draft.customerId;

      // CAS : C'est un nouveau client (ID temporaire commençant par TEMP)
      if (draft.newClientData && finalCustomerId?.startsWith("TEMP")) {
        console.log("Conversion des données JSON en FormData...");

        // 1. CRÉATION DU FORMDATA (C'est l'étape manquante qui corrige l'erreur)
        const formData = new FormData();

        // On transforme chaque champ de l'objet en champ de formulaire
        Object.entries(draft.newClientData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });

        // 2. APPEL DE L'ACTION AVEC LE FORMDATA
        // createCustomer(prevState, formData) -> on passe null en prevState
        const result = await createCustomer(null, formData);

        // 3. GESTION DU RÉSULTAT
        if (result?.errors) {
          alert("Erreur validation client : " + JSON.stringify(result.errors));
          setIsSubmitting(false);
          return;
        }

        // On vérifie qu'on a bien reçu le nouveau client
        if (!result?.newCustomer?.id) {
          console.error("Retour action:", result);
          throw new Error("Le client a été créé mais l'ID est introuvable.");
        }

        // On met à jour l'ID final avec le VRAI ID de la base de données
        finalCustomerId = result.newCustomer.id;
        console.log("Client créé en DB avec succès, ID:", finalCustomerId);
      }

      // --- SUITE : CRÉATION DE LA COMMANDE ---
      console.log("Création commande avec CustomerID:", finalCustomerId);

      // EXEMPLE (Adaptez avec votre vraie action createOrder)
      // await createOrder({
      //    ...draft,
      //    customerId: finalCustomerId
      // });

      alert("Commande créée avec succès !");
      // router.push("/dashboard/orders");
    } catch (error) {
      // ✅ AJOUTEZ CE BLOC EN PREMIER :
      // Si l'erreur est une redirection Next.js, on laisse faire et on ne fait rien.
      if (
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" ||
          error.message.includes("NEXT_REDIRECT"))
      ) {
        console.log("Redirection en cours...");
        return; // On arrête la gestion d'erreur ici
      }

      // Le reste de votre gestion d'erreur normale
      console.error("🔥 ERREUR CRITIQUE DÉTAILLÉE :", error);

      if (error instanceof Error) {
        // console.error("Message d'erreur :", error.message); // Optionnel
        alert(`Erreur technique : ${error.message}`);
      } else {
        alert("Une erreur inconnue est survenue.");
      }
    } finally {
      // Attention : si une redirection a lieu, le composant peut être démonté avant que ceci s'exécute,
      // mais c'est bien de le laisser pour les cas d'erreur.
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <StepOne
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(2)}
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
          onSubmit={handleSubmit} // On passe la fonction master
        />
      )}
    </div>
  );
}
