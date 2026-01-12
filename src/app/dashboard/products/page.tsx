// src/app/dashboard/products/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProductsTable } from "@/components/dashboard/products-table";
import { Button } from "@/components/ui/button";

import { Package, CheckCircle2, XCircle } from "lucide-react";
import { StatItem } from "@/components/dashboard/StatItem";
import { getProductsAndStats } from "@/lib/data/products";

export default async function ProductsPage() {
    const { products: rows, stats } = await getProductsAndStats();
    const { totalProducts, activeProducts, inactiveProducts } = stats;

    return (
        <div className="space-y-6">
            {/* Header (comme Orders/Customers) */}
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

                <Button asChild>
                    <Link href="/dashboard/products/new">Nouveau produit</Link>
                </Button>
            </div>

            {/* Stats (3 mini cards) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatItem
                    icon={<Package className="h-4 w-4" />}
                    label="Produits"
                    value={totalProducts}
                    hint="Total"
                />

                <StatItem
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Actifs"
                    value={activeProducts}
                    hint="Disponibles"
                />

                <StatItem
                    icon={<XCircle className="h-4 w-4" />}
                    label="Inactifs"
                    value={inactiveProducts}
                    hint="Non visibles"
                />
            </div>

            {/* Table */}
            <ProductsTable products={rows} />
        </div>
    );
}
