import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Clients</h1>
                <p className="text-sm text-muted-foreground">
                    Liste des clients enregistrés
                </p>
            </div>

            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Liste</CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    {customers.length === 0 ? (
                        <div className="p-6 text-sm text-muted-foreground italic">
                            Aucun client pour le moment.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40">
                                        <TableHead className="min-w-[180px]">Nom</TableHead>
                                        <TableHead className="min-w-[220px]">Email</TableHead>
                                        <TableHead className="min-w-[140px]">Téléphone</TableHead>
                                        <TableHead className="min-w-[180px]">Société</TableHead>
                                        <TableHead className="min-w-[140px]">TVA</TableHead>
                                        <TableHead className="min-w-[150px]">Créé le</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {customers.map((c) => (
                                        <TableRow key={c.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                {c.name ?? <span className="text-muted-foreground">—</span>}
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {c.email ?? "—"}
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {c.phone ?? "—"}
                                            </TableCell>

                                            <TableCell>
                                                {c.companyName ? (
                                                    <span>{c.companyName}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">Particulier</span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {c.vatNumber ? (
                                                    <span className="font-mono text-sm">{c.vatNumber}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">❌</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
