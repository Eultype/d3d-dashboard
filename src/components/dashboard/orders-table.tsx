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
import { Eye } from "lucide-react";

type OrderRow = {
    id: string;
    status: string;
    createdAt: string; // ISO
    customer: {
        name: string | null;
        email: string | null;
    } | null;
};

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "A_VERIFIER":
            return <Badge variant="secondary">À vérifier</Badge>;
        case "PROD":
            return <Badge>En production</Badge>;
        case "TERMINE":
            return <Badge variant="outline">Terminé</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
    return (
        <TooltipProvider>
            <div className="bg-background overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/90">
                            <TableHead className="w-[140px] py-2">Commande</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    Aucune commande pour le moment.
                                </TableCell>
                            </TableRow>
                        )}

                        {orders.map((o) => (
                            <TableRow key={o.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-mono">
                                    #{o.id.slice(0, 10)}
                                </TableCell>

                                <TableCell>
                                    {o.customer ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{o.customer.name ?? "Client sans nom"}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {o.customer.email ?? "—"}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="italic text-muted-foreground">Sans client</span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <StatusBadge status={o.status} />
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={`/dashboard/orders/${o.id}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                                                >
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Voir</TooltipContent>
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
