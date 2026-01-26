// Import Next
import Link from "next/link";
// Import des composants
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Import des libz
import { formatDateFR } from "@/lib/utils/dates";
import { formatEUR } from "@/lib/utils/money";

type ProductRecentOrdersCardProps = {
    lastItems: {
        id: string;
        quantity: number;
        unitPriceCents: number;
        order: {
            id: string;
            reference: string | null;
            createdAt: Date;
            items: { id: string }[];
            customer: {
                name: string | null;
            } | null;
        };
    }[];
    productId: string;
};

import { ProductRecentOrderItem } from "@/types/product";
import { ArrowRight } from "lucide-react";

// Composant des dernières commandes ayant ce produit
export function ProductRecentOrdersCard({ lastItems, productId }: { lastItems: ProductRecentOrderItem[], productId: string }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                {/* Titre de la carte */}
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Dernières commandes contenant ce produit
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                {/* Si aucune commande ne contient ce produit */}
                {lastItems.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4">
                        Aucune commande ne contient ce produit.
                    </p>
                )}

                {/* Liste des dernières commandes */}
                <div className="space-y-4">
                    {lastItems.map((it) => {
                        const order = it.order;
                        const orderHref = `/dashboard/orders/${order.id}`;

                        const lineTotal = formatEUR((it.unitPriceCents ?? 0) * it.quantity);
                        const unit = formatEUR(it.unitPriceCents ?? 0);

                        return (
                            <div
                                key={it.id}
                                className="group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                            >
                                {/* Bloc gauche : informations principales de la commande */}
                                <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                                        {/* Référence commande */}
                                        <span className="font-mono text-sm font-bold text-blue-600">
                                            {order.reference ?? `#${order.id.slice(0, 8)}`}
                                        </span>
                                        {/* Quantité */}
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold">
                                            x{it.quantity}
                                        </Badge>
                                        {order.customer ? (
                                                // Nom du client
                                            <span className="text-sm text-muted-foreground truncate italic">
                                                • {order.customer.name ?? "Client"}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">
                                                • Sans client
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        {formatDateFR(order.createdAt)} •{" "}
                                        {order.items.length} article{order.items.length > 1 ? "s" : ""}
                                    </p>
                                </div>

                                {/* Bloc de droite : montant, prix unitaire et bouton "Voir" */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right leading-tight">
                                        {/* Total */}
                                        <div className="font-bold text-foreground">{lineTotal}</div>
                                        {/* Prix unitaire */}
                                        <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {unit} / unité
                                        </div>
                                    </div>
                                    {/* Bouton voir */}
                                    <Button asChild size="sm" variant="outline" className="shrink-0">
                                        <Link href={orderHref}>Voir</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/*  Lien vers toutes les commandes concernées, affiché seulement si au moins une commande existe. */}
                {lastItems.length > 0 && (
                    <div className="pt-2 text-right">
                        <Link
                            href={`/dashboard/orders?product=${productId}`}
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
