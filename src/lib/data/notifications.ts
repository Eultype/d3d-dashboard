// src/lib/data/notifications.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export type NotificationWithReadStatus = {
  id: string;
  message: string;
  link: string;
  createdAt: Date;
  isRead: boolean;
};

export async function getNotificationsForUser(): Promise<NotificationWithReadStatus[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // On ne prend que les 20 plus récentes pour commencer
  });

  // Pour chaque notif, on vérifie si l'utilisateur l'a lue
  const notificationsWithStatus = await Promise.all(
    notifications.map(async (notification) => {
      const readEntry = await prisma.notificationRead.findUnique({
        where: {
          userId_notificationId: {
            userId,
            notificationId: notification.id,
          },
        },
      });
      return {
        ...notification,
        isRead: !!readEntry,
      };
    })
  );

  return notificationsWithStatus;
}
