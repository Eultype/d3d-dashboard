import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({ status }: { status: string }) {
    switch (status) {
        case "A_VERIFIER":
            return <Badge variant="secondary">À vérifier</Badge>;
        case "PROD":
            return <Badge>En production</Badge>;
        case "TERMINE":
            return <Badge variant="outline">Terminé</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
