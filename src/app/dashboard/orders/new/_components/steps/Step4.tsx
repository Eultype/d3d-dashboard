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
import { OrderDraft } from "@/types/order";

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

  const shippingCost = draft.info?.shippingCost || 0;

  // Calcul du total TTC
  const total = subTotal + shippingCost;
  
  // Calcul de la TVA (incluse dans le total)
  const taxRate = draft.info?.taxRate || 21;
  const vatAmount = total - (total / (1 + taxRate / 100));

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
        <h2 className="text-2xl font-bold ">Récapitulatif</h2>
        <p className="text-sm  mt-1">
          Vérifiez les informations avant de créer la commande
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Informations commande */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 " />
              <CardTitle className="text-base font-semibold ">
                Informations commande
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="">Préfixe</span>
              <span className="font-medium ">{draft.info?.prefix || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="">Canal</span>
              <span className="font-medium ">{draft.info?.channel || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="">Livraison</span>
              <span className="font-medium ">
                {draft.info?.delivery || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Client */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 " />
              <CardTitle className="text-base font-semibold ">Client</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              // On priorise les données complètes du "Nouveau Client" si elles existent
              // Sinon on affiche les infos basiques du client existant sélectionné
              const client = draft.newClientData || draft.clientDetails;

              if (!client) {
                return <p className="text-sm">Aucun client associé</p>;
              }

              const isCompany = !!(
                "companyName" in client && client.companyName?.trim()
              );
              const hasVat = !!(
                "vatNumber" in client && client.vatNumber?.trim()
              );
              const hasAddress = !!(
                "addressLine1" in client && client.addressLine1?.trim()
              );

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                  {/* BLOC 1 : CONTACT */}
                  <div className="space-y-1">
                    <div className="font-semibold  border-b pb-1 mb-2">
                      Contact
                    </div>
                    <div className="font-medium">{client.name}</div>
                    {client.email ? (
                      <div className="text-muted-foreground break-words">
                        {client.email}
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Pas d'email
                      </div>
                    )}
                    {client.phone ? (
                      <div className="text-muted-foreground">
                        {client.phone}
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Pas de téléphone
                      </div>
                    )}
                  </div>

                  {/* BLOC 2 : ENTREPRISE */}
                  <div className="space-y-1">
                    <div className="font-semibold  border-b pb-1 mb-2">
                      Entreprise
                    </div>
                    {isCompany ? (
                      <div>{client.companyName}</div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Particulier
                      </div>
                    )}
                    <div className="pt-1">
                      <span className="text-xs text-muted-foreground mr-2">
                        TVA:
                      </span>
                      {hasVat ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground font-mono">
                          {client.vatNumber}
                        </span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                  </div>

                  {/* BLOC 3 : ADRESSE */}
                  <div className="space-y-1">
                    <div className="font-semibold  border-b pb-1 mb-2">
                      Adresse
                    </div>
                    {hasAddress ? (
                      <>
                        <div>{client.addressLine1}</div>
                        {client.addressLine2 && (
                          <div>{client.addressLine2}</div>
                        )}
                        <div>
                          {client.postalCode} {client.city}
                        </div>
                        <div className="uppercase text-muted-foreground text-xs mt-1">
                          {client.country}
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Non renseignée
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* 3. Produits */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 " />
              <CardTitle className="text-base font-semibold ">
                Produits ({draft.products.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {draft.products.length === 0 ? (
              <p className=" italic">Aucun produit sélectionné</p>
            ) : (
              draft.products.map((prod, idx) => {
                // Calcul prix item (prix base + option texte) * quantité
                const itemTotal =
                  (prod.unitPrice + (prod.hasCustomText ? 10 : 0)) *
                  prod.quantity;

                return (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="">
                      {prod.quantity}x {prod.label}
                      {/* Petit indicateur visuel si options */}
                      {(prod.hasCustomText || prod.needs3D) && (
                        <span className="text-xs  ml-2">
                          (
                          {[prod.hasCustomText && "Texte", prod.needs3D && "3D"]
                            .filter(Boolean)
                            .join(", ")}
                          )
                        </span>
                      )}
                    </span>
                    <span className="font-medium ">
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
              <Calculator className="h-5 w-5 " />
              <CardTitle className="text-base font-semibold ">Total</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de remise */}
            <div className="space-y-2">
              <label className="text-sm font-medium ">Type de remise</label>
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
                <span className="">Sous-total produits</span>
                <span className="font-medium ">
                  {subTotal.toFixed(2).replace(".", ",")} €
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="">Livraison ({draft.info?.delivery})</span>
                <span className="font-medium ">
                  {shippingCost.toFixed(2).replace(".", ",")} €
                </span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold  pt-2">
                <span>Total</span>
                <span>{total.toFixed(2).replace(".", ",")} €</span>
              </div>

              <div className="flex justify-end text-xs text-muted-foreground italic">
                <span>Dont TVA ({taxRate}%) : {vatAmount.toFixed(2).replace(".", ",")} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commentaire interne */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium ">
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
        <Button onClick={onSubmit} className="  px-6">
          <Check className="mr-2 h-4 w-4" /> Créer la commande
        </Button>
      </div>
    </div>
  );
}
