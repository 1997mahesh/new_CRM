import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  MoreHorizontal, 
  Receipt, 
  Building2, 
  Calendar as CalendarIcon, 
  Mail, 
  FileText, 
  Package, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  CreditCard,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  User as UserIcon,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BillViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
      amount: 0,
      paymentMethod: "Bank Transfer",
      paymentDate: new Date().toISOString().split('T')[0],
      referenceNo: "",
      notes: ""
  });

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase/bills/${id}`);
      setBill(response.data);
      setPaymentData(prev => ({ ...prev, amount: response.data.balance }));
    } catch (error) {
      toast.error("Failed to load Bill details");
      navigate("/purchase/bills");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
      try {
          if (paymentData.amount <= 0) {
              toast.error("Payment amount must be greater than zero");
              return;
          }
          await api.post(`/purchase/bills/${id}/payments`, paymentData);
          toast.success("Payment recorded successfully");
          setPaymentDialogOpen(false);
          fetchBill();
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to record payment");
      }
  };

  const handleVoid = async () => {
      if (!confirm("Are you sure you want to void this bill? This action cannot be undone.")) return;
      try {
          await api.post(`/purchase/bills/${id}/void`);
          toast.success("Bill marked as void");
          fetchBill();
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to void bill");
      }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bill? This action cannot be undone.")) return;
    try {
        await api.delete(`/purchase/bills/${id}`);
        toast.success("Bill deleted successfully");
        navigate("/purchase/bills");
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete bill");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return "bg-emerald-50 text-emerald-600 shadow-emerald-100/50";
      case 'overdue': return "bg-red-50 text-red-600 shadow-red-100/50";
      case 'partial':
      case 'partially paid': return "bg-amber-50 text-amber-600 shadow-amber-100/50";
      case 'unpaid': return "bg-slate-100 text-slate-500 shadow-slate-100/50 font-bold";
      case 'void': return "bg-slate-200 text-slate-400 line-through font-bold grayscale";
      default: return "bg-slate-100 text-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Receipt className="h-12 w-12 text-slate-200 animate-pulse" />
        <p className="text-slate-400 italic animate-pulse">Loading Bill details...</p>
      </div>
    );
  }

  if (!bill) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase/bills")}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 italic tracking-tighter">
                {bill.number}
              </h1>
              <Badge className={cn(
                "text-[10px] font-bold uppercase py-0.5 px-3 border-none h-6 tracking-widest italic shadow-sm",
                getStatusColor(bill.status)
              )}>
                {bill.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 italic">
              <span className="flex items-center gap-1 font-bold">
                 <Building2 className="h-3.5 w-3.5 text-emerald-600" /> {bill.vendorName || bill.vendor?.name}
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span>Created: {format(new Date(bill.issueDate), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {bill.status !== "void" && bill.status !== "paid" && (
            <Button 
                onClick={() => navigate(`/purchase/bills/${bill.id}/edit`)}
                variant="outline" 
                className="rounded-xl border-slate-200 font-bold gap-2 italic h-10 px-4"
            >
                <Edit2 className="h-4 w-4" />
                Edit Bill
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 shadow-sm">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl dark:bg-[#1f1a1d] dark:border-white/10 shadow-premium p-1">
               <DropdownMenuItem className="text-xs font-bold gap-2 italic p-3 cursor-pointer">
                 <Printer className="h-4 w-4" /> Print Invoice
               </DropdownMenuItem>
               <DropdownMenuItem className="text-xs font-bold gap-2 italic p-3 cursor-pointer">
                 <Download className="h-4 w-4" /> Download PDF
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="text-xs font-bold gap-2 italic p-3 cursor-pointer">
                 <FileText className="h-4 w-4" /> View Ledger
               </DropdownMenuItem>
               <DropdownMenuItem className="text-xs font-bold gap-2 italic p-3 cursor-pointer">
                   <Mail className="h-4 w-4" /> Email to Vendor
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               {bill.status !== "void" && bill.status !== "paid" && (
                 <DropdownMenuItem 
                    onClick={handleVoid}
                    className="text-xs font-bold gap-2 italic p-3 cursor-pointer text-amber-600"
                >
                    <Ban className="h-4 w-4" /> Mark as Void
                 </DropdownMenuItem>
               )}
               {bill.payments.length === 0 && (
                 <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-xs font-bold gap-2 italic p-3 cursor-pointer text-rose-600"
                >
                    <Trash2 className="h-4 w-4" /> Delete Bill
                 </DropdownMenuItem>
               )}
            </DropdownMenuContent>
          </DropdownMenu>

          {bill.balance > 0 && bill.status !== "void" && (
            <Button 
                onClick={() => setPaymentDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-premium font-black gap-2 italic tracking-tight h-10 px-6"
            >
              <CreditCard className="h-4 w-4 text-emerald-200" />
              RECORD PAYMENT
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Main Info Card */}
          <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="p-0 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div className="px-8 py-6 flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg italic font-black flex items-center gap-2">
                           <FileText className="h-5 w-5 text-emerald-600" />
                           BILL DETAILS
                        </CardTitle>
                        <CardDescription className="text-xs italic font-medium">Standard ERP Vendor Invoice</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 italic">Bill Timeline</p>
                     <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 italic font-bold">ISSUE DATE</span>
                           <span className="text-sm font-bold italic text-slate-700 dark:text-slate-300">
                             {format(new Date(bill.issueDate), 'MMMM dd, yyyy')}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 italic font-bold">DUE DATE</span>
                           <span className={cn(
                             "text-sm font-black italic",
                             new Date(bill.dueDate) < new Date() && bill.status !== 'paid' ? "text-red-500" : "text-slate-800 dark:text-slate-200"
                           )}>
                             {format(new Date(bill.dueDate), 'MMMM dd, yyyy')}
                           </span>
                        </div>
                        {bill.status === "paid" && (
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold italic pt-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Fully Paid</span>
                            </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 italic">Vendor Reference</p>
                     <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 italic font-bold">CREDITOR</span>
                           <span className="text-sm font-bold italic text-emerald-600 underline underline-offset-4 decoration-emerald-200 decoration-bold">
                             {bill.vendor?.name}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-400 italic font-bold">DOC NUMBER</span>
                           <span className="text-sm font-mono font-bold italic text-slate-700 dark:text-slate-300">
                             {bill.number}
                           </span>
                        </div>
                        {bill.purchaseOrder && (
                            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold italic pt-1 hover:underline cursor-pointer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>PO: {bill.purchaseOrder.number}</span>
                            </div>
                        )}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 italic">Financial Summary</p>
                     <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">
                            <span>TOTAL AMOUNT</span>
                            <span>${bill.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-rose-400 uppercase italic tracking-widest">BALANCE DUE</span>
                            <span className="text-xl font-black text-white italic tracking-tighter font-mono">
                                ${bill.balance.toLocaleString()}
                            </span>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Line Items Table */}
          <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex flex-row items-center justify-between shrink-0">
               <div className="space-y-1">
                 <CardTitle className="text-lg italic font-black flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-600" />
                    LINE ITEMS
                 </CardTitle>
                 <CardDescription className="text-xs italic font-medium">Billed items and services</CardDescription>
               </div>
               <Badge variant="outline" className="text-[10px] font-bold uppercase shadow-sm border-slate-200 italic">{bill.items?.length || 0} ITEMS</Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/30 border-b border-slate-100 dark:border-white/5">
                        <th className="px-8 py-4">Item Description</th>
                        <th className="px-4 py-4 text-center">Qty</th>
                        <th className="px-4 py-4 text-right">Unit Price</th>
                        <th className="px-4 py-4 text-right">Tax</th>
                        <th className="px-4 py-4 text-right font-black">Line Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                     {bill.items?.map((item: any, idx: number) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                           <td className="px-8 py-5">
                              <div className="flex flex-col gap-0.5">
                                 <span className="font-bold text-slate-900 dark:text-slate-100 italic">{item.productName || item.productId}</span>
                                 {item.description && <span className="text-[10px] text-slate-400 italic line-clamp-1">{item.description}</span>}
                              </div>
                           </td>
                           <td className="px-4 py-5 text-center font-bold text-slate-600 italic">{item.quantity}</td>
                           <td className="px-4 py-5 text-right font-mono text-slate-400 italic">${item.unitPrice?.toLocaleString()}</td>
                           <td className="px-4 py-5 text-right font-mono text-emerald-600 italic">+${item.taxAmount?.toLocaleString()}</td>
                           <td className="px-4 py-5 text-right font-bold text-slate-800 dark:text-slate-200 italic font-mono tracking-tighter">
                              ${item.lineTotal?.toLocaleString()}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>

               <div className="p-8 bg-slate-50/30 dark:bg-white/5 flex flex-col items-end gap-3 text-sm italic">
                  <div className="w-full max-w-[300px] space-y-3">
                     <div className="flex justify-between items-center text-slate-500 font-medium">
                        <span>Subtotal</span>
                        <span className="font-bold font-mono">${bill.subtotal?.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-rose-500 font-bold italic">
                        <span>Total Discount</span>
                        <span className="font-mono">-${bill.discountAmount?.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-emerald-600 font-bold italic">
                        <span>Total Tax</span>
                        <span className="font-mono">+${bill.taxAmount?.toLocaleString()}</span>
                     </div>
                     <Separator className="bg-slate-200" />
                     <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white italic tracking-tighter">
                        <span>TOTAL AMOUNT</span>
                        <span className="font-mono tracking-widest decoration-emerald-500 decoration-double underline decoration-4 underline-offset-4">${bill.totalAmount?.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           {/* Sidebar Info */}
           <Card className="border-none shadow-premium rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f]">
             <CardHeader className="p-6 border-b border-slate-50 dark:border-white/5">
                <CardTitle className="text-sm italic font-black flex items-center gap-2">
                    <History className="h-4 w-4 text-emerald-600" />
                    BILL JOURNEY
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="space-y-6">
                   <div className="relative pl-6 border-l border-slate-100 dark:border-white/10 space-y-8 pb-2">
                       <div className="flex flex-col relative">
                          <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                          <span className="text-[10px] font-black uppercase text-slate-400 italic tracking-widest">Bill Generated</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">{format(new Date(bill.createdAt), 'MMM dd, hh:mm a')}</span>
                          <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400 italic">
                             <UserIcon className="h-2.5 w-2.5" /> By {bill.creator?.firstName || "System"}
                          </div>
                       </div>

                       {bill.payments?.map((payment: any) => (
                           <div key={payment.id} className="flex flex-col relative">
                             <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                             <span className="text-[10px] font-black uppercase text-blue-500 italic tracking-widest">Payment Recorded</span>
                             <span className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">
                               ${payment.amount.toLocaleString()} - {payment.paymentMethod}
                             </span>
                             <span className="text-[9px] text-slate-400 italic">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</span>
                           </div>
                       ))}

                       {bill.status === "void" && (
                           <div className="flex flex-col relative">
                             <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-slate-400 ring-4 ring-slate-50" />
                             <span className="text-[10px] font-black uppercase text-slate-500 italic tracking-widest">Bill Voided</span>
                             <span className="text-xs font-bold text-slate-400 italic">No longer active</span>
                           </div>
                       )}

                       {bill.status === "paid" && (
                            <div className="flex flex-col relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-emerald-50">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-emerald-600 italic tracking-widest">Fully Settled</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">Debt cleared</span>
                            </div>
                       )}
                   </div>

                   <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 italic space-y-3">
                      <div>
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Internal Notes</Label>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{bill.notes || "No internal notes added."}</p>
                      </div>
                      <Separator className="bg-slate-200/50" />
                      <div>
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Terms</Label>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{bill.terms || "Standard payment terms apply."}</p>
                      </div>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-amber-50/50 dark:bg-amber-600/5 border-amber-100">
             <CardContent className="p-6 flex flex-col gap-3 italic">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="font-black text-amber-900 tracking-tight">Need assistance?</h4>
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">Verify vendor banking details before processing payments. Ensure the digital copy matches the received physical invoice.</p>
             </CardContent>
           </Card>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-200">
          <DialogHeader className="p-8 bg-emerald-600 text-white italic">
            <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-2 uppercase">
                <CreditCard className="h-6 w-6" /> Record Payment
            </DialogTitle>
            <DialogDescription className="text-emerald-100 font-medium mt-1">
                Enter payment details for Bill {bill.number}
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-5 bg-white italic">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <Input 
                        type="number"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                        className="pl-7 h-12 rounded-xl border-slate-200 font-black text-lg font-mono text-emerald-600 italic tracking-tighter"
                    />
                </div>
                <p className="text-[10px] text-slate-400 font-bold italic tracking-wider uppercase">BALANCE REMAINING: ${(bill.balance - paymentData.amount).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</Label>
                    <Input 
                        type="date"
                        value={paymentData.paymentDate}
                        onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 font-bold italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Method</Label>
                    <Input 
                        placeholder="e.g. Bank Transfer"
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                        className="h-11 rounded-xl border-slate-200 font-bold italic"
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reference / Check #</Label>
                <Input 
                    placeholder="TRX-987654321..."
                    value={paymentData.referenceNo}
                    onChange={(e) => setPaymentData({ ...paymentData, referenceNo: e.target.value })}
                    className="h-11 rounded-xl border-slate-200 font-bold italic"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Notes</Label>
                <Textarea 
                    placeholder="Optional message..."
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    className="rounded-xl border-slate-200 italic font-medium min-h-[80px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 gap-3 border-t border-slate-100 flex-row">
            <Button variant="ghost" onClick={() => setPaymentDialogOpen(false)} className="rounded-xl font-bold italic text-slate-400 hover:text-slate-600">Cancel</Button>
            <Button onClick={handleRecordPayment} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-premium font-black italic tracking-tight gap-2">
                <CheckCircle2 className="h-4 w-4" /> CONFIRM PAYMENT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
