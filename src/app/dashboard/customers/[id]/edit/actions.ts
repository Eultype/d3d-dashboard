// src/app/dashboard/customers/[id]/edit/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCustomer(id: string, data: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    companyName?: string | null;
    vatNumber?: string | null;
    isActive?: boolean;
    addressLine1?: string | null;
    addressLine2?: string | null;
    postalCode?: string | null;
    city?: string | null;
    country?: string | null;
}) {
    await prisma.customer.update({
        where: { id },
        data,
    });

    redirect(`/dashboard/customers/${id}`);
}
