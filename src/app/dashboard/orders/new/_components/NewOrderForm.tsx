"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StepOne from "./steps/Step1";
import StepTwo from "./steps/Step2";
import StepThree from "./steps/Step3";
import StepFour from "./steps/Step4";
import { createOrder } from "@/actions/order";
import { OrderDraft, ProductFromDB } from "@/types/order";

// --- Définition des types globaux ---

type OrderFormProps = {
  productsCatalog: ProductFromDB[];
  userRole?: string;
  userPrefix?: string; // Ajout du préfixe dynamique
  prefilledCustomer?: any;
};

export default function OrderForm({ productsCatalog, userRole, userPrefix, prefilledCustomer }: OrderFormProps) {
  const router = useRouter();
  const isReseller = userRole === "REVENDEUR";

  // Si revendeur, on commence direct à l'étape 3
  const [step, setStep] = useState(isReseller ? 3 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draft, setDraft] = useState<OrderDraft>({
    info: { 
      prefix: isReseller && userPrefix ? userPrefix : "", // Utilise le préfixe du revendeur
      delivery: isReseller ? "Livraison Belgique" : "",
      shippingCost: isReseller ? 12 : 0, 
      taxRate: 21,
      manualNumber: null 
    },
    customerId: prefilledCustomer?.id || null,
    clientDetails: prefilledCustomer ? {
      name: prefilledCustomer.name,
      email: prefilledCustomer.email,
      phone: prefilledCustomer.phone,
      addressLine1: prefilledCustomer.addressLine1,
      postalCode: prefilledCustomer.postalCode,
      city: prefilledCustomer.city,
      country: prefilledCustomer.country,
      companyName: prefilledCustomer.companyName,
      vatNumber: prefilledCustomer.vatNumber,
    } : null,
    newClientData: null,
    products: [],
    discountType: "none",
    internalNote: "",
  });

  // Si on est revendeur et qu'on n'a pas de client associé, on avertit
  useEffect(() => {
    if (isReseller && !prefilledCustomer) {
      toast.error("Votre compte revendeur n'est pas lié à une fiche client. Veuillez contacter l'administrateur.");
    }
  }, [isReseller, prefilledCustomer]);

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
          files: p.files || [] // ✅ Ajout des fichiers
        })),
        internalNote: draft.internalNote,
        discountType: draft.discountType,
        discountValue: draft.discountValue,
      };

      const result = await createOrder(payload);

      if (result.success && result.orderId) {
        toast.success(`Commande ${result.reference} créée avec succès !`);
        // Redirection vers la page de la nouvelle commande
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
      {step === 1 && !isReseller && (
        <StepOne
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && !isReseller && (
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
          onBack={isReseller ? undefined : () => setStep(2)} // Disable back for Reseller
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