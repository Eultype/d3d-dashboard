import { CheckCircle, PauseCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductActiveBadge({ status }: { status: string }) {
    if (status === "AVAILABLE") {
        return (
            <Badge className="flex items-center gap-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 whitespace-nowrap">
                <CheckCircle className="h-3 w-3" />
                Disponible
            </Badge>
        );
    }

    if (status === "OUT_OF_STOCK") {
        return (
            <Badge className="flex items-center gap-1 bg-orange-500/15 text-orange-700 border border-orange-500/30 whitespace-nowrap">
                <PauseCircle className="h-3 w-3" />
                Rupture de stock
            </Badge>
        );
    }

    return (
        <Badge className="flex items-center gap-1 bg-slate-500/15 text-slate-700 border border-slate-500/30 whitespace-nowrap">
            <XCircle className="h-3 w-3" />
            Masqué du catalogue
        </Badge>
    );
}
