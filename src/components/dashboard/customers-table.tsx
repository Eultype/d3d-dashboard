"use client";

import Link from "next/link";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";

type CustomerRow = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    vatNumber: string | null;
    createdAt: string; // on passe une string depuis le serveur (toISOString)
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
            <div className="bg-background overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/90">
                            <TableHead className="w-[320px] py-2">Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Société</TableHead>
                            <TableHead>TVA</TableHead>
                            <TableHead>Créé le</TableHead>
                            <TableHead className="text-center w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {customers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                    Aucun client.
                                </TableCell>
                            </TableRow>
                        )}

                        {customers.map((c) => {
                            const isCompany = !!c.companyName;
                            const vatOk = !!c.vatNumber;

                            return (
                                <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                                    {/* NAME cell (avatar + name + email) */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold">
                                                {initials(c.name)}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-medium truncate">{c.name ?? "Client sans nom"}</div>
                                                <div className="text-sm text-muted-foreground truncate">
                                                    {c.email ?? "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-sm">{c.email ?? "—"}</TableCell>
                                    <TableCell className="text-sm">{c.phone ?? "—"}</TableCell>

                                    <TableCell>
                                        {isCompany ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{c.companyName}</span>
                                                <span className="italic text-muted-foreground">Entreprise</span>
                                            </div>
                                        ) : (
                                            <span className="italic text-muted-foreground">Particulier</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {vatOk ? (
                                            <Badge variant="secondary" className="font-mono">
                                                {c.vatNumber}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">❌</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={`/dashboard/customers/${c.id}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                    >
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Détails</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                        onClick={() => alert("Edit (à faire)")}
                                                    >
                                                        <Pencil className="h-4 w-4 text-muted-foreground" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>Modifier</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                        onClick={() => alert("Delete (à faire)")}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>Supprimer</TooltipContent>
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
