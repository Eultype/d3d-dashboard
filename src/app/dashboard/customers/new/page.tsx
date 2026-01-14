import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "../_components/CustomerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "D3D | Créer un client",
    description: "Ajoutez un nouveau client à votre base de données.",
};

export default function CustomerCreatePage() {
    return (
        <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link> /{" "}
                <Link href="/dashboard/customers" className="hover:underline">Clients</Link> /{" "}
                <span className="text-foreground">Nouveau</span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Nouveau client</h1>
                    <p className="text-sm text-muted-foreground">Ajoutez un nouveau client à votre base de données.</p>
                </div>
                <Button asChild variant="ghost">
                    <Link href="/dashboard/customers">← Annuler</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du client</CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomerForm />
                </CardContent>
            </Card>
        </div>
    );
}
