"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
// Import des types définis dans le parent
import { OrderDraft } from "../page";

// --- Types ---

type Props = {
  draft: OrderDraft; // Réception des données réelles
  onChange: (patch: Partial<OrderDraft>) => void; // Fonction de mise à jour
  onBack: () => void;
  onSubmit?: () => void;
  currentStep?: number;
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

export default function StepFour({
  draft,
  onChange,
  onBack,
  onSubmit,
  currentStep = 4,
}: Props) {
  // Calcul du sous-total basé sur les produits du draft
  const subTotal = draft.products.reduce((acc, p) => {
    const textOptionPrice = p.hasCustomText ? 10 : 0;
    return acc + (p.unitPrice + textOptionPrice) * p.quantity;
  }, 0);

  // Calcul du total (Identique au sous-total pour l'instant, logique de remise à implémenter si besoin)
  const total = subTotal;

  // Handlers pour mettre à jour le draft global directement
  const handleDiscountChange = (value: string) => {
    onChange({ discountType: value });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ internalNote: e.target.value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Récapitulatif</h2>
        <p className="text-sm text-gray-600 mt-1">
          Vérifiez les informations avant de créer la commande
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Informations commande */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Informations commande
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Préfixe</span>
              <span className="font-medium text-gray-900">
                {draft.info?.prefix || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Canal</span>
              <span className="font-medium text-gray-900">
                {draft.info?.channel || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Livraison</span>
              <span className="font-medium text-gray-900">
                {draft.info?.delivery || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Client */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Client
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {draft.clientDetails ? (
              // 👇 C'est ici que la magie opère
              <div className="text-sm space-y-1">
                <div className="font-bold text-gray-900">
                  {draft.clientDetails.name}
                </div>
                <div className="text-gray-600">{draft.clientDetails.email}</div>
                <div className="text-gray-600">{draft.clientDetails.phone}</div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun client associé</p>
            )}
          </CardContent>
        </Card>

        {/* 3. Produits */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Produits ({draft.products.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {draft.products.length === 0 ? (
              <p className="text-gray-500 italic">Aucun produit sélectionné</p>
            ) : (
              draft.products.map((prod, idx) => {
                // Calcul prix item (prix base + option texte) * quantité
                const itemTotal =
                  (prod.unitPrice + (prod.hasCustomText ? 10 : 0)) *
                  prod.quantity;

                return (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-900">
                      {prod.quantity}x {prod.label}
                      {/* Petit indicateur visuel si options */}
                      {(prod.hasCustomText || prod.needs3D) && (
                        <span className="text-xs text-gray-500 ml-2">
                          (
                          {[prod.hasCustomText && "Texte", prod.needs3D && "3D"]
                            .filter(Boolean)
                            .join(", ")}
                          )
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-gray-900">
                      {itemTotal.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* 4. Total & Remise */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-base font-semibold text-gray-900">
                Total
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de remise */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Type de remise
              </label>
              <Select
                value={draft.discountType || "none"}
                onValueChange={handleDiscountChange}
              >
                <SelectTrigger className="w-full sm:w-1/2 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Aucune remise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune remise</SelectItem>
                  <SelectItem value="percent">Pourcentage (%)</SelectItem>
                  <SelectItem value="amount">Montant fixe (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calculs */}
            <div className="pt-2 space-y-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium text-gray-900">
                  {subTotal.toFixed(2).replace(".", ",")} €
                </span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commentaire interne */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-gray-900">
            Commentaire interne (optionnel)
          </label>
          <Textarea
            placeholder="Notes internes pour l'équipe..."
            className="bg-gray-50 border-gray-200 resize-none h-24"
            value={draft.internalNote || ""}
            onChange={handleNoteChange}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="w-32">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6"
        >
          <Check className="mr-2 h-4 w-4" /> Créer la commande
        </Button>
      </div>
    </div>
  );
}
