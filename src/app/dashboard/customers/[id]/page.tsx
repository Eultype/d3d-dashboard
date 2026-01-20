// Import des datas
import { getCustomerPageData, getCustomerOrderItems } from "@/lib/data/customers";
//Import Next
import { notFound } from "next/navigation";
import Link from "next/link";
import type {Metadata} from "next";
// Import des composants
import { CustomerContactCard } from "./_components/CustomerContactCard";
import { CustomerRecentOrdersCard } from "./_components/CustomerRecentOrdersCard";
import { CustomerLastProductsCard } from "./_components/CustomerLastProductsCard";
import { CustomerTypeBadge } from "@/components/badges/customer-type-badge";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { Button } from "@/components/ui/button";
// Import des lib
import { formatDateTimeFR } from "@/lib/dates";

// Metadata de la page
export const metadata: Metadata = {
    title: "D3D | Dashboard | Détails client",
    description:
        "Consultez et gérez les informations du client, son historique de commandes, ses statuts et autres actions associées.",
};

// Page de détails client
export default async function CustomerDetailPage({
                                                     params,
                                                 }: {
    params: Promise<{ id?: string }>;
}) {
    const { id } = await params;
    if (!id) return notFound();

    // On utilise la nouvelle fonction optimisée
    const customer = await getCustomerPageData(id); 
    const lastItems = await getCustomerOrderItems(id);

    if (!customer) return notFound();

    // Les commandes sont maintenant une propriété de l'objet customer
    const orders = customer.orders; 

    // Date + heure
    const { date: createdDate, time: createdTime } = formatDateTimeFR(
        new Date(customer.createdAt)
    );

    return (
        <div className="space-y-6">
            {/* En-tête : fil d’Ariane, titre et badges client, actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    {/* Fil d’Ariane */}
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/customers" className="hover:underline">
                            Clients
                        </Link>{" "}
                        / <span className="text-foreground">{customer.name ?? "Client sans nom"}</span>
                    </div>

                    {/* Titre + badges type et statut */}
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">{customer.name ?? "Client sans nom"}</h1>
                        <CustomerTypeBadge companyName={customer.companyName} />
                        <CustomerActiveBadge isActive={customer.isActive} />
                    </div>

                    {/* Date de création du client */}
                    <p className="text-sm text-muted-foreground">
                        Créé le {createdDate} à {createdTime}
                    </p>
                </div>

                {/* Actions principales : retour / modification */}
                <div className="flex items-center gap-2">
                    {/* Bouton retour */}
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/customers">← Retour</Link>
                    </Button>
                    {/* Bouton modifier */}
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/customers/${customer.id}/edit`}>Modifier</Link>
                    </Button>
                </div>
            </div>

            {/* Carte de contact du client */}
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
