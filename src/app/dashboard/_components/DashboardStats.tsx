import { StatItem } from "@/components/dashboard/StatItem";
import { ClipboardList, AlertCircle, Factory, Truck, Store } from "lucide-react";

type DashboardStatsProps = {
  stats: {
    countInProgress: number;
    countToVerify: number;
    countInProd: number;
    countToShip: number;
    countToPickUp: number;
  };
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatItem
        icon={<ClipboardList className="h-4 w-4" />}
        label="En cours"
        value={stats.countInProgress}
        hint="Commandes actives"
      />

      <StatItem
        icon={<AlertCircle className="h-4 w-4" />}
        label="À vérifier"
        value={stats.countToVerify}
        hint="Priorité"
      />

      <StatItem
        icon={<Factory className="h-4 w-4" />}
        label="En production"
        value={stats.countInProd}
        hint="Atelier"
      />

      <StatItem
        icon={<Truck className="h-4 w-4" />}
        label="À expédier"
        value={stats.countToShip}
        hint="Prêtes à envoyer"
      />

      <StatItem
        icon={<Store className="h-4 w-4" />}
        label="À récupérer"
        value={stats.countToPickUp}
        hint="Click & collect"
      />
    </div>
  );
}
