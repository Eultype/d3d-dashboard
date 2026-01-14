// Import des datas
import { getOrderDetails } from "@/lib/data/orders";
{/* Import Next */}
import { notFound } from "next/navigation";
import Link from "next/link";
import type {Metadata} from "next";
// Import des composants
import { OrderProgressionCard } from "./_components/OrderProgressionCard";
import { OrderStatusBadge } from "@/components/badges/order-status-badge";
import { OrderProductsCard } from "./_components/OrderProductsCard";
import { OrderNotesCard } from "./_components/OrderNotesCard";
import { OrderFilesCard } from "./_components/OrderFilesCard";
import { OrderSummaryCard } from "./_components/OrderSummaryCard";
import { OrderCustomerCard } from "./_components/OrderCustomerCard";
import { Button } from "@/components/ui/button";
// Import des lib
import { orderTotalCents } from "@/lib/orders";
import { formatDateTimeFR } from "@/lib/dates";

// Metadata du dashboard
export const metadata: Metadata = {
    title: "D3D | Dashboard | Détails commande",
    description:
        "Consultez le détail, le statut, les fichiers et l’historique des modifications de cette commande.",
};

// Page de détails commande
export default async function OrderDetailPage({
                                                  params,
                                              }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const order = await getOrderDetails(id);

    if (!order) return notFound();

    const shortId = order.id.slice(0, 10);
    const { date: createdDate, time: createdTime } = formatDateTimeFR(new Date(order.createdAt));

    const sousTotalCents = orderTotalCents(order.items);
    const livraisonCents = 0;
    const tvaCents = 0;
    const totalCents = sousTotalCents + livraisonCents + tvaCents;

    const articlesCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/orders" className="hover:underline">
                            Commandes
                        </Link>{" "}
                        / <span className="text-foreground">{order.reference ?? shortId}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Commande {order.reference ?? shortId}</h1>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>Détails de la commande</span>
                        <span>•</span>
                        <span>
                             {createdDate} à {createdTime}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-foreground">
                            {articlesCount} article{articlesCount > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild>
                        <Link href={`/dashboard/orders/${order.id}/edit`}>Modifier la commande</Link>
                    </Button>

                    <Button asChild variant="ghost">
                        <Link href="/dashboard/orders">← Retour</Link>
                    </Button>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-4 lg:grid-cols-12 items-start">
                {/* Colonne gauche : Progression - Produits - Notes + Fichiers */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Progression */}
                    <OrderProgressionCard order={order} />
                    {/* Produits */}
                    <OrderProductsCard items={order.items} orderStatus={order.status} />

                    {/* Notes + Fichiers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Notes */}
                        <OrderNotesCard notes={order.notes} />
                        {/* Fichiers */}
                        <OrderFilesCard files={order.files} />
                    </div>
                </div>

                {/* Colonne droite : Récapitulatif - Client */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Récapitulatif */}
                    <OrderSummaryCard
                        orderId={order.id}
                        sousTotalCents={sousTotalCents}
                        livraisonCents={livraisonCents}
                        tvaCents={tvaCents}
                        totalCents={totalCents}
                    />
                    {/* Client */}
                    <OrderCustomerCard customer={order.customer} />
                </div>
            </div>
        </div>
    );
}

