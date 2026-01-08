import { prisma } from "@/lib/prisma";
import { CustomersTable } from "@/components/dashboard/customers-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Clients</h1>
                <p className="text-sm text-muted-foreground">Liste des clients enregistrés</p>
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
                        createdAt: c.createdAt.toISOString(),
                    }))}
                />
            </div>
        </div>
    );
}
