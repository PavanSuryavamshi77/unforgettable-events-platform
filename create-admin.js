const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addAdmin() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@unforgettable.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@unforgettable.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  });

  console.log("Admin user created successfully!");
}

addAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
