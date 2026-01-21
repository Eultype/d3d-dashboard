"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

export async function markAllNotificationsAsRead(): Promise<{ success: boolean, message?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Non autorisé" };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  try {
    let whereClause: any = {};
    if (userRole === "REVENDEUR") {
      whereClause = {
        order: {
          createdById: userId,
        },
      };
    }

    // 1. Trouver toutes les notifications
    const allNotifications = await prisma.notification.findMany({
      where: whereClause,
      select: { id: true }
    });

    // 2. Trouver celles que l'utilisateur a déjà lues
    const readNotifications = await prisma.notificationRead.findMany({
      where: { userId },
      select: { notificationId: true }
    });
    const readNotificationIds = new Set(readNotifications.map(r => r.notificationId));

    // 3. Déterminer celles qui ne sont pas encore lues
    const unreadNotifications = allNotifications.filter(n => !readNotificationIds.has(n.id));
    const unreadNotificationIds = unreadNotifications.map(n => n.id);

    if (unreadNotificationIds.length === 0) {
      return { success: true }; // Rien à faire
    }

    // 4. Créer les entrées "NotificationRead" pour toutes les non-lues
    await prisma.notificationRead.createMany({
      data: unreadNotificationIds.map(notificationId => ({
        userId,
        notificationId,
      })),
      skipDuplicates: true, // Au cas où, pour éviter les erreurs
    });
    
    // Revalider le layout pour que le changement soit pris en compte au prochain rechargement
    revalidatePath("/dashboard", "layout");

    return { success: true };

  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    return { success: false, message: "Erreur du serveur." };
  }
}
