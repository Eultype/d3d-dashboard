"use client";

// Import Next
import Link from "next/link";
// Import des composants
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
// Import de Lucide React
import { Eye } from "lucide-react";
// Import des lib
import { formatDateFR } from "@/lib/dates";

import { Button } from "@/components/ui/button";

export interface ResellerRow {
    id: string;
    email: string;
    name: string | null;
    companyName: string | null;
    isActive: boolean;
    prefix: string | null;
    role: string;
    createdAt: string;
    ordersCount: number;
}

// Composant listing revendeurs
export function ResellersTable({ resellers }: { resellers: ResellerRow[] }) {
    if (resellers.length === 0) {
        return (
            <div className="rounded-lg border bg-background py-12 text-center text-muted-foreground">
                Aucun revendeur pour le moment.
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* VUE MOBILE : Liste de cartes (2 colonnes) */}
                <div className="grid grid-cols-2 gap-2 xl:hidden">
                    {resellers.map((r) => {
                        const editHref = `/dashboard/resellers/${r.id}`;

                        return (
                            <div key={r.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex items-center justify-between mb-3 gap-1">
                                        <CustomerActiveBadge isActive={r.isActive} />
                                        {r.prefix && (
                                            <Badge variant="outline" className="font-mono text-[10px] scale-90 origin-right">
                                                {r.prefix}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-1 mb-4">
                                        <Link href={editHref} className="font-bold text-sm text-foreground hover:underline block truncate">
                                            {r.name ?? "Sans nom"}
                                        </Link>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {r.email}
                                        </p>
                                        <div className="pt-1">
                                            {r.companyName ? (
                                                <div className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md font-medium truncate w-fit max-w-full">
                                                    {r.companyName}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-md font-medium w-fit">
                                                    Particulier
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground pt-1">
                                            {r.ordersCount} commande{r.ordersCount > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center pt-3 border-t">
                                    <Button asChild size="sm" variant="outline" className="h-8 w-full">
                                        <Link href={editHref}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Détails
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
                            <TableRow className="bg-muted/40">
                                <TableHead>Revendeur</TableHead>
                                <TableHead>Société</TableHead>
                                <TableHead className="w-[120px]">Préfixe</TableHead>
                                <TableHead className="w-[120px]">Statut</TableHead>
                                <TableHead className="w-[120px]">Commandes</TableHead>
                                <TableHead className="w-[160px]">Créé le</TableHead>
                                <TableHead className="text-center w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resellers.map((r) => (
                                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{r.name || "—"}</span>
                                            <span className="text-xs text-muted-foreground">{r.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {r.companyName ? (
                                            <span className="font-medium">{r.companyName}</span>
                                        ) : (
                                            <span className="text-muted-foreground italic text-sm">Particulier</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {r.prefix ? (
                                            <Badge variant="outline" className="font-mono">
                                                {r.prefix}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground italic text-sm">Aucun</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <CustomerActiveBadge isActive={r.isActive} />
                                    </TableCell>
                                    <TableCell>
                                        {r.ordersCount}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDateFR(new Date(r.createdAt))}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={`/dashboard/resellers/${r.id}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                    >
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Détails</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TooltipProvider>
    );
}
