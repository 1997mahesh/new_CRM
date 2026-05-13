import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Inventory data...');

  // 1. Warehouses
  const warehousesData = [
    { name: 'Main Warehouse', location: 'Industrial Zone A', managerEmail: 'admin@example.com' },
    { name: 'Retail Store Backroom', location: 'Downtown Center', managerEmail: 'admin@example.com' },
    { name: 'Northern Hub', location: 'Logistics Park N', managerEmail: 'admin@example.com' },
  ];

  const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });

  const warehouses = [];
  for (const w of warehousesData) {
    const warehouse = await prisma.warehouse.upsert({
      where: { name: w.name },
      update: { location: w.location, managerId: admin?.id },
      create: { 
        name: w.name, 
        location: w.location, 
        managerId: admin?.id 
      },
    });
    warehouses.push(warehouse);
  }

  // 2. Categories
  const categoriesData = [
    { name: 'Raw Materials', description: 'Basic materials for production' },
    { name: 'Finished Goods', description: 'Products ready for sale' },
    { name: 'Electronics', description: 'Electronic components and devices' },
    { name: 'Office Supplies', description: 'Stationery and office equipment' },
    { name: 'Packaging', description: 'Boxes and shipping materials' },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const category = await prisma.inventoryCategory.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: { name: c.name, description: c.description },
    });
    categories.push(category);
  }

  // 3. Products (Inventory)
  const productsData = [
    { sku: 'ELC001', name: 'Microcontroller A1', category: 'Electronics', cost: 12.5, sell: 25.0, stock: 150, min: 50, reorder: 75, unit: 'pc' },
    { sku: 'ELC002', name: 'Relay Module 5V', category: 'Electronics', cost: 5.0, sell: 12.0, stock: 200, min: 40, reorder: 60, unit: 'pc' },
    { sku: 'OF001', name: 'Ergonomic Desk Chair', category: 'Office Supplies', cost: 85.0, sell: 180.0, stock: 12, min: 5, reorder: 8, unit: 'box' },
    { sku: 'OF002', name: 'Wireless Mouse', category: 'Electronics', cost: 15.0, sell: 35.0, stock: 45, min: 10, reorder: 15, unit: 'pc' },
    { sku: 'RM001', name: 'Aluminum Sheets 2mm', category: 'Raw Materials', cost: 45.0, sell: 0, stock: 8, min: 10, reorder: 15, unit: 'sheet' }, // Low stock
    { sku: 'RM002', name: 'Steel Bars 10mm', category: 'Raw Materials', cost: 32.0, sell: 0, stock: 0, min: 20, reorder: 30, unit: 'bar' }, // Out of stock
    { sku: 'PK001', name: 'Shipping Box Large', category: 'Packaging', cost: 1.2, sell: 2.5, stock: 500, min: 100, reorder: 200, unit: 'bundle' },
    { sku: 'FG001', name: 'Solar Charger Kit', category: 'Finished Goods', cost: 120.0, sell: 249.99, stock: 25, min: 5, reorder: 10, unit: 'set' },
  ];

  for (const p of productsData) {
    const category = categories.find(c => c.name === p.category);
    const status = p.stock === 0 ? 'Out of Stock' : (p.stock <= p.min ? 'Low Stock' : 'In Stock');
    
    await prisma.inventory.upsert({
      where: { sku: p.sku },
      update: {
        currentStock: p.stock,
        costPrice: p.cost,
        sellingPrice: p.sell,
        minimumStock: p.min,
        reorderLevel: p.reorder,
        status,
        categoryId: category?.id,
        warehouseId: warehouses[0].id
      },
      create: {
        sku: p.sku,
        name: p.name,
        currentStock: p.stock,
        costPrice: p.cost,
        sellingPrice: p.sell,
        minimumStock: p.min,
        reorderLevel: p.reorder,
        unit: p.unit,
        status,
        categoryId: category?.id,
        warehouseId: warehouses[0].id
      },
    });
  }

  console.log('Inventory Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
