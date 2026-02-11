import { prisma } from "@/lib/services/prisma";
import { Prisma } from "@prisma/client";
import { calculateOrderTotal } from "@/lib/utils/orders";

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

function computeOrderTotals(items: { quantity: number; unitPriceCents: number }[]) {
    const articlesCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalCents = items.reduce((sum, it) => sum + it.quantity * it.unitPriceCents, 0);
    return { articlesCount, totalCents };
}

function sumCents(values: number[]) {
    return values.reduce((s, v) => s + v, 0);
}

export async function getOrdersAndStats(query?: string, page: number = 1, status?: string, userContext?: { userId: string, role: string }) {
    const PAGE_SIZE = 13;
    const skip = (page - 1) * PAGE_SIZE;

    const whereClause: Prisma.OrderWhereInput = {};

    // Sécurité : Si Revendeur, on ne montre que ses commandes
    if (userContext && userContext.role === "REVENDEUR") {
        whereClause.createdById = userContext.userId;
    }

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

    // Filtre pour le CA global (Doit aussi respecter le scope utilisateur)
    const caWhereClause: Prisma.OrderWhereInput = {};
    if (userContext && userContext.role === "REVENDEUR") {
        caWhereClause.createdById = userContext.userId;
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
        // CA Global (Total Absolu de la base ou du revendeur)
        prisma.order.findMany({
            where: caWhereClause,
            select: {
                shippingCostCents: true,
                discountType: true,
                discountValue: true,
                taxRate: true,
                items: {
                    select: { quantity: true, unitPriceCents: true }
                }
            }
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const rows = orders.map((o) => {
        const { articlesCount } = computeOrderTotals(o.items);
        
        const { totalCents } = calculateOrderTotal(
            o.items,
            o.shippingCostCents,
            o.discountType,
            o.discountValue
        );

        return {
            id: o.id,
            reference: o.reference,
            status: o.status,
            shippingType: o.shippingType,
            createdAt: o.createdAt.toISOString(),
            articlesCount,
            totalCents: totalCents,
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

    // CA Global (Calculé HT et Hors Livraison)
    const caTotalCents = allOrdersForCA.reduce((sum, order) => {
        const { subTotalCents, discountAmountCents } = calculateOrderTotal(
            order.items,
            0, // On force la livraison à 0 pour l'exclure du calcul
            order.discountType,
            order.discountValue
        );
        
        const netTTC = Math.max(0, subTotalCents - discountAmountCents);
        const taxRate = order.taxRate || 21;
        const netHT = netTTC / (1 + taxRate / 100);
        
        return sum + Math.round(netHT);
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

