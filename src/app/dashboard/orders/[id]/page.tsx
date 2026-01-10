// src/app/dashboard/orders/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, FileText, Image as ImageIcon } from "lucide-react";

import { formatEUR } from "@/lib/money";
import { orderTotalCents, statusLabelFR } from "@/lib/orders";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
import { formatDateTimeFR } from "@/lib/dates";
import { isImageUrl } from "@/lib/strings";

// -----------------------------
// UI helpers
// -----------------------------
function MetaChip({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="rounded-xl border bg-muted/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-sm font-medium">{value}</p>
        </div>
    );
}

function SectionTitle({ children }: { children: ReactNode }) {
    return <h3 className="text-sm font-semibold text-foreground">{children}</h3>;
}

function InfoRow({ label, value }: { label: ReactNode; value: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-sm font-medium text-right">{value}</div>
        </div>
    );
}

function StepperFR({ current }: { current: string }) {
    const steps = [
        { key: "A_VERIFIER", label: "Confirmation" },
        { key: "PROD", label: "Traitement" },
        { key: "EXPEDITION", label: "Expédition" },
        { key: "TERMINE", label: "Livrée" },
    ];

    const idx = Math.max(
        0,
        steps.findIndex((s) => s.key === current)
    );

    return (
        <div className="grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => {
                const done = i < idx;
                const active = i === idx;

                return (
                    <div key={s.key} className="rounded-2xl border bg-background p-3">
                        <div className="flex items-center gap-2">
                            <span
                                className={[
                                    "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                                    done ? "bg-foreground text-background border-foreground" : "",
                                    active ? "border-foreground" : "text-muted-foreground",
                                ].join(" ")}
                            >
                                {i + 1}
                            </span>

                            <p className={["text-sm font-medium", active ? "" : "text-muted-foreground"].join(" ")}>
                                {s.label}
                            </p>
                        </div>

                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={[
                                    "h-full rounded-full bg-foreground transition-all",
                                    done ? "w-full" : active ? "w-2/3" : "w-0",
                                ].join(" ")}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// -----------------------------
// Page
// -----------------------------
export default async function OrderDetailPage({
                                                  params,
                                              }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            items: {
                include: { product: true },
                orderBy: { createdAt: "asc" },
            },
            notes: {
                include: { user: true },
                orderBy: { createdAt: "desc" },
            },
            files: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!order) return notFound();

    const shortId = order.id.slice(0, 10);
    const { date: createdDate, time: createdTime } = formatDateTimeFR(new Date(order.createdAt));

    const sousTotalCents = orderTotalCents(order.items);
    const livraisonCents = 0;
    const tvaCents = 0;
    const totalCents = sousTotalCents + livraisonCents + tvaCents;

    const lignesCount = order.items.length;
    const articlesCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/orders" className="hover:underline">
                            Commandes
                        </Link>{" "}
                        / <span className="font-mono">#{shortId}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Commande #{shortId}</h1>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>Détails de la commande</span>
                        <span>•</span>
                        <span>
              {createdDate} à {createdTime}
            </span>
                        <span>•</span>
                        <span className="font-medium text-foreground">
              {articlesCount} article{articlesCount > 1 ? "s" : ""}
            </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild>
                        <Link href={`/dashboard/orders/${order.id}/edit`}>Modifier la commande</Link>
                    </Button>

                    <Button asChild variant="ghost">
                        <Link href="/dashboard/orders">← Retour</Link>
                    </Button>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-4 lg:grid-cols-12 items-start">
                {/* Colonne gauche */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Progress */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">Progression</CardTitle>
                                    <p className="text-sm text-muted-foreground">Statut actuel de la commande</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Actuel</p>
                                    <p className="text-sm font-semibold">{statusLabelFR(order.status)}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StepperFR current={order.status} />
                        </CardContent>
                    </Card>

                    {/* Produits */}


                    {/* Notes + Fichiers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    </div>
                </div>

                {/* Colonne droite */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Récapitulatif (à la place de Paiement) */}

                </div>
            </div>
        </div>
    );
}

