import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type ProductRow = {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    priceCents: number;
    createdAt: string;
};

function formatPriceEUR(priceCents: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(priceCents / 100);
}

function ProductStatusBadge({ isActive }: { isActive: boolean }) {
    return isActive ? (
        <Badge>Actif</Badge>
    ) : (
        <Badge variant="secondary">Inactif</Badge>
    );
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/90">
                        <TableHead>Produit</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Créé le</TableHead>
                        <TableHead className="text-center w-[120px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                Aucun produit pour le moment
                            </TableCell>
                        </TableRow>
                    )}
                    {products.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                            <TableCell>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                        {p.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">IMG</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{p.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {p.description ?? "Aucune description"}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                            <TableCell className="font-medium">
                                {formatPriceEUR(p.priceCents)}
                            </TableCell>
                            <TableCell>
                                <ProductActiveBadge isActive={p.isActive} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="text-right">
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
