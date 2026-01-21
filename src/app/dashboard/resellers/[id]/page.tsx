import { getResellerFullDetails } from "@/lib/data/resellers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResellerContactCard } from "./_components/ResellerContactCard";
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

    const { user, lastItems } = data;
    const orders = user.createdOrders;

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
                        / <span className="text-foreground">{user.name ?? user.email}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">{user.name ?? "Revendeur sans nom"}</h1>
                        {user.prefix && (
                            <Badge variant="outline" className="font-mono text-base">
                                {user.prefix}
                            </Badge>
                        )}
                        <CustomerActiveBadge isActive={user.isActive} />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Compte créé le {createdDate} à {createdTime}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/dashboard/resellers">← Retour</Link>
                    </Button>
                    {/* <Button asChild variant="outline">
                        <Link href={`/dashboard/resellers/${user.id}/edit`}>Modifier Infos</Link>
                    </Button> */}
                </div>
            </div>

            <ResellerContactCard user={user} />
            
            <div className="grid items-stretch gap-4 xl:grid-cols-2">
                {/* I will need a ResellerRecentOrdersCard here */}
                {/* For now, I can't reuse CustomerRecentOrdersCard because it uses customerId. */}
                {/* I will use CustomerLastProductsCard because it should be compatible. */}
                <CustomerLastProductsCard lastItems={lastItems} />
            </div>
        </div>
    );
}