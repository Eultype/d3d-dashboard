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

export async function getCustomersAndStats() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Stats
    const totalCustomers = customers.length;
    const actifs = customers.filter((c) => c.isActive).length;
    const entreprises = customers.filter((c) => !!c.companyName?.trim()).length;
    const tvaRenseignee = customers.filter((c) => !!c.vatNumber?.trim()).length;

    // “Nouveaux (30j)”
    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);
    const nouveaux30j = customers.filter((c) => new Date(c.createdAt) >= d30).length;

    return {
        customers,
        stats: {
            totalCustomers,
            actifs,
            entreprises,
            tvaRenseignee,
            nouveaux30j,
        },
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
        