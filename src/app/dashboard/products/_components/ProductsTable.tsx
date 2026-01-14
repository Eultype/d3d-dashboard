import Link from "next/link";
import { formatDateFR } from "@/lib/dates";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Eye, Pencil } from "lucide-react";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import { ProductRow } from "@/types/product";

function formatPriceEUR(priceCents: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format((priceCents ?? 0) / 100);
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
    return (
        <TooltipProvider>
            {/* EXACTEMENT comme OrdersTable : table dans une card */}
            <div className="overflow-hidden rounded-lg border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="py-2">Produit</TableHead>
                            <TableHead className="w-[160px]">SKU</TableHead>
                            <TableHead className="text-right w-[140px]">Prix</TableHead>
                            <TableHead className="w-[160px]">Statut</TableHead>
                            <TableHead className="w-[160px]">Créé le</TableHead>
                            <TableHead className="text-center w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-10 text-center text-muted-foreground"
                                >
                                    Aucun produit pour le moment.
                                </TableCell>
                            </TableRow>
                        )}

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
                                            <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                                {p.imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
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
                                                <div className="font-medium truncate">{p.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {p.description ?? "Aucune description"}
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
                                        <ProductActiveBadge isActive={p.isActive} />
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
        </TooltipProvider>
    );
}
