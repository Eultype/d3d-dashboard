import { CleanupButton } from "./_components/CleanupButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance | D3D Dashboard",
};

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <p className="text-muted-foreground mt-2">
          Actions de maintenance pour l'application.
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold">Nettoyage des fichiers</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Supprime les fichiers téléversés qui ne sont associés à aucune commande depuis plus de 24 heures. 
            Cette action peut prendre quelques instants.
          </p>
        </div>
        <div className="border-t px-6 py-4">
            <CleanupButton />
        </div>
      </div>
    </div>
  );
}
