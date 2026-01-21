// Import Next
import Link from "next/link";
// Import des composants
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
// Import des lib
import { formatEUR } from "@/lib/money";
import { formatDateFR } from "@/lib/dates";
// Import Lucide-React
import { ArrowRight, Eye } from "lucide-react";

type RecentOrdersCardProps = {
  orders: {
    id: string;
    reference?: string | null;
    status: string;
    createdAt: Date;
    totalCents: number;
    articlesCount: number;
    customer: {
      name: string | null;
      email: string | null;
    } | null;
  }[];
};

// Composant des commandes récentes
export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Card className="rounded-lg">
      {/* En-tête de la carte avec le titre et le bouton "Voir tout" */}
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          {/* Titre et description de la section */}
          <CardTitle className="text-base">Dernières commandes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Les 5 dernières commandes créées
          </p>
        </div>

        {/* Bouton pour accéder à la liste complète des commandes */}
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/dashboard/orders">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      {/* Contenu principal de la carte : liste des commandes ou message si aucune */}
      <CardContent className="space-y-3">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Aucune commande pour le moment.
          </p>
        )}

        {/* Parcours et affichage de chaque commande */}
        {orders.map((o) => {
          const href = `/dashboard/orders/${o.id}`;
          const reference = o.reference ?? `#${o.id.slice(0, 8)}`;

          return (
            <div
              key={o.id}
              className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
                {/* Partie gauche : informations principales sur la commande */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
                    <div className="flex items-center gap-2">
                      {/* Affiche de la reference */}
                      <span className="font-mono text-sm shrink-0">{reference}</span>
                      {/* Badge de statut */}
                      <OrderStatusBadge status={o.status} />
                    </div>
                    {/* Prix visible ici sur mobile pour gain de place */}
                    <div className="font-semibold sm:hidden">
                      {formatEUR(o.totalCents)}
                    </div>
                  </div>

                  {/* Détails : nom du client, date, nombre d’articles */}
                  <p className="mt-2 text-xs text-muted-foreground sm:mt-1">
                    {o.customer ? (
                      <>
                        <span className="font-medium text-foreground/90">
                          {o.customer.name ?? "Client sans nom"}
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

                {/* Partie droite : actions et affichage du prix sur desktop */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="hidden sm:block text-right leading-tight">
                    <div className="font-semibold whitespace-nowrap">
                      {formatEUR(o.totalCents)}
                    </div>
                    <div className="text-xs text-muted-foreground text-nowrap">
                      Total commande
                    </div>
                  </div>

                  {/* Bouton d'accès au détail de la commande */}
                  <Button asChild size="sm" variant="outline" className="w-full sm:w-auto shrink-0">
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
