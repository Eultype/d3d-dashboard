import { getProductDetails, getProductOrderItems, getProductRecentCustomers } from "@/lib/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductInfoCard } from "./_components/ProductInfoCard";
import { ProductRecentOrdersCard } from "./_components/ProductRecentOrdersCard";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";

import { formatEUR } from "@/lib/money";
import { formatDateFR, formatDateTimeFR } from "@/lib/dates";

export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const product = await getProductDetails(id);

    if (!product) return notFound();

    const lastItems = await getProductOrderItems(product.id);

    const lastCustomers = await getProductRecentCustomers(product.id);

    const { date: createdDate, time: createdTime } = formatDateTimeFR(new Date(product.createdAt));

    const shortId = product.id.slice(0, 10);
    const price = formatEUR(product.priceCents ?? 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/products" className="hover:underline">
                            Produits
                        </Link>{" "}
                        / <span className="text-foreground">#{product.id.slice(0, 10)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Fiche produit #{shortId}</h1>
                        <ProductActiveBadge isActive={product.isActive} />
                        {product.sku ? (
                            <Badge variant="secondary" className="font-mono">
                                {product.sku}
                            </Badge>
                        ) : null}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Créé le {createdDate} à {createdTime}
                    </p>
                </div>

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
                {/* Derniers clients */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Derniers clients ayant commandé ce produit
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {lastCustomers.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">
                                Aucun client n’a encore commandé ce produit.
                            </p>
                        )}

                        {lastCustomers.map((c) => (
                            <div
                                key={c.id}
                                className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">
                                            {c.name ?? "Client sans nom"}
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {c.email ?? "—"}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button asChild size="sm" variant="outline" className="shrink-0">
                                            <Link href={`/dashboard/customers/${c.id}`}>Voir</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
