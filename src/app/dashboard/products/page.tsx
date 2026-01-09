import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/dashboard/products-table";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des produits",
    description:
        "Gérez votre catalogue produits : prix, stock, visuels, descriptions et statut actif/inactif.",
};

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                    <Link href="/dashboard" className="hover:underline">
                        Dashboard
                    </Link>{" "}
                    /{" "}
                    <Link href="/dashboard/products" className="hover:underline">
                        Produits
                    </Link>{" "}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Produits</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestion du catalogue (cristaux, supports, etc.)
                    </p>
                </div>
            </div>

            <div>
                <Link href="/dashboard/products/new">
                    <Button>Nouveau produit</Button>
                </Link>
            </div>

            <div>
                <ProductsTable
                    products={products.map((p) => ({
                        id: p.id,
                        name: p.name,
                        sku: p.sku,
                        description: p.description,
                        imageUrl: p.imageUrl,
                        isActive: p.isActive,
                        priceCents: p.priceCents,
                        createdAt: p.createdAt.toISOString(),
                    }))}
                />
            </div>
        </div>
    );
}
