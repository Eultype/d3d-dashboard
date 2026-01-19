"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { NotificationWithReadStatus } from "@/lib/data/notifications";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { pusherClient } from "@/lib/pusher-client";
import { markAllNotificationsAsRead } from "@/actions/notifications";
import { toast } from "sonner";

type NotificationsBellProps = {
  initialNotifications: NotificationWithReadStatus[];
};

export function NotificationsBell({ initialNotifications }: NotificationsBellProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const channel = pusherClient.subscribe('d3d-dashboard');
    channel.bind('new-notification', (newNotification: NotificationWithReadStatus) => {
      // Pour une nouvelle notif entrante, isRead est faux par défaut
      const newNotifWithStatus = { ...newNotification, isRead: false };
      setNotifications((prevNotifications) => [newNotifWithStatus, ...prevNotifications]);
    });

    return () => {
      pusherClient.unsubscribe('d3d-dashboard');
      channel.unbind_all();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = () => {
    if (unreadCount === 0) return;

    startTransition(async () => {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        // Optimistic update: on met tout à jour côté client
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour.");
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-2 border-b">
            <h4 className="font-medium text-sm">Notifications</h4>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAsRead} 
                disabled={isPending || unreadCount === 0}
                className="text-xs"
            >
                <CheckCheck className="mr-2 h-4 w-4" />
                Marquer comme lu
            </Button>
        </div>

        <div className="space-y-1 p-2">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune notification
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <li key={notif.id}>
                  <Link
                    href={notif.link}
                    className={`
                      block rounded-md p-3 transition-colors hover:bg-muted
                      ${!notif.isRead ? "bg-blue-500/10" : ""}
                    `}
                  >
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
