"use client";

import { useActionState, useState } from "react";
import {
  updateCustomer,
  createCustomer,
  type CustomerFormState,
} from "@/actions/customer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CustomerFormProps = {
  customer?: {
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
};

export function OrderForm({ customer }: CustomerFormProps) {
  const isEditMode = !!customer;
  const action = isEditMode ? updateCustomer : createCustomer;

  const initialState: CustomerFormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(action, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      {isEditMode && <input type="hidden" name="id" value={customer.id} />}

      <div className="grid gap-4 md:grid-cols-2">
        {/*Switch*/}
        <input type="hidden" name="isActive" value="true" />
        {/*Nom*/}
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={customer?.name ?? ""} />
          {state.errors?.name && (
            <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>
          )}
        </div>
        {/*Email*/}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
          />
          {state.errors?.email && (
            <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
          )}
        </div>
        {/*Telephone*/}
        <div className="space-y-2">
          <Label>Téléphone</Label>
          <Input name="phone" defaultValue={customer?.phone ?? ""} />
        </div>
        {/*societé*/}
        <div className="space-y-2">
          <Label>Société</Label>
          <Input
            name="companyName"
            defaultValue={customer?.companyName ?? ""}
          />
        </div>
        {/*TVA*/}
        <div className="space-y-2">
          <Label>TVA</Label>
          <Input name="vatNumber" defaultValue={customer?.vatNumber ?? ""} />
        </div>{" "}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Adresse ligne 1</Label>
          <Input
            name="addressLine1"
            defaultValue={customer?.addressLine1 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Adresse ligne 2</Label>
          <Input
            name="addressLine2"
            defaultValue={customer?.addressLine2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Code postal</Label>
          <Input name="postalCode" defaultValue={customer?.postalCode ?? ""} />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Input name="city" defaultValue={customer?.city ?? ""} />
        </div>

        <div className="space-y-2">
          <Label>Pays</Label>
          <Input name="country" defaultValue={customer?.country ?? ""} />
        </div>
      </div>
    </form>
  );
}
