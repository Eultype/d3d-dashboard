import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/dashboard/orders-table";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "D3D | Dashboard | Gestion des commandes",
  description:
    "Gérez et suivez l’ensemble des commandes : statuts, détails, historique et actions associées.",
};

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
        <Link href="/dashboard/orders/new">
          <Button>Nouvelle commande</Button>
        </Link>
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
