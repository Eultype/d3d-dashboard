"use server";

import { prisma } from "@/lib/prisma";

export async function getNextSequenceValue(prefix: string) {
  // On cherche la séquence
  let seq = await prisma.sequence.findUnique({
    where: { id: prefix },
  });

  // Si elle n'existe pas, on la crée à 1000 (par défaut)
  if (!seq) {
    seq = await prisma.sequence.create({
      data: { id: prefix, currentValue: 1000 },
    });
  }

  // La valeur SUIVANTE sera currentValue + 1
  return seq.currentValue + 1;
}

/**
 * Récupère la liste des préfixes disponibles pour les commandes internes.
 * Exclut les préfixes associés à des comptes revendeurs.
 */
export async function getInternalPrefixes() {
  // 1. Récupérer tous les préfixes connus dans la table Sequence
  const allSequences = await prisma.sequence.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  // 2. Récupérer les préfixes réservés par les revendeurs
  const resellerUsers = await prisma.user.findMany({
    where: { 
      role: "REVENDEUR",
      prefix: { not: null }
    },
    select: { prefix: true },
  });

  // Créer un Set des préfixes réservés (en majuscules pour éviter les soucis de casse)
  const reservedPrefixes = new Set(
    resellerUsers
      .map((u) => u.prefix?.toUpperCase())
      .filter((p): p is string => !!p)
  );

  // 3. Filtrer : On ne garde que ceux qui ne sont PAS dans la liste réservée
  const internalPrefixes = allSequences
    .map((s) => s.id)
    .filter((id) => !reservedPrefixes.has(id.toUpperCase()));

  // 4. Ajouter les défauts (BOG, WEB, ERIC) s'ils ne sont pas déjà là et pas réservés
  const defaults = ["BOG", "WEB", "ERIC"];
  for (const def of defaults) {
    if (!reservedPrefixes.has(def) && !internalPrefixes.includes(def)) {
      internalPrefixes.push(def);
    }
  }

  return Array.from(new Set(internalPrefixes)).sort();
}