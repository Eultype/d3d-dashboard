import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/dashboard/product/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D3D | Créer un produit",
    description: "Ajoutez un nouveau produit à votre base de données.",
};

export default function ProductCreatePage() {
    return (
        <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/products" className="hover:underline">Produits</Link> /{" "}
                <span className="text-foreground">Nouveau</span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Nouveau produit</h1>
                    <p className="text-sm text-muted-foreground">Ajoutez un nouveau produit à votre base de données.</p>
                </div>
                <Button asChild variant="ghost">
                    <Link href="/dashboard/products">← Annuler</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du produit</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm />
                </CardContent>
            </Card>
        </div>
    );
}
