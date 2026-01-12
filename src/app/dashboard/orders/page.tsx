{/* Import des datas */}
import { getOrdersAndStats } from "@/lib/data/orders";
{/* Import Next */}
import type { Metadata } from "next";
import Link from "next/link";
{/* Import des composants */}
import { OrdersTable } from "@/components/dashboard/orders-table";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import {ClipboardList, AlertCircle, Factory, CheckCircle2, Euro,} from "lucide-react";
{/* Import des lib */}
import { formatEUR } from "@/lib/money";

{/*  */}
export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des commandes",
    description:
        "Gérez et suivez l’ensemble des commandes : statuts, détails, historique et actions associées.",
};

{/* Page de listing commandes */}
export default async function OrdersPage() {
    const { orders: rows, stats } = await getOrdersAndStats();
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

                <Button asChild>
                    <Link href="/dashboard/orders/new">Nouvelle commande</Link>
                </Button>
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
                    hint={`Hors livraison / TVA`}
                />
            </div>

            {/* Tableau commandes */}
            <OrdersTable orders={rows} />
        </div>
    );
}
