import { getResellerFullDetails } from "@/lib/data/resellers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerContactCard } from "../../customers/[id]/_components/CustomerContactCard";
import { CustomerRecentOrdersCard } from "../../customers/[id]/_components/CustomerRecentOrdersCard";
import { CustomerLastProductsCard } from "../../customers/[id]/_components/CustomerLastProductsCard";
import { CustomerActiveBadge } from "@/components/badges/customer-active-badge";
import { formatDateTimeFR } from "@/lib/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails Revendeur | D3D Dashboard",
};

export default async function ResellerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const { id } = await params;
    const data = await getResellerFullDetails(id);

    if (!data || !data.user) return notFound();

    const { user, customer, lastItems } = data;
    const orders = customer?.orders || [];

    const { date: createdDate, time: createdTime } = formatDateTimeFR(user.createdAt);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <Link href="/dashboard/resellers" className="hover:underline">
                            Revendeurs
                        </Link>{" "}
                        / <span className="text-foreground">{customer?.name ?? user.email}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">{customer?.name ?? "Revendeur sans nom"}</h1>
                        {user.prefix && (
                            <Badge variant="outline" className="font-mono text-base">
                                {user.prefix}
                            </Badge>
                        )}
                        {customer && <CustomerActiveBadge isActive={customer.isActive} />}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Compte créé le {createdDate} à {createdTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/resellers">← Retour</Link>
                    </Button>
                    {/* Placeholder for edit if we had a dedicated reseller edit page, or link to customer edit */}
                    {customer && (
                        <Button asChild variant="outline">
                            <Link href={`/dashboard/customers/${customer.id}/edit`}>Modifier Infos</Link>
                        </Button>
                    )}
                </div>
            </div>

            {customer ? (
                <>
                    <CustomerContactCard customer={customer} />
                    
                    <div className="grid items-stretch gap-4 xl:grid-cols-2">
                        <CustomerRecentOrdersCard orders={orders} customerId={customer.id} />
                        <CustomerLastProductsCard lastItems={lastItems} />
                    </div>
                </>
            ) : (
                <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
                    <p>Ce compte revendeur n&apos;est pas encore lié à une fiche client complète.</p>
                </div>
            )}
        </div>
    );
}
