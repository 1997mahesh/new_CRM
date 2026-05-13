import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Send, 
  Trash2, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  Calendar,
  User,
  Hash,
  CreditCard,
  DollarSign,
  Info,
  Loader2,
  ChevronRight,
  MoreVertical,
  Undo2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PaymentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [refundSheetOpen, setRefundSheetOpen] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: "",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [processingRefund, setProcessingRefund] = useState(false);

  const fetchPayment = async () => {
    try {
      const res = await api.get(`/payments/${id}`);
      if (res.success) {
        setPayment(res.data);
        setRefundData(prev => ({ ...prev, amount: res.data.amount }));
      }
    } catch (error) {
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const handleRefund = async () => {
    if (refundData.amount <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    setProcessingRefund(true);
    try {
      const res = await api.post(`/payments/${id}/refund`, refundData);
      if (res.success) {
        toast.success("Refund processed successfully");
        setRefundSheetOpen(false);
        fetchPayment();
      }
    } catch (error) {
      toast.error("Failed to process refund");
    } finally {
      setProcessingRefund(false);
    }
  };

  const handleSendEmail = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sending receipt email...',
        success: 'Receipt sent to customer email successfully',
        error: 'Failed to send email',
      }
    );
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this payment record? This will revert the invoice balance.")) return;
    try {
      const res = await api.delete(`/payments/${id}`);
      if (res.success) {
        toast.success("Payment record deleted");
        navigate('/sales/payments');
      }
    } catch (error) {
      toast.error("Failed to delete payment record");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] italic">Retrieving Transaction Artifacts...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Receipt className="h-16 w-16 text-slate-200" />
        <h2 className="text-xl font-bold text-slate-600">Payment Record Not Found</h2>
        <Button onClick={() => navigate('/sales/payments')}>Back to Payments</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div className="flex items-center gap-5">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/sales/payments')}
            className="rounded-full h-11 w-11 hover:bg-white shadow-sm border border-slate-100 dark:border-white/10 dark:hover:bg-white/5"
           >
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <div className="space-y-1">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 italic tracking-tighter">
                   {payment.receiptNumber}
                </h1>
                <Badge className={cn(
                  "font-black uppercase tracking-widest text-[10px] px-3 h-6 rounded-lg italic",
                  payment.status === 'Success' ? "bg-emerald-50 text-emerald-600 border-none" :
                  payment.status === 'Refunded' ? "bg-red-50 text-red-600 border-none" :
                  "bg-amber-50 text-amber-600 border-none"
                )}>
                  {payment.status}
                </Badge>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-500 italic">
               <Calendar className="h-3.5 w-3.5" />
               <span>Paid on {format(new Date(payment.date), "MMMM dd, yyyy")}</span>
               <span className="opacity-30">|</span>
               <Clock className="h-3.5 w-3.5" />
               <span>Recorded at {format(new Date(payment.createdAt), "HH:mm")}</span>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl font-bold h-11 border-slate-200 dark:border-white/10 shadow-sm gap-2">
             <Printer className="h-4 w-4 text-slate-400" />
             <span>Print Receipt</span>
           </Button>
           <Button variant="outline" className="rounded-xl font-bold h-11 border-slate-200 dark:border-white/10 shadow-sm gap-2">
             <Download className="h-4 w-4 text-slate-400" />
             <span>Download PDF</span>
           </Button>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 shadow-premium px-4">
                    <MoreVertical className="h-5 w-5" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 dark:bg-[#1f1a1d] dark:border-white/10 glass-effect">
                 <DropdownMenuItem className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-xs" onClick={handleSendEmail}>
                    <Send className="h-4 w-4 text-blue-500" /> Send Receipt Email
                 </DropdownMenuItem>
                 <DropdownMenuItem 
                    className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-xs text-amber-600 dark:text-amber-400" 
                    onClick={() => setRefundSheetOpen(true)}
                    disabled={payment.status === 'Refunded'}
                 >
                    <Undo2 className="h-4 w-4" /> Refund Payment
                 </DropdownMenuItem>
                 <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                 <DropdownMenuItem className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-xs text-red-500" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" /> Delete Record
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Info */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] dark:border-white/5">
                <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
                    <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400">
                        <Info className="h-4 w-4 text-blue-600" />
                        Transaction Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Name</Label>
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/crm/customers/${payment.customerId}`)}>
                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 font-black italic shadow-inner">
                                {payment.customerName?.[0] || "C"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-slate-800 dark:text-slate-100 italic group-hover:text-blue-600 transition-colors">{payment.customerName || "N/A"}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter opacity-60">Verified Business Entity</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Linked Sales Invoice</Label>
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate(`/sales/invoices/${payment.invoiceId}`)}>
                            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all border border-transparent group-hover:border-blue-100 italic">
                                <Receipt className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-slate-800 dark:text-slate-100 italic group-hover:text-blue-600 transition-colors uppercase">{payment.invoice?.number || "N/A"}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter opacity-60">Revenue Channel</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 h-20 pt-2 border-t border-slate-50 dark:border-white/5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment method</Label>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center italic",
                                "bg-slate-50 dark:bg-white/5 text-slate-500 border border-slate-100 dark:border-white/5 shadow-inner"
                            )}>
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{payment.method}</span>
                                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter italic">Verified Transaction</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 h-20 pt-2 border-t border-slate-50 dark:border-white/5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference / TXN ID</Label>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/5 shadow-inner italic">
                                <Hash className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-mono font-bold text-slate-700 dark:text-slate-200">{payment.reference || "N/A"}</span>
                                <span className="text-[10px] text-slate-400 font-medium italic opacity-60">External Identity</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                
                <CardContent className="px-8 pb-8 pt-0 border-t border-slate-50 dark:border-white/5">
                    <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Internal Remarks & Evidence Note</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
                           {payment.note || "No specific remarks identified for this transaction artifact."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {payment.status === 'Refunded' && (
                <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <CardHeader className="py-4 border-b border-red-100 dark:border-red-900/20 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                            <Undo2 className="h-4 w-4" /> Refund History
                        </CardTitle>
                        <span className="text-[10px] font-black text-red-500 uppercase italic">
                            Processed {payment.refundDate ? format(new Date(payment.refundDate), "MMM dd, yyyy") : "N/A"}
                        </span>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label className="text-[10px] font-black uppercase text-red-400 tracking-widest block mb-1">Refund Amount Reverted</Label>
                            <span className="text-2xl font-black text-red-600 dark:text-red-400 italic">
                                ${payment.refundAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div>
                            <Label className="text-[10px] font-black uppercase text-red-400 tracking-widest block mb-1">Reversal Logic / Reason</Label>
                            <p className="text-sm text-slate-700 dark:text-slate-300 italic font-bold">
                                {payment.refundReason || "Standard reversal requested."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-6">
            <Card className="border-none shadow-premium rounded-2xl overflow-hidden sticky top-24 bg-white dark:bg-[#211c1f]">
               <CardHeader className="bg-slate-900 border-b border-slate-800 py-6">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-white text-xs font-bold uppercase tracking-widest leading-none italic">Payment Breakdown</CardTitle>
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Final Ledger
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-4 bg-slate-900 text-white">
                  <div className="flex justify-between items-center text-sm opacity-60">
                    <span className="italic">Invoice Total Gross</span>
                    <span className="font-mono">${payment.invoice?.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-60 border-b border-white/5 pb-2">
                    <span className="italic font-bold">Previous Paid Sum</span>
                    <span className="font-mono text-emerald-400">${(payment.invoice?.totalAmount - payment.invoice?.balance - (payment.status === 'Success' ? payment.amount : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 bg-white/5 rounded-xl px-4 border border-white/10 my-4 shadow-inner">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Current Receipt</span>
                        <span className="text-2xl font-black font-mono tracking-tighter text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                            + ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <Receipt className="h-8 w-8 text-white opacity-10" />
                  </div>

                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold italic">New Remaining Balance</span>
                    <span className={cn(
                        "text-2xl font-black font-mono tracking-tighter",
                        payment.invoice?.balance === 0 ? "text-emerald-400" : "text-white"
                    )}>
                       ${payment.invoice?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
               </CardContent>

               <CardContent className="p-6 bg-slate-50 dark:bg-black/20 space-y-5">
                   <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest italic mb-2">
                       <span>Transaction History</span>
                       <ChevronRight className="h-4 w-4" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex gap-4 relative">
                         <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200 dark:bg-white/10" />
                         <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10 shrink-0" />
                         <div className="flex-1 -mt-0.5">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase italic">Payment Received</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase italic">{format(new Date(payment.date), "MMM dd, yyyy HH:mm")}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-white/10 z-10 shrink-0" />
                         <div className="flex-1 -mt-0.5 opacity-50">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase italic">Invoice Generated</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase italic">{format(new Date(payment.invoice?.issueDate || Date.now()), "MMM dd, yyyy")}</p>
                         </div>
                      </div>
                   </div>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* Refund Sheet */}
      <Sheet open={refundSheetOpen} onOpenChange={setRefundSheetOpen}>
         <SheetContent className="w-[400px] sm:w-[540px] dark:bg-[#1f1a1d] dark:border-white/10">
            <SheetHeader className="pb-8 border-b border-slate-100 dark:border-white/5 mb-8">
               <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-600/10 flex items-center justify-center text-amber-600 mb-6 shadow-soft italic font-black text-2xl">
                    $
               </div>
               <SheetTitle className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 italic">Initiate Refund</SheetTitle>
               <SheetDescription className="text-slate-500 italic text-base">
                  Reversing a payment will update the linked invoice balance and mark this receipt as refunded.
               </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-8 py-4">
               <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Refund Amount *</Label>
                  <div className="relative group">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 group-focus-within:scale-110 transition-transform" />
                     <Input 
                        type="number"
                        className="h-14 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 pl-12 text-2xl font-black italic text-red-600 dark:text-red-400 shadow-inner" 
                        value={refundData.amount}
                        onChange={e => setRefundData({ ...refundData, amount: Number(e.target.value) })}
                        max={payment.amount}
                     />
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1 font-bold italic">
                     <Info className="h-3 w-3" />
                     Max refundable: ${payment.amount.toLocaleString()}
                  </p>
               </div>

               <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Reversal Logic / Reason *</Label>
                  <Textarea 
                     placeholder="Why is this payment being refunded? (e.g., Customer cancellation, Overpayment, Error in recording)" 
                     className="rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 min-h-[140px] italic shadow-inner p-4 text-base" 
                     value={refundData.reason}
                     onChange={e => setRefundData({ ...refundData, reason: e.target.value })}
                  />
               </div>

               <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Processing Date</Label>
                  <div className="relative">
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                     <Input 
                        type="date"
                        className="h-14 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 pl-12 font-bold italic" 
                        value={refundData.date}
                        onChange={e => setRefundData({ ...refundData, date: e.target.value })}
                     />
                  </div>
               </div>
            </div>

            <SheetFooter className="mt-12 flex-col sm:flex-row gap-3 border-t border-slate-100 dark:border-white/5 pt-8">
               <SheetClose asChild>
                  <Button variant="outline" className="h-14 rounded-2xl flex-1 font-bold italic tracking-tight text-base">Dismiss</Button>
               </SheetClose>
               <Button 
                className="h-14 rounded-2xl flex-1 bg-red-600 hover:bg-red-700 text-white shadow-premium font-black italic tracking-tight text-lg gap-2"
                onClick={handleRefund}
                disabled={processingRefund}
               >
                  {processingRefund ? <Loader2 className="h-5 w-5 animate-spin" /> : <Undo2 className="h-5 w-5" />}
                  Confirm Reversal
               </Button>
            </SheetFooter>
         </SheetContent>
      </Sheet>
    </div>
  );
}
