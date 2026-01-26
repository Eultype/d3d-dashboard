// Import Next
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// Import composant
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "../../_components/ProductForm";
// Import lib
import { prisma } from "@/lib/services/prisma";

// Metadata de modification d'un produit
export const metadata: Metadata = {
    title: "D3D | Modifier un produit",
};

// Page de modification d'un produit
export default async function ProductEditPage({ params }: { params: Promise<{ id?: string }> }) {
    const { id } = await params;

    if (!id) {
        return notFound();
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            {/* Fil d'Ariane */}
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/products" className="hover:underline">Produits</Link> /{" "}
                <Link href={`/dashboard/products/${product.id}`} className="hover:underline">
                    {product.name}
                </Link>{" "}
                / <span className="text-foreground">Modifier</span>
            </div>

            {/* En-tête de la page : Titres + bouton annuler */}
            <div className="flex items-center justify-between gap-3">
                {/* Titres */}
                <div>
                    <h1 className="text-2xl font-bold">Modifier le produit</h1>
                    <p className="text-sm text-muted-foreground">Mettez à jour les informations du produit.</p>
                </div>
                {/* Bouton annuler */}
                <Button asChild variant="ghost">
                    <Link href={`/dashboard/products/${product.id}`}>← Retour</Link>
                </Button>
            </div>

            {/* Titre carte + formulaire de modification du produit dans une carte */}
            <Card>
                <CardHeader>
                    {/* Titre de la carte */}
                    <CardTitle>Informations du produit</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Formulaire de modification de produit */}
                    <ProductForm product={product} />
                </CardContent>
            </Card>
        </div>
    );
}
