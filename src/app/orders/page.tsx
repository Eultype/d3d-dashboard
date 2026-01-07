import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Commandes</h1>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`} className="block">
                        <Card className="hover:bg-muted/40 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Commande #{order.id.slice(0, 6)}</CardTitle>
                                <Badge>{order.status}</Badge>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Créée le {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                </p>

                                {order.customer ? (
                                    <p>
                                        Client :{" "}
                                        <span className="font-medium">
                                            {order.customer.name ?? "Client sans nom"}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="italic text-muted-foreground">Aucun client associé</p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {orders.length === 0 && (
                    <p className="text-muted-foreground">Aucune commande pour le moment.</p>
                )}
            </div>
        </div>
    );
}
