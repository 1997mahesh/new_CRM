import prisma from './backend/src/prisma/index.js';

async function seed() {
  console.log('Seeding CRM data (Leads, Invoices, Tickets)...');

  // Get a user for assignment
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found! Please register a user first.');
    return;
  }

  // 1. Seed Leads (20 leads)
  const leadSources = ["Website", "Referral", "Cold Call", "Partner", "Trade Show"];
  const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
  const priorities = ["Low", "Medium", "High", "Urgent"];
  const companies = ["Global Trade Corp", "TechFlow Solutions", "Nexa Logistics", "Zenith Design", "Alpha Tech", "Blue Sky Media", "Prime Properties"];

  for (let i = 1; i <= 20; i++) {
    await prisma.lead.create({
      data: {
        title: `Opportunity ${i}: ${['Software', 'Cloud', 'Branding', 'Analytics'][i % 4]} Project`,
        companyName: companies[i % companies.length],
        contactPerson: `Contact Person ${i}`,
        email: `contact${i}@${companies[i % companies.length].toLowerCase().replace(/ /g, '')}.com`,
        phone: `+1 555-010${i}`,
        source: leadSources[i % leadSources.length],
        pipelineStage: stages[i % stages.length],
        value: Math.floor(Math.random() * 100000) + 5000,
        assignedUserId: user.id,
        priority: priorities[i % priorities.length],
        notes: `Automated seed note for lead ${i}. Interested in full service migration.`,
        status: i % 7 === 6 ? 'Closed' : 'Open'
      }
    });
  }

  // 2. Seed Invoices (10 invoices)
  for (let i = 1; i <= 10; i++) {
    const subtotal = Math.floor(Math.random() * 20000) + 1000;
    const tax = subtotal * 0.15;
    await prisma.invoice.create({
      data: {
        number: `INV-2026-${String(i).padStart(4, '0')}`,
        customerId: `cust-${i}`,
        customerName: companies[i % companies.length],
        issueDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        dueDate: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)),
        amount: subtotal,
        taxAmount: tax,
        totalAmount: subtotal + tax,
        status: i % 3 === 0 ? 'paid' : (i % 5 === 0 ? 'overdue' : 'unpaid'),
        items: [
          { description: 'Service Implementation', quantity: 1, price: subtotal, total: subtotal }
        ],
        notes: "Thank you for your business!"
      }
    });
  }

  // 3. Seed Tickets (15 tickets)
  const departments = ["Technical Support", "Billing", "Sales", "General Inquiry"];
  for (let i = 1; i <= 15; i++) {
    await prisma.ticket.create({
      data: {
        subject: `Support Case #${i}: ${['Login Issue', 'Payment Failed', 'Feature Request', 'Bug Report'][i % 4]}`,
        customerName: companies[i % companies.length],
        department: departments[i % departments.length],
        priority: priorities[i % priorities.length],
        status: i % 4 === 0 ? 'Closed' : 'Open',
        assignedUserId: user.id,
        description: `Detailed description for support ticket ${i}. The customer reported a recurring issue with the ${['interface', 'database', 'loading time', 'API'][i % 4]}.`,
        createdAt: new Date(Date.now() - (i * 12 * 60 * 60 * 1000))
      }
    });
  }

  console.log('CRM Seeding completed!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
