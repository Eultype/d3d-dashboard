import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D3D | Dashboard | Vue d'ensemble",
  description:
    "Accédez à une vue d’ensemble claire des statistiques, clients et performances depuis votre dashboard.",
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

      <div className="grid gap-4 md:grid-cols-4">
        {/* Commandes en cours */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes en cours</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
        {/* Commandes en production */}
        <Card>
          <CardHeader>
            <CardTitle>En production</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
        {/* Commandes à expédier*/}
        <Card>
          <CardHeader>
            <CardTitle>À expédier</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
        {/* Commandes à récupérer*/}
        <Card>
          <CardHeader>
            <CardTitle>À récupérer</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
        {/* Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {customersCount}
          </CardContent>
        </Card>
        {/* Produits */}
        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">0</CardContent>
        </Card>
        {/* 3d en attente*/}
        <Card>
          <CardHeader>
            <CardTitle>3d en attente</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {ordersCount}
          </CardContent>
        </Card>
      </div>

      <Link href="/dashboard/orders" className="underline">
        Voir les commandes
      </Link>
    </div>
  );
}
