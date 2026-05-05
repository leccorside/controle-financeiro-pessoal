require('dotenv').config();
const prisma = require('./lib/prisma');

async function main() {
  const users = await prisma.user.findMany({
    include: { pushSubscriptions: true }
  });
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
