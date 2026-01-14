"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { createProduct, updateProduct } from "@/actions/product";
import { ProductFormState, ProductFormProps } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    const buttonText = isEditMode ? "Enregistrer les modifications" : "Créer le produit";
    const pendingText = isEditMode ? "Enregistrement..." : "Création...";
    return (
        <Button aria-disabled={pending} type="submit" className="w-full sm:w-auto">
            {pending ? pendingText : buttonText}
        </Button>
    );
}

export function ProductForm({ product }: ProductFormProps) {
    const isEditMode = !!product;
    const action = isEditMode ? updateProduct : createProduct;

    const initialState: ProductFormState = { errors: {}, message: null };
    const [state, dispatch] = useActionState(action, initialState);

    const [isActive, setIsActive] = useState<boolean>(product?.isActive ?? true);

    // Ajout pour la preview instantanée :
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Libère les URL en mémoire si le composant démonte ou un nouveau fichier remplace l'ancien
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Quand on sélectionne un fichier, on génère l’URL temporaire pour prévisualiser
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const imageToShow = previewUrl || product?.imageUrl;

    return (
        <form action={dispatch} className="space-y-6">
            {isEditMode && <input type="hidden" name="id" value={product.id} />}

            {/* Container */}
            <div className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={product?.name ?? ""}
                            required
                            placeholder="Ex: Hoodie Premium"
                            className={state.errors?.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {state.errors?.name && (
                            <p className="text-sm text-red-600 -mt-2">{state.errors.name[0]}</p>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="sku">SKU (Référence unique)</Label>
                        <Input
                            id="sku"
                            name="sku"
                            defaultValue={product?.sku ?? ""}
                            placeholder="Ex: HD-PRM-BLK-M"
                            className={state.errors?.sku ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {state.errors?.sku && (
                            <p className="text-sm text-red-600 -mt-2">{state.errors.sku[0]}</p>
                        )}
                    </Field>
                </div>

                <Field>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product?.description ?? ""}
                        rows={4}
                        placeholder="Description du produit..."
                        className={state.errors?.description ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {state.errors?.description && (
                        <p className="text-sm text-red-600 -mt-2">{state.errors.description[0]}</p>
                    )}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                        <Label htmlFor="imageFile">Image du produit</Label>

                        {/* Preview dynamique */}
                        {imageToShow && (
                            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-background">
                                    <Image
                                        src={imageToShow}
                                        alt={product?.name ?? "Image produit"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {product?.name ?? "Image actuelle"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {previewUrl ? "Prévisualisation (non enregistrée)" : "Aperçu de l’image enregistrée"}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Input
                            id="imageFile"
                            name="imageFile"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className={state.errors?.imageFile ? "border-red-500 focus-visible:ring-red-500" : ""}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <p className="text-xs text-muted-foreground -mt-2">
                            PNG/JPEG/WEBP — max 2MB.
                        </p>
                        {state.errors?.imageFile && (
                            <p className="text-sm text-red-600 -mt-2">{state.errors.imageFile[0]}</p>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="priceCents">Prix (en centimes)</Label>
                        <Input
                            id="priceCents"
                            name="priceCents"
                            type="number"
                            defaultValue={product?.priceCents ?? 0}
                            required
                            className={state.errors?.priceCents ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {state.errors?.priceCents && (
                            <p className="text-sm text-red-600 -mt-2">{state.errors.priceCents[0]}</p>
                        )}

                        {/* Switch juste en dessous du prix */}
                        <div className="rounded-xl border p-4 flex items-center justify-between mt-5">
                            <div>
                                <p className="text-sm font-medium">Statut</p>
                                <p className="text-xs text-muted-foreground">
                                    {isActive ? "Le produit est visible" : "Le produit est masqué"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                                <input type="hidden" name="isActive" value={String(isActive)} />
                                <Label htmlFor="isActive" className="text-sm text-muted-foreground cursor-pointer">
                                    {isActive ? "Actif" : "Inactif"}
                                </Label>
                            </div>
                        </div>
                    </Field>
                </div>
            </div>

            {/* Footer actions */}
            <div className="p-5 sm:p-6 border-t flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {state.message && (
                        <p className="text-sm text-red-600 -mt-2">{state.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <SubmitButton isEditMode={isEditMode} />
                </div>
            </div>
        </form>
    );
}