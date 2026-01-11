// src/app/dashboard/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
import { formatEUR } from "@/lib/money";
import { orderTotalCents } from "@/lib/orders";

import {
  ClipboardList,
  AlertCircle,
  Factory,
  Truck,
  Store,
  Plus,
  ArrowRight,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "D3D | Dashboard | Vue d'ensemble",
  description:
      "Vue d’ensemble orientée actions : pipeline des commandes + accès rapide aux dernières commandes et aux urgences.",
};

// ⚠️ Adapte si tes statuts diffèrent
const STATUS = {
  A_VERIFIER: "A_VERIFIER",
  PROD: "PROD",
  A_EXPEDIER: "A_EXPEDIER",
  A_RECUPERER: "A_RECUPERER",
  TERMINE: "TERMINE",
} as const;

type OrderLite = {
  id: string;
  status: string;
  createdAt: Date;
  customer: { name: string | null; email: string | null } | null;
  items: { quantity: number; unitPriceCents: number }[];
};

function formatDateShortFR(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(d);
}

function StatItem({
                    icon,
                    label,
                    value,
                    hint,
                  }: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
      <div className="rounded-lg border bg-background px-4 py-3 shadow-sm transition-colors hover:bg-muted/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
              {icon}
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wide">{label}</div>
          </div>
        </div>

        <div className="mt-3 text-xl font-bold tabular-nums leading-tight">{value}</div>
        {hint ? (
            <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{hint}</div>
        ) : null}
      </div>
  );
}

function shortOrderId(id: string) {
  return id.slice(0, 10);
}

function customerLabel(c: OrderLite["customer"]) {
  if (!c) return { primary: "Sans client", secondary: "" };
  return {
    primary: c.name ?? "Client sans nom",
    secondary: c.email ?? "—",
  };
}

export default async function DashboardPage() {
  /**
   * Idée “pro” :
   * - Cards : pipeline commandes (le + utile)
   * - Dernières commandes : top 5
   * - À traiter : top 5 parmi les statuts actionnables (pas seulement parmi les dernières)
   */
  const actionableStatuses = [STATUS.A_VERIFIER, STATUS.A_EXPEDIER, STATUS.A_RECUPERER];

  const [
    countToVerify,
    countInProd,
    countToShip,
    countToPickUp,
    countDone,

    lastOrders,
    todoOrders,

    // Bonus utile (tu peux enlever si tu veux ultra-minimal)
    monthCa,
  ] = await Promise.all([
    prisma.order.count({ where: { status: STATUS.A_VERIFIER } }),
    prisma.order.count({ where: { status: STATUS.PROD } }),
    prisma.order.count({ where: { status: STATUS.A_EXPEDIER } }),
    prisma.order.count({ where: { status: STATUS.A_RECUPERER } }),
    prisma.order.count({ where: { status: STATUS.TERMINE } }),

    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: true,
        items: { select: { quantity: true, unitPriceCents: true } },
      },
    }),

    prisma.order.findMany({
      where: { status: { in: actionableStatuses } },
      orderBy: { createdAt: "asc" }, // les plus anciennes d’abord (plus urgent)
      take: 5,
      include: {
        customer: true,
        items: { select: { quantity: true, unitPriceCents: true } },
      },
    }),

    // CA du mois (terminées uniquement)
    (async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const doneThisMonth = await prisma.order.findMany({
        where: {
          status: STATUS.TERMINE,
          createdAt: { gte: start, lt: end },
        },
        include: { items: true },
      });

      const cents = doneThisMonth.reduce((sum, o) => sum + orderTotalCents(o.items), 0);
      return cents;
    })(),
  ]);

  const inProgress = countToVerify + countInProd + countToShip + countToPickUp;
  const toProcessTotal = countToVerify + countToShip + countToPickUp;

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>{" "}
              / <span className="text-foreground">Vue d’ensemble</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Pipeline des commandes + accès rapide aux actions.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild>
              <Link href="/dashboard/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle commande
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau client
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau produit
              </Link>
            </Button>
          </div>
        </div>

        {/* Cards pipeline (focus commandes) */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatItem
              icon={<ClipboardList className="h-4 w-4" />}
              label="En cours"
              value={inProgress}
              hint="Commandes actives"
          />

          <StatItem
              icon={<AlertCircle className="h-4 w-4" />}
              label="À vérifier"
              value={countToVerify}
              hint="Priorité"
          />

          <StatItem
              icon={<Factory className="h-4 w-4" />}
              label="En production"
              value={countInProd}
              hint="Atelier"
          />

          <StatItem
              icon={<Truck className="h-4 w-4" />}
              label="À expédier"
              value={countToShip}
              hint="Prêtes à envoyer"
          />

          <StatItem
              icon={<Store className="h-4 w-4" />}
              label="À récupérer"
              value={countToPickUp}
              hint="Click & collect"
          />
        </div>

        {/* 2 colonnes: Dernières commandes + À traiter */}
        <div className="grid gap-4 xl:grid-cols-2 items-stretch">
          {/* Dernières commandes */}
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
              {lastOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Aucune commande pour le moment.
                  </p>
              )}

              {(lastOrders as OrderLite[]).map((o) => {
                const href = `/dashboard/orders/${o.id}`;
                const id = shortOrderId(o.id);

                const totalCents = orderTotalCents(o.items);
                const total = formatEUR(totalCents);

                const { primary, secondary } = customerLabel(o.customer);

                const articlesCount = o.items.reduce((s, it) => s + it.quantity, 0);

                return (
                    <div
                        key={o.id}
                        className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                        {/* gauche */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm">#{id}</span>
                            <OrderStatusBadge status={o.status} />
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {o.customer ? (
                                <>
                                  <span className="font-medium text-foreground/90">{primary}</span>{" "}
                                  <span className="text-muted-foreground">({secondary})</span>
                                  {" • "}
                                </>
                            ) : (
                                <>
                                  <span className="italic">Sans client</span> •{" "}
                                </>
                            )}
                            {formatDateShortFR(new Date(o.createdAt))} • {articlesCount} article
                            {articlesCount > 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* droite */}
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <div className="text-right leading-tight">
                            <div className="font-semibold whitespace-nowrap">{total}</div>
                            <div className="text-xs text-muted-foreground">Total commande</div>
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

          {/* À traiter (le vrai truc utile) */}
          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">À traiter</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Commandes qui nécessitent une action maintenant
                </p>
              </div>

              <Badge variant="secondary" className="tabular-nums">
                {toProcessTotal} au total
              </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
              {todoOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Rien d’urgent. 👍
                  </p>
              ) : (
                  (todoOrders as OrderLite[]).map((o) => {
                    const href = `/dashboard/orders/${o.id}`;
                    const id = shortOrderId(o.id);
                    const { primary } = customerLabel(o.customer);

                    return (
                        <div
                            key={o.id}
                            className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
                        >
                          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm">#{id}</span>
                                <OrderStatusBadge status={o.status} />
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatDateShortFR(new Date(o.createdAt))}
                                {o.customer ? ` • ${primary}` : " • Sans client"}
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

              <div className="pt-1 flex items-center justify-between">
                {/* Bonus pro (ultra utile) : CA du mois */}
                <div className="text-xs text-muted-foreground">
                  CA du mois :{" "}
                  <span className="font-medium text-foreground">{formatEUR(monthCa)}</span>
                </div>

                <Link href="/dashboard/orders" className="text-sm underline">
                  Aller aux commandes →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/orders">Voir les commandes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/customers">Voir les clients</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/products">Voir les produits</Link>
          </Button>
        </div>
      </div>
  );
}
