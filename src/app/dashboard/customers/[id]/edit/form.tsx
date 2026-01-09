// src/app/dashboard/customers/[id]/edit/form.tsx
"use client";

import { useState } from "react";
import { updateCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CustomerEditForm({
                                             customer,
                                         }: {
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        companyName: string;
        vatNumber: string;
        isActive: boolean;
        addressLine1: string;
        addressLine2: string;
        postalCode: string;
        city: string;
        country: string;
    };
}) {
    const [pending, setPending] = useState(false);

    const [isActive, setIsActive] = useState<boolean>(customer.isActive);

    async function onSubmit(formData: FormData) {
        setPending(true);

        const active = formData.get("isActive") === "true";

        await updateCustomer(customer.id, {
            name: (formData.get("name") as string) || null,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            companyName: (formData.get("companyName") as string) || null,
            vatNumber: (formData.get("vatNumber") as string) || null,
            isActive: active,
            addressLine1: (formData.get("addressLine1") as string) || null,
            addressLine2: (formData.get("addressLine2") as string) || null,
            postalCode: (formData.get("postalCode") as string) || null,
            city: (formData.get("city") as string) || null,
            country: (formData.get("country") as string) || null,
        });

        setPending(false);
    }

    return (
        <form action={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input name="name" defaultValue={customer.name} />
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" defaultValue={customer.email} />
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
                    <Switch checked={isActive} onCheckedChange={setIsActive} />

                    <input type="hidden" name="isActive" value={isActive ? "true" : "false"} />

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

            <div className="flex justify-end">
                <Button disabled={pending} type="submit">
                    {pending ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </form>
    );
}
