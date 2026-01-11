import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerTypeBadge } from "@/components/badges/customer-type-badge";
import { formatEUR } from "@/lib/money";
import { orderTotalCents } from "@/lib/orders";
import { formatDateFR, formatDateTimeFR } from "@/lib/dates";

export default async function CustomerDetailPage({
                                                     params,
                                                 }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const customer = await prisma.customer.findUnique({
        where: { id },
    });

    const orders = await prisma.order.findMany({
        where: { customerId: id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            items: true,
        },
    });

    const lastItems = await prisma.orderItem.findMany({
        where: {
            order: { customerId: id },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        include: {
            product: true,
            order: true,
        },
    });

    if (!customer) return notFound();

    // ✅ Date + heure via 1 seule fonction (plus propre)
    const { date: createdDate, time: createdTime } = formatDateTimeFR(
        new Date(customer.createdAt)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/customers" className="hover:underline">
                            Clients
                        </Link>{" "}
                        / <span className="font-mono">#{customer.id.slice(0, 10)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Fiche client</h1>
                        <CustomerTypeBadge companyName={customer.companyName} />
                        <CustomerActiveBadge isActive={customer.isActive} />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Créé le {createdDate} à {createdTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/customers">← Retour</Link>
                    </Button>
                </div>
            </div>

            {/* Coordonnées */}
            <div className="grid gap-1 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Coordonnées
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
                            {/* Nom - Email - Tél - Entreprise - TVA */}
                            <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
                <span className="text-right font-semibold text-gray-700">
                  Nom / Prénom
                </span>
                                <div className="row-span-3 w-[2px] self-stretch bg-gray-300" />
                                <span>{customer.name}</span>

                                <span className="text-right font-semibold text-gray-700">
                  Email
                </span>
                                <span>{customer.email}</span>

                                <span className="text-right font-semibold text-gray-700">
                  Téléphone
                </span>
                                <span>{customer.phone}</span>

                                <span className="text-right font-semibold text-gray-700">
                  Entreprise
                </span>
                                <div className="row-span-2 w-[2px] self-stretch bg-gray-300" />
                                <span>
                  {customer.companyName?.trim() ? (
                      customer.companyName
                  ) : (
                      <span className="italic text-muted-foreground">
                      Particulier
                    </span>
                  )}
                </span>

                                <span className="text-right font-semibold text-gray-700">
                  Numéro de TVA
                </span>
                                <span>
                  {customer.vatNumber?.trim() ? (
                      customer.vatNumber
                  ) : (
                      <span className="text-muted-foreground">❌</span>
                  )}
                </span>
                            </div>

                            {/* Adresse */}
                            <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
                <span className="text-right font-semibold text-gray-700">
                  Ligne 1
                </span>
                                <div className="row-span-5 w-[2px] self-stretch bg-gray-300" />
                                <span>{customer.addressLine1}</span>

                                <span className="text-right text-muted-foreground">Ligne 2</span>
                                <span>
                  {customer.addressLine2?.trim() ? (
                      customer.addressLine2
                  ) : (
                      <span className="italic text-muted-foreground">Maison</span>
                  )}
                </span>

                                <span className="text-right font-semibold text-gray-700">
                  Code postal
                </span>
                                <span>{customer.postalCode}</span>

                                <span className="text-right font-semibold text-gray-700">
                  Ville
                </span>
                                <span>{customer.city}</span>

                                <span className="text-right font-semibold text-gray-700">
                  Pays
                </span>
                                <span>{customer.country}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Blocs bas */}
            <div className="grid items-stretch gap-4 xl:grid-cols-2">
                {/* Commandes récentes */}
                <div className="grid gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Commandes récentes
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {orders.length === 0 && (
                                <p className="text-sm italic text-muted-foreground">
                                    Aucune commande pour ce client.
                                </p>
                            )}

                            {orders.map((order) => {
                                const totalCents = orderTotalCents(order.items);
                                const total = formatEUR(totalCents);

                                return (
                                    <div
                                        key={order.id}
                                        className="rounded-lg border px-4 py-3 hover:bg-muted/30"
                                    >
                                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="shrink-0 font-mono text-sm">
                            #{order.id.slice(0, 8)}
                          </span>
                                                    <Badge variant="secondary" className="shrink-0">
                                                        {order.status}
                                                    </Badge>
                                                </div>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatDateFR(new Date(order.createdAt))} •{" "}
                                                    {order.items.length} article
                                                    {order.items.length > 1 ? "s" : ""}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                <div className="leading-tight">
                                                    <div className="whitespace-nowrap text-left font-semibold md:text-right">
                                                        {total}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Total de la commande
                                                    </div>
                                                </div>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="shrink-0"
                                                >
                                                    <Link href={`/dashboard/orders/${order.id}`}>Voir</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {orders.length > 0 && (
                                <div className="pt-2 text-right">
                                    <Link
                                        href={`/dashboard/orders?customer=${customer.id}`}
                                        className="text-sm underline"
                                    >
                                        Voir toutes les commandes →
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Derniers produits */}
                <div className="grid gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Derniers produits commandés
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {lastItems.length === 0 && (
                                <p className="text-sm italic text-muted-foreground">
                                    Aucun produit commandé pour ce client.
                                </p>
                            )}

                            {lastItems.map((it) => {
                                const unit = formatEUR(it.unitPriceCents);
                                const lineTotal = formatEUR(it.unitPriceCents * it.quantity);

                                return (
                                    <div
                                        key={it.id}
                                        className="rounded-lg border px-4 py-3 hover:bg-muted/30"
                                    >
                                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <p className="min-w-0 truncate font-medium">
                                                        {it.product.name}
                                                    </p>
                                                    <Badge variant="secondary" className="shrink-0">
                                                        x{it.quantity}
                                                    </Badge>
                                                </div>

                                                <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
                                                    {it.product.sku && (
                                                        <span className="font-mono">{it.product.sku} •</span>
                                                    )}
                                                    <span>
                                                        Commande #{it.orderId.slice(0, 8)} •{" "}
                                                        {formatDateFR(new Date(it.order.createdAt))}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                <div className="leading-tight">
                                                    <div className="whitespace-nowrap font-semibold">
                                                        {lineTotal}
                                                    </div>
                                                    <div className="whitespace-nowrap text-xs text-muted-foreground">
                                                        {unit} / unité
                                                    </div>
                                                </div>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="shrink-0"
                                                >
                                                    <Link href={`/dashboard/orders/${it.orderId}`}>Voir</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
