import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Send, 
  FileText, 
  Calendar, 
  User, 
  CreditCard,
  Plus,
  MoreVertical,
  Printer,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Trash2,
  Copy,
  Receipt,
  Mail,
  Loader2,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function InvoiceViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/invoices/${id}`);
      if (res.success) {
        setInvoice(res.data);
      }
    } catch (error) {
      toast.error("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'paid': return <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm border-none rounded-full px-4 italic font-bold">PAID</Badge>;
      case 'partially paid': return <Badge className="bg-blue-500 hover:bg-blue-600 shadow-sm border-none rounded-full px-4 italic font-bold">PARTIAL</Badge>;
      case 'overdue': return <Badge className="bg-red-500 hover:bg-red-600 shadow-sm border-none rounded-full px-4 italic font-bold">OVERDUE</Badge>;
      case 'void': return <Badge className="bg-slate-500 hover:bg-slate-600 shadow-sm border-none rounded-full px-4 italic font-bold text-slate-300">VOID</Badge>;
      case 'draft': return <Badge variant="outline" className="border-slate-300 text-slate-400 rounded-full px-4 italic font-bold">DRAFT</Badge>;
      default: return <Badge className="bg-amber-500 hover:bg-amber-600 shadow-sm border-none rounded-full px-4 italic font-bold">SENT</Badge>;
    }
  };

  const voidInvoice = async () => {
    if (!window.confirm("Are you sure you want to void this invoice?")) return;
    try {
      const res = await api.post(`/invoices/${id}/void`);
      if (res.success) {
        toast.success("Invoice voided successfully");
        fetchInvoice();
      }
    } catch (error) {
      toast.error("Failed to void invoice");
    }
  };

  const duplicateInvoice = async () => {
    try {
      const res = await api.post(`/invoices/${id}/duplicate`);
      if (res.success) {
        toast.success("Invoice duplicated as draft");
        navigate(`/sales/invoices/${res.data.id}/edit`);
      }
    } catch (error) {
      toast.error("Failed to duplicate invoice");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Decrypting Invoice Data...</p>
      </div>
    );
  }

  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/sales/invoices')}
            className="rounded-full hover:bg-white shadow-sm border border-slate-100 dark:border-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 italic tracking-tight">{invoice.number}</h1>
               {getStatusBadge(invoice.status)}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <Calendar className="h-3 w-3" /> Due On: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
               <span className="text-slate-200">|</span>
               <User className="h-3 w-3" /> Created By: System
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={() => navigate(`/sales/invoices/${id}/record-payment`)} 
            disabled={invoice.status.toLowerCase() === 'paid' || invoice.status.toLowerCase() === 'void'}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold shadow-premium h-11 transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <CreditCard className="h-4 w-4" /> Record Payment
          </Button>
          
          <div className="h-11 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden md:block" />

          <Button variant="outline" className="rounded-xl h-11 font-bold border-slate-200 dark:border-white/10 gap-2 hover:bg-slate-50">
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" className="rounded-xl h-11 font-bold border-slate-200 dark:border-white/10 gap-2 hover:bg-slate-50 text-blue-600 border-blue-100 bg-blue-50/30">
            <Send className="h-4 w-4" /> Send Invoice
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl border border-slate-100 dark:border-white/10">
                <MoreVertical className="h-5 w-5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-premium p-1.5 border-slate-100">
               <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate(`/sales/invoices/${invoice.id}/edit`)} className="rounded-lg gap-2 font-medium text-xs py-2.5">
                    <FileText className="h-4 w-4" /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={duplicateInvoice} className="rounded-lg gap-2 font-medium text-xs py-2.5">
                    <Copy className="h-4 w-4" /> Duplicate as Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg gap-2 font-medium text-xs py-2.5">
                    <Printer className="h-4 w-4" /> Print Preview
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator className="opacity-10" />
               <DropdownMenuGroup>
                  <DropdownMenuItem onClick={voidInvoice} className="rounded-lg gap-2 font-bold text-xs py-2.5 text-amber-600">
                    <Ban className="h-4 w-4" /> Void Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg gap-2 font-bold text-xs py-2.5 text-red-500">
                    <Trash2 className="h-4 w-4" /> Delete Invoice
                  </DropdownMenuItem>
               </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Invoice Card */}
          <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f] relative">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
               <Receipt className="h-64 w-64 rotate-12" />
             </div>
             <CardContent className="p-8 md:p-12 space-y-12">
               <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-dashed border-slate-100 dark:border-white/5 pb-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">Billed To</p>
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 italic">{invoice.customerName}</h2>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500 italic max-w-xs">
                       <p>United States of America</p>
                       <p>support@{invoice.customerName.toLowerCase().replace(/\s/g, "")}.com</p>
                       <p>TAX ID: US-9988776655</p>
                    </div>
                 </div>
                 <div className="space-y-6 md:text-right">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">Our Info</p>
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 italic">TPD CRM Corp.</h2>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500 italic">
                       <p>123 Business Avenue, Suite 500</p>
                       <p>New York, NY 10001</p>
                       <p>billing@tpdcrm.com</p>
                    </div>
                 </div>
               </div>

               {/* Items Table */}
               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText className="h-3 w-3 text-blue-600" /> Services & Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                          <th className="px-6 py-4 rounded-l-2xl">Description</th>
                          <th className="px-6 py-4 text-center">Qty</th>
                          <th className="px-6 py-4 text-right">Unit Price</th>
                          <th className="px-6 py-4 text-right rounded-r-2xl">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50 dark:divide-white/5 text-sm">
                        {invoice.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="group hover:bg-slate-50/30 dark:hover:bg-white/[0.01]">
                            <td className="px-6 py-6 border-none">
                              <p className="font-bold text-slate-700 dark:text-slate-300 italic">{item.description}</p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest leading-none">SKU-882711</p>
                            </td>
                            <td className="px-6 py-6 text-center font-bold text-slate-600">{item.quantity}</td>
                            <td className="px-6 py-6 text-right font-mono text-slate-500">
                             ${(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-6 text-right font-black text-slate-800 dark:text-slate-100 font-mono italic">
                             ${((item.quantity || 0) * (item.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               {/* Summary Footer */}
               <div className="flex flex-col md:flex-row justify-between gap-12 pt-10 mt-12 bg-slate-50/30 dark:bg-white/5 rounded-3xl p-8 border border-slate-100 dark:border-white/5">
                 <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notes & Instructions</p>
                       <p className="text-xs text-slate-500 italic leading-relaxed">
                         {invoice.notes || "No special instructions provided for this invoice transaction. Please ensure payment is made within the stipulated terms."}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Terms & Conditions</p>
                       <p className="text-[10px] text-slate-400 italic leading-relaxed">
                         {invoice.terms || "Standard payment terms are NET-14. Late payments will incur a 2% monthly interest fee. Please use the invoice number as payment reference."}
                       </p>
                    </div>
                 </div>
                 <div className="space-y-3 min-w-[280px]">
                    <div className="flex justify-between items-center text-xs text-slate-500 italic px-2">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-700">${(invoice.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-600 font-bold px-2">
                      <span className="italic">VAT / Tax (15%)</span>
                      <span className="font-mono">+ ${(invoice.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between items-center text-xs text-red-500 font-bold px-2">
                        <span className="italic">Discount Applied</span>
                        <span className="font-mono italic">- ${(invoice.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-4" />
                    <div className="flex justify-between items-end p-4 bg-white dark:bg-[#1f1a1d] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                      <span className="text-[11px] font-black uppercase text-blue-600 tracking-widest mb-1">Grand Total</span>
                      <span className="text-3xl font-black italic tracking-tighter text-slate-800 dark:text-slate-100 leading-none">
                         ${(invoice.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                 </div>
               </div>
             </CardContent>
          </Card>

          {/* Payment History Card */}
          <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f]">
             <CardHeader className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                    <History className="h-4 w-4 text-emerald-500" /> Payment History
                  </CardTitle>
                  <CardDescription className="text-[10px] italic mt-1 uppercase font-bold opacity-70">List of successful transactions</CardDescription>
               </div>
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-lg px-3 py-1 font-bold italic shadow-none">
                 Balance: ${(invoice.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </Badge>
             </CardHeader>
             <CardContent className="p-8">
                <div className="space-y-4">
                   {invoice.payments?.length > 0 ? (
                     invoice.payments.map((pm: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:bg-emerald-50/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1f1a1d] flex items-center justify-center border border-slate-100 dark:border-white/5 text-emerald-500 shadow-sm">
                                <CheckCircle2 className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 italic">{pm.method}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(pm.date), "MMM dd, yyyy")}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-emerald-600 italic tracking-tight">+ ${pm.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[120px]">{pm.notes || "Verification Ref: X-990"}</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40 italic">
                        <Receipt className="h-12 w-12 text-slate-300" />
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No payments recorded</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">Submit a payment using the record button above.</p>
                        </div>
                     </div>
                   )}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <Card className="border-none shadow-premium rounded-3xl overflow-hidden bg-slate-900 text-white relative">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <AlertCircle className="h-24 w-24" />
             </div>
             <CardContent className="p-8 space-y-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] italic">Current Status</p>
                   <div className="flex items-center gap-2">
                     <div className={cn(
                       "h-2 w-2 rounded-full animate-pulse",
                       invoice.status.toLowerCase() === 'paid' ? "bg-emerald-400" : "bg-amber-400"
                     )} />
                     <h3 className="text-2xl font-black italic tracking-tighter uppercase">{invoice.status}</h3>
                   </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-white/10">
                   <div className="flex items-center justify-between text-xs font-bold opacity-60 italic">
                     <span className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" /> Total Invoiced</span>
                     <span>${(invoice.totalAmount || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs font-bold opacity-60 italic">
                     <span className="flex items-center gap-2"><Badge className="h-3.5 w-3.5 scale-75" /> Amount Received</span>
                     <span className="text-emerald-400">${((invoice.totalAmount || 0) - (invoice.balance || 0)).toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Outstanding</span>
                     <span className="text-xl font-black italic font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                       ${(invoice.balance || 0).toLocaleString()}
                     </span>
                   </div>
                </div>

                <Button 
                  onClick={() => navigate(`/sales/invoices/${id}/record-payment`)} 
                  disabled={invoice.balance <= 0}
                  className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-bold italic tracking-tight rounded-2xl group transition-all"
                >
                  Post New Payment
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
             </CardContent>
           </Card>

           <Card className="border-none shadow-soft rounded-3xl overflow-hidden bg-white dark:bg-[#211c1f]">
             <CardHeader className="bg-slate-50/50 dark:bg-white/5 p-6 border-b border-slate-100 dark:border-white/5">
                <CardTitle className="text-[11px] font-black uppercase text-slate-400 tracking-widest leading-none italic">Extended details</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Customer Association</p>
                   <p className="text-xs font-bold text-slate-700 dark:text-slate-200 italic flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/crm/customers/${invoice.customerId}`)}>
                     {invoice.customerName}
                     <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </p>
                </div>
                {invoice.orderId && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Related Order</p>
                    <p className="text-xs font-bold text-blue-600 italic flex items-center gap-1.5 cursor-pointer hover:underline" onClick={() => navigate(`/sales/orders/${invoice.orderId}`)}>
                      <Receipt className="h-3.5 w-3.5" /> Order # {invoice.orderId.slice(-6).toUpperCase()}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Issue Timestamp</p>
                   <p className="text-xs font-bold text-slate-700 dark:text-slate-200 italic">{format(new Date(invoice.issueDate), "MMMM dd, yyyy @ HH:mm")}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Communication Log</p>
                   <div className="flex flex-wrap gap-1 mt-2">
                     <Badge variant="outline" className="text-[9px] py-0 italic border-slate-100">EMAIL_SENT</Badge>
                     <Badge variant="outline" className="text-[9px] py-0 italic border-slate-100">SMS_REMINDER_PENDING</Badge>
                   </div>
                </div>
             </CardContent>
           </Card>

           <div className="p-6 bg-blue-50/50 dark:bg-blue-600/5 rounded-3xl border border-blue-100/50 dark:border-blue-500/10 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white dark:bg-[#1f1a1d] flex items-center justify-center text-blue-600 shadow-sm">
                    <Mail className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-blue-800 dark:text-blue-400 italic">Auto-Reminder</h4>
               </div>
               <p className="text-[10px] font-medium text-blue-700/70 dark:text-blue-400/70 leading-relaxed italic">
                  A reminder email is scheduled to be sent automatically if this invoice remains unpaid 2 days before the due date.
               </p>
               <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-100/50">Modify Schedule</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
