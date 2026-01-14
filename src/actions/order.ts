"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getNextOrderReference } from "@/lib/sequences";

// Type pour les données reçues
export type OrderInputData = {
  info: {
    prefix: string;
    channel: string;
    delivery: string;
  };
  clientId: string | null;
  clientDetails?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  products: Array<{
    typeId: string;
    quantity: number;
    unitPrice: number;
  }>;
  internalNote?: string;
};

export async function createOrder(data: OrderInputData) {
  // console.log("🚀 [createOrder] Début de l'action serveur", JSON.stringify(data, null, 2));

  if (!prisma.user || !prisma.customer) {
      console.error("🔥 [createOrder] CRITICAL: Prisma models are undefined!");
      return { success: false, message: "Erreur interne: Connexion base de données instable." };
  }
  
  const session = await getServerSession(authOptions);
  
  let userEmail = session?.user?.email;

  // FALLBACK DEV : Si pas de session, on tente d'utiliser l'admin par défaut
  if (!userEmail) {
    console.warn("⚠️ [createOrder] Pas de session détectée. Tentative d'utilisation du compte admin par défaut (DEV ONLY).");
    userEmail = "admin@test.com"; 
  }

  // On récupère l'ID de l'EMPLOYÉ (pour la note interne)
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.error("❌ [createOrder] Employé introuvable (Session ou Fallback) :", userEmail);
    return { success: false, message: "Erreur d'autorisation : Employé introuvable." };
  }

  try {
    // 1. Gestion du CLIENT (Celui qui achète)
    let finalCustomerId = data.clientId;
    
    // On détecte si c'est un nouveau client (ID null ou ID temporaire du front)
    const isTempId = finalCustomerId && finalCustomerId.startsWith("TEMP_");
    const shouldCreateClient = !finalCustomerId || isTempId;

    // Si on doit créer un client et qu'on a les détails
    if (shouldCreateClient && data.clientDetails && data.clientDetails.name) {
      // console.log("👤 [createOrder] Création d'un nouveau client à la volée...");
      
      // Petit check pour voir si l'email existe déjà (évite doublons)
      let existingCustomer = null;
      if (data.clientDetails.email) {
          existingCustomer = await prisma.customer.findUnique({
              where: { email: data.clientDetails.email }
          });
      }

      if (existingCustomer) {
           // console.log("ℹ️ [createOrder] Un client existe déjà avec cet email, on le lie.");
           finalCustomerId = existingCustomer.id;
      } else {
          // Création du nouveau client
          const newCustomer = await prisma.customer.create({
            data: {
              name: data.clientDetails.name,
              email: data.clientDetails.email || null,
              phone: data.clientDetails.phone,
              isActive: true,
            },
          });
          finalCustomerId = newCustomer.id;
          // console.log("✅ [createOrder] Nouveau client créé avec ID:", finalCustomerId);
      }
    } else if (isTempId) {
        // Cas critique : On a un ID TEMP mais pas de détails pour créer le client
        // On force à null pour éviter que Prisma ne plante avec "TEMP_..."
        console.warn("⚠️ [createOrder] ID Temporaire reçu sans détails client. La commande sera orpheline.");
        finalCustomerId = null;
    }

    // 2. Génération de la référence unique (ex: BOG-1001)
    // console.log("🔢 [createOrder] Génération référence pour le préfixe:", data.info.prefix);
    const reference = await getNextOrderReference(data.info.prefix);
    // console.log("✅ [createOrder] Référence générée:", reference);

    // 3. Préparation des lignes de commande
    // Aggrégation pour éviter les doublons de produits (clé unique orderId_productId)
    const aggregatedProducts = data.products.reduce((acc, p) => {
      const existing = acc.get(p.typeId);
      if (existing) {
        existing.quantity += p.quantity;
      } else {
        acc.set(p.typeId, { ...p });
      }
      return acc;
    }, new Map<string, typeof data.products[0]>());

    const orderItems = Array.from(aggregatedProducts.values()).map((p) => ({
      productId: p.typeId,
      quantity: p.quantity,
      unitPriceCents: Math.round(p.unitPrice * 100),
    }));

    // 4. Création de la commande
    // console.log("💾 [createOrder] Création en base...");
    const newOrder = await prisma.order.create({
      data: {
        reference: reference,
        status: "A_VERIFIER",
        customerId: finalCustomerId, // L'ID du client (existant ou nouveau)
        
        items: {
          create: orderItems,
        },
        
        // La note est signée par l'EMPLOYÉ connecté (user.id)
        ...(data.internalNote && {
          notes: {
            create: {
              content: data.internalNote,
              userId: user.id,
            },
          },
        }),
      },
    });
    // console.log("🎉 [createOrder] Commande créée avec succès, ID:", newOrder.id);

    revalidatePath("/dashboard/orders");
    return { success: true, orderId: newOrder.id, reference: newOrder.reference };

  } catch (error) {
    console.error("❌ [createOrder] ERREUR CRITIQUE:", error);
    if (error instanceof Error) {
        return { success: false, message: `Erreur: ${error.message}` };
    }
    return { success: false, message: "Une erreur technique est survenue." };
  }
}
