import { prisma } from "@/lib/prisma";

export async function getOrderDetails(id: string) {
    return prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            items: {
                include: { product: true },
                orderBy: { createdAt: "asc" },
            },
            notes: {
                include: { user: true },
                orderBy: { createdAt: "desc" },
            },
            files: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    url: true,
                    filename: true,
                    type: true,
                    createdAt: true
                }
            },
        },
    });
}

import { formatEUR } from "@/lib/money"; // Used in calculateStats

function computeOrderTotals(items: { quantity: number; unitPriceCents: number }[]) {
    const articlesCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalCents = items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
    return { articlesCount, totalCents };
}

function sumCents(values: number[]) {
    return values.reduce((s, v) => s + v, 0);
}

export async function getOrdersAndStats() {
    const orders = await prisma.order.findMany({
        include: {
            customer: true,
            items: {
                select: {
                    quantity: true,
                    unitPriceCents: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const rows = orders.map((o) => {
        const { articlesCount, totalCents } = computeOrderTotals(o.items);
        return {
            id: o.id,
            reference: o.reference, // Ajout de la référence
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            articlesCount,
            totalCents,
            customer: o.customer
                ? {
                    name: o.customer.name,
                    email: o.customer.email,
                }
                : null,
        };
    });

    // Stats
    const totalOrders = orders.length;
    const aVerifier = orders.filter((o) => o.status === "A_VERIFIER").length;
    const enProd = orders.filter((o) => o.status === "PROD").length;
    const terminees = orders.filter((o) => o.status === "TERMINE").length;

    const caTotalCents = sumCents(rows.map((r) => r.totalCents));
    // const aTraiter = aVerifier + enProd; // Not directly used in stats, keep if needed elsewhere

    return {
        orders: rows, // Return processed rows for the table
        stats: {
            totalOrders,
            aVerifier,
            enProd,
            terminees,
            caTotalCents,
            // aTraiter, // if needed
        },
    };
}

