"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field"; // Vos composants existants
import { Stepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input"; // Nécessaire pour quantité/prix
import { Checkbox } from "@/components/ui/checkbox"; // Nécessaire pour les options
import { Label } from "@/components/ui/label"; // Label standard shadcn
import { Trash2, Upload, Plus } from "lucide-react"; // Icônes

// --- Types ---

type ProductDef = {
  id: string;
  label: string;
  basePrice: number;
};

// Catalogue des produits disponibles
const PRODUCT_CATALOG: Record<string, ProductDef> = {
  coeur: { id: "coeur", label: "Coeur", basePrice: 55 },
  pra: { id: "pra", label: "PRA (Prisma Allongé)", basePrice: 85 },
  prc: { id: "prc", label: "PRC (Prisma Carrée)", basePrice: 65 },
  rectangle_grand: {
    id: "rectangle_grand",
    label: "Rectangle grand",
    basePrice: 75,
  },
  rectangle_petit: {
    id: "rectangle_petit",
    label: "Rectangle petit",
    basePrice: 45,
  },
};

type AddedProduct = {
  uniqueId: string; // Pour la clé React (cas où on ajoute 2x le même produit)
  typeId: string;
  label: string;
  unitPrice: number;
  quantity: number;
  hasCustomText: boolean;
  needs3D: boolean;
};

type Props = {
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

export default function StepOne({ onNext, onBack, currentStep = 3 }: Props) {
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<AddedProduct[]>([]);

  // Ajouter un produit à la liste
  const addProduct = () => {
    if (selectedProductKey && PRODUCT_CATALOG[selectedProductKey]) {
      const original = PRODUCT_CATALOG[selectedProductKey];

      const newProduct: AddedProduct = {
        uniqueId: Math.random().toString(36).substr(2, 9),
        typeId: original.id,
        label: original.label,
        unitPrice: original.basePrice,
        quantity: 1,
        hasCustomText: false,
        needs3D: false,
      };

      setProducts([...products, newProduct]);
      setSelectedProductKey(null); // Reset select
    }
  };

  // Supprimer un produit
  const removeProduct = (uniqueId: string) => {
    setProducts(products.filter((p) => p.uniqueId !== uniqueId));
  };

  // Mettre à jour un champ d'un produit spécifique
  const updateProduct = (
    uniqueId: string,
    field: keyof AddedProduct,
    value: any,
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.uniqueId === uniqueId ? { ...p, [field]: value } : p)),
    );
  };

  // Calcul du total global
  const calculateTotal = () => {
    return products.reduce((acc, p) => {
      const textOptionPrice = p.hasCustomText ? 10 : 0;
      const subTotal = (p.unitPrice + textOptionPrice) * p.quantity;
      return acc + subTotal;
    }, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Form Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Produits de la commande
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ajoutez les produits avec leurs options
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {/* --- Ligne de sélection --- */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="select-product">
                Sélectionner un produit
              </FieldLabel>
              <Select
                value={selectedProductKey || ""}
                onValueChange={setSelectedProductKey}
              >
                <SelectTrigger
                  id="select-product"
                  className="w-full h-11 bg-gray-50/50"
                >
                  <SelectValue placeholder="Sélectionner un produit à ajouter" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PRODUCT_CATALOG).map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.label} - {prod.basePrice.toFixed(2)} €
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Button
            onClick={addProduct}
            className=" shrink-0 bg-black "
            disabled={!selectedProductKey}
          >
            <Plus className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* --- Liste des produits --- */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center text-gray-400 bg-gray-50/50">
              <h3 className="font-medium">Aucun produit ajouté</h3>
              <p className="text-sm mt-1">
                Sélectionnez un produit ci-dessus pour commencer
              </p>
            </div>
          ) : (
            products.map((item) => {
              // Calcul sous-total item
              const itemSubTotal =
                (item.unitPrice + (item.hasCustomText ? 10 : 0)) *
                item.quantity;

              return (
                <div
                  key={item.uniqueId}
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm space-y-6"
                >
                  {/* Header Carte : Titre + Prix Unitaire + Trash */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {item.label}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.unitPrice.toFixed(2)} € / unité
                      </p>
                    </div>
                    <button
                      onClick={() => removeProduct(item.uniqueId)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Inputs Grid : Quantité & Prix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`qty-${item.uniqueId}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Quantité
                      </Label>
                      <Input
                        id={`qty-${item.uniqueId}`}
                        type="number"
                        min={1}
                        className="bg-gray-50 border-gray-200 h-11"
                        value={item.quantity}
                        onChange={(e) =>
                          updateProduct(
                            item.uniqueId,
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`price-${item.uniqueId}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Prix unitaire (€)
                      </Label>
                      <Input
                        id={`price-${item.uniqueId}`}
                        type="number"
                        className="bg-gray-50 border-gray-200 h-11 font-medium"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateProduct(
                            item.uniqueId,
                            "unitPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${item.uniqueId}`}
                        checked={item.hasCustomText}
                        onCheckedChange={(checked) =>
                          updateProduct(item.uniqueId, "hasCustomText", checked)
                        }
                      />
                      <label
                        htmlFor={`custom-${item.uniqueId}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Texte personnalisé (+10,00 €)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`3d-${item.uniqueId}`}
                        checked={item.needs3D}
                        onCheckedChange={(checked) =>
                          updateProduct(item.uniqueId, "needs3D", checked)
                        }
                      />
                      <label
                        htmlFor={`3d-${item.uniqueId}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Nécessite sous-traitance 3D
                      </label>
                    </div>
                  </div>

                  {/* Upload Zone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Photos client
                    </Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg h-24 flex items-center justify-center bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>

                  {/* Sous-total Item */}
                  <div className="text-right pt-2">
                    <span className="font-semibold text-gray-900">
                      Sous-total : {itemSubTotal.toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Total Global */}
        {products.length > 0 && (
          <div className="flex justify-end pt-4">
            <h3 className="text-xl font-bold text-gray-900">
              Total produits : {calculateTotal().toFixed(2).replace(".", ",")} €
            </h3>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onBack} className="w-32">
            ← Retour
          </Button>
          <Button
            onClick={onNext}
            className="w-32 bg-slate-800 hover:bg-slate-900"
          >
            Continuer →
          </Button>
        </div>
      </div>
    </div>
  );
}
