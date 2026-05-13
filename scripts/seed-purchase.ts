import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding purchase data...');

  // 1. Create Vendors
  const vendors = [
    { name: "TechSupplies Ltd", contactName: "John Doe", email: "john@techsupplies.com", phone: "+1 234 567 890" },
    { name: "CloudWorks Inc", contactName: "Jane Smith", email: "jane@cloudworks.com", phone: "+1 987 654 321" },
    { name: "OfficePro Solutions", contactName: "Bob Miller", email: "bob@officepro.com", phone: "+1 555 123 456" },
    { name: "Global Logistics", contactName: "Alice Wong", email: "alice@gblogistics.com", phone: "+1 444 888 999" },
    { name: "Digital Assets Co", contactName: "Charlie Brown", email: "charlie@digitalassets.com", phone: "+1 222 333 444" },
  ];

  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { name: v.name },
      update: {},
      create: v,
    });
  }

  const allVendors = await prisma.vendor.findMany();

  // 2. Create Purchase Orders
  const statuses = ['Draft', 'Sent', 'Confirmed', 'Pending Approval', 'Received', 'Cancelled'];
  const now = new Date();

  for (let i = 1; i <= 50; i++) {
    const vendor = allVendors[i % allVendors.length];
    const amount = Math.floor(Math.random() * 10000) + 500;
    const date = new Date(now);
    date.setMonth(now.getMonth() - Math.floor(Math.random() * 12));
    date.setDate(Math.floor(Math.random() * 28) + 1);

    await prisma.purchaseOrder.create({
      data: {
        number: `PO-2026-${1000 + i}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        totalAmount: amount,
        subtotal: amount * 0.85,
        taxAmount: amount * 0.15,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        issueDate: date,
      }
    });
  }

  // 3. Create Vendor Bills
  const poList = await prisma.purchaseOrder.findMany({
    where: { status: { in: ['Confirmed', 'Received'] } }
  });

  for (let i = 0; i < poList.length; i++) {
    const po = poList[i];
    const isOverdue = i % 3 === 0;
    const isPaid = i % 5 === 0;
    
    const dueDate = new Date(po.issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    await prisma.vendorBill.create({
      data: {
        number: `BILL-2026-${1000 + i}`,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        purchaseOrderId: po.id,
        issueDate: po.issueDate,
        dueDate: dueDate,
        totalAmount: po.totalAmount,
        balance: isPaid ? 0 : po.totalAmount,
        status: isPaid ? 'paid' : (dueDate < now ? 'overdue' : 'unpaid'),
      }
    });
  }

  console.log('Purchase data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
