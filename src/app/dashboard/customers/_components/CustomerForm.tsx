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
import { Label } from "@/components/ui/label";

// Bouton de soumission (Envoyer)
function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
    const { pending } = useFormStatus();
    const buttonText = isEditMode ? "Enregistrer" : "Créer le client";
    const pendingText = isEditMode ? "Enregistrement..." : "Création...";
    return (
        <Button aria-disabled={pending} type="submit">
            {pending ? pendingText : buttonText}
        </Button>
    );
}

// Page formulaire de création d'un client
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


    return (
        <form action={dispatch} className="space-y-6">
            {/* Champ caché pour l’id en mode édition */}
            {isEditMode && <input type="hidden" name="id" value={customer.id} />}

            {/* Bloc 1: Infos principales */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Nom */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" name="name" defaultValue={customer?.name ?? ""} />
                    {/* Message d’erreur pour “nom” */}
                    {state.errors?.name && <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} />
                    {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={customer?.phone ?? ""} />
                    {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone[0]}</p>}
                </div>

                {/* Société */}
                <div className="space-y-2">
                    <Label htmlFor="companyName">Société</Label>
                    <Input id="companyName" name="companyName" defaultValue={customer?.companyName ?? ""} />
                    {state.errors?.companyName && <p className="text-sm text-red-600 mt-1">{state.errors.companyName[0]}</p>}
                </div>

                {/* Numéro de TVA */}
                <div className="space-y-2">
                    <Label htmlFor="vatNumber">TVA</Label>
                    <Input id="vatNumber" name="vatNumber" defaultValue={customer?.vatNumber ?? ""} />
                    {state.errors?.vatNumber && <p className="text-sm text-red-600 mt-1">{state.errors.vatNumber[0]}</p>}
                </div>

                {/* Statut actif/inactif */}
                <div className="flex items-center gap-3 pt-6">
                    <Switch checked={isActive} onCheckedChange={setIsActive} name="isActiveSwitch" />
                    <input type="hidden" name="isActive" value={String(isActive)} />
                    <span className="text-sm text-muted-foreground">
                        Client {isActive ? "actif" : "inactif"}
                    </span>
                    {state.errors?.isActive && <p className="text-sm text-red-600 mt-1">{state.errors.isActive[0]}</p>}
                </div>
            </div>

            {/* Bloc 2 : Adresse */}
            <div className="grid gap-4 md:grid-cols-2 mt-6">
                {/* Adresse ligne 1 */}
                <div className="space-y-2">
                    <Label htmlFor="addressLine1">Adresse ligne 1</Label>
                    <Input id="addressLine1" name="addressLine1" defaultValue={customer?.addressLine1 ?? ""} />
                    {state.errors?.addressLine1 && <p className="text-sm text-red-600 mt-1">{state.errors.addressLine1[0]}</p>}
                </div>

                {/* Adresse ligne 2 */}
                <div className="space-y-2">
                    <Label htmlFor="addressLine2">Adresse ligne 2</Label>
                    <Input id="addressLine2" name="addressLine2" defaultValue={customer?.addressLine2 ?? ""} />
                    {state.errors?.addressLine2 && <p className="text-sm text-red-600 mt-1">{state.errors.addressLine2[0]}</p>}
                </div>

                {/* Code postal */}
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" name="postalCode" defaultValue={customer?.postalCode ?? ""} />
                    {state.errors?.postalCode && <p className="text-sm text-red-600 mt-1">{state.errors.postalCode[0]}</p>}
                </div>

                {/* Ville */}
                <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" name="city" defaultValue={customer?.city ?? ""} />
                    {state.errors?.city && <p className="text-sm text-red-600 mt-1">{state.errors.city[0]}</p>}
                </div>

                {/* Pays */}
                <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" name="country" defaultValue={customer?.country ?? ""} />
                    {state.errors?.country && <p className="text-sm text-red-600 mt-1">{state.errors.country[0]}</p>}
                </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex items-center justify-end mt-6">
                <SubmitButton isEditMode={isEditMode} />
            </div>
        </form>
    );
}