import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductRecentCustomersCardProps = {
    lastCustomers: {
        id: string;
        name: string | null;
        email: string | null;
    }[];
};

export function ProductRecentCustomersCard({ lastCustomers }: ProductRecentCustomersCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Derniers clients ayant commandé ce produit
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {lastCustomers.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        Aucun client n’a encore commandé ce produit.
                    </p>
                )}

                {lastCustomers.map((c) => (
                    <div
                        key={c.id}
                        className="rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                            <div className="min-w-0">
                                <div className="font-medium truncate">
                                    {c.name ?? "Client sans nom"}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {c.email ?? "—"}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button asChild size="sm" variant="outline" className="shrink-0">
                                    <Link href={`/dashboard/customers/${c.id}`}>Voir</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
