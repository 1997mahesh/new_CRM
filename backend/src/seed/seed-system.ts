import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding System Settings...');

  // 1. App Modules
  const modules = [
    { name: 'Core CRM', slug: 'crm', isEnabled: true, description: 'Leads, Customers, and Contacts' },
    { name: 'Sales', slug: 'sales', isEnabled: true, description: 'Invoices, Quotes, and Sales Orders' },
    { name: 'Inventory', slug: 'inventory', isEnabled: true, description: 'Warehouses, Stock, and Products' },
    { name: 'Finance', slug: 'finance', isEnabled: true, description: 'Expenses, Ledger, and P&L' },
    { name: 'Reports', slug: 'reports', isEnabled: true, description: 'Analytical reports and dashboards' },
  ];

  for (const m of modules) {
    await prisma.appModule.upsert({
      where: { slug: m.slug },
      update: {},
      create: m,
    });
  }

  // 2. Default Currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, isDefault: true },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, isDefault: false },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, isDefault: false },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 151.6, isDefault: false },
  ];

  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  // 3. Tax Rates
  const taxRates = [
    { name: 'VAT 20%', rate: 20 },
    { name: 'Sales Tax 5%', rate: 5 },
    { name: 'Zero Rated', rate: 0 },
  ];

  for (const t of taxRates) {
    await prisma.taxRate.create({ data: t });
  }

  // 4. Number Series
  const series = [
    { name: 'Invoices', prefix: 'INV', lastNumber: 100, padding: 5 },
    { name: 'Purchase Orders', prefix: 'PO', lastNumber: 50, padding: 5 },
    { name: 'Customers', prefix: 'CUST', lastNumber: 200, padding: 4 },
  ];

  for (const s of series) {
    await prisma.numberSeries.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  // 5. Default Settings
  const defaultSettings = [
    { key: 'app_name', value: 'Nexus ERP', group: 'general' },
    { key: 'timezone', value: 'UTC', group: 'general' },
    { key: 'language', value: 'en', group: 'general' },
    { key: 'smtp_host', value: 'smtp.gmail.com', group: 'email' },
    { key: 'smtp_port', value: '587', group: 'email' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log('System Settings Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
