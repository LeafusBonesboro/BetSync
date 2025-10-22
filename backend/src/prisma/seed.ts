import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.bet.createMany({
    data: [
      {
        event: 'Lakers vs Warriors',
        market: 'Spread',
        stake: 50,
        odds: -110,
        status: 'Pending',
      },
      {
        event: 'Chiefs vs 49ers',
        market: 'Moneyline',
        stake: 25,
        odds: 120,
        status: 'Won',
      },
    ],
  });

  console.log('✅ Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
