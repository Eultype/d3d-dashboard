// Import Next
import Link from "next/link";
import type { Metadata } from "next";
// Import des composants
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";

// Metadata de la création d'un produit
export const metadata: Metadata = {
    title: "D3D | Créer un produit",
    description: "Ajoutez un nouveau produit à votre base de données.",
};

// Page de création de produit
export default function ProductCreatePage() {
    return (
        <div className="space-y-6">
            {/* Fil d'Ariane  */}
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/products" className="hover:underline">Produits</Link> /{" "}
                <span className="text-foreground">Nouveau</span>
            </div>

            {/* En-tête : titre, description et bouton Annuler */}
            <div className="flex items-center justify-between gap-3">
                {/* Titres */}
                <div>
                    <h1 className="text-2xl font-bold">Nouveau produit</h1>
                    <p className="text-sm text-muted-foreground">Ajoutez un nouveau produit à votre base de données.</p>
                </div>

                {/* Bouton annuler*/}
                <Button asChild variant="ghost">
                    <Link href="/dashboard/products">← Retour</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    {/* Titre de la carte*/}
                    <CardTitle>Informations du produit</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Formulaire de création d'un produit */}
                    <ProductForm />
                </CardContent>
            </Card>
        </div>
    );
}
