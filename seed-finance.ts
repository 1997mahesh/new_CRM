import prisma from './backend/src/prisma/index.js';

async function seed() {
  console.log('Seeding Finance data...');

  // 1. Categories
  const categories = [
    { name: 'Payroll', type: 'expense', description: 'Employee salaries and benefits' },
    { name: 'Infrastructure', type: 'expense', description: 'Cloud servers, AWS, hosting' },
    { name: 'Office Supplies', type: 'expense', description: 'Stationery, coffee, furniture' },
    { name: 'Travel', type: 'expense', description: 'Business trips, hotels, flights' },
    { name: 'Subscriptions', type: 'expense', description: 'Software SaaS, tools' },
    { name: 'Marketing', type: 'expense', description: 'Ads, campaigns' },
    { name: 'Sales Revenue', type: 'income', description: 'Direct sales' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.name }, // Temporary unique check by name for seed
      update: {},
      create: cat,
    }).catch(async () => {
       // Fallback if upsert fails on non-unique id
       const exists = await prisma.category.findFirst({ where: { name: cat.name } });
       if (!exists) await prisma.category.create({ data: cat });
    });
  }

  const dbCats = await prisma.category.findMany();
  const payroll = dbCats.find(c => c.name === 'Payroll')!;
  const infra = dbCats.find(c => c.name === 'Infrastructure')!;
  const office = dbCats.find(c => c.name === 'Office Supplies')!;
  const subscriptions = dbCats.find(c => c.name === 'Subscriptions')!;
  const income = dbCats.find(c => c.name === 'Sales Revenue')!;

  // 2. Expenses
  const expenses = [
    { amount: 12500, date: new Date(), description: 'Monthly Salaries April 2026', categoryId: payroll.id, status: 'approved', merchant: 'Employees', paymentMethod: 'Bank Transfer' },
    { amount: 450.75, date: new Date(), description: 'AWS Infra March Consumption', categoryId: infra.id, status: 'approved', merchant: 'Amazon Web Services', paymentMethod: 'Credit Card' },
    { amount: 89.90, date: new Date(), description: 'Coffee and snacks for office', categoryId: office.id, status: 'pending', merchant: 'Local Grocery', paymentMethod: 'Cash' },
    { amount: 299, date: new Date(), description: 'Google Workspace Subscription', categoryId: subscriptions.id, status: 'approved', merchant: 'Google Business', paymentMethod: 'Credit Card' },
    { amount: 1200, date: new Date(), description: 'New Office Chairs x4', categoryId: office.id, status: 'pending', merchant: 'Furniture Store', paymentMethod: 'Bank Transfer' },
  ];

  for (const exp of expenses) {
    await prisma.expense.create({ data: exp });
  }

  // 3. Ledger (Initial Balance)
  await prisma.ledgerEntry.create({
    data: {
      date: new Date(),
      description: 'Initial Balance Seed',
      type: 'income',
      credit: 50000,
      balance: 50000
    }
  });

  // Approved expenses to ledger
  const approved = await prisma.expense.findMany({ where: { status: 'approved' } });
  let currentBalance = 50000;
  for (const exp of approved) {
    currentBalance -= exp.amount;
    await prisma.ledgerEntry.create({
      data: {
        date: exp.date,
        description: exp.description || 'Expense',
        type: 'expense',
        debit: exp.amount,
        balance: currentBalance,
        reference: exp.id
      }
    });
  }

  console.log('Seeding completed!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
