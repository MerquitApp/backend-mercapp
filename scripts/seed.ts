import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Generar usuarios falsos
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
        password: faker.internet.password(),
        profile_picture: faker.image.avatar(),
      },
    });

    // Generar reputaciones falsas para el usuario
    for (let j = 0; j < 3; j++) {
      await prisma.reputation.create({
        data: {
          score: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          userId: user.user_id,
        },
      });
    }

    // Generar actividades falsas para el usuario
    for (let j = 0; j < 3; j++) {
      await prisma.activity.create({
        data: {
          description: faker.lorem.sentence(),
          userId: user.user_id,
        },
      });
    }
  }

  // Generar categorías falsas
  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes'];
  for (const categoryName of categories) {
    await prisma.category.create({
      data: {
        name: categoryName,
        description: faker.lorem.sentence(),
      },
    });
  }

  // Generar productos falsos
  const allCategories = await prisma.category.findMany();
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 10, max: 1000 }),
        tags: [faker.commerce.department(), faker.commerce.department()],
      },
    });

    // Asignar categorías aleatorias a los productos
    const randomCategories = faker.helpers.arrayElements(allCategories, 2);
    for (const category of randomCategories) {
      await prisma.productCategoriesOnProduct.create({
        data: {
          productId: product.id,
          categoryId: category.id,
        },
      });
    }

    // Generar imágenes falsas para los productos
    for (let j = 0; j < 3; j++) {
      await prisma.productImage.create({
        data: {
          image: faker.image.urlLoremFlickr({ category: 'technics' }),
          productId: product.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
