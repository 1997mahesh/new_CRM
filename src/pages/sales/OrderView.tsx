import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Printer, 
  Trash2, 
  Calendar,
  User,
  CreditCard,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  ArrowRight,
  Package,
  FileCheck,
  Ban,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400", icon: FileText },
  "Confirmed": { label: "Confirmed", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400", icon: CheckCircle },
  "Processing": { label: "Processing", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400", icon: FileCheck },
  "Shipped": { label: "Shipped", color: "bg-purple-50 text-purple-600 dark:bg-purple-600/10 dark:text-purple-400", icon: Truck },
  "Delivered": { label: "Delivered", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400", icon: Package },
  "Cancelled": { label: "Cancelled", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400", icon: Ban },
};

export default function OrderViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success) setOrder(res.data);
      else toast.error("Failed to fetch order details.");
    } catch (err) {
      toast.error("An error occurred while fetching order.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await api.put(`/orders/${id}`, { status: newStatus });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}.`);
        setOrder(res.data);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.success) {
        toast.success("Order deleted successfully.");
        navigate('/sales/orders');
      }
    } catch (err) {
      toast.error("Failed to delete order.");
    }
  };

  const createInvoice = async () => {
    try {
      const res = await api.post(`/invoices/from-order/${id}`, {});
      if (res.success) {
        toast.success("Invoice created successfully.");
        navigate(`/sales/invoices/${res.data.id}`);
      }
    } catch (err) {
      toast.error("Failed to create invoice.");
    }
  };

  const fulfillOrder = async () => {
    if (!window.confirm("Fulfill this order? This will deduct stock from inventory and mark it as Shipped.")) return;
    try {
      setLoading(true);
      const res = await api.post(`/orders/${id}/fulfill`, {});
      toast.success("Order fulfilled and stock updated successfully.");
      fetchOrder();
    } catch (err: any) {
      toast.error(err.message || "Failed to fulfill order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center font-bold uppercase tracking-widest text-slate-400 italic">Refining Order Data...</div>;
  if (!order) return <div className="p-12 text-center font-bold text-red-500 italic">Order not found.</div>;

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["Draft"];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/sales/orders')}
            className="rounded-xl border border-slate-200 dark:border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white italic uppercase">{order.number}</h1>
              <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest px-3 h-6 border-none", status.color)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">{order.title || 'Sales Order Document'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" className="rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest border-slate-200 dark:border-white/5 gap-2">
                 <span>Update Status</span>
                 <MoreVertical className="h-3.5 w-3.5" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 dark:bg-[#1C1F26] dark:border-white/10">
               <DropdownMenuGroup>
                 <DropdownMenuItem onClick={() => updateStatus("Processing")} className="rounded-lg text-xs font-bold gap-2"><FileCheck className="h-4 w-4 text-indigo-500" /> Start Processing</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => updateStatus("Shipped")} className="rounded-lg text-xs font-bold gap-2"><Truck className="h-4 w-4 text-purple-500" /> Mark Shipped</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => updateStatus("Delivered")} className="rounded-lg text-xs font-bold gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Mark Delivered</DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => updateStatus("Cancelled")} className="rounded-lg text-xs font-bold gap-2 text-red-500"><Ban className="h-4 w-4" /> Cancel Order</DropdownMenuItem>
               </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            className="rounded-xl h-11 w-11 p-0 border-slate-200 dark:border-white/5"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 text-slate-400" />
          </Button>

          <Button 
            className="rounded-xl h-11 px-6 font-bold uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-700 shadow-premium"
            asChild
            nativeButton={false}
          >
            <Link to={`/sales/orders/${order.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> <span>Edit Order</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="p-8">
               <div className="flex justify-between items-start mb-12">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Official Sales Order</span>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bill To</Label>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase italic">{order.customerName}</h2>
                        <p className="text-xs text-slate-500 font-bold italic max-w-xs">{order.customerAddress || 'Client address not specified'}</p>
                     </div>
                  </div>

                  <div className="text-right space-y-6">
                    <div className="space-y-1">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Date</Label>
                       <p className="text-sm font-bold text-slate-800 dark:text-white font-mono italic">
                         {new Date(order.issueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expected Delivery</Label>
                       <p className="text-sm font-bold text-blue-500 font-mono italic">
                         {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'ASAP'}
                       </p>
                    </div>
                  </div>
               </div>

               {/* Line Items Table */}
               <div className="rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden mb-8">
                 <table className="w-full text-sm">
                   <thead>
                      <tr className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                        <th className="py-4 px-6 text-left italic">Description</th>
                        <th className="py-4 px-6 text-center italic">Qty</th>
                        <th className="py-4 px-6 text-right italic">Unit Price</th>
                        <th className="py-4 px-6 text-center italic">Tax %</th>
                        <th className="py-4 px-6 text-right italic">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                     {order.items?.map((item: any, idx: number) => (
                       <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100 italic">{item.description}</td>
                        <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-400 font-mono italic">{item.quantity}</td>
                        <td className="py-4 px-6 text-right font-bold text-slate-600 dark:text-slate-400 font-mono italic">${(item.unitPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-4 px-6 text-center">
                           <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-[9px] font-bold uppercase tracking-tight h-5">{item.taxPercent}%</Badge>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white font-mono italic">${(item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Notes</Label>
                       <p className="p-4 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] text-xs font-medium text-slate-600 dark:text-slate-300 italic min-h-[60px] leading-relaxed">
                         {order.notes || 'No special instructions provided.'}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Terms</Label>
                       <p className="p-4 rounded-xl border border-slate-100 dark:border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">
                         {order.terms || 'Standard 30-day payment terms apply.'}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-center px-4 py-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Subtotal</span>
                        <span className="text-sm font-bold font-mono text-slate-800 dark:text-white italic">${(order.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center px-4 py-2 text-red-500">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Order Discount</span>
                        <span className="text-sm font-bold font-mono italic">-${(order.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center px-4 py-2 text-emerald-500">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">VAT (Tax)</span>
                        <span className="text-sm font-bold font-mono italic">+${(order.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="mt-4 p-6 rounded-2xl bg-slate-900 dark:bg-blue-600 shadow-xl border border-white/10 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 bg-white/5 rounded-full" />
                        <div className="relative flex justify-between items-center">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 italic mb-1">Final Amount Due</p>
                              <p className="text-3xl font-black text-white font-mono tracking-tighter italic">${(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                           </div>
                           <Badge className="bg-white/20 text-white border-none text-[8px] tracking-widest font-black">USD</Badge>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 italic">Next Actions</h3>
            <div className="space-y-2">
              {order.status !== 'Shipped' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <Button 
                    onClick={fulfillOrder}
                    className="w-full justify-start rounded-xl h-11 font-bold italic tracking-tight gap-3 bg-blue-600 hover:bg-blue-700 shadow-premium"
                >
                    <Package className="h-4 w-4" /> <span>Fulfill & Ship</span>
                </Button>
              )}
              <Button 
                onClick={createInvoice}
                className="w-full justify-start rounded-xl h-11 font-bold italic tracking-tight gap-3 bg-emerald-600 hover:bg-emerald-700 shadow-premium"
              >
                <DollarSign className="h-4 w-4" /> <span>Create Invoice</span>
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start rounded-xl h-11 font-bold italic tracking-tight gap-3 border-slate-200 dark:border-white/5"
              >
                <Download className="h-4 w-4" /> <span>Download PDF</span>
              </Button>
              <Button 
                variant="ghost"
                onClick={deleteOrder}
                className="w-full justify-start rounded-xl h-11 font-bold italic tracking-tight gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> <span>Delete Order</span>
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-3 relative">
                  <div className="h-2 w-2 rounded-full mt-1.5 bg-blue-500 shrink-0" />
                  <div className="absolute left-[3.5px] top-[14px] w-[1px] h-[30px] bg-slate-200 dark:bg-white/5" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-white">Order Created</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {order.status !== 'Draft' && (
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full mt-1.5 bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white italic">Confirmed</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Status: {order.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
