import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/dashboard/product/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D3D | Modifier un produit",
};

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
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/products" className="hover:underline">Produits</Link> /{" "}
                <Link href={`/dashboard/products/${product.id}`} className="hover:underline">
                    {product.name}
                </Link>{" "}
                / <span className="text-foreground">Modifier</span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Modifier le produit</h1>
                    <p className="text-sm text-muted-foreground">Mettez à jour les informations du produit.</p>
                </div>
                <Button asChild variant="ghost">
                    <Link href={`/dashboard/products/${product.id}`}>← Annuler</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du produit</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} />
                </CardContent>
            </Card>
        </div>
    );
}
