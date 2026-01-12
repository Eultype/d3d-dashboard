import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { SectionTitle } from "@/components/ui/section-title";

// It's better to define the type properly
type Customer = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    companyName: string | null;
    vatNumber: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
} | null;


type OrderCustomerCardProps = {
    customer: Customer;
};

export function OrderCustomerCard({ customer }: OrderCustomerCardProps) {
    if (!customer) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">Aucun client associé à cette commande.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Client</CardTitle>
                    <Link className="text-sm underline" href={`/dashboard/customers/${customer.id}`}>
                        Ouvrir →
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-xl border p-3">
                    <SectionTitle>Informations générales</SectionTitle>

                    <div className="mt-3 space-y-2">
                        <InfoRow label="Nom" value={customer.name ?? "—"} />
                        <InfoRow label="Téléphone" value={customer.phone ?? "—"} />

                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-sm font-medium break-all text-right">{customer.email ?? "—"}</p>
                        </div>

                        <InfoRow label="Société" value={customer.companyName ?? "Particulier"} />
                        <InfoRow label="TVA" value={customer.vatNumber ?? "—"} />
                    </div>
                </div>

                <div className="rounded-xl border p-3">
                    <SectionTitle>Adresse de livraison</SectionTitle>
                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">{customer.addressLine1 ?? "—"}</p>
                        {customer.addressLine2?.trim() ? <p>{customer.addressLine2}</p> : null}
                        <p>{(customer.postalCode ?? "—") + " " + (customer.city ?? "—")}</p>
                        <p>{customer.country ?? "—"}</p>
                    </div>
                </div>

                <div className="rounded-xl border p-3">
                    <SectionTitle>Adresse de facturation</SectionTitle>
                    <p className="mt-3 text-sm text-muted-foreground">Identique à l’adresse de livraison</p>
                </div>
            </CardContent>
        </Card>
    );
}
