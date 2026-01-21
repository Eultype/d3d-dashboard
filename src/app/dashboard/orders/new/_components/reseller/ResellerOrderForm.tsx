"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/actions/order";
import { OrderDraft, ProductFromDB } from "@/types/order";
import ResellerStep1 from "./ResellerStep1";
import ResellerStep2 from "./ResellerStep2";

type ResellerOrderFormProps = {
  productsCatalog: ProductFromDB[];
  userPrefix: string;
  prefilledCustomer: any;
};

export default function ResellerOrderForm({ 
  productsCatalog, 
  userPrefix, 
  prefilledCustomer 
}: ResellerOrderFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialisation du draft spécifique Revendeur
  const [draft, setDraft] = useState<OrderDraft>({
    info: { 
      prefix: userPrefix, 
      delivery: "Livraison Belgique", // Par défaut
      shippingCost: 12, // Par défaut
      taxRate: 21,
      manualNumber: null 
    },
    customerId: prefilledCustomer?.id || null,
    clientDetails: prefilledCustomer ? {
      name: prefilledCustomer.name || "",
      email: prefilledCustomer.email || "",
      phone: prefilledCustomer.phone || "",
      addressLine1: prefilledCustomer.addressLine1 || "",
      postalCode: prefilledCustomer.postalCode || "",
      city: prefilledCustomer.city || "",
      country: prefilledCustomer.country || "",
      companyName: prefilledCustomer.companyName || "",
      vatNumber: prefilledCustomer.vatNumber || "",
    } : null,
    newClientData: null,
    products: [],
    discountType: "none",
    internalNote: "",
  });

  const updateDraft = (patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
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
        toast.error(result.message || "Une erreur est survenue.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erreur technique:", error);
      toast.error("Erreur technique.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <ResellerStep1
          draft={draft}
          onChange={updateDraft}
          onNext={() => setStep(2)}
          productsCatalog={productsCatalog}
        />
      )}

      {step === 2 && (
        <ResellerStep2
          draft={draft}
          onChange={updateDraft}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
