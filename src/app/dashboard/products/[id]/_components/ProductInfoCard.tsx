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
          {/* Grille principale : deux colonnes (gauche et droite) responsives */}
          <div className="mx-auto max-w-4xl grid gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">

            {/* Bloc gauche : informations principales du produit */}
            <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
              {/* Nom */}
              <span className="font-semibold text-right">Nom</span>
              {/* Séparateur vertical */}
              <div className="row-span-4 bg-gray-300 w-[2px] self-stretch" />
              <span className="font-medium">{product.name}</span>

              {/* SKU */}
              <span className="font-semibold text-right">SKU</span>
              <span className="font-mono">{product.sku ?? "—"}</span>

              {/* Prix */}
              <span className="font-semibold text-right">Prix</span>
              <span className="font-semibold tabular-nums">{price}</span>

              {/* Statut */}
              <span className="font-semibold text-right">Statut</span>
              <span>
                <ProductActiveBadge isActive={product.isActive} />
              </span>
            </div>

            {/* Bloc droite : image et description du produit */}
            <div className="grid grid-cols-[140px_2px_1fr] gap-x-4 gap-y-4 items-center">
              {/* Label Image */}
              <span className="font-semibold text-right">Image</span>
              {/* Séparateur vertical */}
              <div className="row-span-2 bg-gray-300 w-[2px] self-stretch" />
              {/* Aperçu de l'image et son URL */}
              <span>
                <div className="flex items-center gap-3">
                  {/* Conteneur pour l'aperçu de l'image */}
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
                  {/* Affichage du chemin ou message si pas d'image */}
                  <div className="text-sm text-muted-foreground truncate">
                    {product.imageUrl ?? "Aucune image"}
                  </div>
                </div>
              </span>

              {/* Label Description */}
              <span className="font-semibold text-right">Description</span>
              {/* Affichage de la description ou message si absente */}
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
