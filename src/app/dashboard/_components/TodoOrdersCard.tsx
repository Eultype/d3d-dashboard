import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
import { formatDateFR } from "@/lib/dates";
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

export function TodoOrdersCard({ orders, countToProcess }: TodoOrdersCardProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">À traiter</CardTitle>
          <p className="text-sm text-muted-foreground">
            Commandes qui nécessitent une action maintenant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="tabular-nums">
            {countToProcess} au total
          </Badge>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>

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
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm">{reference}</span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateFR(o.createdAt)}
                      {o.customer?.name ? ` • ${o.customer.name}` : ""}
                    </p>
                  </div>

                  <Button asChild size="sm" variant="outline" className="shrink-0">
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
