// Import Next
import Link from "next/link";
import type { Metadata } from "next";
// Import des composants
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "../_components/CustomerForm";

// Metadata de la création d'un client
export const metadata: Metadata = {
    title: "D3D | Créer un client",
    description: "Ajoutez un nouveau client à votre base de données.",
};

// Page de création d'un client
export default function CustomerCreatePage() {
    return (
        <div className="space-y-6">
            {/* Fil d'Ariane pour la navigation */}
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/customers" className="hover:underline">Clients</Link> /{" "}
                <span className="text-foreground">Nouveau</span>
            </div>

            {/* Titre principal et bouton annuler */}
            <div className="flex items-center justify-between gap-3">
                {/* Titre principal */}
                <div>
                    <h1 className="text-2xl font-bold">Nouveau client</h1>
                    <p className="text-sm text-muted-foreground">Ajoutez un nouveau client à votre base de données.</p>
                </div>
                {/* Bouton pour retourner à la liste des clients (annuler) */}
                <Button asChild variant="ghost">
                    <Link href="/dashboard/customers">← Annuler</Link>
                </Button>
            </div>

            {/* Carte contenant le formulaire d’ajout de client */}
            <Card>
                <CardHeader>
                    {/* Titre de la carte */}
                    <CardTitle>Informations du client</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Formulaire de création de client */}
                    <CustomerForm />
                </CardContent>
            </Card>
        </div>
    );
}
