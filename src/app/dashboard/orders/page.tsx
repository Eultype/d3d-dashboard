import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersTable } from "@/components/dashboard/orders-table";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Commandes</h1>
                <p className="text-sm text-muted-foreground">
                    Gestion des commandes de gravure 3D
                </p>
            </div>

            <div>
                <OrdersTable
                    orders={orders.map((o) => ({
                        id: o.id,
                        status: o.status,
                        createdAt: o.createdAt.toISOString(),
                        customer: o.customer
                            ? {
                            name: o.customer.name,
                                email: o.customer.email,
                            }
                            : null,
                    }))}
                />
            </div>
        </div>
    );
}
