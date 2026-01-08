import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatusBadge({ companyName }: { companyName?: string | null }) {
    const label = companyName?.trim() ? "Entreprise" : "Particulier";

    return <Badge variant="secondary">{label}</Badge>;
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id?: string }> }) {
    const { id } = await params;
    if (!id) return notFound();

    const customer = await prisma.customer.findUnique({
        where: { id },
    });

    const order = await prisma.order.findMany({
        where: { customerId: id },
    })

    if (!customer) return notFound();

    const created = new Date(customer.createdAt).toLocaleDateString("fr-FR");
    const createdTime = new Date(customer.createdAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/customers" className="hover:underline">
                            Clients
                        </Link>{" "} / <span className="font-mono">#{customer.id.slice(0, 10)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold ">Fiche client</h1>
                        <StatusBadge companyName={customer.companyName} />
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

            {/* Coordonnées */}
            <div className="grid gap-1 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Coordonnées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-10 md:gap-24 lg:gap-12 xl:gap-24">
                            {/* Nom - Email - Tél */}
                            <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                                <span className="font-semibold text-gray-700 text-right">
                                    Nom / Prénom
                                </span>

                                <div className="row-span-3 bg-gray-300 w-[2px] self-stretch"></div>

                                <span>{customer.name}</span>

                                <span className="font-semibold text-gray-700 text-right">
                                    Email
                                </span>
                                <span>{customer.email}</span>

                                <span className="font-semibold text-gray-700 text-right">
                                    Téléphone
                                </span>
                                <span>{customer.phone}</span>
                            </div>
                            {/* Entreprise - n°TVA */}
                            <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                                <span className="font-semibold text-gray-700 text-right">
                                    Entreprise
                                </span>

                                <div className="row-span-2 bg-gray-300 w-[2px] self-stretch"></div>

                                <span>{customer.companyName}</span>

                                <span className="font-semibold text-gray-700 text-right">
                                    Numéro de TVA
                                </span>
                                <span>{customer.vatNumber}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Commandes récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
