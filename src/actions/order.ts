"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getNextOrderReference } from "@/lib/sequences";
import { z } from "zod";

// Schéma de validation
const OrderSchema = z.object({
  info: z.object({
    prefix: z.string().min(1, "Le préfixe est requis"),
    channel: z.string().min(1, "Le canal est requis"),
    delivery: z.string().min(1, "Le mode de livraison est requis"),
  }),
  clientId: z.string().nullable(),
  clientDetails: z
    .object({
      name: z.string().min(1, "Le nom du client est requis"),
      email: z.string().email("Email invalide"),
      phone: z.string().min(1, "Le téléphone est requis"),
      addressLine1: z.string().min(1, "L'adresse est requise"),
      postalCode: z.string().min(1, "Le code postal est requis"),
      city: z.string().min(1, "La ville est requise"),
      country: z.string().min(1, "Le pays est requis"),
    })
    .nullable()
    .optional(),
  products: z
    .array(
      z.object({
        typeId: z.string().min(1, "ID produit manquant"),
        quantity: z.number().min(1, "Quantité minimum 1"),
        unitPrice: z.number().min(0, "Prix invalide"),
        file: z
          .object({
            url: z.string(),
            filename: z.string(),
            type: z.string(),
          })
          .nullable()
          .optional(),
      })
    )
    .min(1, "La commande doit contenir au moins un produit"),
  internalNote: z.string().optional(),
});

// Type déduit du schéma (optionnel, mais garde la synchro)
export type OrderInputData = z.infer<typeof OrderSchema>;

export async function createOrder(data: OrderInputData) {
  // 1. Validation des données entrantes
  const validatedFields = OrderSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("❌ [createOrder] Validation failed:", validatedFields.error);
    return {
      success: false,
      message: "Données invalides : " + validatedFields.error.issues.map((issue) => issue.message).join(", "),
    };
  }

  const validData = validatedFields.data;

  if (!prisma.user || !prisma.customer) {
    console.error("🔥 [createOrder] CRITICAL: Prisma models are undefined!");
    return { success: false, message: "Erreur interne: Connexion base de données instable." };
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return { success: false, message: "Erreur d'autorisation : Vous devez être connecté." };
  }

  // On récupère l'ID de l'EMPLOYÉ (pour la note interne)
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.error("❌ [createOrder] Employé introuvable (Session) :", userEmail);
    return { success: false, message: "Erreur d'autorisation : Employé introuvable." };
  }

  try {
    // 2. Gestion du CLIENT (Celui qui achète)
    let finalCustomerId = validData.clientId;

    // On détecte si c'est un nouveau client (ID null ou ID temporaire du front)
    const isTempId = finalCustomerId && finalCustomerId.startsWith("TEMP_");
    const shouldCreateClient = !finalCustomerId || isTempId;

    // Si on doit créer un client et qu'on a les détails
    if (shouldCreateClient && validData.clientDetails && validData.clientDetails.name) {
      
      // Petit check pour voir si l'email existe déjà (évite doublons)
      let existingCustomer = null;
      if (validData.clientDetails.email) {
        existingCustomer = await prisma.customer.findUnique({
          where: { email: validData.clientDetails.email },
        });
      }

      if (existingCustomer) {
        finalCustomerId = existingCustomer.id;
      } else {
        // Création du nouveau client
        const newCustomer = await prisma.customer.create({
          data: {
            name: validData.clientDetails.name,
            email: validData.clientDetails.email,
            phone: validData.clientDetails.phone,
            addressLine1: validData.clientDetails.addressLine1,
            postalCode: validData.clientDetails.postalCode,
            city: validData.clientDetails.city,
            country: validData.clientDetails.country,
            isActive: true,
          },
        });
        finalCustomerId = newCustomer.id;
      }
    } else if (isTempId) {
      // Cas critique : On a un ID TEMP mais pas de détails pour créer le client
      console.warn("⚠️ [createOrder] ID Temporaire reçu sans détails client. La commande sera orpheline.");
      finalCustomerId = null;
    }

    // 3. Génération de la référence unique (ex: BOG-1001)
    const reference = await getNextOrderReference(validData.info.prefix);

    // 4. Préparation des lignes de commande
    // Aggrégation pour éviter les doublons de produits (clé unique orderId_productId)
    const aggregatedProducts = validData.products.reduce((acc, p) => {
      const existing = acc.get(p.typeId);
      if (existing) {
        existing.quantity += p.quantity;
      } else {
        acc.set(p.typeId, { ...p });
      }
      return acc;
    }, new Map<string, (typeof validData.products)[0]>());

    const orderItems = Array.from(aggregatedProducts.values()).map((p) => ({
      productId: p.typeId,
      quantity: p.quantity,
      unitPriceCents: Math.round(p.unitPrice * 100),
    }));

    // 5. Création de la commande
    const newOrder = await prisma.order.create({
      data: {
        reference: reference,
        status: "A_VERIFIER",
        customerId: finalCustomerId, // L'ID du client (existant ou nouveau)

        items: {
          create: orderItems,
        },

        // La note est signée par l'EMPLOYÉ connecté (user.id)
        ...(validData.internalNote && {
          notes: {
            create: {
              content: validData.internalNote,
              userId: user.id,
            },
          },
        }),
      },
    });

    // 6. Gestion des fichiers attachés aux produits
    const filesToCreate = validData.products
      .filter((p) => p.file)
      .map((p) => ({
        url: p.file!.url,
        filename: p.file!.filename,
        type: p.file!.type,
        orderId: newOrder.id,
      }));

    if (filesToCreate.length > 0) {
      await prisma.file.createMany({
        data: filesToCreate,
      });
    }

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

// --- ACTION DE MISE À JOUR DU STATUT ---
const UpdateStatusSchema = z.object({
  orderId: z.string(),
  newStatus: z.enum(["A_VERIFIER", "PROD", "A_EXPEDIER", "A_RECUPERER", "TERMINE", "ANNULEE"]), // Liste à adapter selon tes besoins
  trackingNumber: z.string().optional(),
});

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Non autorisé" };
  }

  // Validation
  const validation = UpdateStatusSchema.safeParse({ orderId, newStatus, trackingNumber });
  if (!validation.success) {
    return { success: false, message: "Statut invalide" };
  }

  try {
    // Si le statut passe à "A_EXPEDIER" ou "TERMINE", on pourrait sauvegarder le tracking ici
    // Pour l'instant on fait simple : update du status
    
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        // On pourrait ajouter un champ 'trackingNumber' à la table Order plus tard
      },
    });

    // TODO: Ajouter ici la logique d'envoi d'email (ex: "Votre commande est expédiée")

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur update status:", error);
    return { success: false, message: "Erreur lors de la mise à jour" };
  }
}
