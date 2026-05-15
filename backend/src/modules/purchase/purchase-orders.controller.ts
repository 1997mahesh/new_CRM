import { Request } from 'express';
import { BaseController } from '../../controllers/base.controller.js';
import prisma from '../../prisma/index.js';
import { auditLog } from '../../utils/audit.js';
import { getAndIncrementNextNumber } from '../../utils/number-series.js';
import { calculateTotals, calculateLineTotal } from '../../utils/calculations.js';

export class PurchaseOrderController extends BaseController {
  getAllPOs = this.handleRequest(async (req: Request) => {
    const { status, search, vendorId } = req.query;

    const where: any = {};
    if (status && status !== 'All') {
      where.status = status;
    }
    if (vendorId) {
      where.vendorId = vendorId;
    }
    if (search) {
      where.OR = [
        { number: { contains: search as string, mode: 'insensitive' } },
        { vendorName: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const pos = await prisma.purchaseOrder.findMany({
      where,
      include: {
        vendor: true,
        items: true,
        receipts: true,
        bills: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return pos;
  });

  getPOById = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        items: true,
        receipts: {
          include: {
            items: true
          }
        },
        bills: true
      }
    });

    if (!po) {
      throw new Error('Purchase Order not found');
    }

    return po;
  });

  createPO = this.handleRequest(async (req: Request) => {
    const { id: _, ...data } = req.body;
    const userId = (req as any).user?.id || null;

    // Generate PO number if not provided
    if (!data.number) {
      data.number = await getAndIncrementNextNumber('purchase_order');
    }

    const { items, ...poData } = data;

    // Recalculate totals for safety
    const computed = calculateTotals(items || [], poData.discountType, poData.discountValue);
    poData.subtotal = computed.subtotal;
    poData.taxAmount = computed.taxAmount;
    poData.discountAmount = computed.discountAmount;
    poData.totalAmount = computed.totalAmount;

    // Sanitize dates
    if (poData.issueDate === "" || !poData.issueDate) poData.issueDate = new Date();
    else poData.issueDate = new Date(poData.issueDate);

    if (poData.expectedDelivery === "" || !poData.expectedDelivery) delete poData.expectedDelivery;
    else poData.expectedDelivery = new Date(poData.expectedDelivery);

    if (poData.deliveryDate === "" || !poData.deliveryDate) delete poData.deliveryDate;
    else poData.deliveryDate = new Date(poData.deliveryDate);

    const po = await prisma.purchaseOrder.create({
      data: {
        ...poData,
        items: {
          create: items.map((item: any) => {
            const line = calculateLineTotal(item);
            return {
              productId: item.productId,
              productName: item.productName,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxPercent: item.taxPercent,
              taxAmount: line.taxAmount,
              discountType: item.discountType || 'Fixed',
              discountValue: item.discountValue || 0,
              discountAmount: line.discountAmount,
              totalAmount: line.lineTotal
            };
          })
        }
      },
      include: {
        items: true
      }
    });

    await auditLog(userId, 'CREATE_PO', 'PURCHASE', `Created PO ${po.number}`);

    return po;
  });

  updatePO = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { id: _, ...data } = req.body;
    const userId = (req as any).user?.id || null;

    const { items, ...poData } = data;

    // Recalculate totals if items or discount info changed
    if (items) {
      const computed = calculateTotals(items, poData.discountType, poData.discountValue);
      poData.subtotal = computed.subtotal;
      poData.taxAmount = computed.taxAmount;
      poData.discountAmount = computed.discountAmount;
      poData.totalAmount = computed.totalAmount;
    }

    // Sanitize dates
    if (poData.issueDate === "") delete poData.issueDate;
    else if (poData.issueDate) poData.issueDate = new Date(poData.issueDate);

    if (poData.expectedDelivery === "") poData.expectedDelivery = null;
    else if (poData.expectedDelivery) poData.expectedDelivery = new Date(poData.expectedDelivery);

    if (poData.deliveryDate === "") poData.deliveryDate = null;
    else if (poData.deliveryDate) poData.deliveryDate = new Date(poData.deliveryDate);

    // Standard update logic would involve deleting old items and creating new ones or updating existing ones
    // For simplicity, we'll delete and recreate if items are provided
    const updateData: any = { ...poData };

    if (items) {
      updateData.items = {
        deleteMany: {},
        create: items.map((item: any) => {
          const line = calculateLineTotal(item);
          return {
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxPercent: item.taxPercent,
            taxAmount: line.taxAmount,
            discountType: item.discountType || 'Fixed',
            discountValue: item.discountValue || 0,
            discountAmount: line.discountAmount,
            totalAmount: line.lineTotal
          };
        })
      };
    }

    const po = await prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: {
        items: true
      }
    });

    await auditLog(userId, 'UPDATE_PO', 'PURCHASE', `Updated PO ${po.number}`);

    return po;
  });

  deletePO = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const po = await prisma.purchaseOrder.delete({
      where: { id }
    });

    await auditLog(userId, 'DELETE_PO', 'PURCHASE', `Deleted PO ${po.number}`);

    return { message: 'Purchase Order deleted' };
  });

  receivePO = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const { items, receivedBy, notes, date } = req.body;
    const userId = (req as any).user?.id || null;

    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!po) throw new Error('PO not found');

    const receiptNumber = await getAndIncrementNextNumber('goods_receipt');

    const receipt = await prisma.goodsReceipt.create({
      data: {
        number: receiptNumber,
        purchaseOrderId: id,
        vendorId: po.vendorId,
        date: (date && date !== "") ? new Date(date) : new Date(),
        receivedBy,
        notes,
        items: {
          create: items.map((item: any) => ({
            purchaseOrderItemId: item.purchaseOrderItemId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Update received quantities in PO items and PO status
    for (const item of items) {
      await prisma.purchaseOrderItem.update({
        where: { id: item.purchaseOrderItemId },
        data: {
          receivedQuantity: {
            increment: item.quantity
          }
        }
      });

      // Update Inventory if productId is present
      if (item.productId) {
        const product = await prisma.inventory.findUnique({
            where: { id: item.productId }
        });

        if (product) {
          const warehouseId = product.warehouseId || (await prisma.warehouse.findFirst())?.id;
          
          await prisma.inventory.update({
            where: { id: item.productId },
            data: {
              currentStock: { increment: Math.floor(item.quantity) },
              status: ((product.currentStock + Math.floor(item.quantity)) > product.minimumStock) ? 'In Stock' : 'Low Stock'
            }
          });

          await prisma.stockMovement.create({
            data: {
              productId: item.productId,
              type: 'IN',
              quantity: Math.floor(item.quantity),
              warehouseId: warehouseId!,
              referenceType: 'PURCHASE_ORDER',
              referenceId: po.number,
              cost: product.costPrice,
              createdBy: userId,
              date: new Date()
            }
          });
        }
      }
    }

    // Refresh PO to check status
    const updatedPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });

    const allReceived = updatedPO?.items.every(i => i.receivedQuantity >= i.quantity);
    const someReceived = updatedPO?.items.some(i => i.receivedQuantity > 0);

    let newStatus = po.status;
    if (allReceived) newStatus = 'Received';
    else if (someReceived) newStatus = 'Partially Received';

    await prisma.purchaseOrder.update({
      where: { id },
      data: { status: newStatus }
    });

    await auditLog(userId, 'CREATE_RECEIPT', 'PURCHASE', `Created Receipt ${receipt.number} for PO ${po.number}`);

    return receipt;
  });

  createBillFromPO = this.handleRequest(async (req: Request) => {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;

    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!po) throw new Error('PO not found');

    const billNumber = await getAndIncrementNextNumber('bill');

    const bill = await prisma.vendorBill.create({
      data: {
        number: billNumber,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        purchaseOrderId: po.id,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        currency: po.currency || "USD",
        subtotal: po.subtotal,
        taxAmount: po.taxAmount,
        discountAmount: po.discountAmount,
        totalAmount: po.totalAmount,
        paidAmount: 0,
        balance: po.totalAmount,
        status: 'unpaid',
        notes: `Billed from PO ${po.number}`,
        createdBy: userId,
        items: {
          create: po.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxPercent: item.taxPercent,
            taxAmount: item.taxAmount,
            discountPercent: 0, // Reset or map from PO if applicable
            discountAmount: item.discountAmount,
            lineTotal: item.totalAmount
          }))
        }
      },
      include: {
        items: true
      }
    });

    await auditLog(userId, 'CREATE_BILL', 'PURCHASE', `Created Bill ${bill.number} from PO ${po.number}`);

    return bill;
  });
}
