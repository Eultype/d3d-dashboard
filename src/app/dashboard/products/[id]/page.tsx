import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";

import { formatEUR } from "@/lib/money";
import { formatDateFR } from "@/lib/dates";

function formatTimeFR(d: Date) {
    return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            sku: true,
            description: true,
            imageUrl: true,
            isActive: true,
            priceCents: true,
            createdAt: true,
        },
    });

    if (!product) return notFound();

    // 5 dernières lignes de commande (orderItems) qui concernent ce produit
    const lastItems = await prisma.orderItem.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            order: {
                include: {
                    customer: true,
                    items: true,
                },
            },
        },
    });

    // 5 derniers clients (dédupliqués) ayant commandé ce produit
    const lastCustomersRaw = await prisma.orderItem.findMany({
        where: {
            productId: product.id,
            order: { customerId: { not: null } },
        },
        orderBy: { createdAt: "desc" },
        take: 20, // on prend large puis on déduplique
        include: {
            order: { include: { customer: true } },
        },
    });

    const seen = new Set<string>();
    const lastCustomers = lastCustomersRaw
        .map((x) => x.order.customer)
        .filter((c): c is NonNullable<typeof c> => !!c)
        .filter((c) => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
        })
        .slice(0, 5);

    const createdDate = formatDateFR(new Date(product.createdAt));
    const createdTime = formatTimeFR(new Date(product.createdAt));

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
                        / <span className="font-mono">#{product.id.slice(0, 10)}</span>
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
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/products">← Retour</Link>
                    </Button>

                    {/* Optionnel si tu as une page edit */}
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/products/${product.id}/edit`}>Modifier</Link>
                    </Button>
                </div>
            </div>

            {/* Informations produit (style "Coordonnées") */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">
                        Informations produit
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="mx-auto max-w-4xl grid gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
                        {/* Bloc gauche */}
                        <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                            <span className="font-semibold text-gray-700 text-right">
                                Nom
                            </span>
                            <div className="row-span-4 bg-gray-300 w-[2px] self-stretch" />
                            <span className="font-medium">{product.name}</span>

                            <span className="font-semibold text-gray-700 text-right">
                                SKU
                            </span>
                            <span className="font-mono">{product.sku ?? "—"}</span>

                            <span className="font-semibold text-gray-700 text-right">
                                Prix
                            </span>
                            <span className="font-semibold tabular-nums">{price}</span>

                            <span className="font-semibold text-gray-700 text-right">
                                Statut
                            </span>
                            <span>
                                <ProductActiveBadge isActive={product.isActive} />
                            </span>
                        </div>

                        {/* Bloc droite */}
                        <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                            <span className="font-semibold text-gray-700 text-right">
                                Image
                            </span>
                            <div className="row-span-2 bg-gray-300 w-[2px] self-stretch" />
                            <span>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">IMG</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {product.imageUrl ?? "Aucune image"}
                                    </div>
                                </div>
                            </span>

                            <span className="font-semibold text-gray-700 text-right">
                                Description
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {product.description?.trim() ? (
                                    product.description
                                ) : (
                                    <span className="italic">Aucune description</span>
                                )}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            
        </div>
    );
}
