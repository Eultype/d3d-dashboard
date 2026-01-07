"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

export function NavLink({
                            href,
                            icon,
                            label,
                        }: {
    href: string;
    icon: ReactNode;
    label: string;
}) {
    const pathname = usePathname();

    const isActive =
        href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
