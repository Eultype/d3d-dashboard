import type { ReactNode } from "react";

export function StatItem({
    icon,
    label,
    value,
    hint,
}: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    hint?: ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-background px-4 py-3 shadow-sm transition-colors hover:bg-muted/20">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                        {icon}
                    </div>
                    <div className="text-[11px] font-medium uppercase tracking-wide">
                        {label}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-xl font-bold tabular-nums leading-tight">
                {value}
            </div>
            {hint ? (
                <div className="mt-1 text-[11px] leading-tight text-muted-foreground">
                    {hint}
                </div>
            ) : null}
        </div>
    );
}
