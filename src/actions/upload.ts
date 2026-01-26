"use server";

import cloudinary from "@/lib/services/cloudinary";
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

  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Seules les images sont acceptées." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, message: "Fichier trop volumineux (max 10MB)." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload vers Cloudinary via un Promise pour gérer le stream
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "d3d/orders",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return { 
      success: true, 
      url: uploadResponse.secure_url, 
      filename: file.name,
      type: file.type 
    };

  } catch (error) {
    console.error("Erreur Cloudinary upload:", error);
    return { success: false, message: "Erreur lors de l'enregistrement sur le Cloud." };
  }
}
