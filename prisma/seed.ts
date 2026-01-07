import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash("password", 10);

    // User admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {
            password: passwordHash, // met à jour si tu relances le seed
        },
        create: {
            email: "admin@test.com",
            password: passwordHash,
        },
    });

    // Customer
    const customer = await prisma.customer.create({
        data: {
            name: "Jean Dupont",
            email: "jean.dupont@test.com",
            phone: "0600000000",
            companyName: "Dupont SARL",
            vatNumber: "FR123456789",
        },
    });

    // Orders
    const order1 = await prisma.order.create({
        data: {
            status: "A_VERIFIER",
            customerId: customer.id,
        },
    });

    // File
    await prisma.file.create({
        data: {
            filename: "bloc-r120-face.webp",
            url: "/uploads/bloc-r120-face.webp",
            type: "FINAL",
            orderId: order1.id,
        },
    });

    const order2 = await prisma.order.create({
        data: {
            status: "PROD",
            customerId: null,
        },
    });

    // Notes
    await prisma.orderNote.create({
        data: {
            content: "Première commande de test",
            orderId: order1.id,
            userId: admin.id,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("✅ Seed terminé");
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
