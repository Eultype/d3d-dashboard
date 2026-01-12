import { getCustomerDetails, getCustomerOrders, getCustomerOrderItems } from "@/lib/data/customers";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerContactCard } from "./_components/CustomerContactCard";
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

    const customer = await getCustomerDetails(id);
    const orders = await getCustomerOrders(id);
    const lastItems = await getCustomerOrderItems(id);

    if (!customer) return notFound();

    const shortId = customer.id.slice(0, 10);
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
                        / <span className="text-foreground">#{customer.id.slice(0, 10)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Fiche client #{shortId}</h1>
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

            <CustomerContactCard customer={customer} />

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
