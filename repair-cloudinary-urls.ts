import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const CLOUD_NAME = "dxbkx5pye";
const WRONG_URL_PART = `image/upload/d3d/products/`;
const CORRECT_URL_PART = `image/upload/home/d3d/products/`;

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Réparation des URLs Cloudinary...");

  const products = await prisma.product.findMany({
    where: {
      imageUrl: {
        contains: WRONG_URL_PART
      }
    }
  });

  console.log(`📦 ${products.length} produits à corriger.`);

  for (const product of products) {
    if (!product.imageUrl) continue;

    const newUrl = product.imageUrl.replace(WRONG_URL_PART, CORRECT_URL_PART);
    
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl }
    });
    
    console.log(`✅ ${product.name} -> ${newUrl}`);
  }

  console.log("🎉 Réparation terminée !");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
