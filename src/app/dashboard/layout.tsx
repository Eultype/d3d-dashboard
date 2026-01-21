// Import Next
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// Import React
import { ReactNode } from "react";
import { ShoppingBag, ClipboardList, Users, LayoutDashboard, Settings } from "lucide-react";
// Import des composants
import { Separator } from "@/components/ui/separator";
import ClientSideHeaderElements from "./_components/ClientSideHeaderElements";
import { MobileNav } from "./_components/MobileNav";
import { NavLink } from "./_components/NavLink";
// Import des lib
import { getNotificationsForUser } from "@/lib/data/notifications";
import { authOptions } from "@/lib/auth-options";

// Layout du dashboard
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  // Fetch initial notifications
  const initialNotifications = await getNotificationsForUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* Barre latérale (visible uniquement sur les écrans larges) */}
        <aside className="hidden lg:flex flex-col border-r bg-background h-screen sticky top-0">
          <div className="h-16 flex items-center px-6 shrink-0">
            <div className="font-semibold tracking-tight">
              D3D Dashboard
              <span className="block text-xs text-muted-foreground font-normal">
                Gravure 2D - 3D cristal
              </span>
            </div>
          </div>

          {/* Séparateur */}
          <Separator />

          {/* Navigation dans la barre latérale */}
          <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
            <nav className="space-y-1">
              <NavLink
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Vue d’ensemble"
              />
              <NavLink
                href="/dashboard/orders"
                icon={<ClipboardList className="h-4 w-4" />}
                label="Commandes"
              />
              {session.user.role === "ADMIN" && (
                  <>
                      <NavLink
                      href="/dashboard/customers"
                      icon={<Users className="h-4 w-4" />}
                      label="Clients"
                      />
                      <NavLink
                      href="/dashboard/products"
                      icon={<ShoppingBag className="h-4 w-4" />}
                      label="Produits"
                      />
                      <NavLink
                        href="/dashboard/resellers"
                        icon={<Users className="h-4 w-4" />} // Reuse Users icon or import another one like UserPlus
                        label="Revendeurs"
                      />
                  </>
              )}
            </nav>

            {/* Section bas (Paramètres) */}
            {session.user.role === "ADMIN" && (
              <nav className="pt-4 border-t">
                <NavLink
                  href="/dashboard/settings"
                  icon={<Settings className="h-4 w-4" />}
                  label="Paramètres"
                />
              </nav>
            )}
          </div>
        </aside>

        {/* Contenu principal */}
        <div>
          {/* Barre supérieure avec navigation et infos utilisateur */}
          <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
              <div className="flex items-center gap-3">
                {/* Navbar mobile */}
                <MobileNav />
                <div className="font-medium">Dashboard</div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Interne • v0.1
                </span>
              </div>

              {/* Partie droite : éléments dynamiques côté client (email et notifications) */}
              <ClientSideHeaderElements
                sessionUserEmail={session.user?.email ?? "Utilisateur"}
                initialNotifications={initialNotifications}
                userRole={session.user.role as string}
              />
            </div>
          </header>

          <main className="px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}