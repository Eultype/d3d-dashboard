"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getNextOrderReference } from "@/lib/sequences";
import { z } from "zod";
import { statusLabelFR } from "@/lib/orders";
import { pusherServer } from "@/lib/pusher"; // Import Pusher server

// Schéma de validation (inchangé)
const OrderSchema = z.object({
  info: z.object({
    prefix: z.string().min(1, "Le préfixe est requis"),
    delivery: z.string().min(1, "Le mode de livraison est requis"),
    shippingCost: z.number().min(0, "Le coût de livraison est invalide"),
    taxRate: z.number().min(0, "Le taux de TVA est invalide"),
    manualNumber: z.number().optional().nullable(),
  }),
  clientId: z.string().nullable(),
  clientDetails: z
    .object({
      name: z.string().min(1, "Le nom du client est requis"),
      email: z.string().email("Email invalide").optional().or(z.literal('')),
      phone: z.string().optional().or(z.literal('')),
      addressLine1: z.string().optional().or(z.literal('')),
      postalCode: z.string().optional().or(z.literal('')),
      city: z.string().optional().or(z.literal('')),
      country: z.string().optional().or(z.literal('')),
    })
    .nullable()
    .optional(),
  products: z
    .array(
      z.object({
        typeId: z.string().min(1, "ID produit manquant"),
        quantity: z.number().min(1, "Quantité minimum 1"),
        unitPrice: z.number().min(0, "Prix invalide"),
        customText: z.string().optional().nullable(),
        files: z.array(z.object({ url: z.string(), filename: z.string(), type: z.string() })).optional().default([]),
      })
    )
    .min(1, "La commande doit contenir au moins un produit"),
  internalNote: z.string().optional(),
  discountType: z.string().optional(),
  discountValue: z.number().optional(),
});
export type OrderInputData = z.infer<typeof OrderSchema>;

export async function createOrder(data: OrderInputData) {
  const validatedFields = OrderSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("❌ [createOrder] Validation failed:", JSON.stringify(validatedFields.error.format(), null, 2));
    return {
      success: false,
      message: "Données invalides : " + validatedFields.error.issues.map((issue) => `${issue.path.join('.')} : ${issue.message}`).join(", "),
    };
  }

  const validData = validatedFields.data;

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return { success: false, message: "Erreur d'autorisation : Vous devez être connecté." };
  }

  // RÉCUPÉRATION DE L'UTILISATEUR AVEC SON RÔLE ET SON PRÉFIXE
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, email: true, role: true, prefix: true, name: true },
  });

  if (!user) {
    console.error("❌ [createOrder] Employé introuvable (Session) :", userEmail);
    return { success: false, message: "Erreur d'autorisation : Employé introuvable." };
  }

  const userName = user.name || user.email;

  // SÉCURITÉ : UN REVENDEUR NE PEUT PAS UTILISER UN AUTRE PRÉFIXE
  if (user.role === "REVENDEUR" && validData.info.prefix !== user.prefix) {
    console.error("⚠️ [createOrder] Tentative d'usurpation de préfixe par :", userEmail);
    return { success: false, message: "Action non autorisée : Préfixe invalide pour votre compte." };
  }

  try {
    // 2. Gestion du CLIENT (Celui qui achète)
    let finalCustomerId = validData.clientId;
    const isTempId = finalCustomerId && finalCustomerId.startsWith("TEMP_");
    const shouldCreateClient = !finalCustomerId || isTempId;

    if (shouldCreateClient && validData.clientDetails && validData.clientDetails.name) {
      let existingCustomer = null;
      if (validData.clientDetails.email) {
        existingCustomer = await prisma.customer.findUnique({
          where: { email: validData.clientDetails.email },
        });
      }

      if (existingCustomer) {
        finalCustomerId = existingCustomer.id;
      } else {
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
      console.warn("⚠️ [createOrder] ID Temporaire reçu sans détails client. La commande sera orpheline.");
      finalCustomerId = null;
    }

    // 3. Génération de la référence unique
    let reference = "";
    if (validData.info.manualNumber) {
      reference = `${validData.info.prefix}-${validData.info.manualNumber}`;
      const existing = await prisma.order.findUnique({ where: { reference } });
      if (existing) {
        return { success: false, message: `La référence ${reference} existe déjà.` };
      }
      const currentSeq = await prisma.sequence.findUnique({ where: { id: validData.info.prefix } });
      if (currentSeq && validData.info.manualNumber > currentSeq.currentValue) {
        await prisma.sequence.update({ where: { id: validData.info.prefix }, data: { currentValue: validData.info.manualNumber } });
      } else if (!currentSeq) {
        await prisma.sequence.create({ data: { id: validData.info.prefix, currentValue: validData.info.manualNumber } });
      }
    } else {
      reference = await getNextOrderReference(validData.info.prefix);
    }

    const orderItems = validData.products.map((p) => ({
      productId: p.typeId,
      quantity: p.quantity,
      unitPriceCents: Math.round(p.unitPrice * 100),
      customText: p.customText,
    }));

    // 5. Création de la commande
    const newOrder = await prisma.order.create({
      data: {
        reference: reference,
        status: "A_VERIFIER",
        shippingType: validData.info.delivery,
        shippingCostCents: Math.round(validData.info.shippingCost * 100),
        taxRate: validData.info.taxRate,
        discountType: validData.discountType,
        discountValue: (validData.discountType === 'amount' && validData.discountValue) 
            ? validData.discountValue * 100 
            : validData.discountValue,
        customerId: finalCustomerId,
        createdById: user.id,
        items: { create: orderItems },
        ...(validData.internalNote && { notes: { create: { content: validData.internalNote, userId: user.id } } }),
      },
    });

    // 6. Gestion des fichiers attachés aux produits
    const filesToCreate = validData.products.flatMap((p) => (p.files || []).map((f) => ({ ...f, orderId: newOrder.id })));
    if (filesToCreate.length > 0) {
      await prisma.file.createMany({ data: filesToCreate });
    }
    
    // 7. Création et envoi de la notification
    const newNotification = await prisma.notification.create({
        data: {
            message: `La commande ${newOrder.reference} a été créée par ${userName}.`,
            link: `/dashboard/orders/${newOrder.id}`,
            orderId: newOrder.id
        }
    });
    
    await pusherServer.trigger('d3d-dashboard', 'new-notification', newNotification);

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
  newStatus: z.enum(["A_VERIFIER", "PROD", "A_EXPEDIER", "A_RECUPERER", "TERMINE", "ANNULEE"]),
  trackingNumber: z.string().optional(),
});

export async function updateOrderStatus(orderId: string, newStatus: string, trackingNumber?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, message: "Non autorisé" };
  }
  const validation = UpdateStatusSchema.safeParse({ orderId, newStatus, trackingNumber });
  if (!validation.success) {
    return { success: false, message: "Statut invalide" };
  }
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email }, 
    select: { email: true, role: true, name: true } 
  });

  if (!user) {
    return { success: false, message: "Utilisateur non trouvé." };
  }

  const userName = user.name || user.email;

  // SÉCURITÉ : SEULS LES ADMINS PEUVENT CHANGER LES STATUTS
  if (user.role !== "ADMIN") {
    return { success: false, message: "Non autorisé. Droits administrateur requis." };
  }

  try {
    const orderToUpdate = await prisma.order.findUnique({ where: { id: orderId } });
    if (!orderToUpdate) {
        return { success: false, message: "Commande introuvable." };
    }
    const oldStatusLabel = statusLabelFR(orderToUpdate.status);
    const newStatusLabel = statusLabelFR(newStatus);
    
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    
    // Création et envoi de la notification
    const newNotification = await prisma.notification.create({
        data: {
            message: `Le statut de la commande ${orderToUpdate.reference} est passé de "${oldStatusLabel}" à "${newStatusLabel}" par ${userName}.`,
            link: `/dashboard/orders/${orderId}`,
            orderId: orderId
        }
    });

    // Envoi via Pusher
    await pusherServer.trigger('d3d-dashboard', 'new-notification', newNotification);

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur update status:", error);
    return { success: false, message: "Erreur lors de la mise à jour" };
  }
}
