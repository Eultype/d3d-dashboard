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

    // ======================
    // ADMIN USER
    // ======================
    const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {
            password: passwordHash,
        },
        create: {
            email: "admin@test.com",
            password: passwordHash,
        },
    });

    // ======================
    // CUSTOMER
    // ======================
    const customer = await prisma.customer.upsert({
        where: { email: "jean.dupont@test.com" },
        update: {
            name: "Jean Dupont",
            phone: "0600000000",
            companyName: "Dupont SARL",
            vatNumber: "FR123456789",
        },
        create: {
            name: "Jean Dupont",
            email: "jean.dupont@test.com",
            phone: "0600000000",
            companyName: "Dupont SARL",
            vatNumber: "FR123456789",
        },
    });

    // ======================
    // CLEAN ORDERS (DEV ONLY)
    // ======================
    await prisma.orderNote.deleteMany();
    await prisma.file.deleteMany();
    await prisma.order.deleteMany();

    // ======================
    // ORDER 1
    // ======================
    const order1 = await prisma.order.create({
        data: {
            status: "A_VERIFIER",
            customerId: customer.id,
        },
    });

    await prisma.file.create({
        data: {
            filename: "bloc-r120-face.webp",
            url: "/uploads/bloc-r120-face.webp",
            type: "FINAL",
            orderId: order1.id,
        },
    });

    await prisma.orderNote.create({
        data: {
            content: "Première commande de test",
            orderId: order1.id,
            userId: admin.id,
        },
    });

    // ======================
    // ORDER 2 (sans client)
    // ======================
    await prisma.order.create({
        data: {
            status: "PROD",
            customerId: null,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("✅ Seed terminé (safe)");
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
