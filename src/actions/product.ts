"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import { ProductFormState } from "@/types/product";

// --- Fonctions Helper ---

// Crée un nom de fichier "slug" à partir d'un texte
const slugify = (text: string) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

// Schéma pour le fichier image, avec validation de la taille et du type
const ImageSchema = z
  .instanceof(File)
  .refine((file) => file.size === 0 || file.type.startsWith("image/"), { message: "Seuls les fichiers image sont acceptés." })
  .refine((file) => file.size < 2 * 1024 * 1024, "L'image doit peser moins de 2MB.")
  .optional();

// Le schéma existant, mais avec `imageUrl` remplacé par `imageFile`
const ProductFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom du produit doit contenir au moins 2 caractères." }),
  sku: z.string().min(1, { message: "Le SKU est requis." }),
  description: z.string().optional(),
  imageFile: ImageSchema,
  priceCents: z.coerce.number().int().min(0, { message: "Le prix doit être un nombre positif." }),
  isActive: z.boolean(),
});

// Fonction helper pour gérer l'upload
async function uploadImage(imageFile: File | undefined | null, productName: string): Promise<string | null> {
    if (!imageFile || imageFile.size === 0) {
        return null;
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileExtension = path.extname(imageFile.name);
    const slug = slugify(productName);
    const filename = `${slug}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/uploads/products/${filename}`;
}


// --- ACTION DE CRÉATION ---
export async function createProduct(
  previousState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const validatedFields = ProductFormSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    isActive: formData.get("isActive") === "true",
    imageFile: formData.get("imageFile"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { imageFile, ...productData } = validatedFields.data;
  const imageUrl = await uploadImage(imageFile, productData.name);

  try {
    await prisma.product.create({
      data: {
        ...productData,
        imageUrl: imageUrl,
      },
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
    priceCents: formData.get("priceCents"),
    isActive: formData.get("isActive") === "true",
    imageFile: formData.get("imageFile"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, imageFile, ...data } = validatedFields.data;
  const imageUrl = await uploadImage(imageFile, data.name);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(imageUrl && { imageUrl: imageUrl }),
      },
    });
  } catch (error) {
    return { message: "Erreur de base de données : Impossible de mettre à jour le produit." };
  }

  revalidatePath(`/dashboard/products/${id}`);
  revalidatePath("/dashboard/products");
  redirect(`/dashboard/products/${id}`);
}