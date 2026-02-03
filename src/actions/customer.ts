"use server";

import { prisma } from "@/lib/services/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CustomerFormState } from "@/types/customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Schéma de base partagé pour les champs du formulaire
const CustomerFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }).nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  vatNumber: z.string().nullable().optional(),
  isActive: z.boolean(),
  addressLine1: z.string().min(1, "L'adresse (ligne 1) est requise"),
  addressLine2: z.string().nullable().optional(),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
});


// --- HELPERS ---

/**
 * Extrait et nettoie les données du FormData pour le schéma Customer
 */
function parseCustomerFormData(formData: FormData) {
  const getOptional = (key: string) => {
    const val = formData.get(key) as string;
    return val?.trim() === "" ? null : val;
  };

  return {
    name: formData.get("name") as string,
    email: getOptional("email"),
    phone: getOptional("phone"),
    companyName: getOptional("companyName"),
    vatNumber: getOptional("vatNumber"),
    isActive: formData.get("isActive") === "true",
    addressLine1: formData.get("addressLine1") as string,
    addressLine2: getOptional("addressLine2"),
    postalCode: formData.get("postalCode") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
  };
}

// --- ACTION DE CRÉATION ---
export async function createCustomer(
  previousState: CustomerFormState | undefined,
  formData: FormData,
): Promise<CustomerFormState> {
  // BLINDAGE SÉCURITÉ
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Non autorisé. Droits administrateur requis." };
  }

  const data = parseCustomerFormData(formData);
  const validatedFields = CustomerFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  try {
    const customer = await prisma.customer.create({
      data: validatedFields.data,
    });
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Client créé avec succès.", customerId: customer.id };
  } catch (error) {
    console.error("❌ [createCustomer] Error:", error);
    return { message: "Erreur de base de données : Impossible de créer le client." };
  }
}


// --- ACTION DE MISE À JOUR ---
const UpdateCustomerSchema = CustomerFormSchema.extend({
  id: z.string(),
});

export async function updateCustomer(
  previousState: CustomerFormState | undefined,
  formData: FormData,
): Promise<CustomerFormState> {
  // BLINDAGE SÉCURITÉ
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Non autorisé. Droits administrateur requis." };
  }

  const data = {
    ...parseCustomerFormData(formData),
    id: formData.get("id") as string,
  };

  const validatedFields = UpdateCustomerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, ...updateData } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath(`/dashboard/customers/${id}`);
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Client mis à jour avec succès." };
  } catch (error) {
    console.error("❌ [updateCustomer] Error:", error);
    return { message: "Erreur de base de données : Impossible de mettre à jour le client." };
  }
}