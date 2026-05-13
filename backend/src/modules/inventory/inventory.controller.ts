import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class InventoryController extends BaseController {
  dashboard = this.handleRequest(async (req: Request) => {
    const { warehouseId, categoryId, vendorId } = req.query;
    
    const where: any = {};
    if (warehouseId) where.warehouseId = String(warehouseId);
    if (categoryId) where.categoryId = String(categoryId);
    if (vendorId) where.vendorId = String(vendorId);

    const [
      totalProducts,
      lowStockCount,
      outOfStockCount,
      allProductsValue,
      _topValueProducts, // Not used directly, calculated later
      _categoryValueDistribution, // Not used directly, calculated later
      recentMovementsRaw,
      pendingFulfillments,
      pendingPurchaseOrders
    ] = await Promise.all([
      // Total Products
      prisma.inventory.count({ where }),
      
      // Low Stock Items
      prisma.inventory.count({ 
        where: { 
          ...where,
          status: 'Low Stock'
        } 
      }),
      
      // Out of Stock Items
      prisma.inventory.count({ 
        where: { 
          ...where,
          status: 'Out of Stock' 
        } 
      }),
      
      // Placeholder for aggregate (Prisma doesn't support sum(currentStock * costPrice) directly)
      prisma.inventory.aggregate({ where, _count: true }),

      // Top Products by Value (Placeholder)
      prisma.inventory.findMany({ where, take: 1, select: { id: true } }),

      // Category Distribution (Placeholder)
      prisma.inventoryCategory.findMany({ take: 1 }),

      // Recent Movements
      prisma.stockMovement.findMany({
        where: warehouseId ? { warehouseId: String(warehouseId) } : {},
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          product: { select: { name: true, sku: true } },
          warehouse: { select: { name: true } }
        }
      }),
      // Pending Sales Orders (Fulfillment check)
      prisma.order.count({
        where: {
          status: { in: ['Draft', 'Confirmed', 'Processing'] }
        }
      }),
      // Pending Purchase Orders (Incoming stock check)
      prisma.purchaseOrder.count({
        where: {
          status: { in: ['Draft', 'Sent', 'Confirmed', 'Partially Received'] }
        }
      })
    ]);

    // Calculate real metrics from all items for accuracy (if DB is small enough)
    const allItems = await prisma.inventory.findMany({
      where,
      select: { id: true, name: true, sku: true, currentStock: true, costPrice: true, categoryId: true },
      include: { category: { select: { name: true } } }
    });

    const totalStockValue = allItems.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

    const topProducts = allItems
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.currentStock,
        value: p.currentStock * p.costPrice,
        category: p.category?.name
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    const categories = await prisma.inventoryCategory.findMany();
    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      value: allItems.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0)
    })).filter(c => c.value > 0);

    const recentMovements = recentMovementsRaw.map(m => ({
        id: m.id,
        productName: m.product.name,
        sku: m.product.sku,
        type: m.type,
        quantity: m.quantity,
        warehouse: m.warehouse?.name,
        date: m.date,
        reference: m.referenceId
    }));

    return {
      totalProducts,
      lowStockCount: lowStockCount,
      outOfStockCount: outOfStockCount,
      totalStockValue,
      pendingFulfillments,
      pendingPurchaseOrders,
      topProducts,
      categoryDistribution,
      recentMovements
    };
  });

  list = this.handleRequest(async (req: Request) => {
    const { search, categoryId, warehouseId, status } = req.query;
    
    const where: any = {};
    if (warehouseId) where.warehouseId = String(warehouseId);
    if (categoryId) where.categoryId = String(categoryId);
    if (status) where.status = String(status);
    
    if (search) {
      const searchStr = String(search);
      where.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { sku: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.inventory.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        warehouse: true,
        category: true,
        _count: {
          select: { movements: true }
        }
      }
    });
    return products;
  });

  get = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const item = await prisma.inventory.findUnique({
      where: { id },
      include: {
        warehouse: true,
        category: true,
        vendor: true,
        movements: {
          orderBy: { date: 'desc' },
          take: 50,
          include: {
            warehouse: true
          }
        }
      }
    });
    return item;
  });

  create = this.handleRequest(async (req: Request) => {
    const data = req.body;
    const userId = (req as any).user?.id;

    if (!data.status) {
      if (data.currentStock === 0) data.status = 'Out of Stock';
      else if (data.currentStock <= (data.minimumStock || 10)) data.status = 'Low Stock';
      else data.status = 'In Stock';
    }

    const item = await prisma.inventory.create({
      data,
      include: { warehouse: true, category: true }
    });

    // Record initial movement if stock > 0
    if (item.currentStock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: item.id,
          type: 'IN',
          quantity: item.currentStock,
          warehouseId: item.warehouseId,
          referenceType: 'MANUAL',
          notes: 'Initial Stock Entry',
          cost: item.costPrice,
          createdBy: userId
        }
      });
    }
    
    return item;
  });

  update = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const data = req.body;
    
    if (data.currentStock !== undefined) {
        if (data.currentStock === 0) data.status = 'Out of Stock';
        else if (data.currentStock <= (data.minimumStock || 10)) data.status = 'Low Stock';
        else data.status = 'In Stock';
    }

    const item = await prisma.inventory.update({
      where: { id },
      data,
      include: { warehouse: true, category: true }
    });
    return item;
  });

  delete = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    return await prisma.inventory.delete({
      where: { id }
    });
  });

  adjustStock = this.handleRequest(async (req: Request) => {
    const { productId, warehouseId, type, quantity, reason, notes, referenceType, referenceId } = req.body;
    const userId = (req as any).user?.id || null;
    
    const item = await prisma.inventory.findUnique({ where: { id: productId } });
    if (!item) throw new Error('Product not found');

    const oldQty = item.currentStock;
    let newQty = oldQty;
    let movementType = type; // IN, OUT, ADJUSTMENT, TRANSFER

    if (type === 'IN') newQty += quantity;
    else if (type === 'OUT') newQty -= quantity;
    else if (type === 'ADJUSTMENT') newQty = quantity;

    let status = 'In Stock';
    if (newQty === 0) status = 'Out of Stock';
    else if (newQty <= item.minimumStock) status = 'Low Stock';

    const updatedItem = await prisma.inventory.update({
      where: { id: productId },
      data: { 
        currentStock: newQty,
        status
      }
    });

    if (type === 'ADJUSTMENT') {
        await prisma.inventoryAdjustment.create({
            data: {
                productId,
                oldQty,
                newQty,
                difference: newQty - oldQty,
                reason: reason || 'Manual Adjustment',
                notes,
                approvedBy: userId
            }
        });
    }

    await prisma.stockMovement.create({
      data: {
        productId,
        type: movementType,
        quantity: type === 'ADJUSTMENT' ? (newQty - oldQty) : quantity,
        warehouseId: warehouseId || item.warehouseId,
        referenceType: referenceType || 'MANUAL',
        referenceId: referenceId,
        notes: notes || reason,
        cost: item.costPrice,
        createdBy: userId,
        date: new Date()
      }
    });

    return updatedItem;
  });

  warehouses = this.handleRequest(async () => {
    return await prisma.warehouse.findMany({
        include: { _count: { select: { products: true } } }
    });
  });

  categories = this.handleRequest(async () => {
    return await prisma.inventoryCategory.findMany({
        include: { _count: { select: { products: true } } }
    });
  });

  createCategory = this.handleRequest(async (req: Request) => {
    const data = req.body;
    return await prisma.inventoryCategory.create({ data });
  });

  deleteCategory = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    return await prisma.inventoryCategory.delete({ where: { id } });
  });
}
