import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import NewResellerForm from "./_components/NewResellerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouveau Revendeur | D3D Dashboard",
};

export default async function NewResellerPage() {
  const session = await getServerSession(authOptions);
  
  // Sécurité : Seul l'ADMIN peut créer des revendeurs
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="py-8">
      <NewResellerForm />
    </div>
  );
}
