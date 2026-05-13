import prisma from './backend/src/prisma/index.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding System Data (Roles, Permissions, User)...');

  // 1. Roles & Permissions
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'System Administrator with full access'
    }
  });

  // 2. Demo User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@veltroxcrm.com' },
    update: {},
    create: {
      email: 'admin@veltroxcrm.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      roles: {
        connect: [{ id: adminRole.id }]
      }
    }
  });

  console.log('User created: admin@veltroxcrm.com / admin123');
  
  // 3. Number Series
  console.log('Seeding Number Series...');
  const series = [
    { name: 'quotation', prefix: 'QT-2026-', padding: 4 },
    { name: 'order', prefix: 'SO-2026-', padding: 4 },
    { name: 'invoice', prefix: 'INV-2026-', padding: 4 }
  ];

  for (const s of series) {
    await prisma.numberSeries.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        prefix: s.prefix,
        padding: s.padding,
        lastNumber: 0
      }
    });
  }

  // 4. Leads (20)
  const companies = ["Global Trade Corp", "TechFlow Solutions", "Nexa Logistics", "Zenith Design", "Alpha Tech", "Blue Sky Media", "Prime Properties"];
  const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const sources = ["Website", "Referral", "Cold Call", "Partner"];
  
  for (let i = 1; i <= 20; i++) {
    await prisma.lead.create({
      data: {
        title: `Project ${i}: Digital Transformation`,
        companyName: companies[i % companies.length],
        contactPerson: `Client Contact ${i}`,
        email: `client${i}@example.com`,
        phone: `+1-800-00${i}`,
        source: sources[i % sources.length],
        pipelineStage: stages[i % stages.length],
        value: i * 5000,
        assignedUserId: user.id,
        priority: i % 3 === 0 ? 'High' : 'Medium',
        status: 'Open'
      }
    });
  }

  // 4. Invoices (10)
  const customers = await prisma.customer.findMany();
  if (customers.length > 0) {
    for (let i = 1; i <= 10; i++) {
      const customer = customers[i % customers.length];
      const amount = i * 1500;
      const tax = amount * 0.15;
      await prisma.invoice.upsert({
        where: { number: `INV-2026-${1000 + i}` },
        update: {},
        create: {
          number: `INV-2026-${1000 + i}`,
          customerId: customer.id,
          customerName: customer.name,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          amount,
          taxAmount: tax,
          totalAmount: amount + tax,
          balance: i % 3 === 0 ? 0 : amount + tax,
          status: i % 3 === 0 ? 'paid' : 'sent',
          items: [{ description: "Professional Services", quantity: 1, price: amount, total: amount }]
        }
      });
    }
  }

  // 5. Tickets (15)
  const departments = ["Technical Support", "Billing", "Sales"];
  for (let i = 1; i <= 15; i++) {
    await prisma.ticket.create({
      data: {
        subject: `Ticket #${i}: Connectivity Issue`,
        customerName: companies[i % companies.length],
        department: departments[i % departments.length],
        priority: i % 4 === 0 ? 'Urgent' : 'Medium',
        status: i % 5 === 0 ? 'Closed' : 'Open',
        assignedUserId: user.id,
        description: `Customer reported intermittent connection drops in the ${departments[i % departments.length]} module.`
      }
    });
  }

  console.log('Seeding complete!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
