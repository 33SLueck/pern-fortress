import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedArticles() {
  console.log('Seeding articles data...');

  const sampleArticles = await prisma.articles.createMany({
    data: [
      {
        name: 'Sample Articles 1',
      },
      {
        name: 'Sample Articles 2',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sampleArticles.count} articles records`);
  return sampleArticles;
}
