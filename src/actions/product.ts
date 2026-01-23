"use server";

import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProductFormState } from "@/types/product";

// --- HELPERS ---

/**
 * Extrait et nettoie les données du FormData pour le schéma Product
 */
function parseProductFormData(formData: FormData) {
  return {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    dimensions: (formData.get("dimensions") as string) || null,
    category: (formData.get("category") as string) || null,
    priceCents: formData.get("priceCents"),
    status: (formData.get("status") as string) || "AVAILABLE",
    imageFile: formData.get("imageFile") as File,
  };
}

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

// Le schéma existant, mis à jour
const ProductFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom du produit doit contenir au moins 2 caractères." }),
  sku: z.string().min(1, { message: "Le SKU est requis." }),
  dimensions: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  imageFile: ImageSchema,
  priceCents: z.coerce.number().int().min(0, { message: "Le prix doit être un nombre positif." }),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "HIDDEN"]),
});

// Fonction helper pour gérer l'upload vers Cloudinary
async function uploadImage(imageFile: File | undefined | null, productName: string): Promise<string | null> {
    if (!imageFile || imageFile.size === 0) {
        return null;
    }
    
    try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "d3d/products",
                    public_id: `${slugify(productName)}-${Date.now()}`,
                    resource_type: "image",
                    overwrite: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        }) as any;

        return uploadResponse.secure_url;
    } catch (error) {
        console.error("❌ [uploadImage] Cloudinary Error:", error);
        return null;
    }
}


// --- ACTION DE CRÉATION ---
export async function createProduct(
  previousState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const data = parseProductFormData(formData);
  const validatedFields = ProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { imageFile, ...productData } = validatedFields.data;
  const imageUrl = await uploadImage(imageFile, productData.name);

  try {
    const product = await prisma.product.create({
      data: {
        ...productData,
        imageUrl: imageUrl,
      },
    });
    revalidatePath("/dashboard/products");
    return { success: true, message: "Produit créé avec succès.", productId: product.id };
  } catch (error) {
    console.error("❌ [createProduct] Error:", error);
    return { message: "Erreur de base de données : Impossible de créer le produit." };
  }
}


// --- ACTION DE MISE À JOUR ---
const UpdateProductSchema = ProductFormSchema.extend({
  id: z.string(),
});

export async function updateProduct(
  previousState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const data = {
    ...parseProductFormData(formData),
    id: formData.get("id") as string,
  };

  const validatedFields = UpdateProductSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation. Veuillez corriger les champs en erreur.",
    };
  }

  const { id, imageFile, ...updateData } = validatedFields.data;
  const newImageUrl = await uploadImage(imageFile, updateData.name);

  try {
    // Mise à jour en base
    await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(newImageUrl && { imageUrl: newImageUrl }),
      },
    });

    revalidatePath(`/dashboard/products/${id}`);
    revalidatePath("/dashboard/products");
    return { success: true, message: "Produit mis à jour avec succès." };
  } catch (error) {
    console.error("❌ [updateProduct] Error:", error);
    return { message: "Erreur de base de données : Impossible de mettre à jour le produit." };
  }
}
