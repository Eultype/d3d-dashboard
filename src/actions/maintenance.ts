"use server";

import cloudinary from "@/lib/services/cloudinary";
import { prisma } from "@/lib/services/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type CleanupResult = {
  success: boolean;
  message: string;
};

/**
 * Nettoie les fichiers orphelins sur Cloudinary.
 * Supprime les ressources du dossier 'd3d/orders' qui ne sont plus référencées en base de données.
 */
export async function cleanupOrphanedFiles(): Promise<CleanupResult> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Accès non autorisé. Droits administrateur requis." };
  }

  console.log("🧹 Démarrage du nettoyage Cloudinary (dossier d3d/orders)...");

  try {
    // 1. Récupérer TOUTES les ressources du dossier orders sur Cloudinary
    // Note: Cloudinary limite à 1000 ressources par requête.
    const cloudinaryResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'd3d/orders/',
      max_results: 500
    });

    if (!cloudinaryResources.resources || cloudinaryResources.resources.length === 0) {
      return { success: true, message: "Aucun fichier trouvé dans le dossier d3d/orders sur Cloudinary." };
    }

    // 2. Récupérer toutes les URLs de fichiers en base de données
    const dbFileRecords = await prisma.file.findMany({
      select: { url: true }
    });
    const validUrls = new Set(dbFileRecords.map(f => f.url));

    // 3. Identifier les fichiers à supprimer
    // On ne supprime que les fichiers vieux de plus de 24h pour éviter de supprimer un upload en cours
    const NOW = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const publicIdsToDelete = cloudinaryResources.resources
      .filter((resource: any) => {
        // Si l'URL n'est pas en base ET que le fichier a plus de 24h
        const isOrphan = !validUrls.has(resource.secure_url);
        const isOldEnough = (NOW - new Date(resource.created_at).getTime()) > ONE_DAY_MS;
        return isOrphan && isOldEnough;
      })
      .map((resource: any) => resource.public_id);

    if (publicIdsToDelete.length === 0) {
      return { success: true, message: "Aucun fichier orphelin à supprimer sur Cloudinary." };
    }

    // 4. Suppression effective sur Cloudinary
    console.log(`🗑️ Suppression de ${publicIdsToDelete.length} fichiers sur Cloudinary...`);
    
    // Cloudinary permet la suppression groupée (max 100 par appel)
    const deleteResult = await cloudinary.api.delete_resources(publicIdsToDelete);

    const message = `Nettoyage terminé. ${publicIdsToDelete.length} fichier(s) supprimé(s) sur Cloudinary.`;
    console.log(`✨ ${message}`, deleteResult);
    
    return { success: true, message };

  } catch (error) {
    console.error("❌ Erreur critique lors du nettoyage Cloudinary:", error);
    if (error instanceof Error) {
        return { success: false, message: `Erreur : ${error.message}` };
    }
    return { success: false, message: "Une erreur serveur est survenue lors du nettoyage." };
  }
}