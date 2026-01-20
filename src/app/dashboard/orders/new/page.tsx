import { prisma } from "@/lib/prisma";
import OrderForm from "./_components/NewOrderForm";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Nouvelle commande | D3D Dashboard",
};

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userRole = session.user.role;
  let userPrefix = "";
  let prefilledCustomer = null;

  // Si Revendeur, on récupère son préfixe et son client associé
  if (userRole === "REVENDEUR") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { prefix: true, email: true }
    });
    
    userPrefix = user?.prefix || "WEB"; // Fallback sur WEB si pas de préfixe (ne devrait pas arriver avec le nouveau flow)

    // On récupère le client associé pour pré-remplir les infos de facturation/contact
    if (user?.email) {
      prefilledCustomer = await prisma.customer.findUnique({
        where: { email: user.email },
      });
    }
  }

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
          {userRole === "REVENDEUR" 
            ? "Créez une nouvelle commande rapidement."
            : "Créez une nouvelle commande en 4 étapes simples."}
        </p>
      </div>

      <OrderForm 
        productsCatalog={productsCatalog} 
        userRole={userRole}
        userPrefix={userPrefix}
        prefilledCustomer={prefilledCustomer}
      />
    </div>
  );
}
