import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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
                prefix: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { createdOrders: true }
                }
            }
        }),
        prisma.user.count({ where: whereClause }), // Total matching search
        
        // Global stats (unfiltered by search, but filtered by role)
        prisma.user.count({ where: baseWhere }),
        prisma.user.count({ where: { ...baseWhere, prefix: { not: null } } }),
        prisma.user.count({ where: { ...baseWhere, createdAt: { gte: d30 } } }),
    ]);

    // Fetch matching customers to get companyName
    const emails = resellers.map(r => r.email);
    const customers = await prisma.customer.findMany({
        where: { email: { in: emails } },
        select: { email: true, companyName: true, name: true }
    });

    const customerMap = new Map(customers.map(c => [c.email, c]));

    const rows = resellers.map((u) => {
        const customer = customerMap.get(u.email);
        return {
            id: u.id,
            email: u.email,
            name: customer?.name || null,
            companyName: customer?.companyName || null,
            prefix: u.prefix,
            role: u.role,
            createdAt: u.createdAt.toISOString(),
            ordersCount: u._count.createdOrders
        };
    });

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
