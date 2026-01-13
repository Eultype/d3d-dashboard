"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- 1. VOTRE FONCTION EXISTANTE (Recherche) ---
export async function searchCustomers(query: string) {
  if (!query || query.length < 2) return [];

  return prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true, // J'ajoute ces champs car on en a besoin pour l'affichage
    },
  });
}

// --- 2. LE SCHEMA DE VALIDATION (Optionnel mais recommandé) ---
const customerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// --- 3. LA FONCTION QUE VOUS DEVEZ AJOUTER (Création) ---
// Cette fonction est appelée par votre handleSubmit du Step 4
export async function createCustomer(prevState: any, formData: FormData) {
  // 1. Extraction des données du FormData
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    companyName: formData.get("companyName"),
    vatNumber: formData.get("vatNumber"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
    isActive: true, // Par défaut
  };

  // 2. Validation
  const validatedFields = customerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Erreur de validation",
    };
  }

  try {
    // 3. Création en base de données
    const newCustomer = await prisma.customer.create({
      data: validatedFields.data,
    });

    revalidatePath("/dashboard/customers");

    // 🚨 C'EST ICI LE POINT CRUCIAL :
    // On retourne l'objet newCustomer pour que le front puisse récupérer son ID
    return {
      success: true,
      message: "Client créé",
      newCustomer: newCustomer.id,
    };
  } catch (error) {
    console.error("Erreur création client:", error);
    return {
      message: "Erreur lors de la création du client en base de données.",
    };
  }
}
