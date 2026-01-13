"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
// Note: les actions seront créées à l'étape suivante, l'import est en anticipation
import { createProduct, updateProduct, type ProductFormState } from "@/actions/product"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

type ProductForForm = {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    imageUrl: string | null;
    priceCents: number;
    isActive: boolean;
};

type ProductFormProps = {
    product?: ProductForForm;
};

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

    return (
        <form action={dispatch} className="space-y-6">
            {isEditMode && <input type="hidden" name="id" value={product.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input id="name" name="name" defaultValue={product?.name ?? ""} required />
                    {state.errors?.name && <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>}
                </Field>

                <Field>
                    <Label htmlFor="sku">SKU (Référence unique)</Label>
                    <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
                    {state.errors?.sku && <p className="text-sm text-red-600 mt-1">{state.errors.sku[0]}</p>}
                </Field>
            </div>

            <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={4} placeholder="Description du produit..."/>
                {state.errors?.description && <p className="text-sm text-red-600 mt-1">{state.errors.description[0]}</p>}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                    <Label htmlFor="imageUrl">URL de l&apos;image</Label>
                    <Input id="imageUrl" name="imageUrl" defaultValue={product?.imageUrl ?? ""} placeholder="https://..." />
                    {state.errors?.imageUrl && <p className="text-sm text-red-600 mt-1">{state.errors.imageUrl[0]}</p>}
                </Field>

                <Field>
                    <Label htmlFor="priceCents">Prix (en centimes)</Label>
                    <Input id="priceCents" name="priceCents" type="number" defaultValue={product?.priceCents ?? 0} required />
                    {state.errors?.priceCents && <p className="text-sm text-red-600 mt-1">{state.errors.priceCents[0]}</p>}
                </Field>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <input type="hidden" name="isActive" value={String(isActive)} />
                <Label htmlFor="isActive" className="text-sm text-muted-foreground cursor-pointer">
                    Produit {isActive ? "actif" : "inactif"}
                </Label>
            </div>

            <div className="flex items-center justify-between pt-4">
                <div>
                    {state.message && <p className="text-sm text-red-600">{state.message}</p>}
                </div>
                <div className="flex justify-end w-full">
                    <SubmitButton isEditMode={isEditMode} />
                </div>
            </div>
        </form>
    );
}
