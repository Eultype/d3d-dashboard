import { prisma } from "./src/lib/prisma";
import { getNextOrderReference } from "./src/lib/sequences";

async function main() {
  console.log("🚀 Démarrage du test de création de commande...");

  // 1. Mock de l'utilisateur (on bypass la session pour le test)
  const userEmail = "admin@test.com";
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user) {
    console.error("❌ Utilisateur de test introuvable.");
    return;
  }
  console.log("✅ Utilisateur trouvé:", user.email);

  try {
    // 2. Test de la génération de référence
    const prefix = "BOG";
    console.log(`🔢 Génération référence pour ${prefix}...`);
    const reference = await getNextOrderReference(prefix);
    console.log("✅ Référence générée:", reference);

    // 3. Tentative de création de commande
    console.log("💾 Création de la commande en base...");
    const newOrder = await prisma.order.create({
      data: {
        reference: reference,
        status: "A_VERIFIER",
        customerId: null, // Pas de client pour ce test
        items: {
          create: [
            {
              // On suppose que ce produit existe (id fictif, ou il faut en trouver un vrai)
              // Pour le test, je vais d'abord chercher un produit
              productId: (await prisma.product.findFirst())?.id || "",
              quantity: 1,
              unitPriceCents: 1000,
            }
          ],
        },
        notes: {
            create: {
                content: "Test automatique via script CLI",
                userId: user.id
            }
        }
      },
    });

    console.log("🎉 SUCCÈS ! Commande créée.");
    console.log("ID:", newOrder.id);
    console.log("Ref:", newOrder.reference);

  } catch (error) {
    console.error("❌ ÉCHEC DU TEST:", error);
  }
}

main();
