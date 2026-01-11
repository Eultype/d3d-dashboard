// src/app/dashboard/orders/page.tsx
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { OrdersTable } from "@/components/dashboard/orders-table";
import { Button } from "@/components/ui/button";

import {
    ClipboardList,
    AlertCircle,
    Factory,
    CheckCircle2,
    Euro,
} from "lucide-react";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des commandes",
    description:
        "Gérez et suivez l’ensemble des commandes : statuts, détails, historique et actions associées.",
};

function computeOrderTotals(items: { quantity: number; unitPriceCents: number }[]) {
    const articlesCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalCents = items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
    return { articlesCount, totalCents };
}

function sumCents(values: number[]) {
    return values.reduce((s, v) => s + v, 0);
}

function formatEUR(cents: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format((cents ?? 0) / 100);
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
    hint?: string;
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
            {hint ? <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{hint}</div> : null}
        </div>
    );
}

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            customer: true,
            items: {
                select: {
                    quantity: true,
                    unitPriceCents: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const rows = orders.map((o) => {
        const { articlesCount, totalCents } = computeOrderTotals(o.items);
        return {
            id: o.id,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            articlesCount,
            totalCents,
            customer: o.customer
                ? {
                    name: o.customer.name,
                    email: o.customer.email,
                }
                : null,
        };
    });

    // Stats
    const totalOrders = orders.length;
    const aVerifier = orders.filter((o) => o.status === "A_VERIFIER").length;
    const enProd = orders.filter((o) => o.status === "PROD").length;
    const terminees = orders.filter((o) => o.status === "TERMINE").length;

    const caTotalCents = sumCents(rows.map((r) => r.totalCents));
    const aTraiter = aVerifier + enProd;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <span className="text-foreground">Commandes</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Commandes</h1>
                        <p className="text-sm text-muted-foreground">Gestion des commandes de gravure 2D-3D</p>
                    </div>
                </div>

                <Button asChild>
                    <Link href="/dashboard/orders/new">Nouvelle commande</Link>
                </Button>
            </div>

            {/* Stats (sans “Aperçu”, juste les 5 cards) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <StatItem
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Commandes"
                    value={totalOrders}
                    hint="Total"
                />

                <StatItem
                    icon={<AlertCircle className="h-4 w-4" />}
                    label="À vérifier"
                    value={aVerifier}
                    hint="À confirmer"
                />

                <StatItem
                    icon={<Factory className="h-4 w-4" />}
                    label="En production"
                    value={enProd}
                    hint="En cours"
                />

                <StatItem
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Terminées"
                    value={terminees}
                    hint="Livrées"
                />

                <StatItem
                    icon={<Euro className="h-4 w-4" />}
                    label="CA total"
                    value={formatEUR(caTotalCents)}
                    hint={`Hors livraison / TVA`}
                />
            </div>

            {/* Table */}
            <OrdersTable orders={rows} />
        </div>
    );
}
