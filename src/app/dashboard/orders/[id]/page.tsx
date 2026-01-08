import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "A_VERIFIER":
            return <Badge variant="secondary">À vérifier</Badge>;
        case "PROD":
            return <Badge>En production</Badge>;
        case "TERMINE":
            return <Badge variant="outline">Terminé</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

function isImageUrl(url: string) {
    return /\.(webp|png|jpg|jpeg|gif)$/i.test(url);
}

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

    const created = new Date(order.createdAt).toLocaleDateString("fr-FR");
    const createdTime = new Date(order.createdAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/orders" className="hover:underline">
                            Commandes
                        </Link>{" "}
                        / <span className="font-mono">#{order.id.slice(0, 6)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">
                            Commande <span className="font-mono">#{order.id.slice(0, 10)}</span>
                        </h1>
                        <StatusBadge status={order.status} />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Créée le {created} à {createdTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/orders">← Retour</Link>
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Client</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-semibold">
                        {order.customer?.name ?? "Sans client"}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-semibold">
                        {order.notes.length}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Fichiers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-semibold">
                        {order.files.length}
                    </CardContent>
                </Card>
            </div>

            {/* Client */}
            <Card>
                <CardHeader>
                    <CardTitle>Client</CardTitle>
                </CardHeader>

                <CardContent>
                    {order.customer ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Nom</p>
                                <p className="font-medium">{order.customer.name ?? "Client sans nom"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{order.customer.email ?? "—"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Téléphone</p>
                                <p className="font-medium">{order.customer.phone ?? "—"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Société</p>
                                <p className="font-medium">{order.customer.companyName ?? "Particulier"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">TVA</p>
                                <p className="font-medium">{order.customer.vatNumber ?? "❌"}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Aucun client associé</p>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {order.notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Aucune note pour le moment.</p>
                        ) : (
                            <div className="space-y-3">
                                {order.notes.map((n) => (
                                    <div key={n.id} className="rounded-xl border p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{n.user.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(n.createdAt).toLocaleString("fr-FR")}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-2 text-sm leading-relaxed">{n.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Fichiers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fichiers</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {order.files.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Aucun fichier pour le moment.</p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {order.files.map((f) => (
                                    <div key={f.id} className="rounded-xl border overflow-hidden">
                                        {isImageUrl(f.url) ? (
                                            // Preview image
                                            <div className="aspect-video bg-muted">
                                                {/* next/image si tu veux + tard, là on reste simple */}
                                                <img
                                                    src={f.url}
                                                    alt={f.filename}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-muted flex items-center justify-center text-sm text-muted-foreground">
                                                Aperçu indisponible
                                            </div>
                                        )}

                                        <div className="p-3 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{f.filename}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(f.createdAt).toLocaleString("fr-FR")}
                                                    </p>
                                                </div>

                                                <Badge variant="outline" className="shrink-0">
                                                    {f.type}
                                                </Badge>
                                            </div>

                                            <Button asChild variant="ghost" className="w-full justify-center">
                                                <a href={f.url} target="_blank" rel="noreferrer">
                                                    Ouvrir
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
