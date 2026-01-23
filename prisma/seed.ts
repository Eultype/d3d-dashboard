import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Démarrage du seed de PRODUCTION...");

    // ======================
    // CLEANUP (Vider la base)
    // ======================
    console.log("🧹 Nettoyage de la base de données...");
    // Ordre important pour respecter les contraintes de clés étrangères
    await prisma.file.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderNote.deleteMany();
    await prisma.notificationRead.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany({ where: { role: "REVENDEUR" } }); // On garde les admins au cas où, ou on peut tout vider :
    // await prisma.user.deleteMany(); 

    const passwordHash = await bcrypt.hash("password", 10);

    // ======================
    // ADMINISTRATEURS
    // ======================
    console.log("👥 Création des administrateurs...");
    
    const admins = [
        { email: "Sdarryy59@gmail.com", name: "Samuel" },
        { email: "redadahmani34@gmail.com", name: "Reda" },
    ];

    for (const adminData of admins) {
        await prisma.user.upsert({
            where: { email: adminData.email },
            update: { 
                name: adminData.name,
                password: passwordHash,
                role: "ADMIN" 
            },
            create: {
                email: adminData.email,
                name: adminData.name,
                password: passwordHash,
                role: "ADMIN",
            },
        });
    }

    // ======================
    // PRODUITS 2D3D
    // ======================
    console.log("📦 Chargement du catalogue produits...");
    const productsData = [
        { name: "Bloc cristal 3D - R80", sku: "BLOC-CRISTAL-3D-R80", dimensions: "80x50x50 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171161/bloc-cristal-3d-r80_frrysj.webp", priceCents: 8900, category: "BLOC", status: "AVAILABLE" },
        { name: "Bloc cristal 3D - R90", sku: "BLOC-CRISTAL-3D-R90", dimensions: "90x60x50 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171161/bloc-cristal-3d-r90_nx1ioh.webp", priceCents: 11900, category: "BLOC", status: "AVAILABLE" },
        { name: "Bloc cristal 3D - R120", sku: "BLOC-CRISTAL-3D-R120", dimensions: "120x80x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171162/bloc-cristal-3d-r120_kyj4l3.webp", priceCents: 16900, category: "BLOC", status: "AVAILABLE" },
        { name: "Bloc cristal 3D - R130", sku: "BLOC-CRISTAL-3D-R130", dimensions: "130x100x90 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171163/bloc-cristal-3d-r130_dmi9ta.webp", priceCents: 18900, category: "BLOC", status: "AVAILABLE" },
        { name: "Bloc cristal 3D - R200", sku: "BLOC-CRISTAL-3D-R200", dimensions: "200x120x80 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171162/bloc-cristal-3d-r200_dz18wz.webp", priceCents: 29900, category: "BLOC", status: "AVAILABLE" },
        { name: "Bloc cube cristal 3D - C50", sku: "BLOC-CUBE-CRISTAL-3D-C50", dimensions: "50x50x50 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171162/bloc-cube-cristal-3d-c50_fklvbk.webp", priceCents: 6900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Bloc cube cristal 3D - C60", sku: "BLOC-CUBE-CRISTAL-3D-C60", dimensions: "60x60x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171162/bloc-cube-cristal-3d-c60_ynlkrs.webp", priceCents: 7900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Bloc cube cristal 3D - C80", sku: "BLOC-CUBE-CRISTAL-3D-C80", dimensions: "80x80x80 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171162/bloc-cube-cristal-3d-c80_yfkocm.webp", priceCents: 11900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Cube coin coupe cristal 3D - C60", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C60", dimensions: "60x60x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171168/cube-coin-coupe-cristal-3d-c60_drz5ea.webp", priceCents: 9900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Cube coin coupe cristal 3D - C80", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C80", dimensions: "80x80x80 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171169/cube-coin-coupe-cristal-3d-c80_h7hpd8.webp", priceCents: 12900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Cube coin coupe cristal 3D - C100", sku: "CUBE-COIN-COUPE-CRISTAL-3D-C100", dimensions: "100x100x100 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171169/cube-coin-coupe-cristal-3d-c100_xg0ngz.webp", priceCents: 21900, category: "BLOC-CUBE", status: "AVAILABLE" },
        { name: "Cadre cristal 2D - Small", sku: "CADRE-CRISTAL-2D-SMALL", dimensions: "100x80x20 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171166/cadre-cristal-2d-small_nfxxcq.webp", priceCents: 6900, category: "CADRE", status: "AVAILABLE" },
        { name: "Cadre cristal 2D - Medium", sku: "CADRE-CRISTAL-2D-MEDIUM", dimensions: "150x100x20 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171166/cadre-cristal-2d-medium_z2rc2y.webp", priceCents: 8900, category: "CADRE", status: "AVAILABLE" },
        { name: "Cadre cristal 2D - Grand", sku: "CADRE-CRISTAL-2D-GRAND", dimensions: "150x100x20 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171165/cadre-cristal-2d-grand_he131v.webp", priceCents: 12900, category: "CADRE", status: "AVAILABLE" },
        { name: "Coeur cristal 3D - Small", sku: "COEUR-CRISTAL-3D-SMALL", dimensions: "100x90x50 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171168/coeur-cristal-3d-small_ecqp4t.webp", priceCents: 12900, category: "COEUR", status: "AVAILABLE" },
        { name: "Coeur cristal 3D - Grand", sku: "COEUR-CRISTAL-3D-GRAND", dimensions: "163x130x80 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171167/coeur-cristal-3d-grand_teyjgh.webp", priceCents: 26900, category: "COEUR", status: "AVAILABLE" },
        { name: "Coeur cristal 2D", sku: "COEUR-CRISTAL-2D", dimensions: "100x85x30 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171166/coeur-cristal-2d_tzig1g.webp", priceCents: 8900, category: "COEUR", status: "AVAILABLE" },
        { name: "Prisme cristal 3D - PRA", sku: "PRISME-CRISTAL-3D-PRA", dimensions: "130x130x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171172/prisme-cristal-3d-pra_iforat.webp", priceCents: 16900, category: "PRISME", status: "AVAILABLE" },
        { name: "Prisme cristal 3D - PRB", sku: "PRISME-CRISTAL-3D-PRB", dimensions: "170x130x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171174/prisme-cristal-3d-prb_ubogba.webp", priceCents: 21900, category: "PRISME", status: "AVAILABLE" },
        { name: "Prisme cristal 3D - PRC", sku: "PRISME-CRISTAL-3D-PRC", dimensions: "200x150x60 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171174/prisme-cristal-3d-prc_w8hs4h.webp", priceCents: 27900, category: "PRISME", status: "AVAILABLE" },
        { name: "Horloge cristal 3D", sku: "HORLOGE-CRISTAL-3D", dimensions: "50x50x80 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171169/horloge-cristal-3d_cpgmny.webp", priceCents: 9900, category: "HORLOGE", status: "AVAILABLE" },
        { name: "Lot 2 porté-clés cristal 3D", sku: "LOT-2-PORTE-CLES-CRISTAL-3D", dimensions: "20x30x15 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171171/lot-2-porte-cles-cristal-3d_vlfndc.webp", priceCents: 3500, category: "PORTE-CLES", status: "AVAILABLE" },
        { name: "Base lumineuse Ronde LED", sku: "BASE-LUMINEUSE-RONDE-LED", dimensions: "20x30x15 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171161/base-lumineuse-ronde-led_v4spcw.webp", priceCents: 2500, category: "ACCESSOIRE", status: "AVAILABLE" },
        { name: "Base lumineuse Carree LED", sku: "BASE-LUMINEUSE-CARREE-LED", dimensions: "20x30x15 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769171161/base-lumineuse-carree-led_vever5.webp", priceCents: 2500, category: "ACCESSOIRE", status: "AVAILABLE" },
        { name: "Plaque commémorative cristal 2D - A3", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A3", dimensions: "400x300x10 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769172027/plaque-commemorative-cristal-2d-a3_pqm6vl.webp", priceCents: 36000, category: "PLAQUE", status: "AVAILABLE" },
        { name: "Plaque commémorative cristal 2D - A4", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A4", dimensions: "300x200x10 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769172027/plaque-commemorative-cristal-2d-a4_tvzinh.webp", priceCents: 21900, category: "PLAQUE", status: "AVAILABLE" },
        { name: "Plaque commémorative cristal 2D - A5", sku: "PLAQUE-COMMEMORATIVE-CRISTAL-2D-A5", dimensions: "200x150x10 mm", imageUrl: "https://res.cloudinary.com/dxbkx5pye/image/upload/v1769172027/plaque-commemorative-cristal-2d-a5_elkgz8.webp", priceCents: 15900, category: "PLAQUE", status: "AVAILABLE" },
    ];

    for (const p of productsData) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: p,
            create: p,
        });
    }

    // ======================
    // SEQUENCES
    // ======================
    console.log("🔢 Initialisation des séquences...");
    const sequences = ["BOG", "WEB", "ERIC"];
    for (const seq of sequences) {
        await prisma.sequence.upsert({
            where: { id: seq },
            update: {},
            create: { id: seq, currentValue: 1000 },
        });
    }

    console.log("✅ Seed de PRODUCTION terminé avec succès !");
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