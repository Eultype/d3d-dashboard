// Import Next
import Link from "next/link";
// Import Composant
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductRecentCustomersCardProps = {
    lastCustomers: {
        id: string;
        name: string | null;
        email: string | null;
    }[];
};

import { ProductRecentCustomer } from "@/types/product";
import { ArrowRight } from "lucide-react";

// Composent des derniers clients ayant commandé ce produit
export function ProductRecentCustomersCard({ lastCustomers }: { lastCustomers: ProductRecentCustomer[] }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                {/* Titre de la carte */}
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Derniers clients ayant commandé ce produit
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                {/* Si aucun client n’a commandé ce produit */}
                    {lastCustomers.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4">
                        Aucun client n’a encore commandé ce produit.
                    </p>
                )}

                {/* Liste des clients */}
                <div className="space-y-4">
                    {lastCustomers.map((c) => (
                        <div
                            key={c.id}
                            className="group relative flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                        >
                            <div className="min-w-0 space-y-1">
                                <div className="font-semibold truncate">
                                    {c.name ?? "Client sans nom"}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                    {c.email ?? "—"}
                                </div>
                            </div>

                            {/* Bouton d’accès à la fiche client */}
                            <Button asChild size="sm" variant="outline" className="shrink-0">
                                <Link href={`/dashboard/customers/${c.id}`}>Voir</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
