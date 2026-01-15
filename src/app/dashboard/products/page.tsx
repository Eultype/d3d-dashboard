// Import des datas
import { getProductsAndStats } from "@/lib/data/products";
// Import Next
import type { Metadata } from "next";
import Link from "next/link";
// Import des composants
import { ProductsTable } from "./_components/ProductsTable";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/components/dashboard/StatItem";
import { Package, CheckCircle2, XCircle } from "lucide-react";

import { SearchInput } from "@/components/ui/search-input";

// Metadata du dashboard
export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des produits",
    description:
        "Gérez et suivez l’ensemble de vos produits : activation, détails, stock, historique des ventes et actions associées.",
};

// Page de listing produits
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const { products: rows, stats } = await getProductsAndStats(q);
    const { totalProducts, activeProducts, inactiveProducts } = stats;

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
                        <span className="text-foreground">Produits</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Produits</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestion du catalogue (cristaux, supports, etc.)
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <SearchInput placeholder="Rechercher un produit..." className="w-full sm:w-64" />
                    <Button asChild>
                        <Link href="/dashboard/products/new">Nouveau produit</Link>
                    </Button>
                </div>
            </div>

            {/* Stats ( Total - Actifs - Inactifs */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total */ }
                <StatItem
                    icon={<Package className="h-4 w-4" />}
                    label="Produits"
                    value={totalProducts}
                    hint="Total"
                />
                {/* Actifs */}
                <StatItem
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Actifs"
                    value={activeProducts}
                    hint="Disponibles"
                />
                {/* Inactifs */}
                <StatItem
                    icon={<XCircle className="h-4 w-4" />}
                    label="Inactifs"
                    value={inactiveProducts}
                    hint="Non visibles"
                />
            </div>

            {/* Tableau produits */}
            <ProductsTable products={rows} />
        </div>
    );
}
