"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

type CleanupResult = {
  success: boolean;
  message: string;
};

export async function cleanupOrphanedFiles(): Promise<CleanupResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, message: "Accès non autorisé." };
  }

  console.log("🧹 Démarrage du nettoyage des fichiers (2-sens)...");

  const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/orders");
  
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    console.log("⚠️ Dossier d'upload introuvable. Rien à nettoyer.");
    return { success: true, message: "Dossier d'upload introuvable, rien à faire." };
  }

  try {
    // --- Phase 1: Nettoyage du Disque (Fichiers sans référence DB) ---
    const filesOnDisk = new Set(await fs.readdir(UPLOAD_DIR));
    const dbFileRecords = await prisma.file.findMany({ select: { id: true, url: true } });
    const validDbFilenames = new Set(dbFileRecords.map((f) => path.basename(f.url)));

    let diskDeletedCount = 0;
    const NOW = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    for (const filename of filesOnDisk) {
      if (validDbFilenames.has(filename)) {
        continue;
      }

      const filePath = path.join(UPLOAD_DIR, filename);
      const stats = await fs.stat(filePath);
      const fileAge = NOW - stats.mtimeMs;

      if (fileAge > ONE_DAY_MS) {
        await fs.unlink(filePath);
        console.log(`🗑️ Fichier disque supprimé : ${filename}`);
        diskDeletedCount++;
      }
    }

    // --- Phase 2: Nettoyage de la DB (Références sans fichier) ---
    const dbEntriesToDelete: string[] = [];
    for (const record of dbFileRecords) {
        const filename = path.basename(record.url);
        if (!filesOnDisk.has(filename)) {
            dbEntriesToDelete.push(record.id);
        }
    }

    let dbDeletedCount = 0;
    if (dbEntriesToDelete.length > 0) {
        const deleteResult = await prisma.file.deleteMany({
            where: {
                id: { in: dbEntriesToDelete }
            }
        });
        dbDeletedCount = deleteResult.count;
        console.log(`🗑️ ${dbDeletedCount} entrée(s) DB supprimée(s).`);
    }

    const message = `Nettoyage terminé. ${diskDeletedCount} fichier(s) disque et ${dbDeletedCount} entrée(s) base de données supprimé(s).`;
    console.log(`✨ ${message}`);
    return { success: true, message };

  } catch (error) {
    console.error("❌ Erreur critique lors du nettoyage:", error);
    return { success: false, message: "Une erreur serveur est survenue lors du nettoyage." };
  }
}
