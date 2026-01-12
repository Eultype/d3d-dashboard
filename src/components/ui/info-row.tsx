import type { ReactNode } from "react";

export function InfoRow({ label, value }: { label: ReactNode; value: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-sm font-medium text-right">{value}</div>
        </div>
    );
}
