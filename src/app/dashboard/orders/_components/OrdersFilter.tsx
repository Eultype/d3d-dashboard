"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OrdersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    // Reset page to 1 when filter changes
    params.set("page", "1");
    
    router.push(`/dashboard/orders?${params.toString()}`);
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Tous les statuts</SelectItem>
        <SelectItem value="A_VERIFIER">À confirmer</SelectItem>
        <SelectItem value="PROD">En production</SelectItem>
        <SelectItem value="A_EXPEDIER">À expédier</SelectItem>
        <SelectItem value="TERMINE">Livrée</SelectItem>
      </SelectContent>
    </Select>
  );
}
