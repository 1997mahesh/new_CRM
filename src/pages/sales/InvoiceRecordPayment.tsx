import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  X, 
  CreditCard, 
  Calendar as CalendarIcon,
  User,
  FileText,
  Hash,
  Loader2,
  DollarSign,
  Info,
  ChevronRight,
  CheckCircle2,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function InvoiceRecordPaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    method: "Bank Transfer",
    reference: "",
    notes: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        
        if (res.success) {
          setInvoice(res.data);
          // Set initial amount to balance if it's the first time
          setPaymentData(prev => ({ ...prev, amount: res.data.balance || 0 }));
          setPaymentHistory(res.data.payments || []);
        }
      } catch (error) {
        toast.error("Failed to load invoice details");
        navigate(-1);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (paymentData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (paymentData.amount > (invoice?.balance || 0)) {
      toast.error("Amount cannot exceed the current balance");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/invoices/${id}/payment`, {
        amount: paymentData.amount,
        date: paymentData.date,
        method: paymentData.method,
        reference: paymentData.reference,
        note: paymentData.notes
      });
      
      if (res.success) {
        toast.success("Payment recorded successfully");
        navigate(`/sales/invoices/${id}`);
      }
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    if (!invoice) return { total: 0, paid: 0, balance: 0, entered: 0, newBalance: 0 };
    const total = invoice.totalAmount || 0;
    const paid = total - (invoice.balance || 0);
    const entered = paymentData.amount || 0;
    const newBalance = Math.max(0, (invoice.balance || 0) - entered);
    const progress = total > 0 ? ((total - newBalance) / total) * 100 : 0;
    
    return { total, paid, balance: invoice.balance || 0, entered, newBalance, progress };
  }, [invoice, paymentData.amount]);

  const getStatusPreview = () => {
    if (totals.newBalance <= 0) return "Fully Paid";
    if (totals.entered > 0) return "Partially Paid";
    return invoice?.status || "Pending";
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Fetching Invoice Context...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white shadow-sm border border-slate-100 dark:border-white/10 h-12 w-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3 italic">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Record Customer Payment
            </h1>
            <p className="text-sm text-slate-500 font-medium italic mt-1 uppercase tracking-widest opacity-70">
              Process invoice balance collection and reconciliation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="rounded-2xl px-8 font-bold h-12 border-slate-200 dark:border-white/10 uppercase text-[10px] tracking-widest"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 shadow-premium h-12 font-black italic gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-6 px-8">
               <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400 italic">
                 <CreditCard className="h-4 w-4 text-blue-600" />
                 Payment Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Customer (Readonly)</Label>
                   <Input 
                    value={invoice.customerName} 
                    readOnly 
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 dark:bg-white/5 font-bold italic text-slate-500" 
                   />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Invoice Number</Label>
                   <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        value={invoice.number} 
                        readOnly 
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 dark:bg-white/5 font-mono font-bold text-slate-500" 
                      />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Amount *</Label>
                   <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400 font-mono italic group-focus-within:text-blue-600 transition-colors">$</div>
                      <Input 
                        type="number" 
                        max={invoice.balance}
                        placeholder="0.00"
                        className="h-16 pl-12 rounded-[20px] border-slate-100 dark:border-white/5 font-black text-3xl italic text-slate-800 dark:text-white bg-slate-50/50 dark:bg-white/[0.02] focus-visible:ring-blue-500/20 focus-visible:border-blue-600 transition-all shadow-inner" 
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                      />
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic">Maximum Payable</p>
                      <p className="text-[10px] font-black text-blue-600 italic tracking-tight">${(invoice.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                   <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Date *</Label>
                   <div className="relative">
                      <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <Input 
                        type="date" 
                        className="h-16 pl-14 rounded-[20px] border-slate-100 dark:border-white/5 font-bold text-lg text-slate-800 dark:text-white bg-slate-50/50 dark:bg-white/[0.02] focus-visible:ring-blue-500/20" 
                        value={paymentData.date}
                        onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                      />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Method *</Label>
                   <Select value={paymentData.method} onValueChange={(val) => setPaymentData({ ...paymentData, method: val })}>
                     <SelectTrigger className="h-14 rounded-2xl border-slate-100 dark:bg-white/[0.02] font-bold italic shadow-none px-6">
                       <SelectValue placeholder="Select method..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl overflow-hidden border-slate-100 dark:border-white/10">
                       <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                       <SelectItem value="Cash">Cash</SelectItem>
                       <SelectItem value="UPI">UPI / Digital Wallet</SelectItem>
                       <SelectItem value="Credit Card">Credit Card</SelectItem>
                       <SelectItem value="Debit Card">Debit Card</SelectItem>
                       <SelectItem value="Cheque">Cheque</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Reference Number</Label>
                   <Input 
                     placeholder="TXN ID / Cheque No / Reference" 
                     className="h-14 rounded-2xl border-slate-100 dark:bg-white/[0.02] font-bold text-slate-800 dark:text-white px-6" 
                     value={paymentData.reference}
                     onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                   />
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-6 px-8">
               <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400 italic">
                 <FileText className="h-4 w-4" />
                 Internal Notes
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Textarea 
                placeholder="Internal payment note (visible only to staff)..." 
                className="rounded-[20px] border-slate-100 dark:bg-white/[0.02] min-h-[120px] italic px-6 py-4 shadow-inner resize-none" 
                value={paymentData.notes}
                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
              />
              <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-600/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 flex items-start gap-4">
                 <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-[11px] font-medium text-blue-700 dark:text-blue-400 leading-relaxed italic">
                    By recording this payment, the invoice balance will be updated instantly across all dashboards and reports. This action is recorded in the audit trail.
                 </p>
              </div>
            </CardContent>
          </Card>

          {paymentHistory.length > 0 && (
            <Card className="border-none shadow-soft rounded-[32px] overflow-hidden bg-white dark:bg-[#211c1f]">
              <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-6 px-8 flex flex-row items-center justify-between">
                 <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-[0.2em] text-slate-400 italic">
                   <Receipt className="h-4 w-4" />
                   Previous Payments
                 </CardTitle>
                 <span className="text-[10px] font-bold text-slate-400 uppercase italic bg-slate-200 dark:bg-white/5 px-3 py-1 rounded-full">
                   {paymentHistory.length} Record(s) Found
                 </span>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-black uppercase text-slate-400 italic">
                             <th className="px-8 py-5">Date</th>
                             <th className="px-8 py-5 text-center">Method</th>
                             <th className="px-8 py-5 text-right">Amount</th>
                             <th className="px-8 py-5">Reference</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                          {paymentHistory.map((p, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                <td className="px-8 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{format(new Date(p.date), "MMM dd, yyyy")}</span>
                                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Processed Date</span>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-600/10 px-3 py-1 rounded-full italic uppercase border border-blue-100 dark:border-blue-500/20">
                                      {p.method}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-right font-mono font-black text-slate-900 dark:text-white italic">
                                   ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-8 py-5">
                                   <span className="text-xs text-slate-400 font-bold italic truncate max-w-[150px] block">
                                      {p.reference || "No Reference"}
                                   </span>
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

        <div className="space-y-8">
          <Card className="border-none shadow-premium rounded-[32px] overflow-hidden sticky top-24 bg-slate-950 text-white">
            <CardHeader className="bg-slate-900 border-b border-white/5 py-8 px-8">
               <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.2em] italic leading-none">Financial Summary</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     Live Update
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm opacity-50 italic">
                    <span>Total Invoiced</span>
                    <span className="font-mono font-bold">${totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-50 italic">
                    <span>Already Paid</span>
                    <span className="text-emerald-400 font-mono font-bold">${totals.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center p-5 rounded-2xl bg-blue-600/10 border border-blue-400/20 text-blue-400">
                    <span className="text-sm font-bold italic flex items-center gap-2.5">
                       <CreditCard className="h-4 w-4" /> Payment Entered
                    </span>
                    <span className="text-xl font-black font-mono italic tracking-tight">+ ${totals.entered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
               </div>

               <div className="h-px bg-white/10" />

               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] italic">New Balance</span>
                    <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 italic bg-emerald-400/10 px-2 py-0.5 rounded-md">
                       {Math.round(totals.progress)}% Collected
                    </span>
                  </div>
                  <div className="text-5xl font-black italic tracking-tighter text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                     ${totals.newBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>

                  <div className="relative pt-4">
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                        <div 
                           className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                           style={{ width: `${Math.min(100, totals.progress)}%` }}
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4 space-y-4">
                  <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 flex flex-col gap-3 group hover:bg-white/10 transition-colors">
                     <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest leading-none italic">Status After Posting</p>
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                          totals.newBalance <= 0 ? "bg-emerald-400" : "bg-blue-400"
                        )} />
                        <span className="text-2xl font-black italic uppercase tracking-tight text-white">
                           {getStatusPreview()}
                        </span>
                        <ChevronRight className="h-5 w-5 text-white/20 ml-auto group-hover:text-white transition-colors" />
                     </div>
                  </div>

                  <div className="flex items-center gap-3 px-2">
                     <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                     <p className="text-[11px] font-bold text-slate-400 italic">Ledger journals will be created.</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
