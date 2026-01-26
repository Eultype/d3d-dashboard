"use server";

import { prisma } from "@/lib/services/prisma";

export async function checkOrderReferenceExists(reference: string) {
  const count = await prisma.order.count({
    where: { reference },
  });
  return count > 0;
}
