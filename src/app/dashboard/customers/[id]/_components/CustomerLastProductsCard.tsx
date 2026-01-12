import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";

type CustomerLastProductsCardProps = {
    lastItems: {
        id: string;
        quantity: number;
        unitPriceCents: number;
        orderId: string;
        order: {
            createdAt: Date;
        };
        product: {
            name: string;
            sku: string | null;
        };
    }[];
};

export function CustomerLastProductsCard({ lastItems }: CustomerLastProductsCardProps) {
    return (
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
    );
}
