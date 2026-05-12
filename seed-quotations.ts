import prisma from './backend/src/prisma/index.js';

async function seedQuotations() {
  console.log('Seeding Quotations and Number Series...');

  // 1. Number Series
  const series = [
    { name: 'Quotation', prefix: 'QT-2026-', lastNumber: 100, padding: 3 },
    { name: 'Order', prefix: 'ORD-2026-', lastNumber: 50, padding: 3 },
    { name: 'Invoice', prefix: 'INV-2026-', lastNumber: 10, padding: 4 }
  ];

  for (const s of series) {
    await prisma.numberSeries.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        prefix: s.prefix,
        lastNumber: s.lastNumber,
        padding: s.padding,
        isActive: true
      }
    });
  }

  // 2. Customers for linking
  const customers = await prisma.customer.findMany();
  if (customers.length === 0) {
    // Create demo customers if none exist
    const demoCustomers = [
      { name: "Global Trade Corp", email: "contact@globaltrade.com" },
      { name: "TechFlow Solutions", email: "hello@techflow.io" },
      { name: "Nexa Logistics", email: "ops@nexalog.com" }
    ];

    for (const c of demoCustomers) {
      await prisma.customer.create({
        data: {
           name: c.name,
           email: c.email,
           type: "Company",
           status: "Active"
        }
      });
    }
  }

  // 3. Demo Quotations
  const allCustomers = await prisma.customer.findMany();
  const statuses = ["Draft", "Sent", "Accepted", "Rejected", "Expired"];

  for (let i = 1; i <= 20; i++) {
    const customer = allCustomers[i % allCustomers.length];
    const amount = i * 2000;
    const tax = amount * 0.1;
    const total = amount + tax;

    await prisma.quotation.create({
      data: {
        number: `QT-2026-${String(i).padStart(3, '0')}`,
        customerId: customer.id,
        customerName: customer.name,
        title: `Project Proposal: ${customer.name} Expansion`,
        issueDate: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        subtotal: amount,
        taxAmount: tax,
        totalAmount: total,
        status: statuses[i % statuses.length],
        items: [
           { id: '1', description: "Solution Design & Consulting", quantity: 1, unitPrice: amount * 0.3, taxPercent: 10, discountPercent: 0, total: amount * 0.3 * 1.1 },
           { id: '2', description: "Software Implementation", quantity: 1, unitPrice: amount * 0.7, taxPercent: 10, discountPercent: 0, total: amount * 0.7 * 1.1 }
        ],
        notes: "Thank you for the opportunity to propose our solutions.",
        terms: "1. 50% Advance payment required. 2. Project timeline is 8 weeks."
      }
    });
  }

  console.log('Quotations seeding complete!');
}

seedQuotations().catch(e => {
  console.error(e);
  process.exit(1);
});
