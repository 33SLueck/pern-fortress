import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts() {
  console.log('Seeding products data...');

  const sampleProducts = await prisma.products.createMany({
    data: [
      {
        name: 'Sample Products 1',
      },
      {
        name: 'Sample Products 2',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sampleProducts.count} products records`);
  return sampleProducts;
}
