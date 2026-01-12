import { Badge } from "@/components/ui/badge";

export function CustomerTypeBadge({ companyName }: { companyName?: string | null }) {
    const label = companyName?.trim() ? "Entreprise" : "Particulier";

    return <Badge variant="secondary">{label}</Badge>;
}
