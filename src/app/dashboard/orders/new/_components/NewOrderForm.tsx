"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StepOne from "./steps/Step1";
import StepTwo from "./steps/Step2";
import StepThree from "./steps/Step3";
import StepFour from "./steps/Step4";
import { createOrder } from "@/actions/order";
import { getInternalPrefixes } from "@/actions/sequence";
import { OrderDraft, ProductFromDB } from "@/types/order";

// --- Définition des types globaux ---

type OrderFormProps = {
  productsCatalog: ProductFromDB[];
};

export default function OrderForm({ productsCatalog }: OrderFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stockage des préfixes chargés depuis le serveur
  const [prefixes, setPrefixes] = useState<string[]>([]);

  const [draft, setDraft] = useState<OrderDraft>({
    info: { 
      prefix: "", 
      delivery: "", 
      shippingCost: 0, 
      taxRate: 21,
      manualNumber: null 
    },
    customerId: null,
    clientDetails: null,
    newClientData: null,
    products: [],
    discountType: "none",
    internalNote: "",
  });

  // Charger les préfixes au montage
  useEffect(() => {
    async function loadPrefixes() {
      try {
        const list = await getInternalPrefixes();
        setPrefixes(list);
      } catch (err) {
        console.error("Erreur chargement préfixes", err);
      }
    }
    loadPrefixes();
  }, []);

  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Préparation des données pour l'action serveur
      const payload = {
        info: draft.info,
        clientId: draft.customerId,
        clientDetails: draft.clientDetails ? {
          ...draft.clientDetails,
          addressLine1: draft.clientDetails.addressLine1 || "",
          postalCode: draft.clientDetails.postalCode || "",
          city: draft.clientDetails.city || "",
          country: draft.clientDetails.country || "",
        } : null,
        products: draft.products.map(p => ({
          typeId: p.typeId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          files: p.files || [] 
        })),
        internalNote: draft.internalNote,
        discountType: draft.discountType,
        discountValue: draft.discountValue,
      };

      const result = await createOrder(payload);

      if (result.success && result.orderId) {
        toast.success(`Commande ${result.reference} créée avec succès !`);
        router.push(`/dashboard/orders/${result.orderId}`);
      } else {
        toast.error(result.message || "Une erreur est survenue lors de la création de la commande.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erreur technique:", error);
      toast.error("Une erreur technique est survenue. Contactez le support.");
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
          availablePrefixes={prefixes}
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
          productsCatalog={productsCatalog}
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