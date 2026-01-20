import { prisma } from "@/lib/prisma";
import OrderForm from "./_components/NewOrderForm";
import type {Metadata} from "next";

export const metadata : Metadata = {
  title: "Nouvelle commande | D3D Dashboard",
};

export default async function NewOrderPage() {
  // 1. Récupération des produits actifs depuis la base de données
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      priceCents: true,
    },
    orderBy: { name: "asc" },
  });

  // 2. Transformation pour le composant client (si besoin, ici c'est déjà bon)
  const productsCatalog = products.map((p) => ({
    id: p.id,
    name: p.name,
    priceCents: p.priceCents,
  }));

  // 3. Rendu du formulaire client avec les données injectées
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold ">Nouvelle commande</h1>
        <p className=" mt-2">
          Créez une nouvelle commande en 4 étapes simples.
        </p>
      </div>

      <OrderForm productsCatalog={productsCatalog} />
    </div>
  );
}
