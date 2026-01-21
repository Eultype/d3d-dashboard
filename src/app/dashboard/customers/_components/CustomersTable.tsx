"use client";

// Import Next
import Link from "next/link";
// Import des composants
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
// Import de Lucide React
import { Eye, Pencil } from "lucide-react";
// Import des lib
import { formatDateFR } from "@/lib/dates";
// Import des types
import { CustomerRow } from "@/types/customer";

// Initiales dans le tableau (mini logo)
function initials(name?: string | null) {
    if (!name) return "C";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "C";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
}

// Composant listing clients
export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
    if (customers.length === 0) {
        return (
            <div className="rounded-lg border bg-background py-12 text-center text-muted-foreground">
                Aucun client pour le moment.
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* VUE MOBILE : Liste de cartes (2 colonnes) */}
                <div className="grid grid-cols-2 gap-2 xl:hidden">
                    {customers.map((c) => {
                        const isCompany = !!c.companyName?.trim();
                        const detailsHref = `/dashboard/customers/${c.id}`;
                        const editHref = `/dashboard/customers/${c.id}/edit`;

                        return (
                            <div key={c.id} className="rounded-lg border bg-card p-3 shadow-sm flex flex-col justify-between min-w-0">
                                <div className="min-w-0">
                                    <div className="flex items-center justify-between mb-2 gap-1">
                                        <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-[10px] font-semibold shrink-0">
                                            {initials(c.name)}
                                        </div>
                                        <div className="shrink-0 scale-75 origin-right">
                                            <CustomerActiveBadge isActive={c.isActive} />
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-3 min-w-0">
                                        <Link href={detailsHref} className="font-bold text-xs text-foreground hover:underline block truncate">
                                            {c.name ?? "Sans nom"}
                                        </Link>
                                        <p className="text-[9px] text-muted-foreground truncate">
                                            {c.email ?? "Pas d'email"}
                                        </p>
                                        <div className="pt-0.5 min-w-0 flex flex-col gap-1">
                                            {isCompany ? (
                                                <div className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md font-medium truncate w-fit max-w-full">
                                                    {c.companyName}
                                                </div>
                                            ) : (
                                                <div className="text-[9px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-md font-medium w-fit">
                                                    Particulier
                                                </div>
                                            )}
                                            
                                            {/* Téléphone et Date */}
                                            <div className="flex items-center justify-between text-[8px] text-muted-foreground mt-1">
                                                <span className="truncate mr-1">{c.phone ?? "—"}</span>
                                                <span className="shrink-0">{formatDateFR(new Date(c.createdAt))}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-2 border-t">
                                    <Button asChild size="sm" variant="outline" className="h-7 px-0 flex-1">
                                        <Link href={detailsHref}>
                                            <Eye className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline" className="h-7 px-0 flex-1">
                                        <Link href={editHref}>
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
                            {/* Ligne d'en-tête du tableau des clients */}
                            <TableRow className="bg-muted/40">
                                <TableHead className="w-[320px] py-2">Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[160px]">Téléphone</TableHead>
                                <TableHead className="w-[220px]">Société</TableHead>
                                <TableHead className="w-[150px]">TVA</TableHead>
                                <TableHead className="w-[120px]">Statut</TableHead>
                                <TableHead className="w-[160px]">Créé le</TableHead>
                                <TableHead className="text-center w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((c) => {
                                const isCompany = !!c.companyName?.trim();
                                const vatOk = !!c.vatNumber?.trim();

                                const detailsHref = `/dashboard/customers/${c.id}`;
                                const editHref = `/dashboard/customers/${c.id}/edit`;

                                return (
                                    <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                                        {/* Nom (avatar + name + email) */}
                                        <TableCell>
                                            <Link href={detailsHref} className="block">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold">
                                                        {initials(c.name)}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">
                                                            {c.name ?? "Client sans nom"}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">
                                                            {c.email ?? "—"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell>

                                        {/* Email */}
                                        <TableCell className="text-sm">{c.email ?? "—"}</TableCell>

                                        {/* Téléphone */}
                                        <TableCell className="text-sm">{c.phone ?? "—"}</TableCell>

                                        {/* Société */}
                                        <TableCell>
                                            {isCompany ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium truncate">{c.companyName}</span>
                                                    <span className="text-sm text-muted-foreground italic">Entreprise</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">Particulier</span>
                                            )}
                                        </TableCell>

                                        {/* TVA */}
                                        <TableCell>
                                            {vatOk ? (
                                                <Badge variant="secondary" className="font-mono">
                                                    {c.vatNumber}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">❌</span>
                                            )}
                                        </TableCell>

                                        {/* Statut */}
                                        <TableCell>
                                            <CustomerActiveBadge isActive={c.isActive} />
                                        </TableCell>

                                        {/* Créé le */}
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDateFR(new Date(c.createdAt))}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {/* Détails */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={detailsHref}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                        >
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Détails</TooltipContent>
                                                </Tooltip>
                                                {/* Modifier */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={editHref}
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