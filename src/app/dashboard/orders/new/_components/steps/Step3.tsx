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
import { Field, FieldLabel } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Plus, FileImage, Loader2 } from "lucide-react";
// Import des types du parent pour la cohérence
import { OrderDraft, ProductItem, ProductFromDB } from "@/types/order";
import { uploadOrderFile } from "@/actions/upload";

// Update des Props pour recevoir le state global et le catalogue
type Props = {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
  productsCatalog: ProductFromDB[]; // AJOUTÉ
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

export default function StepThree({
  draft,
  onChange,
  onNext,
  onBack,
  currentStep = 3,
  productsCatalog,
}: Props) {
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(
    null,
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // 🔑 INITIALISATION : On reprend les produits du draft s'ils existent, sinon tableau vide
  const [products, setProducts] = useState<ProductItem[]>(draft.products || []);

  // Ajouter un produit à la liste
  const addProduct = () => {
    if (selectedProductKey) {
      // On cherche dans le catalogue reçu du serveur
      const original = productsCatalog.find((p) => p.id === selectedProductKey);

      if (original) {
        const newProduct: ProductItem = {
          uniqueId: Math.random().toString(36).substr(2, 9),
          typeId: original.id, // C'est maintenant le VRAI ID (ex: cmk...)
          label: original.name, // On utilise 'name' de la DB
          unitPrice: original.priceCents / 100, // Conversion centimes -> euros
          quantity: 1,
          hasCustomText: false,
          needs3D: false,
        };

        setProducts([...products, newProduct]);
        setSelectedProductKey(null); // Reset select
      }
    }
  };

  // Modifier un produit (quantité, prix, options)
  const updateProduct = (
    uniqueId: string,
    field: keyof ProductItem,
    value: any,
  ) => {
    setProducts(
      products.map((p) =>
        p.uniqueId === uniqueId ? { ...p, [field]: value } : p,
      ),
    );
  };

  // Supprimer un produit de la liste
  const removeProduct = (uniqueId: string) => {
    setProducts(products.filter((p) => p.uniqueId !== uniqueId));
  };

  // Gestion de l'upload fichier
  const handleFileUpload = async (uniqueId: string, file: File) => {
    setUploadingId(uniqueId);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadOrderFile(formData);
      if (res.success && res.url) {
        updateProduct(uniqueId, "file", {
          url: res.url,
          filename: res.filename || file.name,
          type: res.type || file.type,
        });
      } else {
        alert("Erreur upload: " + res.message);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur technique lors de l'upload.");
    } finally {
      setUploadingId(null);
    }
  };

  // Calcul du total global
  const calculateTotal = () => {
    return products.reduce((acc, p) => {
      const textOptionPrice = p.hasCustomText ? 10 : 0;
      const subTotal = (p.unitPrice + textOptionPrice) * p.quantity;
      return acc + subTotal;
    }, 0);
  };

  // 🔑 SAUVEGARDE : On envoie les données au parent avant de changer de page
  const handleNext = () => {
    onChange({ products });
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      {/* ... (Stepper et titre restent identiques) */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div>
        <h2 className="text-2xl font-bold ">Produits de la commande</h2>
        <p className="text-sm text-muted-foreground mt-1">
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
                <SelectTrigger id="select-product" className="w-full h-11 ">
                  <SelectValue placeholder="Sélectionner un produit à ajouter" />
                </SelectTrigger>
                <SelectContent>
                  {productsCatalog.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.name} - {(prod.priceCents / 100).toFixed(2)} €
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Button
            onClick={addProduct}
            className=" shrink-0  "
            disabled={!selectedProductKey}
          >
            <Plus className="h-5 w-5 " />
          </Button>
        </div>

        {/* --- Liste des produits --- */}
        {/* (Le reste du rendu est identique, j'utilise juste products qui est déjà à jour) */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center text-gray-400 ">
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

              const isUploading = uploadingId === item.uniqueId;

              return (
                <div
                  key={item.uniqueId}
                  className="border border-gray-200 rounded-lg p-6  shadow-sm space-y-6"
                >
                  {/* Header Carte : Titre + Prix Unitaire + Trash */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg ">{item.label}</h3>
                      <p className=" text-sm">
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
                        className="text-sm font-medium "
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
                        className="text-sm font-medium "
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
                    <Label className="text-sm font-medium ">
                      Photo / Fichier client (Optionnel - Max 10MB)
                    </Label>

                    {item.file ? (
                      // --- MODE FICHIER EXISTANT ---
                      <div className="flex items-center justify-between border rounded-lg p-3 ">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10  border rounded flex items-center justify-center overflow-hidden">
                            {item.file.type.startsWith("image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.file.url}
                                alt="Aperçu"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FileImage className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium truncate max-w-[200px]">
                              {item.file.filename}
                            </div>
                            <div className="text-xs text-muted-foreground text-green-600">
                              Téléchargé avec succès
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            updateProduct(item.uniqueId, "file", null)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      // --- MODE UPLOAD ---
                      <label
                        className={`
                          border-2 border-dashed border-slate-200 rounded-lg h-24 flex flex-col items-center justify-center
                          hover:bg-slate-50 transition-colors cursor-pointer relative
                          ${isUploading ? "opacity-50 pointer-events-none" : ""}
                       `}
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(item.uniqueId, file);
                          }}
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2 text-slate-500">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="text-xs">Envoi en cours...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6  mb-1" />
                            <span className="text-sm text-slate-500">
                              Cliquez pour ajouter une image
                            </span>
                          </>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Sous-total Item */}
                  <div className="text-right pt-2">
                    <span className="font-semibold ">
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
            <h3 className="text-xl font-bold ">
              Total produits : {calculateTotal().toFixed(2).replace(".", ",")} €
            </h3>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onBack} className="w-32">
            ← Retour
          </Button>
          {/* IMPORTANT : Utiliser handleNext pour sauvegarder */}
          <Button
            onClick={handleNext}
            className="w-32 "
            disabled={products.length === 0}
          >
            Continuer →
          </Button>
        </div>
      </div>
    </div>
  );
}
