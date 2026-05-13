import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Calendar as CalendarIcon,
  User,
  FileText,
  Hash,
  Loader2,
  DollarSign,
  Send,
  Info,
  CreditCard,
  Building2,
  Receipt,
  Wallet,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";

export default function PaymentCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceId: "",
    amount: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    method: "Bank Transfer",
    reference: "",
    note: "",
    status: "Success"
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const custRes = await api.get('/customers');
        if (custRes.success) setCustomers(custRes.data);
      } catch (error) {
        toast.error("Failed to load required data");
      } finally {
        setFetching(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!formData.customerId) {
      setInvoices([]);
      return;
    }

    const fetchInvoices = async () => {
      try {
        const invRes = await api.get(`/invoices?status=partial,sent,overdue&customerId=${formData.customerId}&limit=100`);
        if (invRes.success) {
          setInvoices(invRes.data.items || []);
        }
      } catch (error) {
        toast.error("Failed to load customer invoices");
      }
    };

    fetchInvoices();
  }, [formData.customerId]);

  const filteredInvoices = useMemo(() => {
    return invoices;
  }, [invoices]);

  const selectedInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === formData.invoiceId);
  }, [formData.invoiceId, invoices]);

  const calculations = useMemo(() => {
    if (!selectedInvoice) return { total: 0, alreadyPaid: 0, remaining: 0, newRemaining: 0, progress: 0 };
    const total = selectedInvoice.totalAmount;
    const balance = selectedInvoice.balance;
    const alreadyPaid = total - balance;
    const newRemaining = balance - (Number(formData.amount) || 0);
    const progress = total > 0 ? ((alreadyPaid + (Number(formData.amount) || 0)) / total) * 100 : 0;
    
    return {
      total,
      alreadyPaid,
      remaining: balance,
      newRemaining: newRemaining < 0 ? 0 : newRemaining,
      progress: progress > 100 ? 100 : progress
    };
  }, [selectedInvoice, formData.amount]);

  const handleSubmit = async (isComplete = true) => {
    if (!formData.invoiceId || formData.amount <= 0) {
      toast.error("Please select an invoice and enter a valid amount");
      return;
    }

    setLoading(true);
    try {
        const payload = {
            ...formData,
            status: isComplete ? 'Success' : 'Pending'
        };
      const res = await api.post('/payments', payload);
      if (res.success) {
        toast.success(isComplete ? "Payment registered successfully" : "Payment draft saved");
        navigate('/sales/payments');
      }
    } catch (error) {
      toast.error("Failed to register payment");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Payment Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white shadow-sm border border-slate-100 dark:border-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              Register Payment
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Record cash, bank, or online receipts against customer invoices.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6 font-bold h-11 border-slate-200 dark:border-white/10">
            Cancel
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleSubmit(false)} 
            disabled={loading}
            className="rounded-xl px-6 font-bold h-11 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-500/20"
          >
             <Save className="h-4 w-4 mr-2" />
             Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-premium h-11 font-bold gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Complete Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] dark:border-white/5">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
               <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                 <User className="h-4 w-4 text-blue-600" />
                 Payment Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Customer *</Label>
                   <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val, invoiceId: "" })}>
                     <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                       <SelectValue placeholder="Identify client..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl overflow-hidden">
                       {customers.map(c => (
                         <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Link to Invoice *</Label>
                   <Select value={formData.invoiceId} onValueChange={(val) => {
                       const inv = invoices.find(i => i.id === val);
                       setFormData({ ...formData, invoiceId: val, amount: inv?.balance || 0 });
                   }} disabled={!formData.customerId}>
                     <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                       <SelectValue placeholder={formData.customerId ? "Choose invoice..." : "Select customer first"} />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl overflow-hidden">
                        {filteredInvoices.length > 0 ? (
                          filteredInvoices.map(inv => (
                            <SelectItem key={inv.id} value={inv.id}>
                               {inv.number} - Balance: ${inv.balance.toLocaleString()} ({inv.status})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-6 text-center space-y-2">
                             <p className="text-xs font-bold text-slate-400 italic">No outstanding invoices found for this customer.</p>
                             <p className="text-[10px] text-slate-400">Only partial, sent, or overdue invoices appear here.</p>
                          </div>
                        )}
                      </SelectContent>
                   </Select>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Amount *</Label>
                    <div className="relative">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                       <Input 
                         type="number"
                         className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 pl-10 font-bold text-lg text-emerald-600 dark:text-emerald-400" 
                         value={formData.amount}
                         onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                         max={selectedInvoice?.balance || 0}
                       />
                    </div>
                    {selectedInvoice && (
                        <p className="text-[10px] text-slate-400 italic ml-1 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Suggested: Full balance of ${selectedInvoice.balance.toLocaleString()}
                        </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Date</Label>
                    <div className="relative">
                       <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input 
                         type="date"
                         className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 pl-10" 
                         value={formData.date}
                         onChange={e => setFormData({ ...formData, date: e.target.value })}
                       />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment Method</Label>
                    <Select value={formData.method} onValueChange={(val) => setFormData({ ...formData, method: val })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl overflow-hidden">
                        {[
                          { label: "Bank Transfer", icon: Building2 },
                          { label: "Cash", icon: DollarSign },
                          { label: "UPI", icon: Hash },
                          { label: "Credit Card", icon: CreditCard },
                          { label: "Debit Card", icon: CreditCard },
                          { label: "PayPal", icon: Receipt },
                          { label: "Cheque", icon: FileText },
                        ].map(m => (
                          <SelectItem key={m.label} value={m.label}>
                             <div className="flex items-center gap-2">
                                <m.icon className="h-3.5 w-3.5" />
                                {m.label}
                             </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Reference Number</Label>
                    <div className="relative">
                       <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input 
                         placeholder="TXN ID, Check #, etc." 
                         className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 pl-10 italic" 
                         value={formData.reference}
                         onChange={e => setFormData({ ...formData, reference: e.target.value })}
                       />
                    </div>
                  </div>
               </div>

               <div className="space-y-2 pt-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Notes / Internal Remarks</Label>
                  <Textarea 
                    placeholder="Add any specific details about this transaction..." 
                    className="rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 min-h-[100px] italic shadow-inner" 
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                  />
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-premium rounded-2xl overflow-hidden sticky top-24 bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-900 border-b border-slate-800 py-6">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xs font-bold uppercase tracking-widest leading-none">Payment Summary</CardTitle>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                     Live Balance
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-slate-900 text-white">
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span className="italic">Invoice Total</span>
                 <span className="font-mono">${calculations.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span className="italic">Amount Already Paid</span>
                 <span className="font-mono text-emerald-400">${calculations.alreadyPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="h-px bg-white/10 my-2" />
               <div className="flex justify-between items-center text-sm">
                 <span className="italic font-bold">Current Payment</span>
                 <span className="font-bold text-blue-400 font-mono tracking-tighter text-lg">
                    + ${formData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
               </div>
               <div className="h-px bg-white/10 my-2" />
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold italic">New Remaining Balance</span>
                 <span className={cn(
                     "text-2xl font-bold font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]",
                     calculations.newRemaining === 0 ? "text-emerald-400" : "text-white"
                 )}>
                    ${calculations.newRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
               </div>

               {/* Progress Bar */}
               <div className="pt-4 space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Payment Progress</span>
                    <span>{Math.round(calculations.progress)}%</span>
                 </div>
                 <Progress value={calculations.progress} className="h-1.5 bg-white/5" indicatorClassName="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all" />
               </div>
            </CardContent>
            
            <CardContent className="p-6 bg-slate-50 dark:bg-black/20 space-y-5">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 underline decoration-blue-500/30 underline-offset-4 font-bold">Invoice Status Preview</Label>
                 <div className="p-4 bg-white dark:bg-[#1f1a1d] rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 italic font-bold">Post-Payment Status</span>
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]">
                        {calculations.newRemaining === 0 ? (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-600">Fully Paid</span>
                            </>
                        ) : (
                            <>
                                <Loader2 className="h-3.5 w-3.5 text-blue-500 animate-spin" />
                                <span className="text-blue-600">Partial Payment</span>
                            </>
                        )}
                    </div>
                 </div>
               </div>

               <div className="pt-2">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-600/5 rounded-xl border border-blue-100 dark:border-blue-500/10 shadow-sm font-bold">
                     <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                     <p className="text-[10px] font-medium text-blue-700 dark:text-blue-400 leading-relaxed italic">
                        The remaining balance will be automatically adjusted on the invoice. You can download the receipt after completion.
                     </p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
