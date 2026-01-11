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
        take: 20, // on prend large puis on déduplique
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
