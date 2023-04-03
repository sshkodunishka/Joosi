import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.roles.createMany({
    data: [{ role: 'admin' }, { role: 'user' }, { role: 'choreographer' }],
  });

  const roleId = await prisma.roles.findUnique({ where: { role: 'admin' } });
  await prisma.users.create({
    data: {
      roleId: roleId.id,
      login: 'admin',
      password: '$2b$05$zsGv660cVMSlQJZi9Fv5/ea/R06G0B.XQLTWCwyGPuZsaiYWXBaRi',
      name: 'admin',
      lastName: 'admin',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
