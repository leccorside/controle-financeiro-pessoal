require('dotenv').config();
const prisma = require('./lib/prisma');

async function main() {
  const t = await prisma.transaction.findMany({
    where: { 
      description: { contains: 'Água', mode: 'insensitive' }
    }
  });
  console.log(JSON.stringify(t, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
