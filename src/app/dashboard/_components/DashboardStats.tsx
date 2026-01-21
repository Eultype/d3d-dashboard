// Import des composants
import { StatItem } from "@/components/dashboard/StatItem";
// Import Lucide-React
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
    <div className="flex overflow-x-auto pb-2 gap-3 md:grid md:grid-cols-3 xl:grid-cols-5 md:pb-0 scrollbar-hide">
        {/* Carte : Commandes en cours */}
        <div className="min-w-[140px] flex-1">
        <StatItem
          icon={<ClipboardList className="h-4 w-4" />}
          label="En cours"
          value={stats.countInProgress}
          hint="Commandes actives"
        />
      </div>

      {/* Carte : Commandes à vérifier*/}
      <div className="min-w-[140px] flex-1">
        <StatItem
          icon={<AlertCircle className="h-4 w-4" />}
          label="À vérifier"
          value={stats.countToVerify}
          hint="Priorité"
        />
      </div>
      {/* Carte : Commandes en productions */}
      <div className="min-w-[140px] flex-1">
        <StatItem
          icon={<Factory className="h-4 w-4" />}
          label="En production"
          value={stats.countInProd}
          hint="Atelier"
        />
      </div>
      {/* Carte : Commandes à expédier */}
      <div className="min-w-[140px] flex-1">
        <StatItem
          icon={<Truck className="h-4 w-4" />}
          label="À expédier"
          value={stats.countToShip}
          hint="Prêtes à envoyer"
        />
      </div>

      <div className="min-w-[140px] flex-1">
        <StatItem
          icon={<Store className="h-4 w-4" />}
          label="À récupérer"
          value={stats.countToPickUp}
          hint="Click & collect"
        />
      </div>
    </div>
  );
}
