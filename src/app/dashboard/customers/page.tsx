import { prisma } from "@/lib/prisma";
import { CustomersTable } from "@/components/dashboard/customers-table";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des clients",
    description: "Gérez et suivez l’ensemble des clients : informations, historique, interactions et actions associées."
};


export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                    <Link href="/dashboard" className="hover:underline">
                        Dashboard
                    </Link>{" "}
                    /{" "}
                    <Link href="/dashboard/customers" className="hover:underline">
                        Clients
                    </Link>{" "}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Clients</h1>
                    <p className="text-sm text-muted-foreground">Gestions des clients enregistrés</p>
                </div>
            </div>

            <div>
                <CustomersTable
                    customers={customers.map((c) => ({
                        id: c.id,
                        name: c.name,
                        email: c.email,
                        phone: c.phone,
                        companyName: c.companyName,
                        vatNumber: c.vatNumber,
                        isActive: c.isActive,
                        createdAt: c.createdAt.toISOString(),
                    }))}
                />
            </div>
        </div>
    );
}
