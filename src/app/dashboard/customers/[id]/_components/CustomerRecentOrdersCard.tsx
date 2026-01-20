// Import Next
import Link from "next/link";
// Import des composants
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import des lib
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";
import { orderTotalCents } from "@/lib/orders";

type CustomerRecentOrdersCardProps = {
    orders: {
        id: string;
        reference: string | null;
        status: string;
        createdAt: Date;
        items: { quantity: number; unitPriceCents: number }[];
    }[];
    customerId: string;
};

// Composant commandes récentes
export function CustomerRecentOrdersCard({ orders, customerId }: CustomerRecentOrdersCardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-1">
            <Card>
                <CardHeader>
                    {/* Titre de la carte */}
                    <CardTitle className="text-sm text-muted-foreground">
                        Commandes récentes
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Si aucune commande pour ce client */}
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
                                    {/* Informations principales de la commande */}
                                    <div className="min-w-0">
                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                            {/* Réference */}
                                            <span className="shrink-0 font-mono text-sm">
                                                {order.reference ?? `#${order.id.slice(0, 8)}`}
                                            </span>
                                            {/* Statut */}
                                            <Badge variant="secondary" className="shrink-0">
                                                {order.status}
                                            </Badge>
                                        </div>

                                        {/* Date de création & nombre d’articles */}
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {formatDateFR(new Date(order.createdAt))} •{" "}
                                            {order.items.length} article
                                            {order.items.length > 1 ? "s" : ""}
                                        </p>
                                    </div>

                                    {/* Total de la commande & bouton d’accès au détail */}
                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <div className="leading-tight">
                                            {/* Total */}
                                            <div className="whitespace-nowrap text-left font-semibold md:text-right">
                                                {total}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Total de la commande
                                            </div>
                                        </div>

                                        {/* Bouton d'accès au détail de la commande */}
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

                    {/* Lien vers la liste complète si au moins une commande existe */}
                    {orders.length > 0 && (
                        <div className="pt-2 text-right">
                            <Link
                                href={`/dashboard/orders?customer=${customerId}`}
                                className="text-sm underline"
                            >
                                Voir toutes les commandes →
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
