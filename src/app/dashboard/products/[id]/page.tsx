// Import des datas
import { getProductFullDetails } from "@/lib/data/products";
// Import Next
import { notFound } from "next/navigation";
import Link from "next/link";
import type {Metadata} from "next";
// Import des composants
import { ProductInfoCard } from "./_components/ProductInfoCard";
import { ProductRecentOrdersCard } from "./_components/ProductRecentOrdersCard";
import { ProductRecentCustomersCard } from "./_components/ProductRecentCustomersCard";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Import des lib
import { formatDateTimeFR } from "@/lib/dates";

// Metadata du détails produit
export const metadata: Metadata = {
    title: "D3D | Dashboard | Détails produit",
    description:
        "Consultez et gérez les informations, le statut, l’historique des ventes, les commandes et les clients liés à ce produit.",
};

// Page de détails produit
export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const { product, lastItems, lastCustomers } = await getProductFullDetails(id);

    if (!product) return notFound();

    const { date: createdDate, time: createdTime } = formatDateTimeFR(product.createdAt);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    {/* Fil d'Ariane */}
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/products" className="hover:underline">
                            Produits
                        </Link>{" "}
                        / <span className="text-foreground">{product.name}</span>
                    </div>

                    {/* Titre du produit, statut (actif/inactif), SKU éventuel */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Titre du produit */}
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        {/* Statut (actif/inatif) */}
                        <ProductActiveBadge status={product.status} />
                        {product.sku ? (
                            <Badge variant="secondary" className="font-mono">
                                {/* Badge SKU */}
                                {product.sku}
                            </Badge>
                        ) : null}
                    </div>

                    {/* Date de création du produit */}
                    <p className="text-sm text-muted-foreground">
                        Créé le {createdDate} à {createdTime}
                    </p>
                </div>

                {/* Boutons Retour - Modifier */}
                <div className="flex items-center gap-2">
                    {/* Bouton retour */}
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/products">← Retour</Link>
                    </Button>
                    {/* Bouton modifier */}
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/products/${product.id}/edit`}>Modifier</Link>
                    </Button>
                </div>
            </div>
            {/* Information produit */}
            <ProductInfoCard product={product} />

            {/* Dernières commandes avec ce produit / Dernier client qui a commandé ce produit*/}
            <div className="grid gap-4 xl:grid-cols-2 items-stretch">
                {/* Dernières commandes avec ce produit */}
                <ProductRecentOrdersCard lastItems={lastItems} productId={product.id} />
                {/* Dernier client qui a commandé ce produit */}
                <ProductRecentCustomersCard lastCustomers={lastCustomers} />
            </div>
        </div>
    );
}
