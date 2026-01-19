"use client";

import { useState, useEffect } from "react"; // Import useState and useEffect
import { NotificationsBell } from "./NotificationsBell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { NotificationWithReadStatus } from "@/lib/data/notifications";

type ClientSideHeaderElementsProps = {
  sessionUserEmail: string;
  initialNotifications: NotificationWithReadStatus[];
};

export default function ClientSideHeaderElements({
  sessionUserEmail,
  initialNotifications,
}: ClientSideHeaderElementsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <NotificationsBell initialNotifications={initialNotifications} />
      <ThemeToggle />
      <span className="text-sm text-muted-foreground">
        {sessionUserEmail}
      </span>
      <LogoutButton />
    </div>
  );
}
