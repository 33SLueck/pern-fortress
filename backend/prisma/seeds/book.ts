import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBook() {
  console.log('Seeding book data...');

  const sampleBook = await prisma.book.createMany({
    data: [
      {
        name: 'Sample Book 1',
      },
      {
        name: 'Sample Book 2',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${sampleBook.count} book records`);
  return sampleBook;
}
