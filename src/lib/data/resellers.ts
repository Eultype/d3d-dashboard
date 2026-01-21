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

    // Fetch matching customers to get companyName and isActive
    const emails = resellers.map(r => r.email);
    const customers = await prisma.customer.findMany({
        where: { email: { in: emails } },
        select: { id: true, email: true, companyName: true, name: true, isActive: true }
    });

    const customerMap = new Map(customers.map(c => [c.email, c]));

    const rows = resellers.map((u) => {
        const customer = customerMap.get(u.email);
        return {
            id: u.id,
            customerId: customer?.id || null, // Add customerId
            email: u.email,
            name: customer?.name || null,
            companyName: customer?.companyName || null,
            isActive: customer?.isActive ?? true,
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

export async function getResellerFullDetails(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId, role: Role.REVENDEUR }
    });

    if (!user) return null;

    // Fetch customer by email
    const customer = await prisma.customer.findUnique({
        where: { email: user.email },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
                take: 5,
                include: {
                    items: true,
                },
            },
        },
    });

    let lastItems: any[] = [];
    if (customer) {
         lastItems = await prisma.orderItem.findMany({
            where: {
                order: { customerId: customer.id },
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
    }

    return {
        user,
        customer,
        lastItems: lastItems.map(item => ({
            ...item,
            createdAt: item.createdAt, 
        }))
    };
}
