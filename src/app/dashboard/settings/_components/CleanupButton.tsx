"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cleanupOrphanedFiles } from "@/actions/maintenance";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function CleanupButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await cleanupOrphanedFiles();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      <Trash2 className="mr-2 h-4 w-4" />
      {isPending ? "Nettoyage en cours..." : "Lancer le nettoyage des fichiers orphelins"}
    </Button>
  );
}
