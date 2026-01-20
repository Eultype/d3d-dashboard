import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";
import { calculateOrderTotal } from "@/lib/orders";

type CustomerRecentOrdersCardProps = {
    orders: {
        id: string;
        reference: string | null;
        status: string;
        createdAt: Date;
        items: { quantity: number; unitPriceCents: number }[];
        shippingCostCents: number;
        discountType?: string | null;
        discountValue?: number | null;
    }[];
    customerId: string;
};

export function CustomerRecentOrdersCard({ orders, customerId }: CustomerRecentOrdersCardProps) {
    return (
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
                                className="rounded-lg border px-4 py-3 hover:bg-muted/30"
                            >
                                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                    <div className="min-w-0">
                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                            <span className="shrink-0 font-mono text-sm">
                                                {order.reference ?? `#${order.id.slice(0, 8)}`}
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
