import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // New import

export async function GET(req: Request) {
  const session = await auth(); // Session check
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) return NextResponse.json([]);

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
    },
  });

  return NextResponse.json(customers);
}
