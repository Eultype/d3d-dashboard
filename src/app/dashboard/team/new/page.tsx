import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewEmployeeForm } from "../_components/NewEmployeeForm";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard/team" className="hover:underline">Équipe</Link> / <span className="text-foreground">Nouveau</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ajouter un administrateur</h1>
            <p className="text-sm text-muted-foreground">Créez un nouvel accès pour un membre de l'équipe.</p>
          </div>
        </div>

        <Button asChild variant="ghost">
          <Link href="/dashboard/team">← Retour</Link>
        </Button>
      </div>

      <NewEmployeeForm />
    </div>
  );
}
