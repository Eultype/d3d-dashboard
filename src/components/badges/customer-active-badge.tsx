import { CheckCircle, PauseCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CustomerActiveBadge({ isActive }: { isActive: boolean }) {
    return isActive ? (
        <Badge className="flex items-center gap-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <CheckCircle className="h-3 w-3" />
            Actif
        </Badge>
    ) : (
        <Badge className="flex items-center gap-1 bg-orange-500/15 text-orange-700 border border-orange-600/30">
            <PauseCircle className="h-3 w-3" />
            Inactif
        </Badge>
    );
}
