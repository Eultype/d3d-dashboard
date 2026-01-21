// src/app/dashboard/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

import { getDashboardStats } from "@/lib/data/dashboard";
import { Button } from "@/components/ui/button";

import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardStats } from "./_components/DashboardStats";
import { RecentOrdersCard } from "./_components/RecentOrdersCard";
import { TodoOrdersCard } from "./_components/TodoOrdersCard";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "D3D | Dashboard | Vue d'ensemble",
  description:
    "Vue d’ensemble orientée actions : commandes à vérifier, en production, à livrer, et terminées.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
      redirect("/");
  }

  const userRole = session.user.role as string;

  const { stats, recent, todoOrders } = await getDashboardStats({ 
      userId: session.user.id, 
      role: userRole
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <DashboardHeader userRole={userRole} />

      {/* Stats Pipeline */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-4 xl:grid-cols-2 items-stretch">
        <RecentOrdersCard orders={recent} />
        <TodoOrdersCard orders={todoOrders} countToProcess={stats.countToProcess} />
      </div>

      {/* Accès rapides bas */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/orders">Voir les commandes</Link>
        </Button>
        {userRole === "ADMIN" && (
            <>
                <Button asChild variant="outline">
                <Link href="/dashboard/customers">Voir les clients</Link>
                </Button>
                <Button asChild variant="outline">
                <Link href="/dashboard/products">Voir les produits</Link>
                </Button>
            </>
        )}
      </div>
    </div>
  );
}