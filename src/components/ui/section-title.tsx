import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
    return <h3 className="text-sm font-semibold text-foreground">{children}</h3>;
}
