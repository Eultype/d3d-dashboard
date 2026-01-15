"use server";

import { prisma } from "@/lib/prisma";

export async function getNextSequenceValue(prefix: string) {
  if (!prefix) return null;

  const sequence = await prisma.sequence.findUnique({
    where: { id: prefix },
  });

  // Si la séquence n'existe pas encore, elle commencera à 1001 (selon ta logique getNextOrderReference)
  return sequence ? sequence.currentValue + 1 : 1001;
}
