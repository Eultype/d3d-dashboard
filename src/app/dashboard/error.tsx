"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur (pourrait être envoyé à Sentry/LogRocket plus tard)
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="p-4 rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
        <AlertCircle className="w-10 h-10" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-bold tracking-tight">Oups, un problème est survenu</h2>
        <p className="text-muted-foreground text-sm">
          Impossible de charger les données du tableau de bord. Cela peut être dû à une erreur réseau ou serveur.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 bg-muted/50 rounded text-xs font-mono text-left overflow-auto max-h-32 border">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Réessayer
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Recharger la page
        </Button>
      </div>
    </div>
  );
}
