import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Reports data (Sales, Purchase, Stock)...');

  // 1. Warehouses
  const warehouseA = await prisma.warehouse.upsert({
    where: { id: 'wh-main' },
    update: {},
    create: {
      id: 'wh-main',
      name: 'Main Distribution Center',
      location: 'New York, USA',
    },
  });

  const warehouseB = await prisma.warehouse.upsert({
    where: { id: 'wh-secondary' },
    update: {},
    create: {
      id: 'wh-secondary',
      name: 'secondary Warehouse',
      location: 'San Francisco, USA',
    },
  });

  // 2. Vendors
  const vendors = [
    { id: 'v-001', name: 'Global Tech Solutions', contactName: 'John Smith', email: 'sales@globaltech.com' },
    { id: 'v-002', name: 'Logistics Pro', contactName: 'Sarah Jenkins', email: 'support@logisticspro.com' },
    { id: 'v-003', name: 'Office Depot Corp', contactName: 'Mike Ross', email: 'orders@officedepot.com' },
  ];

  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: {},
      create: v,
    });
  }

  // 3. Inventory
  const inventoryItems = [
    { id: 'inv-001', sku: 'LAP-MAC-14', name: 'MacBook Pro 14"', quantity: 50, unitPrice: 1999, valuation: 99950, warehouseId: warehouseA.id },
    { id: 'inv-002', sku: 'LAP-DEL-XPS', name: 'Dell XPS 15', quantity: 35, unitPrice: 1500, valuation: 52500, warehouseId: warehouseA.id },
    { id: 'inv-003', sku: 'MON-DELL-27', name: 'Dell 27" UltraSharp', quantity: 12, unitPrice: 450, valuation: 5400, warehouseId: warehouseB.id },
    { id: 'inv-004', sku: 'CHR-ERG-01', name: 'Ergonomic Task Chair', quantity: 5, unitPrice: 200, valuation: 1000, warehouseId: warehouseB.id },
  ];

  for (const item of inventoryItems) {
    await prisma.inventory.upsert({
      where: { sku: item.sku },
      update: {
          quantity: item.quantity,
          valuation: item.valuation
      },
      create: item,
    });
  }

  // 4. Invoices (Sales)
  const invoices = [
    { number: 'INV-2026-001', customerId: 'CUST-001', amount: 5000, totalAmount: 5000, status: 'Paid', dueDate: new Date('2026-05-15') },
    { number: 'INV-2026-002', customerId: 'CUST-002', amount: 12000, totalAmount: 12000, status: 'Overdue', dueDate: new Date('2026-04-10') },
    { number: 'INV-2026-003', customerId: 'CUST-003', amount: 8500, totalAmount: 8500, status: 'Unpaid', dueDate: new Date('2026-05-20') },
    { number: 'INV-2026-004', customerId: 'CUST-001', amount: 2500, totalAmount: 2500, status: 'Paid', dueDate: new Date('2026-05-01') },
  ];

  for (const inv of invoices) {
    await prisma.invoice.upsert({
      where: { number: inv.number },
      update: {},
      create: inv,
    });
  }

  // 5. Purchase Orders
  const pos = [
    { number: 'PO-2026-001', vendorId: 'v-001', amount: 25000, status: 'Received', date: new Date('2026-04-15') },
    { number: 'PO-2026-002', vendorId: 'v-002', amount: 4500, status: 'Pending', date: new Date('2026-05-01') },
    { number: 'PO-2026-003', vendorId: 'v-001', amount: 15000, status: 'Received', date: new Date('2026-04-20') },
  ];

  for (const po of pos) {
    await prisma.purchaseOrder.upsert({
      where: { number: po.number },
      update: {},
      create: po,
    });
  }

  console.log('Reports Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
