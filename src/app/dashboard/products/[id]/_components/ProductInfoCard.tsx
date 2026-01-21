// Import Next
import Image from "next/image";
// Import Composant
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductActiveBadge } from "@/components/badges/product-active-badge";
// Import lib
import { formatEUR } from "@/lib/money";
// Import Prisma
import { Product } from "@prisma/client";

export function ProductInfoCard({ product }: { product: Product }) {
  const price = formatEUR(product.priceCents ?? 0);

  return (
      <Card>
        <CardHeader>
          {/* Titre de la carte */}
          <CardTitle className="text-sm text-muted-foreground">
            Informations produit
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Grille principale : deux colonnes dès le format tablette (md) */}
          <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-24">

            {/* Bloc gauche : informations principales du produit */}
            <div className="grid grid-cols-[90px_2px_1fr] sm:grid-cols-[120px_2px_1fr] gap-x-3 sm:gap-x-4 gap-y-4 items-center">
              {/* Nom */}
              <span className="font-semibold text-right text-xs sm:text-base">Nom</span>
              {/* Séparateur vertical */}
              <div className="row-span-4 bg-gray-300 w-[2px] self-stretch" />
              <span className="font-medium truncate text-sm sm:text-base">{product.name}</span>

              {/* SKU */}
              <span className="font-semibold text-right text-xs sm:text-base">SKU</span>
              <span className="font-mono text-xs sm:text-sm">{product.sku ?? "—"}</span>

              {/* Prix */}
              <span className="font-semibold text-right text-xs sm:text-base">Prix</span>
              <span className="font-semibold tabular-nums text-sm sm:text-base">{price}</span>

              {/* Statut */}
              <span className="font-semibold text-right text-xs sm:text-base">Statut</span>
              <span>
                <ProductActiveBadge isActive={product.isActive} />
              </span>
            </div>

            {/* Bloc droite : image et description du produit */}
            <div className="grid grid-cols-[90px_2px_1fr] sm:grid-cols-[120px_2px_1fr] gap-x-3 sm:gap-x-4 gap-y-4 items-start">
              {/* Label Image */}
              <span className="font-semibold text-right text-xs sm:text-base pt-3">Image</span>
              {/* Séparateur vertical */}
              <div className="row-span-2 bg-gray-300 w-[2px] self-stretch" />
              {/* Aperçu de l'image et son URL */}
              <div className="pt-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Conteneur pour l'aperçu de l'image */}
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-[10px] text-muted-foreground">IMG</span>
                    )}
                  </div>
                  {/* Affichage du chemin ou message si pas d'image */}
                  <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {product.imageUrl ?? "Aucune image"}
                  </div>
                </div>
              </div>

              {/* Label Description */}
              <span className="font-semibold text-right text-xs sm:text-base">Description</span>
              {/* Affichage de la description ou message si absente */}
              <div className="text-xs sm:text-sm text-muted-foreground break-words min-w-0">
                {product.description?.trim() ? (
                    product.description
                ) : (
                    <span className="italic">Aucune description</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
