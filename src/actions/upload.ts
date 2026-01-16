"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function uploadOrderFile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, message: "Aucun fichier fourni." };
  }

  // Validation basique (Image uniquement pour l'instant)
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Seules les images sont acceptées." };
  }

  // Limitation taille (ex: 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, message: "Fichier trop volumineux (max 10MB)." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Génération d'un nom unique : uuid-nom_original
    // On nettoie le nom original pour éviter les soucis de caractères spéciaux
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${randomUUID()}-${safeName}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads/orders");
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/orders/${fileName}`;

    return { 
      success: true, 
      url: publicUrl, 
      filename: file.name,
      type: file.type 
    };

  } catch (error) {
    console.error("Erreur upload:", error);
    return { success: false, message: "Erreur lors de l'enregistrement du fichier." };
  }
}
