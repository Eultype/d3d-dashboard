// Import des datas
import { getCustomersAndStats } from "@/lib/data/customers";
// Import Next
import Link from "next/link";
import type { Metadata } from "next";
// Import des composants
import { CustomersTable } from "./_components/CustomersTable";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
// Import de Lucide React
import { Users, UserCheck, Building2, BadgeCheck, UserPlus,} from "lucide-react";

// Metadata du dashboard
export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des clients",
    description:
        "Gérez et suivez l’ensemble de vos clients : informations, statut, historique, entreprises, TVA et activités récentes.",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

// Page de listing clients
export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const { q, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const { customers, stats, pagination } = await getCustomersAndStats(q, currentPage);

    const { totalCustomers, actifs, entreprises, tvaRenseignee, nouveaux30j } = stats;

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
                        <span className="text-foreground">Clients</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Clients</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestion des clients enregistrés
                        </p>
                    </div>
                </div>

                {/* Actions : Recherche + Nouveau */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <SearchInput placeholder="Rechercher un client..." className="w-full sm:w-64" />
                    <Button asChild>
                        <Link href="/dashboard/customers/new">Nouveau client</Link>
                    </Button>
                </div>
            </div>

            {/* Stats (Total - Actifs - Entreprises - TVA - Nouveaux) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Total */}
                <StatItem
                    icon={<Users className="h-4 w-4" />}
                    label="Clients"
                    value={totalCustomers}
                    hint="Total"
                />
                {/* Actifs */}
                <StatItem
                    icon={<UserCheck className="h-4 w-4" />}
                    label="Actifs"
                    value={actifs}
                    hint="Statut actif"
                />
                {/* Entreprises */}
                <StatItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Entreprises"
                    value={entreprises}
                    hint="Avec société"
                />
                {/* TVA */}
                <StatItem
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="TVA"
                    value={tvaRenseignee}
                    hint="TVA renseignée"
                />
                {/* Nouveaux */}
                <StatItem
                    icon={<UserPlus className="h-4 w-4" />}
                    label="Nouveaux"
                    value={nouveaux30j}
                    hint="Sur 30 jours"
                />
            </div>

            {/* Table */}
            <CustomersTable customers={customers} />

            {/* Pagination */}
            <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
            />
        </div>
    );
}
