// Import Next
import Link from "next/link";
// Import composants
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import { Button } from "@/components/ui/button";

// Import Lucide React
import { Eye, Pencil } from "lucide-react";
// Import lib
import { formatDateFR } from "@/lib/dates";
// Import type
import { ProductRow } from "@/types/product";

function formatPriceEUR(priceCents: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format((priceCents ?? 0) / 100);
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
    if (products.length === 0) {
        return (
            <div className="rounded-lg border bg-background py-12 text-center text-muted-foreground">
                Aucun produit pour le moment.
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* VUE MOBILE : Liste de cartes (2 colonnes) */}
                <div className="grid grid-cols-2 gap-2 xl:hidden">
                    {products.map((p) => {
                        const href = `/dashboard/products/${p.id}`;

                        return (
                            <div key={p.id} className="rounded-lg border bg-card p-3 shadow-sm flex flex-col justify-between min-w-0">
                                <div className="min-w-0">
                                    <div className="flex items-start justify-between mb-2 gap-1">
                                        <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-[8px] text-muted-foreground uppercase">Img</span>
                                            )}
                                        </div>
                                        <div className="shrink-0 scale-75 origin-top-right">
                                            <ProductActiveBadge status={p.status} />
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-3 min-w-0">
                                        <Link href={href} className="font-bold text-xs text-foreground hover:underline block truncate">
                                            {p.name}
                                        </Link>
                                        <div className="flex flex-wrap gap-1">
                                            <p className="text-[9px] text-muted-foreground font-mono truncate">
                                                {p.sku}
                                            </p>
                                            <span className="text-[9px] text-muted-foreground">•</span>
                                            <p className="text-[9px] text-blue-600 font-medium truncate">
                                                {p.category}
                                            </p>
                                        </div>
                                        <div className="font-bold text-sm tabular-nums pt-0.5">
                                            {formatPriceEUR(p.priceCents)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-2 border-t">
                                    <Button asChild size="sm" variant="outline" className="h-7 px-0 flex-1">
                                        <Link href={href}>
                                            <Eye className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline" className="h-7 px-0 flex-1">
                                        <Link href={`${href}/edit`}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* VUE DESKTOP : Tableau classique */}
                <div className="hidden xl:block overflow-hidden rounded-lg border bg-background">
                    <Table>
                        <TableHeader>
                            {/* Ligne d'en-tête du tableau des produits */}
                            <TableRow className="bg-muted/40">
                                <TableHead className="py-2">Produit</TableHead>
                                <TableHead className="w-[160px]">SKU</TableHead>
                                <TableHead className="text-right w-[140px]">Prix</TableHead>
                                <TableHead className="w-[160px]">Statut</TableHead>
                                <TableHead className="w-[160px]">Créé le</TableHead>
                                <TableHead className="text-center w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Corps du tableau */}
                        <TableBody>
                            {products.map((p) => {
                                const href = `/dashboard/products/${p.id}`;

                                return (
                                    <TableRow
                                        key={p.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        {/* Produit (image + nom + desc) */}
                                        <TableCell>
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Image */}
                                                <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                                    {p.imageUrl ? (
                                                        <img
                                                            src={p.imageUrl}
                                                            alt={p.name}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            IMG
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    {/* Nom */}
                                                    <div className="font-medium truncate">{p.name}</div>
                                                    {/* Dimensions & Catégorie */}
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {p.dimensions ?? "—"} • {p.category ?? "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* SKU */}
                                        <TableCell className="font-mono text-xs">{p.sku}</TableCell>

                                        {/* Prix */}
                                        <TableCell className="text-right font-medium tabular-nums">
                                            {formatPriceEUR(p.priceCents)}
                                        </TableCell>

                                                                            {/* Statut */}
                                                                            <TableCell>
                                                                                <ProductActiveBadge status={p.status} />
                                                                            </TableCell>
                                        {/* Date */}
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDateFR(new Date(p.createdAt))}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={href}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                        >
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Voir</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={`${href}/edit`}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                        >
                                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Modifier</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TooltipProvider>
    );
}