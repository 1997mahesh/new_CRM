import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';

export class InventoryController extends BaseController {
  dashboard = this.handleRequest(async (req: Request) => {
    const { warehouseId, categoryId, vendorId, status, dateRange } = req.query;
    
    const where: any = {};
    if (warehouseId && warehouseId !== 'all') where.warehouseId = String(warehouseId);
    if (categoryId && categoryId !== 'all') where.categoryId = String(categoryId);
    if (vendorId && vendorId !== 'all') where.vendorId = String(vendorId);
    if (status && status !== 'all') where.status = String(status);

    // Date range handling for movements
    const dateQuery: any = {};
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'today') {
        dateQuery.gte = new Date(now.setHours(0, 0, 0, 0));
      } else if (dateRange === 'week') {
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        dateQuery.gte = lastWeek;
      } else if (dateRange === 'month') {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        dateQuery.gte = lastMonth;
      } else if (dateRange === 'quarter') {
        const lastQuarter = new Date(now.setMonth(now.getMonth() - 3));
        dateQuery.gte = lastQuarter;
      }
    }

    const [
      totalProducts,
      lowStockCount,
      outOfStockCount,
      _sumStock, // Placeholder for sum
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
      
      // Aggregate sum
      prisma.inventory.aggregate({ 
        where, 
        _sum: { currentStock: true } 
      }),

      // Top Products by Value (Placeholder)
      prisma.inventory.findMany({ where, take: 1, select: { id: true } }),

      // Category Distribution (Placeholder)
      prisma.inventoryCategory.findMany({ take: 1 }),

      // Recent Movements
      prisma.stockMovement.findMany({
        where: {
            ...(warehouseId && warehouseId !== 'all' ? { warehouseId: String(warehouseId) } : {}),
            ...(dateQuery.gte ? { date: dateQuery } : {})
        },
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
            warehouse: true,
            creator: true
          }
        }
      }
    });
    return item;
  });

  create = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
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
    const { id: _, ...data } = req.body;
    
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
    const { productId, warehouseId, type, quantity, reason, notes, referenceType, referenceId, date } = req.body;
    const userId = (req as any).user?.id || null;
    
    const item = await prisma.inventory.findUnique({ where: { id: productId } });
    if (!item) throw new Error('Product not found');

    const oldQty = item.currentStock;
    let newQty = oldQty;
    
    // IN, OUT, ADJUSTMENT, DAMAGED, RETURNED
    if (type === 'IN' || type === 'RETURNED') {
      newQty += Math.abs(quantity);
    } else if (type === 'OUT' || type === 'DAMAGED') {
      newQty -= Math.abs(quantity);
    } else if (type === 'ADJUSTMENT') {
      newQty = quantity;
    }

    if (newQty < 0) throw new Error('Stock cannot be negative');

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
                reason: reason || notes || 'Manual Adjustment',
                notes,
                approvedBy: userId
            }
        });
    }

    await prisma.stockMovement.create({
      data: {
        productId,
        type,
        quantity: Math.floor(type === 'ADJUSTMENT' ? (newQty - oldQty) : quantity),
        beforeStock: oldQty,
        afterStock: newQty,
        warehouseId: warehouseId || item.warehouseId,
        referenceType: referenceType || 'MANUAL',
        referenceId: referenceId,
        notes: notes || reason,
        cost: item.costPrice,
        createdBy: userId,
        date: (date && date !== "") ? new Date(date) : new Date()
      }
    });

    return updatedItem;
  });

  movementHistory = this.handleRequest(async (req: Request) => {
    const { productId, type, warehouseId, startDate, endDate, limit } = req.query;
    
    const where: any = {};
    if (productId) where.productId = String(productId);
    if (type && type !== 'all') where.type = String(type);
    if (warehouseId && warehouseId !== 'all') where.warehouseId = String(warehouseId);
    
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(String(startDate));
        if (endDate) where.date.lte = new Date(String(endDate));
    }

    return await prisma.stockMovement.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit ? parseInt(String(limit)) : 50,
        include: {
            product: { select: { name: true, sku: true, unit: true } },
            warehouse: { select: { name: true } },
            creator: { select: { firstName: true, lastName: true } }
        }
    });
  });

  warehouses = this.handleRequest(async () => {
    return await prisma.warehouse.findMany({
        include: { _count: { select: { products: true } } }
    });
  });

  categories = this.handleRequest(async (req: Request) => {
    const { search } = req.query;
    const where: any = {};
    if (search) {
      const searchStr = String(search);
      where.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { slug: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
      ];
    }
    return await prisma.inventoryCategory.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' }
    });
  });

  createCategory = this.handleRequest(async (req: Request) => {
    const { id, ...data } = req.body;
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await prisma.inventoryCategory.create({ data });
  });

  updateCategory = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    return await prisma.inventoryCategory.update({
        where: { id },
        data
    });
  });

  deleteCategory = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    // Check if category has products
    const productsCount = await prisma.inventory.count({
        where: { categoryId: id }
    });
    if (productsCount > 0) {
        throw new Error('Cannot delete category with linked products');
    }
    return await prisma.inventoryCategory.delete({ where: { id } });
  });
}
