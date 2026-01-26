import { prisma } from "@/lib/services/prisma";
import { Role } from "@prisma/client";

export async function getResellerFullDetails(userId: string) {
    // 1. Fetch User info with everything
    const user = await prisma.user.findUnique({
        where: { id: userId, role: Role.REVENDEUR },
        include: {
            createdOrders: {
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    items: true,
                },
            },
        }
    });

    if (!user) return null;

    // Fetch last items (across all orders created by this user)
    const lastItems = await prisma.orderItem.findMany({
        where: {
            order: { createdById: user.id },
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5,
        include: {
            product: true,
            order: {
                select: {
                    reference: true,
                    createdAt: true
                }
            },
        },
    });

    return {
        user,
        lastItems: lastItems.map(item => ({
            ...item,
            createdAt: item.createdAt, 
        }))
    };
}

export async function getResellersAndStats(query?: string, page: number = 1) {
    const PAGE_SIZE = 13;
    const skip = (page - 1) * PAGE_SIZE;

    // Base filter: only REVENDEUR role
    const baseWhere = {
        role: Role.REVENDEUR
    };

    const whereClause = query
        ? {
            AND: [
                baseWhere,
                {
                    OR: [
                        { email: { contains: query, mode: "insensitive" as const } },
                        { prefix: { contains: query, mode: "insensitive" as const } },
                        { name: { contains: query, mode: "insensitive" as const } },
                        { companyName: { contains: query, mode: "insensitive" as const } },
                    ],
                }
            ]
        }
        : baseWhere;

    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);

    const [resellers, totalCount, totalGlobal, countWithPrefix, countNew] = await Promise.all([
        prisma.user.findMany({
            where: whereClause,
            take: PAGE_SIZE,
            skip: skip,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                isActive: true,
                prefix: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { createdOrders: true }
                }
            }
        }),
        prisma.user.count({ where: whereClause }),
        
        prisma.user.count({ where: baseWhere }),
        prisma.user.count({ where: { ...baseWhere, prefix: { not: null } } }),
        prisma.user.count({ where: { ...baseWhere, createdAt: { gte: d30 } } }),
    ]);

    const rows = resellers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        companyName: u.companyName,
        isActive: u.isActive,
        prefix: u.prefix,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        ordersCount: u._count.createdOrders
    }));

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return {
        resellers: rows,
        stats: {
            totalResellers: totalGlobal,
            withPrefix: countWithPrefix,
            new30j: countNew,
        },
        pagination: {
            totalPages,
            currentPage: page,
            totalCount,
        }
    };
}