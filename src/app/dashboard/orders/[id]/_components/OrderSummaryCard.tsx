import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { formatEUR } from "@/lib/utils/money";

type OrderSummaryCardProps = {
    orderId: string;
    sousTotalCents: number;
    livraisonCents: number;
    shippingType?: string | null;
    tvaCents: number;
    taxRate?: number;
    totalCents: number;
    discountAmountCents?: number;
};

export function OrderSummaryCard({
    orderId,
    sousTotalCents,
    livraisonCents,
    shippingType,
    tvaCents,
    taxRate = 21,
    totalCents,
    discountAmountCents = 0,
}: OrderSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                        <CardTitle className="text-base">Récapitulatif</CardTitle>
                        <p className="text-sm text-muted-foreground">Total de la commande</p>
                    </div>

                    <Button asChild variant="outline" size="sm" className="shrink-0">
                        <Link href={`/print/orders/${orderId}/facture`} target="_blank" rel="noreferrer">
                            Facture
                        </Link>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <InfoRow label="Sous-total" value={<span className="tabular-nums">{formatEUR(sousTotalCents)}</span>} />
                
                {discountAmountCents > 0 && (
                    <InfoRow 
                        label={<span className="text-green-600">Remise</span>}
                        value={<span className="tabular-nums text-green-600">-{formatEUR(discountAmountCents)}</span>} 
                    />
                )}

                <InfoRow 
                    label={shippingType ? `Livraison (${shippingType})` : "Livraison"} 
                    value={<span className="tabular-nums">{formatEUR(livraisonCents)}</span>} 
                />
                <div className="h-px bg-border" />
                <div className="space-y-1">
                    <InfoRow
                        label={<span className="font-semibold text-foreground">Total</span>}
                        value={<span className="font-bold tabular-nums">{formatEUR(totalCents)}</span>}
                    />
                    <div className="flex justify-end">
                        <span className="text-[11px] text-muted-foreground italic">
                            Dont TVA ({taxRate}%) : {formatEUR(tvaCents)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
