import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Truck, 
  CreditCard, 
  MoreHorizontal, 
  Calendar, 
  Building2, 
  Package, 
  Clock, 
  User, 
  CheckCircle2, 
  XSquare, 
  AlertCircle,
  Hash,
  ChevronRight,
  Receipt,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  calculateLineTotal, 
  calculateProcurementTotals, 
  formatCurrency 
} from "@/lib/procurement-calculations";

export default function PurchaseOrderViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [po, setPo] = useState<any>(null);

  useEffect(() => {
    fetchPO();
  }, [id]);

  const fetchPO = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase/orders/${id}`);
      setPo(response.data);
    } catch (error) {
      console.error("Fetch PO error:", error);
      toast.error("Failed to load Purchase Order");
      navigate("/purchase/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await api.put(`/purchase/orders/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchPO();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateBill = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/purchase/orders/${id}/create-bill`);
      toast.success("Bill created successfully");
      // Redirect to Bill view or refresh?
      fetchPO();
    } catch (error) {
      toast.error("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!po) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">
        <Link to="/purchase/orders" className="hover:text-indigo-600 transition-colors">Purchase Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-800">{po.number}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-soft border border-slate-100">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase/orders")}
            className="rounded-full hover:bg-slate-100 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{po.number}</h1>
              <Badge className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-none shadow-sm",
                po.status === "Received" ? "bg-emerald-100 text-emerald-700" : 
                po.status === "Partially Received" ? "bg-amber-100 text-amber-700" : 
                po.status === "Sent" ? "bg-blue-100 text-blue-700" :
                po.status === "Cancelled" ? "bg-rose-100 text-rose-700" :
                "bg-slate-100 text-slate-500"
              )}>
                {po.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs text-slate-500 flex items-center gap-1.5 italic">
                <Building2 className="h-3.5 w-3.5" /> <span className="font-bold text-slate-700">{po.vendorName}</span>
              </p>
              <Separator orientation="vertical" className="h-3 shadow-none" />
              <p className="text-xs text-slate-500 flex items-center gap-1.5 italic">
                <Calendar className="h-3.5 w-3.5" /> Created on <span className="font-bold text-slate-700">{format(new Date(po.issueDate), "MMM dd, yyyy")}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold gap-2 text-xs">
            <Printer className="h-3.5 w-3.5 text-slate-400" /> Print PO
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold gap-2 text-xs">
            <Download className="h-3.5 w-3.5 text-slate-400" /> PDF
          </Button>
          
          <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block shadow-none" />

          {po.status !== "Received" && po.status !== "Cancelled" && (
            <Button 
              size="sm"
              onClick={() => navigate(`/purchase/orders/${id}/receive`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-bold gap-2 text-xs"
            >
              <Truck className="h-3.5 w-3.5" /> Receive
            </Button>
          )}

          {po.status !== "Received" && po.status !== "Cancelled" && (
            <Button 
              size="sm"
              onClick={handleCreateBill}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 font-bold gap-2 text-xs"
            >
              <Receipt className="h-3.5 w-3.5" /> Create Bill
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-slate-100 shadow-xl">
              <DropdownMenuItem onClick={() => navigate(`/purchase/orders/${id}/edit`)} className="font-bold text-xs gap-2 py-2">
                <FileText className="h-3.5 w-3.5" /> Edit Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Cancelled")} className="font-bold text-xs gap-2 py-2 text-rose-600">
                <XSquare className="h-3.5 w-3.5" /> Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-tighter">
                <Package className="h-4 w-4 text-indigo-600" /> Ordered Products
              </h3>
              <Badge variant="outline" className="bg-white text-slate-500 font-bold text-[10px] uppercase tracking-widest border-slate-200">
                {po.items?.length || 0} Positions
              </Badge>
            </div>
            <CardContent className="p-0">
               <div className="overflow-x-auto text-[13px]">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 bg-white">
                       <th className="px-6 py-4">Product Details</th>
                       <th className="px-4 py-4 text-center">Qty</th>
                       <th className="px-4 py-4 text-center">Received</th>
                       <th className="px-4 py-4 text-right">Unit Price</th>
                       <th className="px-4 py-4 text-center">Tax</th>
                       <th className="px-4 py-4 text-center">Disc</th>
                       <th className="px-6 py-4 text-right">Line Total</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {(!po.items || po.items.length === 0) ? (
                       <tr>
                         <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                            No products added to this order yet.
                         </td>
                       </tr>
                     ) : (
                       po.items.map((item: any) => {
                         const lineDetails = calculateLineTotal({
                           quantity: item.quantity,
                           unitPrice: item.unitPrice,
                           taxPercent: item.taxPercent,
                           discountType: item.discountType || 'Fixed',
                           discountValue: item.discountValue || 0
                         });
                         
                         return (
                           <tr key={item.id} className="hover:bg-slate-50/20 transition-colors group">
                             <td className="px-6 py-4">
                               <div className="flex flex-col">
                                 <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.productName}</span>
                                 <span className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">{item.description || "No description"}</span>
                               </div>
                             </td>
                             <td className="px-4 py-4 text-center font-bold text-slate-600">{item.quantity}</td>
                             <td className="px-4 py-4 text-center">
                                <Badge className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 border-none shadow-none",
                                  item.receivedQuantity >= item.quantity ? "bg-emerald-50 text-emerald-600" :
                                  item.receivedQuantity > 0 ? "bg-amber-50 text-amber-600" :
                                  "bg-slate-50 text-slate-400"
                                )}>
                                  {item.receivedQuantity || 0}
                                </Badge>
                             </td>
                             <td className="px-4 py-4 text-right font-mono text-slate-500">
                               {formatCurrency(item.unitPrice, po.currency)}
                             </td>
                             <td className="px-4 py-4 text-center text-slate-400 font-medium">
                               {item.taxPercent > 0 ? `${item.taxPercent}%` : "-"}
                             </td>
                             <td className="px-4 py-4 text-center text-rose-400 font-medium whitespace-nowrap">
                               {lineDetails.discountAmount > 0 ? `-${formatCurrency(lineDetails.discountAmount, po.currency)}` : "-"}
                             </td>
                             <td className="px-6 py-4 text-right font-black text-slate-800 font-mono">
                               {formatCurrency(lineDetails.lineTotal, po.currency)}
                             </td>
                           </tr>
                         );
                       })
                     )}
                   </tbody>
                 </table>
               </div>
            </CardContent>
            
            <div className="bg-slate-50/50 p-6 flex flex-col md:flex-row justify-end border-t border-slate-100">
               <div className="w-full md:w-80 space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sub Total</span>
                    <span className="font-bold text-slate-700 font-mono tracking-tight">{formatCurrency(po.subtotal, po.currency)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Tax</span>
                    <span className="font-bold text-slate-700 font-mono tracking-tight">{formatCurrency(po.taxAmount, po.currency)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Discount</span>
                    <span className="font-bold text-rose-500 font-mono tracking-tight">-{formatCurrency(po.discountAmount, po.currency)}</span>
                  </div>
                  <Separator className="bg-slate-200" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Grand Total</span>
                    <span className="text-2xl font-black text-indigo-600 font-mono tracking-tighter">
                      {formatCurrency(po.totalAmount, po.currency)}
                    </span>
                  </div>
               </div>
            </div>
          </Card>

          {/* Related Goods Receipts */}
          {po.receipts && po.receipts.length > 0 && (
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden mt-6">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600" /> Goods Receipts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                        <th className="px-6 py-3">Receipt #</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Received By</th>
                        <th className="px-4 py-3 text-right">Items</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {po.receipts.map((gr: any) => (
                        <tr key={gr.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="px-6 py-4 font-bold text-indigo-600 italic underline underline-offset-4 decoration-indigo-100">{gr.number}</td>
                          <td className="px-4 py-4 text-slate-500 font-medium">
                            {format(new Date(gr.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-4 text-slate-700 font-bold">{gr.receivedBy || "System"}</td>
                          <td className="px-4 py-4 text-right">
                             <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">{gr.items?.length || 0} Items</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Linked Bills */}
          {po.bills && po.bills.length > 0 && (
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden mt-6">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-600" /> Linked Vendor Bills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                        <th className="px-6 py-3">Bill #</th>
                        <th className="px-4 py-3">Issue Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Total Amount</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {po.bills.map((bill: any) => (
                        <tr key={bill.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="px-6 py-4 font-bold text-emerald-600 italic underline underline-offset-4 decoration-emerald-100">{bill.number}</td>
                          <td className="px-4 py-4 text-slate-500 font-medium">
                            {format(new Date(bill.issueDate), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-4">
                             <Badge className={cn(
                               "text-[9px] font-bold uppercase py-0.5 px-2 border-none italic",
                               bill.status === "paid" ? "bg-emerald-50 text-emerald-600" : 
                               bill.status === "unpaid" ? "bg-red-50 text-red-600" :
                               "bg-slate-100 text-slate-400"
                             )}>
                               {bill.status}
                             </Badge>
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-slate-800 font-mono">
                             {bill.totalAmount.toLocaleString('en-US', { style: 'currency', currency: po.currency })}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-rose-600 font-mono">
                             {bill.balance.toLocaleString('en-US', { style: 'currency', currency: po.currency })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white border border-slate-100">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Order Logistics</h3>
            </div>
            <CardContent className="p-6 space-y-5">
               <div className="space-y-4">
                  <div className="flex items-start gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Date</p>
                      <p className="text-sm font-bold text-slate-700 italic">{format(new Date(po.issueDate), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0 group-hover:scale-110 transition-transform">
                      <Truck className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Delivery</p>
                      <p className="text-sm font-bold text-slate-700 italic">
                        {po.expectedDelivery ? format(new Date(po.expectedDelivery), 'MMMM dd, yyyy') : "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 group-hover:scale-110 transition-transform">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor Liaison</p>
                      <p className="text-sm font-bold text-slate-700 italic">{po.vendor?.contactPerson || "In-charge"}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="flex items-start gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                      <Hash className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between w-full">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</p>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[9px] font-bold h-4 px-1.5">{po.currency}</Badge>
                      </div>
                      <p className="text-sm font-bold text-slate-700 italic">Standard {po.currency} Format</p>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white border border-slate-100">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Terms</h3>
            </div>
            <CardContent className="p-6">
               <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
                 <p className="text-[11px] text-slate-500 leading-relaxed italic">
                   {po.terms || "Standard trade terms: Net 30 days. Please include PO number on all shipping labels and invoices."}
                 </p>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white border border-slate-100">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Instructional Notes</h3>
            </div>
            <CardContent className="p-6">
               <div className="flex gap-3">
                 <FileText className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                 <p className="text-[11px] text-slate-500 leading-relaxed italic">
                   {po.notes || "No special internal handling instructions for this procurement request."}
                 </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
