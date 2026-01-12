import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import { formatEUR } from "@/lib/money";
import Image from "next/image";

export function ProductInfoCard({ product }: { product: any }) {
    const price = formatEUR(product.priceCents ?? 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Informations produit
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="mx-auto max-w-4xl grid gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
                    {/* Bloc gauche */}
                    <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                        <span className="font-semibold text-gray-700 text-right">
                            Nom
                        </span>
                        <div className="row-span-4 bg-gray-300 w-[2px] self-stretch" />
                        <span className="font-medium">{product.name}</span>

                        <span className="font-semibold text-gray-700 text-right">
                            SKU
                        </span>
                        <span className="font-mono">{product.sku ?? "—"}</span>

                        <span className="font-semibold text-gray-700 text-right">
                            Prix
                        </span>
                        <span className="font-semibold tabular-nums">{price}</span>

                        <span className="font-semibold text-gray-700 text-right">
                            Statut
                        </span>
                        <span>
                            <ProductActiveBadge isActive={product.isActive} />
                        </span>
                    </div>

                    {/* Bloc droite */}
                    <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
                        <span className="font-semibold text-gray-700 text-right">
                            Image
                        </span>
                        <div className="row-span-2 bg-gray-300 w-[2px] self-stretch" />
                        <span>
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-muted-foreground">IMG</span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {product.imageUrl ?? "Aucune image"}
                                </div>
                            </div>
                        </span>

                        <span className="font-semibold text-gray-700 text-right">
                            Description
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {product.description?.trim() ? (
                                product.description
                            ) : (
                                <span className="italic">Aucune description</span>
                            )}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
