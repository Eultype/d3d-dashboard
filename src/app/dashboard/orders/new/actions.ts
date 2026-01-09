import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        {
          name: {
            not: null,
            contains: q,
            mode: "insensitive",
          },
        },
        {
          email: {
            not: null,
            contains: q,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return NextResponse.json(customers);
}
