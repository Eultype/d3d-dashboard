// Import des datas
import { prisma } from "@/lib/prisma";
// Import Next
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// Import des composants
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "../../_components/CustomerForm";

// Metadata de la modification d'un client
export const metadata: Metadata = {
    title: "D3D | Modifier un client",
    description: "Modifiez les informations d’un client existant dans votre base de données.",
};

// Page de modification du client
export default async function CustomerEditPage({
                                                   params,
                                               }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return notFound();

    return (
        <div className="space-y-6">
            {/* Fil d’Ariane de navigation + bouton */}
            <div className="text-sm text-muted-foreground">
                {/* Fil d'Ariane */}
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/customers" className="hover:underline">Clients</Link> /{" "}
                <Link href={`/dashboard/customers/${customer.id}`} className="hover:underline">
                    #{customer.id.slice(0, 10)}
                </Link>{" "}

                {/* Bouton modifier */}
                / <span className="text-foreground">Modifier</span>
            </div>

            {/* Header avec titres et bouton retour */}
            <div className="flex items-center justify-between gap-3">
                {/* Titres */}
                <div>
                    <h1 className="text-2xl font-bold">Modifier le client</h1>
                    <p className="text-sm text-muted-foreground">Mettez à jour les informations du client.</p>
                </div>

                {/* Bouton retour */}
                <Button asChild variant="ghost">
                    <Link href={`/dashboard/customers/${customer.id}`}>← Retour</Link>
                </Button>
            </div>

            {/* Carte contenant le formulaire d’édition du client */}
            <Card>
                <CardHeader>
                    {/* Titre de la carte */}
                    <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Affiche le formulaire pré-rempli avec les informations du client */}
                    <CustomerForm
                        customer={{
                            id: customer.id,
                            name: customer.name ?? "",
                            email: customer.email ?? "",
                            phone: customer.phone ?? "",
                            companyName: customer.companyName ?? "",
                            vatNumber: customer.vatNumber ?? "",
                            isActive: customer.isActive,
                            addressLine1: customer.addressLine1 ?? "",
                            addressLine2: customer.addressLine2 ?? "",
                            postalCode: customer.postalCode ?? "",
                            city: customer.city ?? "",
                            country: customer.country ?? "",
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
