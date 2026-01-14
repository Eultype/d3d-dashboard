"use client";

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

import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { Eye, Pencil } from "lucide-react";

type CustomerRow = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    vatNumber: string | null;
    isActive: boolean;
    createdAt: string; // ISO
};

function initials(name?: string | null) {
    if (!name) return "C";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "C";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
}

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
    return (
        <TooltipProvider>
            <div className="overflow-hidden rounded-lg border bg-background">
                <Table>
                    <TableHeader>
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
                        {customers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                                    Aucun client.
                                </TableCell>
                            </TableRow>
                        )}

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
        </TooltipProvider>
    );
}
