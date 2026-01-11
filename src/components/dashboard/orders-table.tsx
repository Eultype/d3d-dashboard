"use client";

import Link from "next/link";
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";

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

import { Eye } from "lucide-react";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";

type OrderRow = {
    id: string;
    status: string;
    createdAt: string; // ISO
    articlesCount: number;
    totalCents: number;
    customer: {
        name: string | null;
        email: string | null;
    } | null;
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
    return (
        <TooltipProvider>
            <div className="overflow-hidden rounded-lg border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[180px] py-2">Commande</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right w-[140px]">Total</TableHead>
                            <TableHead className="w-[160px]">Date</TableHead>
                            <TableHead className="text-center w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                    Aucune commande pour le moment.
                                </TableCell>
                            </TableRow>
                        )}

                        {orders.map((o) => {
                            const href = `/dashboard/orders/${o.id}`;
                            const shortId = o.id.slice(0, 10);

                            return (
                                <TableRow key={o.id} className="hover:bg-muted/30 transition-colors">
                                    {/* Commande + nb articles */}
                                    <TableCell className="align-top">
                                        <Link href={href} className="block">
                                            <div className="font-mono">#{shortId}</div>
                                            <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                                                {o.articlesCount} article{o.articlesCount > 1 ? "s" : ""}
                                            </div>
                                        </Link>
                                    </TableCell>

                                    {/* Client */}
                                    <TableCell>
                                        {o.customer ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {o.customer.name ?? "Client sans nom"}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {o.customer.email ?? "—"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="italic text-muted-foreground">Sans client</span>
                                        )}
                                    </TableCell>

                                    {/* Statut */}
                                    <TableCell>
                                        <OrderStatusBadge status={o.status} />
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell className="text-right font-medium tabular-nums">
                                        {formatEUR(o.totalCents)}
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDateFR(new Date(o.createdAt))}
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
