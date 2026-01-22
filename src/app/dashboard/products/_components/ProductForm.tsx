"use client";

// Import React
import { useActionState, useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
// Import Next
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
// Import action
import { createProduct, updateProduct } from "@/actions/product";
// Import types
import { ProductFormState, ProductFormProps } from "@/types/product";
// Import composant
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";

// Bouton de soumission (Envoyer)
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    const buttonText = isEditMode ? "Enregistrer les modifications" : "Créer le produit";
    const pendingText = isEditMode ? "Enregistrement..." : "Création...";
    return (
        <Button aria-disabled={pending} type="submit" className="min-w-[150px]">
            {pending ? pendingText : buttonText}
        </Button>
    );
}

// Page formulaire de création mise à jour d'un produit
export function ProductForm({ product }: ProductFormProps) {
    const isEditMode = !!product;
    const action = isEditMode ? updateProduct : createProduct;
    const router = useRouter();

    const initialState: ProductFormState = { errors: {}, message: null, success: false };
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

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            if (isEditMode) {
                router.push(`/dashboard/products/${product?.id}`);
            } else {
                router.push(`/dashboard/products/${state.productId}`);
            }
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, isEditMode, router, product?.id]);

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

    const formatErrors = (errors?: string[]) => errors?.map(m => ({ message: m }));
    const imageToShow = previewUrl || product?.imageUrl;

    return (
        <form action={dispatch} className="space-y-8">
            {isEditMode && <input type="hidden" name="id" value={product.id} />}

            {/* Bloc 1: Informations principales */}
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom */}
                        <Field>
                            <FieldLabel htmlFor="name">Nom du produit *</FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={product?.name ?? ""}
                                required
                                placeholder="Ex: Hoodie Premium"
                            />
                            <FieldError errors={formatErrors(state.errors?.name)} />
                        </Field>

                        {/* SKU */}
                        <Field>
                            <FieldLabel htmlFor="sku">SKU (Référence unique) *</FieldLabel>
                            <Input
                                id="sku"
                                name="sku"
                                defaultValue={product?.sku ?? ""}
                                placeholder="Ex: HD-PRM-BLK-M"
                            />
                            <FieldError errors={formatErrors(state.errors?.sku)} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dimensions */}
                        <Field>
                            <FieldLabel htmlFor="dimensions">Dimensions</FieldLabel>
                            <Input
                                id="dimensions"
                                name="dimensions"
                                defaultValue={product?.dimensions ?? ""}
                                placeholder="Ex: 80x50x50 mm"
                            />
                            <FieldError errors={formatErrors(state.errors?.dimensions)} />
                        </Field>

                        {/* Catégorie */}
                        <Field>
                            <FieldLabel htmlFor="category">Catégorie</FieldLabel>
                            <Select name="category" defaultValue={product?.category ?? ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BLOC">Bloc</SelectItem>
                                    <SelectItem value="BLOC-CUBE">Bloc Cube</SelectItem>
                                    <SelectItem value="CADRE">Cadre</SelectItem>
                                    <SelectItem value="COEUR">Coeur</SelectItem>
                                    <SelectItem value="PRISME">Prisme</SelectItem>
                                    <SelectItem value="HORLOGE">Horloge</SelectItem>
                                    <SelectItem value="PORTE-CLES">Porte-clés</SelectItem>
                                    <SelectItem value="ACCESSOIRE">Accessoire</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={formatErrors(state.errors?.category)} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image */}
                        <Field>
                            <FieldLabel htmlFor="imageFile">Image du produit</FieldLabel>

                            {/* Preview dynamique */}
                            {imageToShow && (
                                <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3 mb-2">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-background shrink-0">
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
                                        <p className="text-[10px] text-muted-foreground">
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
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                                PNG, JPEG ou WEBP — Max 2MB.
                            </p>
                            <FieldError errors={formatErrors(state.errors?.imageFile)} />
                        </Field>

                        {/* Prix et Statut */}
                        <div className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="priceCents">Prix (en centimes) *</FieldLabel>
                                <Input
                                    id="priceCents"
                                    name="priceCents"
                                    type="number"
                                    defaultValue={product?.priceCents ?? 0}
                                    required
                                />
                                <FieldError errors={formatErrors(state.errors?.priceCents)} />
                            </Field>

                            {/* Switch statut */}
                            <div className="rounded-xl border p-4 flex items-center justify-between bg-muted/10">
                                <div>
                                    <p className="text-sm font-medium">Statut du produit</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {isActive ? "Le produit est visible dans le catalogue" : "Le produit est masqué"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Switch id="isActive-switch" checked={isActive} onCheckedChange={setIsActive} />
                                    <input type="hidden" name="isActive" value={String(isActive)} />
                                    <label htmlFor="isActive-switch" className="text-xs font-medium cursor-pointer">
                                        {isActive ? "Actif" : "Inactif"}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.back()}
                >
                    Annuler
                </Button>
                <SubmitButton isEditMode={isEditMode} />
            </div>
        </form>
    );
}
