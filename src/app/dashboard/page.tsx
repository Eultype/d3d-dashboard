import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Vue d'ensemble",
    description: "Accédez à une vue d’ensemble claire des statistiques, clients et performances depuis votre dashboard."
};

export default async function DashboardPage() {
    const [ordersCount, customersCount] = await Promise.all([
        prisma.order.count(),
        prisma.customer.count(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Vue d’ensemble</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">
                        {ordersCount}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Clients</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">
                        {customersCount}
                    </CardContent>
                </Card>
            </div>

            <Link href="/dashboard/orders" className="underline">
                Voir les commandes
            </Link>
        </div>
    );
}
