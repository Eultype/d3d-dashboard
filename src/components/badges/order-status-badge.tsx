import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({ status }: { status: string }) {
    switch (status) {
        case "A_VERIFIER":
            return <Badge variant="secondary">À confirmer</Badge>;
        case "PROD":
            return <Badge variant="info">En production</Badge>;
        case "A_EXPEDIER":
            return <Badge variant="warning">À expédier</Badge>;
        case "TERMINE":
            return <Badge variant="success">Livrée</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
