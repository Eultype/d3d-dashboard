"use client";
// Import React
import { Menu, LayoutDashboard, ClipboardList, Users, ShoppingBag, Settings } from "lucide-react";
import { useState, useEffect } from "react";
// Import des composants
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "./NavLink";
// Composant Navbar mobile
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="lg:hidden mr-2">
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col h-full">
        <SheetHeader className="py-5 px-6 text-left shrink-0">
          <SheetTitle className="font-bold text-lg">D3D Dashboard</SheetTitle>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Gravure 2D - 3D cristal</p>
        </SheetHeader>
        <Separator />
        
        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <div onClick={() => setOpen(false)}>
              <NavLink
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Vue d’ensemble"
              />
            </div>
            <div onClick={() => setOpen(false)}>
              <NavLink
                href="/dashboard/orders"
                icon={<ClipboardList className="h-4 w-4" />}
                label="Commandes"
              />
            </div>
            <div onClick={() => setOpen(false)}>
              <NavLink
                href="/dashboard/customers"
                icon={<Users className="h-4 w-4" />}
                label="Clients"
              />
            </div>
            <div onClick={() => setOpen(false)}>
              <NavLink
                href="/dashboard/products"
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Produits"
              />
            </div>
          </nav>

          <nav className="pt-4 border-t">
            <div onClick={() => setOpen(false)}>
              <NavLink
                href="/dashboard/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Paramètres"
              />
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
