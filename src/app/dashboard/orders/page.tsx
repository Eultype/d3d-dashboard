// Import des datas
import { getOrdersAndStats } from "@/lib/data/orders";
//Import Next
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

// Import des composants
import { OrdersTable } from "./_components/OrdersTable";
import { OrdersFilter } from "./_components/OrdersFilter";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import {ClipboardList, AlertCircle, Factory, CheckCircle2, Euro,} from "lucide-react";
// Import des lib
import { formatEUR } from "@/lib/money";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";

// Metadata du dashboard
export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des commandes",
    description:
        "Gérez et suivez l’ensemble des commandes : statuts, détails, historique et actions associées.",
};

// Page de listing commandes
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/");
    }

    const { q, page, status } = await searchParams;
    const currentPage = Number(page) || 1;

    const { orders: rows, stats, pagination } = await getOrdersAndStats(
        q, 
        currentPage, 
        status, 
        { userId: session.user.id, role: session.user.role as string }
    );
    const { totalOrders, aVerifier, enProd, terminees, caTotalCents } = stats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <span className="text-foreground">Commandes</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Commandes</h1>
                        <p className="text-sm text-muted-foreground">Gestion des commandes de gravure 2D-3D</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <OrdersFilter />
                    <SearchInput placeholder="Rechercher une commande..." className="w-full sm:w-64" />
                    <Button asChild>
                        <Link href="/dashboard/orders/new">Nouvelle commande</Link>
                    </Button>
                </div>
            </div>

            {/* Stats (Total - À confirmer - En production - Terminées - CA total (hors livraison / TVA) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Total */}
                <StatItem
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Commandes"
                    value={totalOrders}
                    hint="Total"
                />
                {/* À confirmer */}
                <StatItem
                    icon={<AlertCircle className="h-4 w-4" />}
                    label="À vérifier"
                    value={aVerifier}
                    hint="À confirmer"
                />
                {/* En production */}
                <StatItem
                    icon={<Factory className="h-4 w-4" />}
                    label="En production"
                    value={enProd}
                    hint="En cours"
                />
                {/* Terminées */}
                <StatItem
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Terminées"
                    value={terminees}
                    hint="Livrées"
                />
                {/* CA total (hors livraison / TVA) */}
                <StatItem
                    icon={<Euro className="h-4 w-4" />}
                    label="CA total"
                    value={formatEUR(caTotalCents)}
                    hint="Hors livraison / TVA"
                />
            </div>

            {/* Tableau commandes */}
            <OrdersTable orders={rows} />

            {/* Pagination */}
            <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
            />
        </div>
    );
}
