import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupOrphanedFiles() {
  console.log("🧹 Démarrage du nettoyage des fichiers orphelins...");

  const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/orders");
  
  // 1. Vérifier si le dossier existe
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    console.log("⚠️ Dossier d'upload introuvable. Rien à nettoyer.");
    return;
  }

  // 2. Récupérer tous les fichiers physiques
  const filesOnDisk = await fs.readdir(UPLOAD_DIR);
  console.log(`📂 Fichiers trouvés sur le disque : ${filesOnDisk.length}`);

  if (filesOnDisk.length === 0) {
    console.log("✅ Aucun fichier à vérifier.");
    return;
  }

  // 3. Récupérer toutes les URLs valides en base de données
  const dbFiles = await prisma.file.findMany({
    select: { url: true },
  });
  
  // On extrait juste le nom du fichier depuis l'url (ex: "/uploads/orders/mon-image.jpg" -> "mon-image.jpg")
  const validFilenames = new Set(
    dbFiles.map((f) => path.basename(f.url))
  );

  console.log(`💾 Fichiers référencés en base : ${validFilenames.size}`);

  let deletedCount = 0;
  const NOW = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // 4. Comparaison et Suppression
  for (const filename of filesOnDisk) {
    // Si le fichier est connu en base, on le garde
    if (validFilenames.has(filename)) {
      continue;
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Vérification de l'âge du fichier (pour ne pas supprimer un upload en cours il y a 5 min)
    try {
      const stats = await fs.stat(filePath);
      const fileAge = NOW - stats.mtimeMs;

      if (fileAge > ONE_DAY_MS) {
        await fs.unlink(filePath);
        console.log(`🗑️ Supprimé : ${filename}`);
        deletedCount++;
      } else {
        // console.log(`⏳ Ignoré (trop récent) : ${filename}`);
      }
    } catch (err) {
      console.error(`❌ Erreur sur ${filename}:`, err);
    }
  }

  console.log(`✨ Nettoyage terminé. ${deletedCount} fichiers orphelins supprimés.`);
}

cleanupOrphanedFiles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
