import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { prisma as target } from "../src/lib/prisma";

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;

function databaseIdentity(connectionString: string): string {
  const url = new URL(connectionString);
  return `${url.protocol}//${url.username}@${url.hostname}:${url.port}${url.pathname}`;
}

async function migrateData() {
  if (!sourceUrl || !targetUrl) {
    throw new Error(
      "Define SOURCE_DATABASE_URL y DATABASE_URL antes de iniciar la importación"
    );
  }
  if (databaseIdentity(sourceUrl) === databaseIdentity(targetUrl)) {
    throw new Error("El origen y el destino deben ser bases de datos distintas");
  }

  const source = new PrismaClient({
    adapter: new PrismaPg({ connectionString: sourceUrl }),
  });

  try {
    const data = await source.$transaction(
      async (transaction) => {
        const categories = await transaction.category.findMany();
        const products = await transaction.product.findMany();
        const heroSlides = await transaction.heroSlide.findMany();
        return { categories, products, heroSlides };
      },
      { isolationLevel: "RepeatableRead" }
    );

    await target.$transaction(async (transaction) => {
      if (data.categories.length) {
        await transaction.category.createMany({ data: data.categories });
      }
      if (data.products.length) {
        await transaction.product.createMany({ data: data.products });
      }
      if (data.heroSlides.length) {
        await transaction.heroSlide.createMany({ data: data.heroSlides });
      }
    });

    console.info(
      `Importados ${data.categories.length} categorías, ${data.products.length} productos y ${data.heroSlides.length} imágenes del Hero.`
    );
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

migrateData().catch((error: unknown) => {
  console.error("La importación de datos no se completó.", error);
  process.exitCode = 1;
});
