import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";

type ProductRecentOrdersCardProps = {
    lastItems: {
        id: string;
        quantity: number;
        unitPriceCents: number;
        order: {
            id: string;
            createdAt: Date;
            items: any[];
            customer: {
                name: string | null;
            } | null;
        };
    }[];
    productId: string;
};

export function ProductRecentOrdersCard({ lastItems, productId }: ProductRecentOrdersCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Dernières commandes contenant ce produit
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {lastItems.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        Aucune commande ne contient ce produit.
                    </p>
                )}

                {lastItems.map((it) => {
                    const order = it.order;
                    const orderHref = `/dashboard/orders/${order.id}`;

                    const lineTotal = formatEUR((it.unitPriceCents ?? 0) * it.quantity);
                    const unit = formatEUR(it.unitPriceCents ?? 0);

                    return (
                        <div
                            key={it.id}
                            className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
                        >
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                                {/* GAUCHE */}
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                                        <span className="font-mono text-sm shrink-0">
                                            #{order.id.slice(0, 8)}
                                        </span>
                                        <Badge variant="secondary" className="shrink-0">
                                            x{it.quantity}
                                        </Badge>
                                        {order.customer ? (
                                            <span className="text-sm text-muted-foreground truncate">
                                                • {order.customer.name ?? "Client"}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">
                                                • Sans client
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDateFR(new Date(order.createdAt))} •{" "}
                                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                                    </p>
                                </div>

                                {/* DROITE */}
                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <div className="text-left md:text-right leading-tight">
                                        <div className="font-semibold whitespace-nowrap">{lineTotal}</div>
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            {unit} / unité
                                        </div>
                                    </div>

                                    <Button asChild size="sm" variant="outline" className="shrink-0">
                                        <Link href={orderHref}>Voir</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {lastItems.length > 0 && (
                    <div className="pt-2 text-right">
                        <Link
                            href={`/dashboard/orders?product=${productId}`}
                            className="text-sm underline"
                        >
                            Voir toutes les commandes →
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
