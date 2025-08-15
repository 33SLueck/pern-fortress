import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProduct() {
  console.log('Seeding product data...');

  const sampleProduct = await prisma.product.createMany({
    data: [
      {
        name: 'Sample Product 1',
      },
      {
        name: 'Sample Product 2',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sampleProduct.count} product records`);
  return sampleProduct;
}
