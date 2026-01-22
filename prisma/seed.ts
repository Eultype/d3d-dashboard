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
        update: { password: passwordHash, role: "ADMIN" },
        create: {
            email: "admin@test.com",
            password: passwordHash,
            role: "ADMIN",
        },
    });

    // ======================
    // SAMUEL USER
    // ======================
    const samuel = await prisma.user.upsert({
        where: { email: "samuel@test.com" },
        update: { password: passwordHash, role: "ADMIN" },
        create: {
            email: "samuel@test.com",
            password: passwordHash,
            role: "ADMIN",
        },
    });

    // ======================
    // REDA USER
    // ======================
    const reda = await prisma.user.upsert({
        where: { email: "reda@test.com" },
        update: { password: passwordHash, role: "ADMIN" },
        create: {
            email: "reda@test.com",
            password: passwordHash,
            role: "ADMIN",
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

    // ======================
    // PRODUITS 2D3D
    // ======================
    const productsData = [
        { name: "Bloc cristal 3D - R80", sku: "BLOC-CRISTAL-3D-R80", dimensions: "80x50x50 mm", imageUrl: "/uploads/products/bloc-cristal-3d-r80.webp", priceCents: 8900, category: "BLOC", isActive: true },
        { name: "Bloc cristal 3D - R90", sku: "BLOC-CRISTAL-3D-R90", dimensions: "90x60x50 mm", imageUrl: "/uploads/products/bloc-cristal-3d-r90.webp", priceCents: 11900, category: "BLOC", isActive: true },
        { name: "Bloc cristal 3D - R120", sku: "BLOC-CRISTAL-3D-R120", dimensions: "120x80x60 mm", imageUrl: "/uploads/products/bloc-cristal-3d-r120.webp", priceCents: 16900, category: "BLOC", isActive: true },
        { name: "Bloc cristal 3D - R130", sku: "BLOC-CRISTAL-3D-R130", dimensions: "130x100x90 mm", imageUrl: "/uploads/products/bloc-cristal-3d-r130.webp", priceCents: 18900, category: "BLOC", isActive: true },
        { name: "Bloc cristal 3D - R200", sku: "BLOC-CRISTAL-3D-R200", dimensions: "200x120x80 mm", imageUrl: "/uploads/products/bloc-cristal-3d-r200.webp", priceCents: 29900, category: "BLOC", isActive: true },
        
        { name: "Bloc cube cristal 3D - C50", sku: "BLOC-CUBE-CRISTAL-3D-C50", dimensions: "50x50x50 mm", imageUrl: "/uploads/products/bloc-cube-cristal-3d-c50.webp", priceCents: 6900, category: "BLOC-CUBE", isActive: true },
        { name: "Bloc cube cristal 3D - C60", sku: "BLOC-CUBE-CRISTAL-3D-C60", dimensions: "60x60x60 mm", imageUrl: "/uploads/products/bloc-cube-cristal-3d-c60.webp", priceCents: 7900, category: "BLOC-CUBE", isActive: true },
        { name: "Bloc cube cristal 3D - C80", sku: "BLOC-CUBE-CRISTAL-3D-C80", dimensions: "80x80x80 mm", imageUrl: "/uploads/products/bloc-cube-cristal-3d-c80.webp", priceCents: 11900, category: "BLOC-CUBE", isActive: true },
        
        { name: "Cube coin coupe cristal 3D - C60", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C60", dimensions: "60x60x60 mm", imageUrl: "/uploads/products/cube-coin-coupe-cristal-3d-c60.webp", priceCents: 9900, category: "BLOC-CUBE", isActive: true },
        { name: "Cube coin coupe cristal 3D - C80", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C80", dimensions: "80x80x80 mm", imageUrl: "/uploads/products/cube-coin-coupe-cristal-3d-c80.webp", priceCents: 12900, category: "BLOC-CUBE", isActive: true },
        { name: "Cube coin coupe cristal 3D - C100", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C100", dimensions: "100x100x100 mm", imageUrl: "/uploads/products/cube-coin-coupe-cristal-3d-c100.webp", priceCents: 21900, category: "BLOC-CUBE", isActive: true },
        
        { name: "Cadre cristal 2D - Small", sku: "CADRE-CRISTAL-2D-SMALL", dimensions: "100x80x20 mm", imageUrl: "/uploads/products/cadre-cristal-2d-small.webp", priceCents: 6900, category: "CADRE", isActive: true },
        { name: "Cadre cristal 2D - Medium", sku: "CADRE-CRISTAL-2D-MEDIUM", dimensions: "150x100x20 mm", imageUrl: "/uploads/products/cadre-cristal-2d-medium.webp", priceCents: 8900, category: "CADRE", isActive: true },
        { name: "Cadre cristal 2D - Grand", sku: "CADRE-CRISTAL-2D-GRAND", dimensions: "150x100x20 mm", imageUrl: "/uploads/products/cadre-cristal-2d-grand.webp", priceCents: 12900, category: "CADRE", isActive: true },
        
        { name: "Coeur cristal 3D - Small", sku: "COEUR-CRISTAL-3D-SMALL", dimensions: "100x90x50 mm", imageUrl: "/uploads/products/coeur-cristal-3d-small.webp", priceCents: 12900, category: "COEUR", isActive: true },
        { name: "Coeur cristal 3D - Grand", sku: "COEUR-CRISTAL-3D-GRAND", dimensions: "163x130x80 mm", imageUrl: "/uploads/products/coeur-cristal-3d-grand.webp", priceCents: 26900, category: "COEUR", isActive: true },
        { name: "Coeur cristal 2D", sku: "COEUR-CRISTAL-2D", dimensions: "100x85x30 mm", imageUrl: "/uploads/products/coeur-cristal-2d.webp", priceCents: 8900, category: "COEUR", isActive: true },
        
        { name: "Prisme cristal 3D - PRA", sku: "PRISME-CRISTAL-3D-PRA", dimensions: "130x130x60 mm", imageUrl: "/uploads/products/prisme-cristal-3d-pra.webp", priceCents: 16900, category: "PRISME", isActive: true },
        { name: "Prisme cristal 3D - PRB", sku: "PRISME-CRISTAL-3D-PRB", dimensions: "170x130x60 mm", imageUrl: "/uploads/products/prisme-cristal-3d-prb.webp", priceCents: 21900, category: "PRISME", isActive: true },
        { name: "Prisme cristal 3D - PRC", sku: "PRISME-CRISTAL-3D-PRC", dimensions: "200x150x60 mm", imageUrl: "/uploads/products/prisme-cristal-3d-prc.webp", priceCents: 27900, category: "PRISME", isActive: true },
        
        { name: "Horloge cristal 3D", sku: "HORLOGE-CRISTAL-3D", dimensions: "50x50x80 mm", imageUrl: "/uploads/products/horloge-cristal-3d.webp", priceCents: 9900, category: "HORLOGE", isActive: true },
        
        { name: "Lot 2 porté-clés cristal 3D", sku: "LOT-2-PORTE-CLES-CRISTAL-3D", dimensions: "20x30x15 mm", imageUrl: "/uploads/products/lot-2-porte-cles-cristal-3d.webp", priceCents: 3500, category: "PORTE-CLES", isActive: true },
        
        { name: "Base lumineuse Ronde LED", sku: "BASE-LUMINEUSE-RONDE-LED", dimensions: "20x30x15 mm", imageUrl: "/uploads/products/base-lumineuse-ronde-led.webp", priceCents: 2500, category: "ACCESSOIRE", isActive: true },
        { name: "Base lumineuse Carree LED", sku: "BASE-LUMINEUSE-CARREE-LED", dimensions: "20x30x15 mm", imageUrl: "/uploads/products/base-lumineuse-carree-led.webp", priceCents: 2500, category: "ACCESSOIRE", isActive: true },
        { name: "Plaque commémorative cristal 2D - A3", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A3", dimensions: "400x300x10 mm", imageUrl: "/uploads/products/plaque-commemorative-cristal-3d-a3.webp", priceCents: 36000, category: "PLAQUE", isActive: true },
        { name: "Plaque commémorative cristal 2D - A4", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A4", dimensions: "300x200x10 mm", imageUrl: "/uploads/products/plaque-commemorative-cristal-3d-a4.webp", priceCents: 21900, category: "PLAQUE", isActive: true },
        { name: "Plaque commémorative cristal 2D - A5", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A5", dimensions: "200x150x10 mm", imageUrl: "/uploads/products/plaque-commemorative-cristal-3d-a5.webp", priceCents: 15900, category: "PLAQUE", isActive: true },
    ];

    // ======================
    // CLEAN COMMANDES (DEV ONLY)
    // ======================
    console.log("🧹 Nettoyage des données existantes...");
    await prisma.file.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderNote.deleteMany();
    await prisma.notificationRead.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
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

    console.log(`📦 Insertion de ${productsData.length} produits...`);
    for (const p of productsData) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: p,
            create: p,
        });
    }

    // ======================
    // COMMANDE 1 (Exemple avec un produit de la nouvelle liste)
    // ======================
    const prod1 = await prisma.product.findUnique({ where: { sku: "BLOC-CRISTAL-3D-R80" } });
    if (prod1) {
        const order1 = await prisma.order.create({
            data: {
                reference: "SEED-001",
                status: "A_VERIFIER",
                customerId: customer1.id,
                items: {
                    create: [
                        {
                            productId: prod1.id,
                            quantity: 1,
                            unitPriceCents: prod1.priceCents,
                        },
                    ],
                },
            },
        });
        
        await prisma.orderNote.create({
            data: {
                content: "Première commande avec le nouveau catalogue.",
                orderId: order1.id,
                userId: admin.id,
            },
        });
    }

    console.log("✅ Seed terminé avec succès !");
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
