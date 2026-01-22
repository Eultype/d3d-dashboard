import { prisma } from "@/lib/prisma";

export async function getProductFullDetails(id: string) {
    const [product, lastItems, lastCustomersRaw] = await Promise.all([
        // 1. Infos de base
        prisma.product.findUnique({
            where: { id },
        }),
        // 2. Dernières commandes (via OrderItem)
        prisma.orderItem.findMany({
            where: { productId: id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                order: {
                    select: {
                        id: true,
                        reference: true,
                        createdAt: true,
                        items: true,
                        customer: { select: { name: true } }
                    }
                },
            },
        }),
        // 3. Derniers clients uniques
        prisma.orderItem.findMany({
            where: {
                productId: id,
                order: { customerId: { not: null } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                order: { include: { customer: true } },
            },
        })
    ]);

    if (!product) return { product: null, lastItems: [], lastCustomers: [] };

    // Logique pour clients uniques
    const seen = new Set<string>();
    const lastCustomers = lastCustomersRaw
        .map((x) => x.order.customer)
        .filter((c): c is NonNullable<typeof c> => !!c)
        .filter((c) => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
        })
        .slice(0, 5);

    return {
        product,
        lastItems,
        lastCustomers
    };
}

export async function getProductsAndStats(query?: string, page: number = 1) {
    const PAGE_SIZE = 13;
    const skip = (page - 1) * PAGE_SIZE;

    const whereClause = query
        ? {
            OR: [
                { name: { contains: query, mode: "insensitive" as const } },
                { sku: { contains: query, mode: "insensitive" as const } },
            ],
        }
        : {};

    const [products, totalCount, countActive, countInactive] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            take: PAGE_SIZE,
            skip: skip,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                sku: true,
                dimensions: true,
                category: true,
                imageUrl: true,
                isActive: true,
                priceCents: true,
                createdAt: true,
                updatedAt: true, // ADDED
            },
        }),
        prisma.product.count({ where: whereClause }),
        // Stats globales (indépendantes de la recherche, sauf Total)
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { isActive: false } }),
    ]);

    const rows = products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        dimensions: p.dimensions,
        category: p.category,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        priceCents: p.priceCents,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(), // ADDED
    }));

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return {
        products: rows,
        stats: {
            totalProducts: totalCount,
            activeProducts: countActive,
            inactiveProducts: countInactive,
        },
        pagination: {
            totalPages,
            currentPage: page,
            totalCount,
        }
    };
}

