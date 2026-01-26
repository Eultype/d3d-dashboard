import { prisma } from "@/lib/services/prisma";

/**
 * Récupère la prochaine valeur pour un préfixe de séquence donné et construit la référence de commande complète.
 * Cette fonction utilise une transaction de base de données pour garantir que la mise à jour de la séquence est atomique,
 * empêchant les "race conditions" où deux commandes pourraient obtenir le même numéro.
 *
 * @param prefix Le préfixe pour la séquence (ex: "BOG", "WEB").
 * @returns La référence de commande complète et unique (ex: "BOG-1001").
 * @throws Error si la séquence pour le préfixe donné n'est pas trouvée dans la base de données.
 */
export async function getNextOrderReference(prefix: string): Promise<string> {
  const sequenceId = prefix.toUpperCase();
  
  // DEBUG
  if (!prisma.sequence) {
      console.error("🔥 [getNextOrderReference] prisma.sequence is UNDEFINED!");
      throw new Error("Prisma Sequence model is not available");
  }

  // Une transaction garantit que les opérations de lecture et de mise à jour sont atomiques.  // C'est crucial pour éviter les "race conditions" en cas de forte charge.
  const sequence = await prisma.$transaction(async (tx) => {
    const sequence = await tx.sequence.findUnique({
      where: { id: sequenceId },
    });

    if (!sequence) {
      throw new Error(
        `Séquence pour le préfixe '${sequenceId}' non trouvée. Assurez-vous que la base de données a été "seedée" correctement.`
      );
    }

    // Incrémente la valeur et retourne la *nouvelle* valeur
    const updatedSequence = await tx.sequence.update({
      where: { id: sequenceId },
      data: {
        currentValue: {
          increment: 1,
        },
      },
    });
    return updatedSequence;
  });

  return `${sequence.id}-${sequence.currentValue}`;
}
