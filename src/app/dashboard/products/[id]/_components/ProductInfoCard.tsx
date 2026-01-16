import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
import { formatEUR } from "@/lib/money";
import Image from "next/image";
import { Product } from "@prisma/client";

export function ProductInfoCard({ product }: { product: Product }) {
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
            {/* Label Nom */}
            <span className="font-semibold  text-right">Nom</span>
            {/* Séparateur */}
            <div className="row-span-4 bg-gray-300 w-[2px] self-stretch" />
            {/* Nom */}
            <span className="font-medium">{product.name}</span>
            {/* Label SKU */}
            <span className="font-semibold  text-right">SKU</span>
            {/* SKU */}
            <span className="font-mono">{product.sku ?? "—"}</span>
            {/* Label Prix */}
            <span className="font-semibold  text-right">Prix</span>
            {/* Prix */}
            <span className="font-semibold tabular-nums">{price}</span>
            {/* Label Statut */}
            <span className="font-semibold  text-right">Statut</span>
            {/* Statut */}
            <span>
              <ProductActiveBadge isActive={product.isActive} />
            </span>
          </div>

          {/* Bloc droite */}
          <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
            <span className="font-semibold  text-right">Image</span>
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

            <span className="font-semibold  text-right">Description</span>
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
