// Import Next
import Link from "next/link";
// Import des composants
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
// Import des lib
import { formatDateFR } from "@/lib/utils/dates";
import { formatEUR } from "@/lib/utils/money";
import { CustomerLastOrderItem } from "@/types/customer";

// Composant derniers produits achetés
export function CustomerLastProductsCard({ lastItems }: { lastItems: CustomerLastOrderItem[] }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                {/* Titre de la carte */}
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Derniers produits commandés
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                {/* Si pas de produit commandé par client */}
                {lastItems.length === 0 ? (
                    <p className="text-sm italic text-muted-foreground py-4">
                        Aucun produit commandé pour ce client.
                    </p>
                ) : (
                    lastItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                        >
                            {/* Informations sur le produit et badge quantité */}
                            <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                    {/* Nom du produit */}
                                    <span className="truncate font-semibold">{item.product.name}</span>
                                    {/* Badge quantité */}
                                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold">
                                        ×{item.quantity}
                                    </Badge>
                                </div>

                                {/* Info supplémentaire : SKU, référence commande, date */}
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                    {/* SKU */}
                                    {item.product.sku && (
                                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                                            {item.product.sku}
                                        </code>
                                    )}
                                    <span className="flex items-center gap-1">
                                        {/* Reference */}
                                        Commande <span className="font-medium text-foreground">{item.order.reference || "—"}</span>
                                    </span>
                                    <span>•</span>
                                    {/* Date */}
                                    <span>{formatDateFR(item.order.createdAt)}</span>
                                </div>
                            </div>

                            {/* Total ligne + prix unitaire + bouton voir la commande */}
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    {/* Total */}
                                    <div className="font-bold text-primary">
                                        {formatEUR(item.unitPriceCents * item.quantity)}
                                    </div>
                                    {/* Prix unitaire */}
                                    <div className="text-[10px] text-muted-foreground">
                                        {formatEUR(item.unitPriceCents)} / unité
                                    </div>
                                </div>
                                {/* Bouton voir commande */}
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0"
                                >
                                    <Link href={`/dashboard/orders/${item.orderId}`}>Voir</Link>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
