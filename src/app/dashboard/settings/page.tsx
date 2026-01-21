import { CleanupButton } from "./_components/CleanupButton";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Paramètres | D3D Dashboard",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les configurations de votre application et les outils de maintenance.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Section Maintenance (Anciennement seule) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Maintenance et Système</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold text-sm">Nettoyage des fichiers</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Supprime les fichiers téléversés qui ne sont associés à aucune commande depuis plus de 24 heures.
              </p>
              <CleanupButton />
            </div>
          </CardContent>
        </Card>

        {/* Placeholder pour futures sections */}
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-10 text-center">
            <SettingsIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              D'autres paramètres (Infos entreprise, Séquences, Emails) seront bientôt disponibles ici.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
