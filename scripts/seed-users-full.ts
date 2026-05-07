import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles, departments, locations, and users...');

  // 1. Roles
  const rolesData = [
    { name: 'Super Admin', description: 'Full system access' },
    { name: 'Admin', description: 'Administrative access' },
    { name: 'Sales Manager', description: 'Manage sales team and leads' },
    { name: 'Sales Executive', description: 'Handle individual leads' },
    { name: 'Accounts Manager', description: 'Financial management' },
    { name: 'Purchase Officer', description: 'Procurement and inventory' },
    { name: 'Support Lead', description: 'Manage customer support' },
  ];

  const roles = [];
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
    roles.push(role);
  }

  // 2. Departments
  const deptsData = [
    { name: 'Management', description: 'Upper management' },
    { name: 'Sales', description: 'Sales and marketing' },
    { name: 'Finance', description: 'Accounts and taxation' },
    { name: 'Inventory', description: 'Warehouse and stock' },
    { name: 'Purchase', description: 'Procurement' },
    { name: 'Operations', description: 'Daily operations' },
    { name: 'Support', description: 'Customer service' },
    { name: 'HR', description: 'Human resources' },
    { name: 'IT', description: 'Technical support and development' },
  ];

  const departments = [];
  for (const d of deptsData) {
    const dept = await prisma.department.upsert({
      where: { name: d.name },
      update: {},
      create: d,
    });
    departments.push(dept);
  }

  // 3. Locations
  const locsData = [
    { name: 'Head Office', address: '123 Main St, New York' },
    { name: 'Kosamba Factory', address: 'Plot 45, Industrial Zone' },
    { name: 'Remote Office', address: 'Virtual' },
  ];

  const locations = [];
  for (const l of locsData) {
    const loc = await prisma.location.upsert({
      where: { name: l.name },
      update: {},
      create: l,
    });
    locations.push(loc);
  }

  // 4. Users
  const hashedPassword = await bcrypt.hash('Welcome@123', 10);
  
  const usersData = [
    { 
      email: 'admin@erp-pro.com', 
      firstName: 'System', 
      lastName: 'Admin', 
      employeeCode: 'EMP001', 
      roleNames: ['Super Admin'],
      deptName: 'IT',
      locName: 'Head Office'
    },
    { 
      email: 'sarah.jones@erp-pro.com', 
      firstName: 'Sarah', 
      lastName: 'Jones', 
      employeeCode: 'EMP002', 
      roleNames: ['Sales Manager'],
      deptName: 'Sales',
      locName: 'Head Office'
    },
    { 
      email: 'mike.ross@erp-pro.com', 
      firstName: 'Mike', 
      lastName: 'Ross', 
      employeeCode: 'EMP003', 
      roleNames: ['Sales Executive'],
      deptName: 'Sales',
      locName: 'Kosamba Factory'
    },
    { 
      email: 'emma.finance@erp-pro.com', 
      firstName: 'Emma', 
      lastName: 'Watson', 
      employeeCode: 'EMP004', 
      roleNames: ['Accounts Manager'],
      deptName: 'Finance',
      locName: 'Head Office'
    },
    { 
      email: 'john.ops@erp-pro.com', 
      firstName: 'John', 
      lastName: 'Doe', 
      employeeCode: 'EMP005', 
      roleNames: ['Purchase Officer'],
      deptName: 'Purchase',
      locName: 'Kosamba Factory'
    },
  ];

  for (const u of usersData) {
    const userRoleIds = roles.filter(r => u.roleNames.includes(r.name)).map(r => ({ id: r.id }));
    const dept = departments.find(d => d.name === u.deptName);
    const loc = locations.find(l => l.name === u.locName);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        roles: {
          set: userRoleIds
        },
        departmentId: dept?.id,
        locationId: loc?.id,
      },
      create: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        employeeCode: u.employeeCode,
        password: hashedPassword,
        roles: {
          connect: userRoleIds
        },
        departmentId: dept?.id,
        locationId: loc?.id,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
