"use client";

import { useState, useEffect } from "react";
import { NotificationsBell } from "./NotificationsBell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { NotificationWithReadStatus } from "@/lib/data/notifications";

type ClientSideHeaderElementsProps = {
  sessionUserEmail: string;
  initialNotifications: NotificationWithReadStatus[];
  userRole?: string;
};

export default function ClientSideHeaderElements({
  sessionUserEmail,
  initialNotifications,
  userRole,
}: ClientSideHeaderElementsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const isAdmin = userRole === "ADMIN";

  return (
    <div className="flex items-center gap-3">
      {isAdmin && <NotificationsBell initialNotifications={initialNotifications} />}
      <ThemeToggle />
      <span className="text-sm text-muted-foreground">
        {sessionUserEmail}
      </span>
      <LogoutButton />
    </div>
  );
}
