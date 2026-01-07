import Link from "next/link";
import { prisma } from "@/lib/prisma";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Commandes</h1>
                <p className="text-sm text-muted-foreground">
                    Gestion des commandes de gravure 3D
                </p>
            </div>

            {/* TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des commandes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        Aucune commande pour le moment
                                    </TableCell>
                                </TableRow>
                            )}

                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono">
                                        #{order.id.slice(0, 6)}
                                    </TableCell>

                                    <TableCell>
                                        {order.customer?.name ?? (
                                            <span className="italic text-muted-foreground">
                        Sans client
                      </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={order.status} />
                                    </TableCell>

                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Link
                                            href={`/dashboard/orders/${order.id}`}
                                            className="text-sm underline"
                                        >
                                            Voir
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
