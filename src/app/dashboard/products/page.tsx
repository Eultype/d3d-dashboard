// src/app/dashboard/products/page.tsx
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProductsTable } from "@/components/dashboard/products-table";
import { Button } from "@/components/ui/button";

import { Package, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des produits",
    description:
        "Gérez votre catalogue produits : prix, stock, visuels, descriptions et statut actif/inactif.",
};

function StatItem({
                      icon,
                      label,
                      value,
                      hint,
                  }: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    hint?: ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-background px-4 py-3 shadow-sm transition-colors hover:bg-muted/20">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                        {icon}
                    </div>
                    <div className="text-[11px] font-medium uppercase tracking-wide">
                        {label}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-xl font-bold tabular-nums leading-tight">
                {value}
            </div>
            {hint ? (
                <div className="mt-1 text-[11px] leading-tight text-muted-foreground">
                    {hint}
                </div>
            ) : null}
        </div>
    );
}

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            sku: true,
            description: true,
            imageUrl: true,
            isActive: true,
            priceCents: true,
            createdAt: true,
        },
    });

    const rows = products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        priceCents: p.priceCents,
        createdAt: p.createdAt.toISOString(),
    }));

    // Stats (3 cards utiles)
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;

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
