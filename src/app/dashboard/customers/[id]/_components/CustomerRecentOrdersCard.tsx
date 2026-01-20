// Import Next
import Link from "next/link";
// Import des composants
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import des lib
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";
import { calculateOrderTotal } from "@/lib/orders";
import { CustomerRecentOrder } from "@/types/customer";
import { ArrowRight } from "lucide-react";

// Composant commandes récentes
export function CustomerRecentOrdersCard({ orders, customerId }: { orders: CustomerRecentOrder[], customerId: string }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                {/* Titre de la carte */}
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Commandes récentes
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                {/* Si aucune commande pour ce client */}
                {orders.length === 0 && (
                    <p className="text-sm italic text-muted-foreground py-4">
                        Aucune commande pour ce client.
                    </p>
                )}

                <div className="space-y-4">
                    {orders.map((order) => {
                        const { totalCents } = calculateOrderTotal(
                            order.items,
                            order.shippingCostCents,
                            order.discountType,
                            order.discountValue
                        );
                        const total = formatEUR(totalCents);

                        return (
                            <div
                                key={order.id}
                                className="group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                            >
                                {/* Informations principales de la commande */}
                                <div className="min-w-0 space-y-1">
                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                        {/* Réference */}
                                        <span className="font-mono text-sm font-bold text-blue-600">
                                            {order.reference ?? `#${order.id.slice(0, 8)}`}
                                        </span>
                                        {/* Statut */}
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold">
                                            {order.status}
                                        </Badge>
                                    </div>

                                    {/* Date de création & nombre d’articles */}
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateFR(order.createdAt)} •{" "}
                                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                                    </p>
                                </div>

                                {/* Total de la commande & bouton d’accès au détail */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right leading-tight">
                                        {/* Total */}
                                        <div className="whitespace-nowrap font-bold text-foreground">
                                            {total}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
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
                        );
                    })}
                </div>

                {/* Lien vers la liste complète si au moins une commande existe */}
                {orders.length > 0 && (
                    <div className="pt-2 text-right">
                        <Link
                            href={`/dashboard/orders?customer=${customerId}`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                        >
                            Voir toutes les commandes <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}