"use client";

import Link from "next/link";
import { formatDateFR } from "@/lib/dates";
import { formatEUR } from "@/lib/money";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";

type OrderRow = {
    id: string;
    reference?: string | null;
    status: string;
    createdAt: string;
    articlesCount: number;
    totalCents: number;
    customer: {
        name: string | null;
        email: string | null;
    } | null;
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg border bg-background py-12 text-center text-muted-foreground">
                Aucune commande pour le moment.
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* VUE MOBILE : Liste de cartes pour petits écrans */}
                <div className="grid grid-cols-2 gap-2 md:hidden">
                    {orders.map((o) => {
                        const href = `/dashboard/orders/${o.id}`;
                        const displayRef = o.reference || `#${o.id.slice(0, 10)}`;
                        return (
                            <div key={o.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Link href={href} className="font-mono font-bold text-blue-600">
                                            {displayRef}
                                        </Link>
                                        <OrderStatusBadge status={o.status} />
                                    </div>

                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground truncate">
                                                {o.customer?.name ?? "Client sans nom"}
                                            </span>
                                            <span className="text-muted-foreground text-xs truncate">
                                                {o.customer?.email ?? "Pas d'email"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{o.articlesCount} art.</span>
                                            <span>{formatDateFR(new Date(o.createdAt))}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t">
                                    <div className="font-bold text-base tabular-nums">
                                        {formatEUR(o.totalCents)}
                                    </div>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={href}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* VUE DESKTOP : Tableau classique pour écrans larges */}
                <div className="hidden md:block overflow-hidden rounded-lg border bg-background">
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
                            {orders.map((o) => {
                                const href = `/dashboard/orders/${o.id}`;
                                // Si on a une référence (BOG-1001), on l'affiche, sinon on prend l'ID tronqué
                                const displayRef = o.reference || `#${o.id.slice(0, 10)}`;

                                return (
                                    <TableRow key={o.id} className="hover:bg-muted/30 transition-colors">
                                        {/* Commande + nb articles */}
                                        <TableCell className="align-top">
                                            <Link href={href} className="block">
                                                <div className="font-mono font-medium text-blue-600 hover:text-blue-800">
                                                    {displayRef}
                                                </div>
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
            </div>
        </TooltipProvider>
    );
}
