import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { getResellersAndStats } from "@/lib/data/resellers";
import { ResellersTable } from "./_components/ResellersTable";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { Users, UserPlus, Tag } from "lucide-react";

export const metadata: Metadata = {
    title: "Revendeurs | D3D Dashboard",
};

export default async function ResellersPage({
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

    const { resellers, stats, pagination } = await getResellersAndStats(q, currentPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <span className="text-foreground">Revendeurs</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Revendeurs</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestion des comptes revendeurs
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <SearchInput placeholder="Rechercher un revendeur..." className="w-full sm:w-64" />
                    <Button asChild>
                        <Link href="/dashboard/resellers/new">Nouveau revendeur</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatItem
                    icon={<Users className="h-4 w-4" />}
                    label="Revendeurs"
                    value={stats.totalResellers}
                    hint="Total"
                />
                <StatItem
                    icon={<Tag className="h-4 w-4" />}
                    label="Avec préfixe"
                    value={stats.withPrefix}
                    hint="Préfixe défini"
                />
                <StatItem
                    icon={<UserPlus className="h-4 w-4" />}
                    label="Nouveaux"
                    value={stats.new30j}
                    hint="Sur 30 jours"
                />
            </div>

            <ResellersTable resellers={resellers} />

            <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
            />
        </div>
    );
}
