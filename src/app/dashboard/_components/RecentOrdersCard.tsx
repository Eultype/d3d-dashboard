import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
import { formatEUR } from "@/lib/money";
import { formatDateFR } from "@/lib/dates";
import { ArrowRight, Eye } from "lucide-react";

type RecentOrdersCardProps = {
  orders: any[];
};

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Dernières commandes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Les 5 dernières commandes créées
          </p>
        </div>

        <Button asChild variant="ghost" className="gap-2">
          <Link href="/dashboard/orders">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Aucune commande pour le moment.
          </p>
        )}

        {orders.map((o) => {
          const href = `/dashboard/orders/${o.id}`;
          const reference = o.reference ?? `#${o.id.slice(0, 8)}`;

          return (
            <div
              key={o.id}
              className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-mono text-sm shrink-0">{reference}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.customer ? (
                      <>
                        <span className="font-medium text-foreground/90">
                          {o.customer.name ?? "Client sans nom"}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          ({o.customer.email ?? "—"})
                        </span>
                        {" • "}
                      </>
                    ) : (
                      <>
                        <span className="italic">Sans client</span> •{" "}
                      </>
                    )}
                    {formatDateFR(o.createdAt)} •{" "}
                    {o.articlesCount} article{o.articlesCount > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right leading-tight">
                    <div className="font-semibold whitespace-nowrap">
                      {formatEUR(o.totalCents)}
                    </div>
                    <div className="text-xs text-muted-foreground text-nowrap">
                      Total commande
                    </div>
                  </div>

                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <Link href={href}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
