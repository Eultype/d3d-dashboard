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
                    <div key={s.key} className="rounded-xl border bg-background p-3">
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
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-base">Produits</CardTitle>
                                <p className="text-sm text-muted-foreground">Articles de la commande</p>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-b-2xl border-t">
                                <div className="grid grid-cols-12 bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">
                                    <div className="col-span-5">Article</div>
                                    <div className="col-span-2 text-center">Statut</div>
                                    <div className="col-span-1 text-center">Qté</div>
                                    <div className="col-span-2 text-right">Prix</div>
                                    <div className="col-span-2 text-right">Montant</div>
                                </div>

                                {order.items.length === 0 ? (
                                    <div className="px-4 py-6 text-sm text-muted-foreground italic">Aucun produit.</div>
                                ) : (
                                    <div className="divide-y">
                                        {order.items.map((it) => {
                                            const name = it.product?.name ?? "Produit supprimé";
                                            const sku = it.product?.sku ?? "—";
                                            const unit = formatEUR(it.unitPriceCents);
                                            const amount = formatEUR(it.unitPriceCents * it.quantity);

                                            const lineStatus =
                                                order.status === "TERMINE" ? "Livré" : order.status === "PROD" ? "En cours" : "En attente";

                                            const imgSrc = it.product?.imageUrl ?? "";

                                            return (
                                                <div key={it.id} className="grid grid-cols-12 items-center px-4 py-3">
                                                    {/* Article */}
                                                    <div className="col-span-5 min-w-0">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="relative h-10 w-10 overflow-hidden rounded-xl border bg-muted/40 shadow-sm">
                                                                {imgSrc ? (
                                                                    <Image
                                                                        src={imgSrc}
                                                                        alt={name}
                                                                        fill
                                                                        sizes="40px"
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-muted-foreground">
                                                                        {name.slice(0, 1).toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold truncate">{name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {sku} • {unit}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Statut */}
                                                    <div className="col-span-2 flex justify-center">
                                                        <Badge variant={order.status === "TERMINE" ? "outline" : "secondary"}>{lineStatus}</Badge>
                                                    </div>

                                                    {/* Qté */}
                                                    <div className="col-span-1 text-center">
                                                        <span className="inline-flex rounded-lg border bg-background px-2 py-1 text-sm font-semibold tabular-nums">
                                                            {it.quantity}
                                                        </span>
                                                    </div>

                                                    {/* Prix */}
                                                    <div className="col-span-2 text-right text-sm tabular-nums">{unit}</div>

                                                    {/* Montant */}
                                                    <div className="col-span-2 text-right text-sm font-semibold tabular-nums">{amount}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes + Fichiers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notes</CardTitle>
                                <p className="text-sm text-muted-foreground">Notes internes sur la commande</p>
                            </CardHeader>
                            <CardContent>
                                {order.notes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">Aucune note.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {order.notes.map((note) => (
                                            <div key={note.id} className="text-sm">
                                                <p>{note.content}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Par {note.user.email} • {new Date(note.createdAt).toLocaleDateString("fr-FR")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Fichiers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Fichiers</CardTitle>
                                <p className="text-sm text-muted-foreground">Fichiers joints à la commande</p>
                            </CardHeader>
                            <CardContent>
                                {order.files.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">Aucun fichier.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {order.files.map((file) => {
                                            const isImg = isImageUrl(file.url);

                                            return (
                                                <div
                                                    key={file.id}
                                                    className="group flex items-center justify-between gap-3 rounded-xl border p-3 hover:bg-muted/30 transition"
                                                >
                                                    {/* Left */}
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="relative h-9 w-9 overflow-hidden rounded-lg border bg-muted/30">
                                                            {isImg ? (
                                                                <Image
                                                                    src={file.url}
                                                                    alt={file.filename}
                                                                    fill
                                                                    sizes="36px"
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                                    <FileText className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium truncate">{file.filename}</p>
                                                            <p className="text-xs text-muted-foreground">{isImg ? "Image" : "Document"}</p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                                                            title="Voir"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>

                                                        <a
                                                            href={file.url}
                                                            download
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                                                            title="Télécharger"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Colonne droite */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Récapitulatif (à la place de Paiement) */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">Récapitulatif</CardTitle>
                                    <p className="text-sm text-muted-foreground">Total de la commande</p>
                                </div>

                                <Button asChild variant="outline">
                                    <Link href={`/print/orders/${order.id}/facture`} target="_blank" rel="noreferrer">
                                        Facture
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <InfoRow label="Sous-total" value={<span className="tabular-nums">{formatEUR(sousTotalCents)}</span>} />
                            <InfoRow label="Livraison" value={<span className="tabular-nums">{formatEUR(livraisonCents)}</span>} />
                            <InfoRow label="TVA" value={<span className="tabular-nums">{formatEUR(tvaCents)}</span>} />
                            <div className="h-px bg-border" />
                            <InfoRow
                                label={<span className="font-semibold text-foreground">Total</span>}
                                value={<span className="font-bold tabular-nums">{formatEUR(totalCents)}</span>}
                            />

                            <div className="grid gap-3 pt-2 sm:grid-cols-2">
                                <MetaChip label="Lignes" value={lignesCount} />
                                <MetaChip label="Articles" value={articlesCount} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Client</CardTitle>
                                {order.customer?.id ? (
                                    <Link className="text-sm underline" href={`/dashboard/customers/${order.customer.id}`}>
                                        Ouvrir →
                                    </Link>
                                ) : null}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-xl border p-3">
                                <SectionTitle>Informations générales</SectionTitle>

                                <div className="mt-3 space-y-2">
                                    <InfoRow label="Nom" value={order.customer?.name ?? "—"} />
                                    <InfoRow label="Téléphone" value={order.customer?.phone ?? "—"} />

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium break-all text-right">{order.customer?.email ?? "—"}</p>
                                    </div>

                                    <InfoRow label="Société" value={order.customer?.companyName ?? "Particulier"} />
                                    <InfoRow label="TVA" value={order.customer?.vatNumber ?? "—"} />
                                </div>
                            </div>

                            <div className="rounded-xl border p-3">
                                <SectionTitle>Adresse de livraison</SectionTitle>
                                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">{order.customer?.addressLine1 ?? "—"}</p>
                                    {order.customer?.addressLine2?.trim() ? <p>{order.customer.addressLine2}</p> : null}
                                    <p>{(order.customer?.postalCode ?? "—") + " " + (order.customer?.city ?? "—")}</p>
                                    <p>{order.customer?.country ?? "—"}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border p-3">
                                <SectionTitle>Adresse de facturation</SectionTitle>
                                <p className="mt-3 text-sm text-muted-foreground">Identique à l’adresse de livraison</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

