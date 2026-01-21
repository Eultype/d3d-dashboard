"use client";
// Import React
import { Menu, LayoutDashboard, ClipboardList, Users, ShoppingBag } from "lucide-react";
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
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-6 text-left">
          <SheetTitle className="font-bold">D3D Dashboard</SheetTitle>
          <p className="text-xs text-muted-foreground">Gravure 2D - 3D cristal</p>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col gap-1 p-4">
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
      </SheetContent>
    </Sheet>
  );
}
