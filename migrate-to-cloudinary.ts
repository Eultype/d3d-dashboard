import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const CLOUD_NAME = "dxbkx5pye";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/home/d3d/products/`;

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Démarrage de la migration vers Cloudinary...");

  const products = await prisma.product.findMany({
    where: {
      imageUrl: {
        startsWith: "/uploads/products/"
      }
    }
  });

  console.log(`📦 ${products.length} produits à mettre à jour.`);

  for (const product of products) {
    if (!product.imageUrl) continue;

    // Extraire le nom du fichier (ex: bloc-r120-face.webp)
    const filename = product.imageUrl.split("/").pop();
    
    if (filename) {
      const newUrl = `${CLOUDINARY_BASE_URL}${filename}`;
      
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newUrl }
      });
      
      console.log(`✅ ${product.name} -> ${newUrl}`);
    }
  }

  console.log("🎉 Migration terminée !");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
