"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import {
  FileText,
  User,
  Package,
  Calculator,
  Check,
  ArrowLeft,
} from "lucide-react";
import { OrderDraft } from "@/types/order";

type Props = {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
  onBack: () => void;
  onSubmit: () => void;
};

const steps = [
  { number: 1, label: "Produits" },
  { number: 2, label: "Validation" },
];

export default function ResellerStep2({
  draft,
  onChange,
  onBack,
  onSubmit,
}: Props) {
  const subTotal = draft.products.reduce((acc, p) => {
    const textOptionPrice = p.hasCustomText ? 10 : 0;
    return acc + (p.unitPrice + textOptionPrice) * p.quantity;
  }, 0);

  const shippingCost = draft.info?.shippingCost || 0;
  const discountValue = draft.discountValue || 0;
  let discountAmount = 0;

  if (draft.discountType === "percent") {
    discountAmount = subTotal * (discountValue / 100);
  } else if (draft.discountType === "amount") {
    discountAmount = discountValue;
  }

  const total = Math.max(0, subTotal - discountAmount) + shippingCost;
  const taxRate = draft.info?.taxRate || 21;
  const vatAmount = total - (total / (1 + taxRate / 100));

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ internalNote: e.target.value });
  };

  // Les revendeurs ne gèrent pas eux-mêmes les remises généralement,
  // mais je laisse le bloc au cas où vous voudriez leur laisser cette liberté.
  // Sinon, on peut le masquer. Je le laisse pour l'instant par symétrie.

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      <div className="pb-2">
        <Stepper steps={steps} currentStep={2} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Validation de la commande</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Vérifiez le récapitulatif avant de confirmer
        </p>
      </div>

      <div className="space-y-4">
        {/* Infos Commande (Fixes pour revendeur) */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">Référence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Préfixe Revendeur</span>
              <span className="font-medium">{draft.info?.prefix || "WEB"}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode de livraison</span>
              <span className="font-medium">{draft.info?.delivery || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Produits */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">Produits ({draft.products.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {draft.products.length === 0 ? (
              <p className="italic">Aucun produit sélectionné</p>
            ) : (
              draft.products.map((prod, idx) => {
                const itemTotal = (prod.unitPrice + (prod.hasCustomText ? 10 : 0)) * prod.quantity;
                return (
                  <div key={idx} className="flex justify-between items-center">
                    <span>
                      {prod.quantity}x {prod.label}
                      {(prod.hasCustomText || prod.needs3D) && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({[prod.hasCustomText && "Texte", prod.needs3D && "3D"].filter(Boolean).join(", ")})
                        </span>
                      )}
                    </span>
                    <span className="font-medium">{itemTotal.toFixed(2).replace(".", ",")} €</span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <CardTitle className="text-base font-semibold">Total à payer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Sous-total produits</span>
                <span className="font-medium">{subTotal.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-medium">{shippingCost.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold pt-2 border-t mt-2">
                <span>Total TTC</span>
                <span>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="flex justify-end text-xs text-muted-foreground italic">
                <span>Dont TVA ({taxRate}%) : {vatAmount.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commentaire */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium">Note pour l'atelier (optionnel)</label>
          <Textarea
            placeholder="Ex: Attention fragile, graver en majuscules..."
            className="bg-gray-50 border-gray-200 resize-none h-24"
            value={draft.internalNote || ""}
            onChange={handleNoteChange}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="w-32">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button onClick={onSubmit} className="px-6 w-48">
          <Check className="mr-2 h-4 w-4" /> Confirmer
        </Button>
      </div>
    </div>
  );
}
