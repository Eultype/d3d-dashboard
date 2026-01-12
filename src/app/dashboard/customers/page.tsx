import Link from "next/link";
import type { Metadata } from "next";

import { CustomersTable } from "@/components/dashboard/customers-table";
import { Button } from "@/components/ui/button";

import { Users, UserCheck, Building2, BadgeCheck, UserPlus,} from "lucide-react";
import { getCustomersAndStats } from "@/lib/data/customers";
import { StatItem } from "@/components/dashboard/StatItem";

export default async function CustomersPage() {
    const { customers, stats } = await getCustomersAndStats();

    const { totalCustomers, actifs, entreprises, tvaRenseignee, nouveaux30j } = stats;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:underline">
                            Dashboard
                        </Link>{" "}
                        /{" "}
                        <span className="text-foreground">Clients</span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Clients</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestion des clients enregistrés
                        </p>
                    </div>
                </div>

                {/* Si tu as la route /new, sinon supprime ce bouton */}
                <Button asChild>
                    <Link href="/dashboard/customers/new">Nouveau client</Link>
                </Button>
            </div>

            {/* Stats (sans “Aperçu”, juste les 5 cards) */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <StatItem
                    icon={<Users className="h-4 w-4" />}
                    label="Clients"
                    value={totalCustomers}
                    hint="Total"
                />

                <StatItem
                    icon={<UserCheck className="h-4 w-4" />}
                    label="Actifs"
                    value={actifs}
                    hint="Statut actif"
                />

                <StatItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Entreprises"
                    value={entreprises}
                    hint="Avec société"
                />

                <StatItem
                    icon={<BadgeCheck className="h-4 w-4" />}
                    label="TVA"
                    value={tvaRenseignee}
                    hint="TVA renseignée"
                />

                <StatItem
                    icon={<UserPlus className="h-4 w-4" />}
                    label="Nouveaux"
                    value={nouveaux30j}
                    hint="Sur 30 jours"
                />
            </div>

            {/* Table */}
            <CustomersTable
                customers={customers.map((c) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    phone: c.phone,
                    companyName: c.companyName,
                    vatNumber: c.vatNumber,
                    isActive: c.isActive,
                    createdAt: c.createdAt.toISOString(),
                }))}
            />
        </div>
    );
}
