"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schéma de base partagé pour les champs du formulaire
const CustomerFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().min(10, "Le téléphone est requis"),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  isActive: z.boolean(),
  addressLine1: z.string().min(1, "L'adresse (ligne 1) est requise"),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
});

export type CustomerFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    companyName?: string[];
    vatNumber?: string[];
    isActive?: string[];
    addressLine1?: string[];
    addressLine2?: string[];
    postalCode?: string[];
    city?: string[];
    country?: string[];
  };
  message?: string | null;
};


// --- ACTION DE CRÉATION ---
export async function createCustomer(
  previousState: CustomerFormState | undefined,
  formData: FormData,
): Promise<CustomerFormState> {
  const validatedFields = CustomerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    companyName: formData.get("companyName"),
    vatNumber: formData.get("vatNumber"),
    isActive: formData.get("isActive") === "true",
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  try {
    await prisma.customer.create({
      data: validatedFields.data,
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de créer le client." };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}


// --- ACTION DE MISE À JOUR ---
const UpdateCustomerSchema = CustomerFormSchema.extend({
  id: z.string(),
});

export async function updateCustomer(
  previousState: CustomerFormState | undefined,
  formData: FormData,
): Promise<CustomerFormState> {
  const validatedFields = UpdateCustomerSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    companyName: formData.get("companyName"),
    vatNumber: formData.get("vatNumber"),
    isActive: formData.get("isActive") === "true",
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id },
      data,
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de mettre à jour le client." };
  }

  revalidatePath(`/dashboard/customers/${id}`);
  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers/${id}`);
}
