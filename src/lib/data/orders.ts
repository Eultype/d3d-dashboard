import { prisma } from "@/lib/prisma";

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
            },
        },
    });
}
