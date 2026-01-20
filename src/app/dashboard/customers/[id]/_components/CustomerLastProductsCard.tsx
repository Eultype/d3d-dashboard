// Import Next
import Link from "next/link";
// Import des composants
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import des lib
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

// Composant dernier produit commandé
export function CustomerLastProductsCard({ lastItems }: CustomerLastProductsCardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-1">
            <Card>
                <CardHeader>
                    {/* Titre de la carte */}
                    <CardTitle className="text-sm text-muted-foreground">
                        Derniers produits commandés
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Si pas de produit commandé par client */}
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
                                    {/* Informations sur le produit et badge quantité */}
                                    <div className="min-w-0">
                                        <div className="flex min-w-0 items-center gap-2">
                                            {/* Nom du produit*/}
                                            <p className="min-w-0 truncate font-medium">
                                                {it.product.name}
                                            </p>
                                            {/* Badge quantité */}
                                            <Badge variant="secondary" className="shrink-0">
                                                x{it.quantity}
                                            </Badge>
                                        </div>

                                        {/* Info supplémentaire : SKU, référence commande, date */}

                                        <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
                                            {/* SKU */}
                                            {it.product.sku && (
                                                <span className="font-mono">{it.product.sku} •</span>
                                            )}
                                            <span>
                                                {/* Reference */}
                                                Commande {it.order.reference} •{" "}
                                                {/* Date */}
                                                {formatDateFR(new Date(it.order.createdAt))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Total ligne + prix unitaire + bouton voir la commande */}
                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <div className="leading-tight">
                                            {/* Total */}
                                            <div className="whitespace-nowrap font-semibold">
                                                {lineTotal}
                                            </div>
                                            {/* Prix unitaire */}
                                            <div className="whitespace-nowrap text-xs text-muted-foreground">
                                                {unit} / unité
                                            </div>
                                        </div>

                                        {/* Bouton voir commande */}
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
