// Import Next
import Link from "next/link";
// Import des composants
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
// Import des lib
import { formatDateFR } from "@/lib/utils/dates";
// Import Lucide-React
import { CheckCircle2 } from "lucide-react";

type TodoOrdersCardProps = {
  orders: {
    id: string;
    reference?: string | null;
    status: string;
    createdAt: Date;
    customer: {
      name: string | null;
    } | null;
  }[];
  countToProcess: number;
};

// Composant des commandes à traiter
export function TodoOrdersCard({ orders, countToProcess }: TodoOrdersCardProps) {
  return (
    <Card className="rounded-lg">
      {/* En-tête de la carte : titre et résumé */}
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">À traiter</CardTitle>
          <p className="text-sm text-muted-foreground">
            Commandes qui nécessitent une action maintenant
          </p>
        </div>

        {/* Indicateur du nombre total à traiter + icône */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="tabular-nums">
            {countToProcess} au total
          </Badge>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>

      {/* Corps de la carte : liste ou message de repos */}
      <CardContent className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Rien d’urgent. 👍
          </p>
        ) : (
          orders.map((o) => {
            const href = `/dashboard/orders/${o.id}`;
            const reference = o.reference ?? `#${o.id.slice(0, 8)}`;

            return (
              <div
                key={o.id}
                className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-center">
                  {/* Partie gauche : informations principales de la commande */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm">{reference}</span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    {/* Informations complémentaires : date puis client si existant */}
                    <p className="mt-2 text-xs text-muted-foreground sm:mt-1">
                      {formatDateFR(o.createdAt)}
                      {o.customer?.name ? ` • ${o.customer.name}` : ""}
                    </p>
                  </div>

                  {/* Partie droite : bouton vers le détail de la commande */}
                  <Button asChild size="sm" variant="outline" className="w-full sm:w-auto shrink-0">
                    <Link href={href}>Ouvrir</Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
