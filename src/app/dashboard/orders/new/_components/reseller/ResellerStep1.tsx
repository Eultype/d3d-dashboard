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
import { OrderDraft, ProductItem, ProductFromDB } from "@/types/order";
import { uploadOrderFile } from "@/actions/upload";

type Props = {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
  onNext: () => void;
  productsCatalog: ProductFromDB[];
};

const steps = [
  { number: 1, label: "Produits" },
  { number: 2, label: "Validation" },
];

export default function ResellerStep1({
  draft,
  onChange,
  onNext,
  productsCatalog,
}: Props) {
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>(draft.products || []);

  const addProduct = () => {
    if (selectedProductKey) {
      const original = productsCatalog.find((p) => p.id === selectedProductKey);
      if (original) {
        const newProduct: ProductItem = {
          uniqueId: Math.random().toString(36).substr(2, 9),
          typeId: original.id,
          label: original.name,
          unitPrice: original.priceCents / 100,
          quantity: 1,
          hasCustomText: false,
          needs3D: false,
          files: [],
        };
        setProducts([...products, newProduct]);
        setSelectedProductKey(null);
      }
    }
  };

  const updateProduct = <K extends keyof ProductItem>(
    uniqueId: string,
    field: K,
    value: ProductItem[K] | ((prev: ProductItem[K]) => ProductItem[K]),
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.uniqueId === uniqueId) {
          const newValue = typeof value === "function"
              ? (value as (prev: ProductItem[K]) => ProductItem[K])(p[field])
              : value;
          return { ...p, [field]: newValue };
        }
        return p;
      }),
    );
  };

  const removeProduct = (uniqueId: string) => {
    setProducts((prev) => prev.filter((p) => p.uniqueId !== uniqueId));
  };

  const handleFileUpload = async (uniqueId: string, file: File) => {
    setUploadingId(uniqueId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadOrderFile(formData);
      if (res.success && res.url) {
        const newFile = {
          url: res.url,
          filename: res.filename || file.name,
          type: res.type || file.type,
        };
        updateProduct(uniqueId, "files", (currentFiles) => [
          ...(currentFiles || []),
          newFile,
        ]);
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

  const removeFile = (uniqueId: string, fileUrl: string) => {
    updateProduct(uniqueId, "files", (currentFiles) =>
      (currentFiles || []).filter((f) => f.url !== fileUrl),
    );
  };

  const calculateTotal = () => {
    return products.reduce((acc, p) => {
      const textOptionPrice = p.hasCustomText ? 10 : 0;
      return acc + (p.unitPrice + textOptionPrice) * p.quantity;
    }, 0);
  };

  const handleNext = () => {
    onChange({ products });
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      <div className="pb-2">
        <Stepper steps={steps} currentStep={1} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Sélection des produits</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ajoutez les produits à votre commande revendeur
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Field>
              <FieldLabel htmlFor="select-product">Sélectionner un produit</FieldLabel>
              <Select value={selectedProductKey || ""} onValueChange={setSelectedProductKey}>
                <SelectTrigger id="select-product" className="w-full h-11">
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
          <Button onClick={addProduct} className="shrink-0" disabled={!selectedProductKey}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center text-gray-400">
              <h3 className="font-medium">Votre panier est vide</h3>
              <p className="text-sm mt-1">Sélectionnez un produit ci-dessus pour commencer</p>
            </div>
          ) : (
            products.map((item) => {
              const itemSubTotal = (item.unitPrice + (item.hasCustomText ? 10 : 0)) * item.quantity;
              const isUploading = uploadingId === item.uniqueId;

              return (
                <div key={item.uniqueId} className="border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.label}</h3>
                      <p className="text-sm">{item.unitPrice.toFixed(2)} € / unité</p>
                    </div>
                    <button onClick={() => removeProduct(item.uniqueId)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`qty-${item.uniqueId}`} className="text-sm font-medium">Quantité</Label>
                      <Input
                        id={`qty-${item.uniqueId}`}
                        type="number"
                        min={1}
                        className="bg-gray-50 border-gray-200 h-11"
                        value={item.quantity}
                        onChange={(e) => updateProduct(item.uniqueId, "quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`price-${item.uniqueId}`} className="text-sm font-medium">Prix unitaire (€)</Label>
                      <Input
                        id={`price-${item.uniqueId}`}
                        type="number"
                        className="bg-gray-100 border-gray-200 h-11 font-medium cursor-not-allowed"
                        value={item.unitPrice}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${item.uniqueId}`}
                        checked={item.hasCustomText}
                        onCheckedChange={(checked) => updateProduct(item.uniqueId, "hasCustomText", checked === true)}
                      />
                      <label htmlFor={`custom-${item.uniqueId}`} className="text-sm font-medium leading-none">
                        Texte personnalisé (+10,00 €)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`3d-${item.uniqueId}`}
                        checked={item.needs3D}
                        onCheckedChange={(checked) => updateProduct(item.uniqueId, "needs3D", checked === true)}
                      />
                      <label htmlFor={`3d-${item.uniqueId}`} className="text-sm font-medium leading-none">
                        Nécessite sous-traitance 3D
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Photos / Fichiers client (Optionnel)</Label>
                    <div className="space-y-2">
                      {item.files && item.files.length > 0 && item.files.map((fileItem, idx) => (
                        <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 border rounded flex items-center justify-center overflow-hidden">
                              {fileItem.type.startsWith("image/") ? (
                                <img src={fileItem.url} alt="Aperçu" className="h-full w-full object-cover" />
                              ) : (
                                <FileImage className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <div className="text-sm">
                              <div className="font-medium truncate max-w-[200px]">{fileItem.filename}</div>
                              <div className="text-xs text-green-600">Téléchargé</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(item.uniqueId, fileItem.url)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <label className={`border-2 border-dashed border-slate-200 rounded-lg h-24 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                        if (e.target.files) Array.from(e.target.files).forEach((file) => handleFileUpload(item.uniqueId, file));
                      }} />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-xs">Envoi...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 mb-1 text-slate-400" />
                          <span className="text-sm text-slate-600">Cliquez pour ajouter des fichiers</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="text-right pt-2">
                    <span className="font-semibold">Sous-total : {itemSubTotal.toFixed(2).replace(".", ",")} €</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {products.length > 0 && (
          <div className="flex justify-end pt-4">
            <h3 className="text-xl font-bold">Total produits : {calculateTotal().toFixed(2).replace(".", ",")} €</h3>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <Button onClick={handleNext} className="w-32" disabled={products.length === 0}>
            Suivant →
          </Button>
        </div>
      </div>
    </div>
  );
}
