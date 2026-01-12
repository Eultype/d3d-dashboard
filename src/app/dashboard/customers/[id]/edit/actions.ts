"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Définition du schéma de validation avec Zod
const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  isActive: z.boolean(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
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
  message?: string;
};

// 2. Mise à jour de la fonction pour qu'elle soit une Server Action complète
export async function updateCustomer(
  previousState: CustomerFormState | undefined,
  formData: FormData,
): Promise<CustomerFormState> {

  // 3. Validation des données du formulaire
  const validatedFields = CustomerSchema.safeParse({
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

  // 4. Si la validation échoue, on retourne les erreurs
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, ...data } = validatedFields.data;

  // 5. Si la validation réussit, on met à jour la base de données
  try {
    await prisma.customer.update({
      where: { id },
      data,
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de mettre à jour le client." };
  }

  // 6. On invalide le cache et on redirige
  revalidatePath(`/dashboard/customers/${id}`);
  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers/${id}`);
}