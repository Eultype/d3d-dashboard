import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">
                        Commande <span className="font-mono">#{order.id.slice(0, 10)}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Créée le {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge>{order.status}</Badge>
                    <Link href="/dashboard/orders" className="text-sm underline">
                        Retour
                    </Link>
                </div>
            </div>

            {/* le reste de ta page (client / notes / files) peut rester identique */}
            <Card>
                <CardHeader>
                    <CardTitle>Client</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.customer ? (
                        <p className="font-medium">
                            {order.customer.name ?? "Client sans nom"}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            Aucun client associé
                        </p>
                    )}
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
                {/* NOTES */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {order.notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                                Aucune note pour le moment.
                            </p>
                        ) : (
                            order.notes.map((n) => (
                                <div key={n.id} className="rounded-lg border p-3 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium">{n.user.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(n.createdAt).toLocaleString("fr-FR")}
                                        </p>
                                    </div>
                                    <p className="text-sm">{n.content}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* FICHIERS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fichiers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {order.files.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                                Aucun fichier pour le moment.
                            </p>
                        ) : (
                            order.files.map((f) => (
                                <div key={f.id} className="flex items-center gap-4 rounded-lg border p-3">
                                    {/* Miniature si image */}
                                    {/\.(webp|png|jpg|jpeg)$/i.test(f.url) && (
                                        <img
                                            src={f.url}
                                            alt={f.filename}
                                            className="h-16 w-16 rounded object-cover border"
                                            loading="lazy"
                                        />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{f.filename}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Type : {f.type} • {new Date(f.createdAt).toLocaleString("fr-FR")}
                                        </p>
                                    </div>

                                    <a
                                        href={f.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm underline"
                                    >
                                        Ouvrir
                                    </a>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
