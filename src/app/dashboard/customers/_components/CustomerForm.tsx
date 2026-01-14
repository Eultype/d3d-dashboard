"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateCustomer, createCustomer } from "@/actions/customer";
import { CustomerFormState, CustomerFormProps } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export function CustomerForm({ customer }: CustomerFormProps) {
    const isEditMode = !!customer;
    const action = isEditMode ? updateCustomer : createCustomer;

    const initialState: CustomerFormState = { errors: {}, message: null };
    const [state, dispatch] = useActionState(action, initialState);

    const [isActive, setIsActive] = useState<boolean>(customer?.isActive ?? true);

    return (
        <form action={dispatch} className="space-y-6">
            {isEditMode && <input type="hidden" name="id" value={customer.id} />}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" name="name" defaultValue={customer?.name ?? ""} />
                    {state.errors?.name && <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} />
                    {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={customer?.phone ?? ""} />
                    {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyName">Société</Label>
                    <Input id="companyName" name="companyName" defaultValue={customer?.companyName ?? ""} />
                    {state.errors?.companyName && <p className="text-sm text-red-600 mt-1">{state.errors.companyName[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vatNumber">TVA</Label>
                    <Input id="vatNumber" name="vatNumber" defaultValue={customer?.vatNumber ?? ""} />
                    {state.errors?.vatNumber && <p className="text-sm text-red-600 mt-1">{state.errors.vatNumber[0]}</p>}
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <Switch checked={isActive} onCheckedChange={setIsActive} name="isActiveSwitch" />
                    <input type="hidden" name="isActive" value={String(isActive)} />
                    <span className="text-sm text-muted-foreground">
      Client {isActive ? "actif" : "inactif"}
    </span>
                    {state.errors?.isActive && <p className="text-sm text-red-600 mt-1">{state.errors.isActive[0]}</p>}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="space-y-2">
                    <Label htmlFor="addressLine1">Adresse ligne 1</Label>
                    <Input id="addressLine1" name="addressLine1" defaultValue={customer?.addressLine1 ?? ""} />
                    {state.errors?.addressLine1 && <p className="text-sm text-red-600 mt-1">{state.errors.addressLine1[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="addressLine2">Adresse ligne 2</Label>
                    <Input id="addressLine2" name="addressLine2" defaultValue={customer?.addressLine2 ?? ""} />
                    {state.errors?.addressLine2 && <p className="text-sm text-red-600 mt-1">{state.errors.addressLine2[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" name="postalCode" defaultValue={customer?.postalCode ?? ""} />
                    {state.errors?.postalCode && <p className="text-sm text-red-600 mt-1">{state.errors.postalCode[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" name="city" defaultValue={customer?.city ?? ""} />
                    {state.errors?.city && <p className="text-sm text-red-600 mt-1">{state.errors.city[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" name="country" defaultValue={customer?.country ?? ""} />
                    {state.errors?.country && <p className="text-sm text-red-600 mt-1">{state.errors.country[0]}</p>}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div>
                    {state.message && <p className="text-sm text-red-600">{state.message}</p>}
                </div>
                <div className="flex justify-end">
                    <SubmitButton isEditMode={isEditMode} />
                </div>
            </div>
        </form>
    );
}
