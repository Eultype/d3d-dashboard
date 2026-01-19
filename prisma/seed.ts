import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Début du seed…");

    const passwordHash = await bcrypt.hash("password", 10);

    // ======================
    // ADMIN USER
    // ======================
    const admin = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: { password: passwordHash },
        create: {
            email: "admin@test.com",
            password: passwordHash,
        },
    });

    // ======================
    // SAMUEL USER
    // ======================
    const samuel = await prisma.user.upsert({
        where: { email: "samuel@test.com" },
        update: { password: passwordHash },
        create: {
            email: "samuel@test.com",
            password: passwordHash,
        },
    });

    // ======================
    // REDA USER
    // ======================
    const reda = await prisma.user.upsert({
        where: { email: "reda@test.com" },
        update: { password: passwordHash },
        create: {
            email: "reda@test.com",
            password: passwordHash,
        },
    });

    // ======================
    // CLIENTS
    // ======================
    const customer1 = await prisma.customer.upsert({
        where: { email: "jean.dupont@test.com" },
        update: {
            isActive: true,
            addressLine2: "Bâtiment B, 2e étage",
        },
        create: {
            name: "Jean Dupont",
            email: "jean.dupont@test.com",
            phone: "0600000000",
            companyName: "Dupont SARL",
            vatNumber: "FR123456789",
            addressLine1: "12 rue de la République",
            addressLine2: "Bâtiment B, 2e étage",
            postalCode: "75001",
            city: "Paris",
            country: "France",
            isActive: true,
        },
    });

    const customer2 = await prisma.customer.upsert({
        where: { email: "marie.martin@test.com" },
        update: {
            isActive: true,
            addressLine2: null,
        },
        create: {
            name: "Marie Martin",
            email: "marie.martin@test.com",
            phone: "0611111111",
            companyName: null,
            vatNumber: null,
            addressLine1: "8 avenue des Lilas",
            addressLine2: null,
            postalCode: "69000",
            city: "Lyon",
            country: "France",
            isActive: true,
        },
    });

    // ======================
    // PRODUITS
    // ======================
    const product1 = await prisma.product.upsert({
        where: { sku: "CRISTAL-R120" },
        update: {
            name: "Bloc cristal R120",
            description:
                "Bloc en cristal pour gravure 3D (format R120). Idéal pour portraits et souvenirs.",
            priceCents: 8900,
            imageUrl: "/uploads/bloc-r120-face.webp",
            isActive: true,
        },
        create: {
            name: "Bloc cristal R120",
            sku: "CRISTAL-R120",
            description:
                "Bloc en cristal pour gravure 3D (format R120). Idéal pour portraits et souvenirs.",
            priceCents: 8900,
            imageUrl: "/uploads/bloc-r120-face.webp",
            isActive: true,
        },
    });

    const product2 = await prisma.product.upsert({
        where: { sku: "CRISTAL-R80" },
        update: {
            name: "Bloc cristal R80",
            description:
                "Bloc en cristal compact (format R80). Parfait pour petits portraits et cadeaux.",
            priceCents: 5900,
            imageUrl: "/uploads/bloc-r80-face.webp",
            isActive: true,
        },
        create: {
            name: "Bloc cristal R80",
            sku: "CRISTAL-R80",
            description:
                "Bloc en cristal compact (format R80). Parfait pour petits portraits et cadeaux.",
            priceCents: 5900,
            imageUrl: "/uploads/bloc-r80-face.webp",
            isActive: true,
        },
    });

    const product3 = await prisma.product.upsert({
        where: { sku: "SUPPORT-LED" },
        update: {
            name: "Support LED",
            description:
                "Support lumineux LED pour mettre en valeur la gravure dans le cristal.",
            priceCents: 1900,
            imageUrl: "/uploads/support-led.webp",
            isActive: true,
        },
        create: {
            name: "Support LED",
            sku: "SUPPORT-LED",
            description:
                "Support lumineux LED pour mettre en valeur la gravure dans le cristal.",
            priceCents: 1900,
            imageUrl: "/uploads/support-led.webp",
            isActive: true,
        },
    });

    // ======================
    // CLEAN COMMANDES (DEV ONLY)
    // ======================
    await prisma.file.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.sequence.deleteMany(); 

    // ======================
    // SEQUENCES
    // ======================
    await prisma.sequence.createMany({
        data: [
            { id: "BOG", currentValue: 1000 },
            { id: "ERIC", currentValue: 1000 },
            { id: "WEB", currentValue: 1000 },
        ],
        skipDuplicates: true,
    });

    // ======================
    // COMMANDE 1 – CLIENT 1
    // ======================
    const order1 = await prisma.order.create({
        data: {
            reference: "SEED-001",
            status: "A_VERIFIER",
            customerId: customer1.id,
            items: {
                create: [
                    {
                        productId: product1.id,
                        quantity: 1,
                        unitPriceCents: product1.priceCents,
                    },
                    {
                        productId: product3.id,
                        quantity: 1,
                        unitPriceCents: product3.priceCents,
                    },
                ],
            },
        },
    });

    await prisma.file.create({
        data: {
            filename: "bloc-r120-face.webp",
            url: "/uploads/bloc-r120-face.webp",
            type: "PREVIEW",
            orderId: order1.id,
        },
    });

    await prisma.orderNote.create({
        data: {
            content: "Client souhaite un rendu très détaillé.",
            orderId: order1.id,
            userId: admin.id,
        },
    });

    // ======================
    // COMMANDE 2 – CLIENT 2
    // ======================
    const order2 = await prisma.order.create({
        data: {
            reference: "SEED-002",
            status: "PROD",
            customerId: customer2.id,
            items: {
                create: [
                    {
                        productId: product2.id,
                        quantity: 2,
                        unitPriceCents: product2.priceCents,
                    },
                ],
            },
        },
    });

    await prisma.file.create({
        data: {
            filename: "preview-r80.webp",
            url: "/uploads/preview-r80.webp",
            type: "PREVIEW",
            orderId: order2.id,
        },
    });

    await prisma.orderNote.create({
        data: {
            content: "Commande en cours de production.",
            orderId: order2.id,
            userId: admin.id,
        },
    });

    // ======================
    // COMMANDE 3 – SANS CLIENT
    // ======================
    const order3 = await prisma.order.create({
        data: {
            reference: "SEED-003",
            status: "TERMINE",
            customerId: null,
            items: {
                create: [
                    {
                        productId: product1.id,
                        quantity: 1,
                        unitPriceCents: product1.priceCents,
                    },
                ],
            },
        },
    });

    await prisma.file.create({
        data: {
            filename: "final-cristal.webp",
            url: "/uploads/final-cristal.webp",
            type: "FINAL",
            orderId: order3.id,
        },
    });

    await prisma.orderNote.create({
        data: {
            content: "Commande terminée et validée.",
            orderId: order3.id,
            userId: admin.id,
        },
    });

    console.log("✅ Seed terminé avec succès");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });