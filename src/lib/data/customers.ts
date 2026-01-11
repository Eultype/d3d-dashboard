import { prisma } from "@/lib/prisma";

export async function getCustomerDetails(id: string) {
    return prisma.customer.findUnique({
        where: { id },
    });
}

export async function getCustomerOrders(customerId: string) {
    return prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            items: true,
        },
    });
}

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
