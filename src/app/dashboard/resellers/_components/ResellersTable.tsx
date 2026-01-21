"use client";

// Import Next
import Link from "next/link";
// Import des composants
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
// Import de Lucide React
import { Eye, Pencil } from "lucide-react";
// Import des lib
import { formatDateFR } from "@/lib/dates";

export interface ResellerRow {
    id: string;
    customerId: string | null;
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
    return (
        <TooltipProvider>
            <div className="overflow-hidden rounded-lg border bg-background">
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
                        {resellers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                    Aucun revendeur.
                                </TableCell>
                            </TableRow>
                        )}

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
        </TooltipProvider>
    );
}
