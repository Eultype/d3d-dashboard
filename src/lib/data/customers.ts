import { prisma } from "@/lib/prisma";

export async function getCustomerOrderItems(customerId: string) {
    return prisma.orderItem.findMany({
        where: {
            order: { customerId: customerId },
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 5,
        include: {
            product: true,
            order: true,
        },
    });
}

export async function getCustomersAndStats(query?: string, page: number = 1) {
    const PAGE_SIZE = 13;
    const skip = (page - 1) * PAGE_SIZE;

    const whereClause = query
        ? {
            OR: [
                { name: { contains: query, mode: "insensitive" as const } },
                { email: { contains: query, mode: "insensitive" as const } },
                { companyName: { contains: query, mode: "insensitive" as const } },
            ],
        }
        : {};

    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);

    const [customers, totalCount, countActive, countCompany, countVat, countNew] = await Promise.all([
        prisma.customer.findMany({
            where: whereClause,
            take: PAGE_SIZE,
            skip: skip,
            orderBy: { createdAt: "desc" },
        }),
        prisma.customer.count({ where: whereClause }),
        // Stats globales (on peut appliquer le filtre de recherche ou non, généralement non pour les stats globales)
        // Ici je choisis de ne PAS appliquer le filtre de recherche aux stats "globales" du dashboard (Actifs, Entreprises...),
        // sauf pour le "Total" qui doit refléter la recherche.
        // Si tu veux que "Actifs" change quand tu cherches "Dupont", il faut ajouter `where: { ...whereClause, isActive: true }`.
        // Pour l'instant, je garde les stats GLOBALES (sans filtre de recherche) pour les indicateurs métier, sauf Total.
        prisma.customer.count({ where: { isActive: true } }),
        prisma.customer.count({ where: { NOT: { companyName: null }, companyName: { not: "" } } }), // Entreprises (nom non vide)
        prisma.customer.count({ where: { NOT: { vatNumber: null }, vatNumber: { not: "" } } }), // TVA renseignée
        prisma.customer.count({ where: { createdAt: { gte: d30 } } }), // Nouveaux 30j
    ]);

    const rows = customers.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        companyName: c.companyName,
        vatNumber: c.vatNumber,
        isActive: c.isActive,
        createdAt: c.createdAt.toISOString(),
    }));

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return {
        customers: rows,
        stats: {
            totalCustomers: totalCount, // Total de la recherche
            actifs: countActive,
            entreprises: countCompany,
            tvaRenseignee: countVat,
            nouveaux30j: countNew,
        },
        pagination: {
            totalPages,
            currentPage: page,
            totalCount,
        }
    };
}
        
export async function getCustomerPageData(id: string) {
    return prisma.customer.findUnique({
        where: { id },
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
}
        