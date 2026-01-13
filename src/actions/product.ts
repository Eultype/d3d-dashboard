"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schéma de validation pour le formulaire produit
const ProductFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom du produit doit contenir au moins 2 caractères." }),
  sku: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  priceCents: z.coerce.number().int().min(0, { message: "Le prix doit être un nombre positif." }),
  isActive: z.boolean(),
});

// Type pour l'état du formulaire
export type ProductFormState = {
  errors?: {
    name?: string[];
    sku?: string[];
    description?: string[];
    imageUrl?: string[];
    priceCents?: string[];
  };
  message?: string;
};

// --- ACTION DE CRÉATION ---
export async function createProduct(
  previousState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const validatedFields = ProductFormSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    priceCents: formData.get("priceCents"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  try {
    await prisma.product.create({
      data: validatedFields.data,
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de créer le produit." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}


// --- ACTION DE MISE À JOUR ---
const UpdateProductSchema = ProductFormSchema.extend({
  id: z.string(),
});

export async function updateProduct(
  previousState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const validatedFields = UpdateProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    priceCents: formData.get("priceCents"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de mettre à jour le produit." };
  }

  revalidatePath(`/dashboard/products/${id}`);
  revalidatePath("/dashboard/products");
  redirect(`/dashboard/products/${id}`);
}
