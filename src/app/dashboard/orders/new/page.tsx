import { prisma } from "@/lib/services/prisma";
import OrderForm from "./_components/NewOrderForm";
import ResellerOrderForm from "./_components/reseller/ResellerOrderForm"; // Import du nouveau formulaire
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
    
    userPrefix = user?.prefix || "WEB"; 

    if (user?.email) {
      prefilledCustomer = await prisma.customer.findUnique({
        where: { email: user.email },
      });
    }
  }

  // 1. Récupération des produits visibles (Disponible + Rupture)
  const products = await prisma.product.findMany({
    where: { 
      status: { in: ["AVAILABLE", "OUT_OF_STOCK"] } 
    },
    select: {
      id: true,
      name: true,
      priceCents: true,
      category: true,
      status: true,
    },
    orderBy: { name: "asc" },
  });

  const productsCatalog = products.map((p) => ({
    id: p.id,
    name: p.name,
    priceCents: p.priceCents,
    category: p.category || undefined,
    status: p.status,
  }));

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

      {/* AIGUILLAGE INTELLIGENT */}
      {userRole === "REVENDEUR" ? (
        <ResellerOrderForm 
          productsCatalog={productsCatalog} 
          userPrefix={userPrefix}
          prefilledCustomer={prefilledCustomer}
        />
      ) : (
        <OrderForm 
          productsCatalog={productsCatalog} 
        />
      )}
    </div>
  );
}
