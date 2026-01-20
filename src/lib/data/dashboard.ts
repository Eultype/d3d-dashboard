import { prisma } from "@/lib/prisma";
import { orderTotalCents } from "@/lib/orders";

export async function getDashboardStats() {
  const STATUS = {
    A_VERIFIER: "A_VERIFIER",
    PROD: "PROD",
    A_EXPEDIER: "A_EXPEDIER",
    A_RECUPERER: "A_RECUPERER",
    TERMINE: "TERMINE",
  } as const;

  const [
    countToVerify,
    countInProd,
    countToShip,
    countToPickUp,
    countDone,
    lastOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { status: STATUS.A_VERIFIER } }),
    prisma.order.count({ where: { status: STATUS.PROD } }),
    prisma.order.count({ where: { status: STATUS.A_EXPEDIER } }),
    prisma.order.count({ where: { status: STATUS.A_RECUPERER } }),
    prisma.order.count({ where: { status: STATUS.TERMINE } }),
    prisma.order.findMany({
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
    const itemsTotalCents = orderTotalCents(o.items);
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
      totalCents: itemsTotalCents + o.shippingCostCents,
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
