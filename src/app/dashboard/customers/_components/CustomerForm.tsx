"use client";

// Import React et hooks spécifiques
import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
// Import Next
import { useRouter } from "next/navigation";
// Import des utilitaires externes
import { toast } from "sonner";
// Import des actions liées aux clients
import { updateCustomer, createCustomer } from "@/actions/customer";
// Import des types liés au formulaire client
import { CustomerFormState, CustomerFormProps } from "@/types/customer";
// Import des composants
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";

// Bouton de soumission (Envoyer)
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    const buttonText = isEditMode ? "Enregistrer" : "Créer le client";
    const pendingText = isEditMode ? "Enregistrement..." : "Création...";
    return (
        <Button aria-disabled={pending} type="submit" className="min-w-[150px]">
            {pending ? pendingText : buttonText}
        </Button>
    );
}

// Page formulaire de création / mise à jour d'un client
export function CustomerForm({ customer }: CustomerFormProps) {
    const isEditMode = !!customer;
    const action = isEditMode ? updateCustomer : createCustomer;
    const router = useRouter();

    const initialState: CustomerFormState = { errors: {}, message: null, success: false };
    const [state, dispatch] = useActionState(action, initialState);

    const [isActive, setIsActive] = useState<boolean>(customer?.isActive ?? true);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            if (isEditMode) {
                router.push(`/dashboard/customers/${customer?.id}`);
            } else {
                router.push(`/dashboard/customers/${state.customerId}`);
            }
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, isEditMode, router, customer?.id]);

    const formatErrors = (errors?: string[]) => errors?.map(m => ({ message: m }));

    return (
        <form action={dispatch} className="space-y-8">
            {/* Champ caché pour l’id en mode édition */}
            {isEditMode && <input type="hidden" name="id" value={customer.id} />}

            {/* Section 1: Informations de contact */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Nom */}
                        <Field>
                            <FieldLabel htmlFor="name">Nom / Prénom *</FieldLabel>
                            <Input id="name" name="name" defaultValue={customer?.name ?? ""} placeholder="Ex: Jean Dupont" />
                            <FieldError errors={formatErrors(state.errors?.name)} />
                        </Field>

                        {/* Email */}
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} placeholder="jean.dupont@exemple.com" />
                            <FieldError errors={formatErrors(state.errors?.email)} />
                        </Field>

                        {/* Téléphone */}
                        <Field>
                            <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                            <Input id="phone" name="phone" type="tel" defaultValue={customer?.phone ?? ""} placeholder="+32 4XX XX XX XX" />
                            <FieldError errors={formatErrors(state.errors?.phone)} />
                        </Field>

                        {/* Société */}
                        <Field>
                            <FieldLabel htmlFor="companyName">Société</FieldLabel>
                            <Input id="companyName" name="companyName" defaultValue={customer?.companyName ?? ""} placeholder="Nom de l'entreprise (optionnel)" />
                            <FieldError errors={formatErrors(state.errors?.companyName)} />
                        </Field>

                        {/* Numéro de TVA */}
                        <Field>
                            <FieldLabel htmlFor="vatNumber">Numéro de TVA</FieldLabel>
                            <Input id="vatNumber" name="vatNumber" defaultValue={customer?.vatNumber ?? ""} placeholder="BE 0XXX.XXX.XXX" />
                            <FieldError errors={formatErrors(state.errors?.vatNumber)} />
                        </Field>

                        {/* Statut actif/inactif */}
                        <div className="flex items-center gap-3 pt-6">
                            <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive-switch" />
                            <input type="hidden" name="isActive" value={String(isActive)} />
                            <label htmlFor="isActive-switch" className="text-sm font-medium cursor-pointer">
                                Client {isActive ? "actif" : "inactif"}
                            </label>
                            <FieldError errors={formatErrors(state.errors?.isActive)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Adresse de facturation */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold px-1">Adresse de facturation</h3>
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Ligne 1 */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="addressLine1">Adresse (Ligne 1) *</FieldLabel>
                                <Input id="addressLine1" name="addressLine1" defaultValue={customer?.addressLine1 ?? ""} placeholder="Rue de l'Exemple, 123" />
                                <FieldError errors={formatErrors(state.errors?.addressLine1)} />
                            </Field>

                            {/* Ligne 2 */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="addressLine2">Adresse (Ligne 2)</FieldLabel>
                                <Input id="addressLine2" name="addressLine2" defaultValue={customer?.addressLine2 ?? ""} placeholder="Appartement, bureau, étage..." />
                                <FieldError errors={formatErrors(state.errors?.addressLine2)} />
                            </Field>

                            {/* Code postal */}
                            <Field>
                                <FieldLabel htmlFor="postalCode">Code postal *</FieldLabel>
                                <Input id="postalCode" name="postalCode" defaultValue={customer?.postalCode ?? ""} placeholder="1000" />
                                <FieldError errors={formatErrors(state.errors?.postalCode)} />
                            </Field>

                            {/* Ville */}
                            <Field>
                                <FieldLabel htmlFor="city">Ville *</FieldLabel>
                                <Input id="city" name="city" defaultValue={customer?.city ?? ""} placeholder="Bruxelles" />
                                <FieldError errors={formatErrors(state.errors?.city)} />
                            </Field>

                            {/* Pays */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="country">Pays *</FieldLabel>
                                <Input id="country" name="country" defaultValue={customer?.country ?? "Belgique"} placeholder="Belgique" />
                                <FieldError errors={formatErrors(state.errors?.country)} />
                            </Field>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                    Annuler
                </Button>
                <SubmitButton isEditMode={isEditMode} />
            </div>
        </form>
    );
}