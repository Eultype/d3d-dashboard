{/* Import des datas */}
import { getCustomerDetails, getCustomerOrders, getCustomerOrderItems } from "@/lib/data/customers";
{/* Import Next */}
import { notFound } from "next/navigation";
import Link from "next/link";
{/* Import des composants */}
import { CustomerContactCard } from "./_components/CustomerContactCard";
import { CustomerRecentOrdersCard } from "./_components/CustomerRecentOrdersCard";
import { CustomerLastProductsCard } from "./_components/CustomerLastProductsCard";
import { CustomerTypeBadge } from "@/components/badges/customer-type-badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { Button } from "@/components/ui/button";
{/* Import des lib */}
import { formatDateTimeFR } from "@/lib/dates";

{/* Page de détails client */}
export default async function CustomerDetailPage({
                                                     params,
                                                 }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    const customer = await getCustomerDetails(id);
    const orders = await getCustomerOrders(id);
    const lastItems = await getCustomerOrderItems(id);

    if (!customer) return notFound();

    const shortId = customer.id.slice(0, 10);
    // ✅ Date + heure via 1 seule fonction (plus propre)
    const { date: createdDate, time: createdTime } = formatDateTimeFR(
        new Date(customer.createdAt)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/customers" className="hover:underline">
                            Clients
                        </Link>{" "}
                        / <span className="text-foreground">#{customer.id.slice(0, 10)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Fiche client #{shortId}</h1>
                        <CustomerTypeBadge companyName={customer.companyName} />
                        <CustomerActiveBadge isActive={customer.isActive} />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Créé le {createdDate} à {createdTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/customers">← Retour</Link>
                    </Button>
                </div>
            </div>
            {/* Informations du client */}
            <CustomerContactCard customer={customer} />

            {/* Commandes récentes - Derniers produits commandés */}
            <div className="grid items-stretch gap-4 xl:grid-cols-2">
                {/* Commandes récentes */}
                <CustomerRecentOrdersCard orders={orders} customerId={customer.id} />
                {/* Derniers produits commandés */}
                <CustomerLastProductsCard lastItems={lastItems} />
            </div>
        </div>
    );
}
