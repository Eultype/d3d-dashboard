import { prisma } from "@/lib/prisma";
import { calculateOrderTotal } from "@/lib/orders";
import { Prisma } from "@prisma/client";

export async function getDashboardStats(userContext?: { userId: string, role: string }) {
  const STATUS = {
    A_VERIFIER: "A_VERIFIER",
    PROD: "PROD",
    A_EXPEDIER: "A_EXPEDIER",
    A_RECUPERER: "A_RECUPERER",
    TERMINE: "TERMINE",
  } as const;

  const whereClause: Prisma.OrderWhereInput = {};

  // Sécurité : "Fail Safe" (Si pas Admin, on restreint)
  let strictFilter = true;
  if (userContext && userContext.role === "ADMIN") {
    strictFilter = false;
  }

  if (strictFilter) {
     if (userContext?.userId) {
         whereClause.createdById = userContext.userId;
     } else {
         // Fallback si session invalide
         whereClause.createdById = "00000000-0000-0000-0000-000000000000";
     }
  }

  const [
    countToVerify,
    countInProd,
    countToShip,
    countToPickUp,
    countDone,
    lastOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { ...whereClause, status: STATUS.A_VERIFIER } }),
    prisma.order.count({ where: { ...whereClause, status: STATUS.PROD } }),
    prisma.order.count({ where: { ...whereClause, status: STATUS.A_EXPEDIER } }),
    prisma.order.count({ where: { ...whereClause, status: STATUS.A_RECUPERER } }),
    prisma.order.count({ where: { ...whereClause, status: STATUS.TERMINE } }),
    prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: true,
        items: { select: { quantity: true, unitPriceCents: true } },
      },
    }),
  ]);

  const countInProgress =
    countToVerify + countInProd + countToShip + countToPickUp;

  const countToProcess = countToVerify + countToShip + countToPickUp;

  const recent = lastOrders.map((o) => {
    const { totalCents } = calculateOrderTotal(
      o.items,
      o.shippingCostCents,
      o.discountType,
      o.discountValue
    );
    const articlesCount = o.items.reduce((sum, it) => sum + it.quantity, 0);

    return {
      id: o.id,
      reference: o.reference,
      status: o.status,
      createdAt: o.createdAt,
      customer: o.customer
        ? { name: o.customer.name, email: o.customer.email }
        : null,
      articlesCount,
      totalCents,
    };
  });

  // À traiter = “ce qui nécessite une action maintenant”
  const targetStatuses: string[] = [STATUS.A_VERIFIER, STATUS.A_EXPEDIER, STATUS.A_RECUPERER];
  const todoOrders = recent.filter((o) => targetStatuses.includes(o.status));

  return {
    stats: {
      countInProgress,
      countToVerify,
      countInProd,
      countToShip,
      countToPickUp,
      countToProcess,
      countDone,
    },
    recent,
    todoOrders,
  };
}
