import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewOrderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nouvelle commande</h1>
            <p className="text-sm text-muted-foreground">
              Créer une nouvelle commande étape par étape
            </p>
          </div>

          <Link href="/dashboard/orders">
            <Button variant="outline">← Retour</Button>
          </Link>
        </header>

        {/* Form container */}
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
