import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function getOrdersAndStats(query?: string, page: number = 1, status?: string) {
    const PAGE_SIZE = 13;
    const skip = (page - 1) * PAGE_SIZE;

    const whereClause: Prisma.OrderWhereInput = {};

    if (query) {
        whereClause.OR = [
            { reference: { contains: query, mode: "insensitive" } },
            // On peut chercher par client aussi
            { customer: { name: { contains: query, mode: "insensitive" } } },
            { customer: { email: { contains: query, mode: "insensitive" } } },
        ];
    }

    if (status && status !== "ALL") {
        whereClause.status = status;
    }

    // On lance les requêtes en parallèle pour la perf
    const [orders, totalCount, groups, allOrdersForCA] = await Promise.all([
        prisma.order.findMany({
            where: whereClause,
            take: PAGE_SIZE,
            skip: skip,
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
        }),
        prisma.order.count({ where: whereClause }),
        prisma.order.groupBy({
            by: ['status'],
            where: whereClause,
            _count: {
                status: true,
            },
        }),
        // CA Global (Total Absolu de la base, sans filtre de recherche)
        prisma.order.findMany({
            select: {
                shippingCostCents: true,
                items: {
                    select: { quantity: true, unitPriceCents: true }
                }
            }
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const rows = orders.map((o) => {
        const { articlesCount, totalCents: itemsTotalCents } = computeOrderTotals(o.items);
        return {
            id: o.id,
            reference: o.reference,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            articlesCount,
            totalCents: itemsTotalCents + o.shippingCostCents,
            customer: o.customer
                ? {
                    name: o.customer.name,
                    email: o.customer.email,
                }
                : null,
        };
    });

    // Mapping des stats globales depuis le groupBy
    const statsMap = groups.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
    }, {} as Record<string, number>);

    const totalOrders = totalCount;
    const aVerifier = statsMap["A_VERIFIER"] || 0;
    const enProd = statsMap["PROD"] || 0;
    const terminees = statsMap["TERMINE"] || 0;

    // CA Global
    const caTotalCents = allOrdersForCA.reduce((sum, order) => {
        const itemsTotal = order.items.reduce((itSum, item) => itSum + (item.quantity * item.unitPriceCents), 0);
        return sum + itemsTotal + order.shippingCostCents;
    }, 0);

    return {
        orders: rows,
        stats: {
            totalOrders,
            aVerifier,
            enProd,
            terminees,
            caTotalCents,
        },
        pagination: {
            totalPages,
            currentPage: page,
            totalCount,
        }
    };
}

