export const dynamic = "force-dynamic";

import { NavLink } from "@/components/dashboard/nav-link";
import { ReactNode } from "react";
import { Package, Users, LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/auth/logout-button";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside className="hidden lg:block border-r bg-background">
          <div className="h-16 flex items-center px-6">
            <div className="font-semibold tracking-tight">
              D3D Dashboard
              <span className="block text-xs text-muted-foreground font-normal">
                Gravure 2D - 3D cristal
              </span>
            </div>
          </div>

          <Separator />

          <nav className="p-4 space-y-1">
            <NavLink
              href="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Vue d’ensemble"
            />
            <NavLink
              href="/dashboard/orders"
              icon={<Package className="h-4 w-4" />}
              label="Commandes"
            />
            <NavLink
              href="/dashboard/customers"
              icon={<Users className="h-4 w-4" />}
              label="Clients"
            />
          </nav>
        </aside>

        {/* MAIN */}
        <div>
          {/* TOPBAR */}
          <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="font-medium">Dashboard</div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Interne • v0.1
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {session.user?.email ?? "Utilisateur"}
                </span>
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
