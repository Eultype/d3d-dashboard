// src/app/dashboard/customers/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerEditForm from "./form";

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
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/customers" className="hover:underline">Clients</Link> /{" "}
                <Link href={`/dashboard/customers/${customer.id}`} className="hover:underline">
                    #{customer.id.slice(0, 10)}
                </Link>{" "}
                / <span className="text-foreground">Modifier</span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Modifier le client</h1>
                    <p className="text-sm text-muted-foreground">Mettez à jour les informations du client.</p>
                </div>
                <Button asChild variant="ghost">
                    <Link href={`/dashboard/customers/${customer.id}`}>← Retour</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomerEditForm
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
