"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateCustomer, type CustomerFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button aria-disabled={pending} type="submit">
            {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
    );
}

export default function CustomerEditForm({ customer }: { customer: { id: string; name: string; email: string; phone: string; companyName: string; vatNumber: string; isActive: boolean; addressLine1: string; addressLine2: string; postalCode: string; city: string; country: string; }; }) {
    const initialState: CustomerFormState = { errors: {}, message: null };
    const [state, dispatch] = useActionState(updateCustomer, initialState);

    const [isActive, setIsActive] = useState<boolean>(customer.isActive);

    return (
        <form action={dispatch} className="space-y-6">
            <input type="hidden" name="id" value={customer.id} />

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" name="name" defaultValue={customer.name} />
                    {state.errors?.name && <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={customer.email} />
                    {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input name="phone" defaultValue={customer.phone} />
                </div>

                <div className="space-y-2">
                    <Label>Société</Label>
                    <Input name="companyName" defaultValue={customer.companyName} />
                </div>

                <div className="space-y-2">
                    <Label>TVA</Label>
                    <Input name="vatNumber" defaultValue={customer.vatNumber} />
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <Switch checked={isActive} onCheckedChange={setIsActive} name="isActiveSwitch" />
                    <input type="hidden" name="isActive" value={String(isActive)} />
                    <span className="text-sm text-muted-foreground">
                        Client {isActive ? "actif" : "inactif"}
                    </span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Adresse ligne 1</Label>
                    <Input name="addressLine1" defaultValue={customer.addressLine1} />
                </div>

                <div className="space-y-2">
                    <Label>Adresse ligne 2</Label>
                    <Input name="addressLine2" defaultValue={customer.addressLine2} />
                </div>

                <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input name="postalCode" defaultValue={customer.postalCode} />
                </div>

                <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input name="city" defaultValue={customer.city} />
                </div>

                <div className="space-y-2">
                    <Label>Pays</Label>
                    <Input name="country" defaultValue={customer.country} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    {state.message && <p className="text-sm text-red-600">{state.message}</p>}
                </div>
                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}