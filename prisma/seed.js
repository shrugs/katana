// if you can get this fucking script to work with typescript, i'll love you forever, good luck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.collection.upsert({
    where: { slug: 'katana' },
    create: { slug: 'katana' },
    update: {},
  });

  await prisma.collection.upsert({
    where: { slug: 'upgrade' },
    create: { slug: 'upgrade' },
    update: {},
  });

  await prisma.collection.upsert({
    where: { slug: 'oneofthemanytelegrams' },
    create: { slug: 'oneofthemanytelegrams' },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
