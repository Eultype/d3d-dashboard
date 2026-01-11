import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { CustomersTable } from "@/components/dashboard/customers-table";
import { Button } from "@/components/ui/button";

import {
    Users,
    UserCheck,
    Building2,
    BadgeCheck,
    UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
    title: "D3D | Dashboard | Gestion des clients",
    description:
        "Gérez et suivez l’ensemble des clients : informations, historique, interactions et actions associées.",
};

function StatItem({
                      icon,
                      label,
                      value,
                      hint,
                  }: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    hint?: string;
}) {
    return (
        <div className="rounded-lg border bg-background px-4 py-3 shadow-sm transition-colors hover:bg-muted/20">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                        {icon}
                    </div>
                    <div className="text-[11px] font-medium uppercase tracking-wide">
                        {label}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-xl font-bold tabular-nums leading-tight">
                {value}
            </div>
            {hint ? (
                <div className="mt-1 text-[11px] leading-tight text-muted-foreground">
                    {hint}
                </div>
            ) : null}
        </div>
    );
}

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Stats
    const totalCustomers = customers.length;
    const actifs = customers.filter((c) => c.isActive).length;
    const entreprises = customers.filter((c) => !!c.companyName?.trim()).length;
    const tvaRenseignee = customers.filter((c) => !!c.vatNumber?.trim()).length;

    // “Nouveaux (30j)”
    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);
    const nouveaux30j = customers.filter((c) => new Date(c.createdAt) >= d30).length;

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
                        <Link href="/dashboard/customers" className="hover:underline">
                            Clients
                        </Link>
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
