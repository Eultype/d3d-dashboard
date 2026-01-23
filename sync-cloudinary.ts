import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Récupération des images sur Cloudinary...");
  
  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100
    });

    console.log(`📸 ${resources.resources.length} images trouvées sur Cloudinary.`);

    const products = await prisma.product.findMany();
    let updatedCount = 0;

    for (const product of products) {
      // On cherche une image dont le nom (public_id) contient le SKU ou le nom du produit
      const sku = product.sku.toLowerCase();
      
      const match = resources.resources.find((r: any) => {
        const publicId = r.public_id.toLowerCase();
        // On enlève les dossiers du publicId pour comparer le nom du fichier
        const filename = publicId.split('/').pop() || "";
        return filename.includes(sku) || sku.includes(filename);
      });

      if (match) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: match.secure_url }
        });
        console.log(`✅ Match : ${product.name} -> ${match.secure_url}`);
        updatedCount++;
      } else {
        console.log(`❌ Non trouvé : ${product.name} (SKU: ${product.sku})`);
      }
    }

    console.log(`
🎉 Terminé ! ${updatedCount}/${products.length} produits mis à jour.`);
  } catch (err) {
    console.error("❌ Erreur lors de la synchro :", err);
  }
}

main()
  .finally(async () => await prisma.$disconnect());
