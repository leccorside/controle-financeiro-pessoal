require('dotenv').config();
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const name = "Johnathan Amorim";
  const email = "leccorside@gmail.com";
  const password = "Johnweb!@#1331";
  const role = "ADMIN";

  console.log('--- Iniciando criação do usuário Admin ---');

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password: hashedPassword,
        role
      },
      create: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    console.log('✅ Usuário Admin criado/atualizado com sucesso:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
