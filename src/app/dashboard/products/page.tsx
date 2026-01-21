// Import des datas
import { getProductsAndStats } from "@/lib/data/products";
// Import Next
import type { Metadata } from "next";
import Link from "next/link";
// Import des composants
import { ProductsTable } from "./_components/ProductsTable";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";
// Import Lucide React
import { Package, CheckCircle2, XCircle } from "lucide-react";

// Metadata du dashboard
export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des produits",
    description:
        "Gérez et suivez l’ensemble de vos produits : activation, détails, stock, historique des ventes et actions associées.",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

// Page de listing produits
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const { q, page, status } = await searchParams;
    const currentPage = Number(page) || 1;

    const { products: rows, stats, pagination } = await getProductsAndStats(q, currentPage);
    const { totalProducts, activeProducts, inactiveProducts } = stats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    {/* Fil d'Ariane */}
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <span className="text-foreground">Produits</span>
                    </div>

                    {/* Titre principal et description */}
                    <div>
                        <h1 className="text-2xl font-bold">Produits</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestion du catalogue (cristaux, supports, etc.)
                        </p>
                    </div>
                </div>

                {/* Zone d’actions : champ de recherche et bouton “Nouveau produit” */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Champ de recherche */}
                    <SearchInput placeholder="Rechercher..." className="w-full sm:w-64" />
                    {/* Bouton nouveau produit */}
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/dashboard/products/new">Nouveau produit</Link>
                    </Button>
                </div>
            </div>

            {/* Stats (Scrollable on mobile/tablet) */}
            <div className="flex overflow-x-auto pb-2 gap-3 xl:grid xl:grid-cols-3 xl:pb-0 scrollbar-hide">
                {/* Total */ }
                <div className="min-w-[140px] flex-1">
                    <StatItem
                        icon={<Package className="h-4 w-4" />}
                        label="Produits"
                        value={totalProducts}
                        hint="Total"
                    />
                </div>
                {/* Actifs */}
                <div className="min-w-[140px] flex-1">
                    <StatItem
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        label="Actifs"
                        value={activeProducts}
                        hint="Disponibles"
                    />
                </div>
                {/* Inactifs */}
                <div className="min-w-[140px] flex-1">
                    <StatItem
                        icon={<XCircle className="h-4 w-4" />}
                        label="Inactifs"
                        value={inactiveProducts}
                        hint="Non visibles"
                    />
                </div>
            </div>

            {/* Tableau produits */}
            <ProductsTable products={rows} />

            {/* Pagination */}
            <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
            />
        </div>
    );
}
