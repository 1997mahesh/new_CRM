import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Roles
  const roleNames = ['admin', 'common_user', 'sales', 'purchase', 'finance'];
  const roles = [];

  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} role`,
      },
    });
    roles.push(role);
  }

  const adminRole = roles.find((r) => r.name === 'admin')!;

  // 2. Permissions
  const permissionDefinitions = [
    { name: 'dashboard.view', module: 'dashboard' },
    { name: 'finance.view', module: 'finance' },
    { name: 'finance.manage', module: 'finance' },
    { name: 'expenses.view', module: 'expenses' },
    { name: 'expenses.create', module: 'expenses' },
    { name: 'ledger.view', module: 'ledger' },
    { name: 'categories.view', module: 'categories' },
    { name: 'reports.sales', module: 'reports' },
    { name: 'reports.purchase', module: 'reports' },
    { name: 'reports.stock', module: 'reports' },
    { name: 'reports.finance', module: 'reports' },
    { name: 'user.view', module: 'users' },
    { name: 'user.create', module: 'users' },
    { name: 'role.view', module: 'roles' },
    { name: 'role.manage', module: 'roles' },
    { name: 'permission.view', module: 'permissions' },
    { name: 'settings.view', module: 'settings' },
    { name: 'settings.manage', module: 'settings' },
  ];

  for (const pDef of permissionDefinitions) {
    const permission = await prisma.permission.upsert({
      where: { name: pDef.name },
      update: { module: pDef.module },
      create: {
        name: pDef.name,
        module: pDef.module,
        description: `Can access ${pDef.name}`,
      },
    });

    // Assign all permissions to Admin
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // 3. Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      roles: {
        connect: [{ id: adminRole.id }]
      },
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
