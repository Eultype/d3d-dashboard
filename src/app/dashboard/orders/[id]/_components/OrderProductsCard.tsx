import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEUR } from "@/lib/utils/money";

type OrderProductsCardProps = {
  items: {
    id: string;
    quantity: number;
    unitPriceCents: number;
    customText?: string | null;
    needs3D?: boolean | null;
    product?: {
      name: string | null;
      sku: string | null;
      imageUrl: string | null;
    } | null;
  }[];
  orderStatus: string;
};

export function OrderProductsCard({
  items,
  orderStatus,
}: OrderProductsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base">Produits</CardTitle>
          <p className="text-sm text-muted-foreground">
            Articles de la commande
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-hidden rounded-b-2xl border-t">
          <div className="grid grid-cols-12 bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">
            <div className="col-span-5">Article</div>
            <div className="col-span-2 text-center">Statut</div>
            <div className="col-span-1 text-center">Qté</div>
            <div className="col-span-2 text-right">Prix</div>
            <div className="col-span-2 text-right">Montant</div>
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground italic">
              Aucun produit.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((it) => {
                const name = it.product?.name ?? "Produit supprimé";
                const sku = it.product?.sku ?? "—";
                const unit = formatEUR(it.unitPriceCents);
                const amount = formatEUR(it.unitPriceCents * it.quantity);

                const lineStatus =
                  orderStatus === "TERMINE"
                    ? "Livré"
                    : orderStatus === "PROD"
                      ? "En cours"
                      : "En attente";

                const imgSrc = it.product?.imageUrl ?? "";

                return (
                  <div
                    key={it.id}
                    className="grid grid-cols-12 items-center px-4 py-3"
                  >
                    {/* Article */}
                    <div className="col-span-5 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl border bg-muted/40 shadow-sm">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt={name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-muted-foreground">
                              {name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {sku} • {unit}
                          </p>
                          {it.customText && (
                            <p className="text-xs text-blue-600 font-medium truncate mt-0.5">
                              Texte personnalisé : {it.customText}
                            </p>
                          )}
                          {it.needs3D && (
                            <p className="text-xs text-amber-600 font-medium truncate mt-0.5">
                              • Nécessite sous-traitance 3D
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Statut */}
                    <div className="col-span-2 flex justify-center">
                      <Badge
                        variant={
                          orderStatus === "TERMINE" ? "outline" : "secondary"
                        }
                      >
                        {lineStatus}
                      </Badge>
                    </div>

                    {/* Qté */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex rounded-lg border bg-background px-2 py-1 text-sm font-semibold tabular-nums">
                        {it.quantity}
                      </span>
                    </div>

                    {/* Prix */}
                    <div className="col-span-2 text-right text-sm tabular-nums">
                      {unit}
                    </div>

                    {/* Montant */}
                    <div className="col-span-2 text-right text-sm font-semibold tabular-nums">
                      {amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
