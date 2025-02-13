import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.productCategoriesOnProduct.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.reputation.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
}

cleanDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
