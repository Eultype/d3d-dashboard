import Link from "next/link";
import { ReactNode } from "react";
import { Package, Users, LayoutDashboard } from "lucide-react";

import { Separator } from "@/components/ui/separator";

function NavLink({
                     href,
                     icon,
                     label,
                 }: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    // Active state (sans hooks, compatible server component)
    // On utilise un data-attr qu'on gérera côté CSS via :has() ? -> pas fiable partout.
    // Donc on fait simple : on garde un style neutre. (Je te donne ensuite une version "active" parfaite avec usePathname si tu veux.)
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <div className="grid lg:grid-cols-[260px_1fr]">
                {/* SIDEBAR */}
                <aside className="hidden lg:block border-r bg-background">
                    <div className="h-16 flex items-center px-6">
                        <div className="font-semibold tracking-tight">
                            D3D Dashboard
                            <span className="block text-xs text-muted-foreground font-normal">
                Gravure 3D cristal
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
                <div className="min-w-0">
                    {/* TOPBAR */}
                    <header className="h-16 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="h-full flex items-center justify-between px-4 lg:px-8">
                            <div className="flex items-center gap-3">
                                <div className="font-medium">Dashboard</div>
                                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Interne • v0.1
                </span>
                            </div>

                            <div className="text-sm text-muted-foreground">admin@test.com</div>
                        </div>
                    </header>

                    <main className="px-4 py-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
