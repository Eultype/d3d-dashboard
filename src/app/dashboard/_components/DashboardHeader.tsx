import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  userRole?: string;
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>{" "}
          / <span className="text-foreground">Vue d’ensemble</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Le pipeline des commandes + accès rapide aux actions.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button asChild>
          <Link href="/dashboard/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle commande
          </Link>
        </Button>

        {isAdmin && (
            <>
                <Button asChild variant="outline">
                <Link href="/dashboard/customers/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau client
                </Link>
                </Button>

                <Button asChild variant="outline">
                <Link href="/dashboard/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau produit
                </Link>
                </Button>
            </>
        )}
      </div>
    </div>
  );
}
