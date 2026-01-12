import { prisma } from "@/lib/prisma";

export async function getProductDetails(id: string) {
    return prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            sku: true,
            description: true,
            imageUrl: true,
            isActive: true,
            priceCents: true,
            createdAt: true,
        },
    });
}

export async function getProductOrderItems(productId: string) {
    return prisma.orderItem.findMany({
        where: { productId: productId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            order: {
                include: {
                    customer: true,
                    items: true,
                },
            },
        },
    });
}

export async function getProductRecentCustomers(productId: string) {
    const lastCustomersRaw = await prisma.orderItem.findMany({
        where: {
            productId: productId,
            order: { customerId: { not: null } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            order: { include: { customer: true } },
        },
    });

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

    return lastCustomers;
}

export async function getProductsAndStats() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            sku: true,
            description: true,
            imageUrl: true,
            isActive: true,
            priceCents: true,
            createdAt: true,
        },
    });

    const rows = products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        imageUrl: p.imageUrl,
        isActive: p.isActive,
        priceCents: p.priceCents,
        createdAt: p.createdAt.toISOString(),
    }));

    // Stats
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;

    return {
        products: rows,
        stats: {
            totalProducts,
            activeProducts,
            inactiveProducts,
        },
    };
}

