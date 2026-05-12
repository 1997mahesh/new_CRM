import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Printer, 
  Copy, 
  Send, 
  Download, 
  Edit2, 
  Trash2, 
  Calendar, 
  FileText,
  User,
  ShoppingBag,
  MoreVertical,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400", icon: FileText },
  "Sent": { label: "Sent", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400", icon: Send },
  "Accepted": { label: "Accepted", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400", icon: CheckCircle2 },
  "Rejected": { label: "Rejected", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400", icon: Trash2 },
  "Expired": { label: "Expired", color: "bg-amber-50 text-amber-600 dark:bg-amber-600/10 dark:text-amber-400", icon: Clock },
};

export function QuotationViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      const res = await api.get(`/quotations/${id}`);
      if (res.success) {
        setQuotation(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await api.post(`/quotations/${id}/duplicate`, {});
      if (res.success) {
        toast.success("Successfully created a copy.");
        navigate(`/sales/quotations/${res.data.id}/edit`);
      }
    } catch (err) {
      toast.error("Failed to duplicate.");
    }
  };

  const handleConvertToOrder = async () => {
    try {
      const res = await api.post(`/quotations/${id}/convert-to-order`, {});
      if (res.success) {
        toast.success("Quotation has been converted to an order.");
        navigate(`/sales/orders/${res.data.id}`);
      }
    } catch (err) {
      toast.error("Failed to convert.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const res = await api.delete(`/quotations/${id}`);
      if (res.success) {
        toast.success("Quotation has been deleted.");
        navigate('/sales/quotations');
      }
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  if (!quotation) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
      <FileText className="h-12 w-12 mb-4 opacity-20" />
      <p className="font-bold uppercase tracking-widest text-sm">Quotation Not Found</p>
    </div>
  );

  const status = STATUS_CONFIG[quotation.status] || STATUS_CONFIG["Draft"];

  const formDataDiscountAmount = (q: any) => {
    const lineDiscountTotal = q.items?.reduce((acc: number, item: any) => 
      acc + (item.quantity * item.unitPrice * (item.discountPercent / 100)), 0) || 0;
    const amountAfterLineDiscounts = q.subtotal - lineDiscountTotal;
    
    if (q.discountType === "Percentage") {
      return amountAfterLineDiscounts * (q.discountValue / 100);
    }
    return q.discountValue;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/sales/quotations')}
            className="rounded-xl border border-slate-200 dark:border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight italic">
                {quotation.number}
              </h1>
              <Badge className={cn("text-[9px] font-black uppercase py-0.5 px-2 border-none h-5", status.color)}>
                <status.icon className="h-2.5 w-2.5 mr-1" />
                {quotation.status}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{quotation.title || 'Sales Quotation'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="outline" className="rounded-xl font-bold uppercase text-[9px] tracking-widest h-10 border-slate-200 dark:border-white/5" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5 mr-2" />
            Print Preview
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl font-bold uppercase text-[9px] tracking-widest h-10 border-slate-200 dark:border-white/5"
            onClick={handleConvertToOrder}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-2 text-emerald-500" />
            Convert to Order
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl font-bold uppercase text-[9px] tracking-widest h-10 border-slate-200 dark:border-white/5"
            onClick={handleDuplicate}
          >
            <Copy className="h-3.5 w-3.5 mr-2 text-blue-500" />
            Duplicate
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-slate-200 dark:border-white/5">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl dark:bg-[#1C1F26] border-slate-200 dark:border-white/10">
              <DropdownMenuItem onClick={() => navigate(`/sales/quotations/${id}/edit`)} className="font-bold text-xs gap-2">
                <Edit2 className="h-3.5 w-3.5" /> Edit Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="font-bold text-xs gap-2 text-red-500">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Quotation Layout */}
      <Card className="border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="p-8 md:p-12 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
           <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                     <DollarSign className="h-6 w-6 text-white" />
                   </div>
                   <span className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">tpd<span className="text-blue-500 italic">CRM</span></span>
                 </div>
                 <div className="space-y-1">
                   <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Quotation From</h2>
                   <p className="font-bold text-slate-800 dark:text-white">TPD Corporate Office</p>
                   <p className="text-sm text-slate-500 dark:text-slate-400">123 Tech Avenue, Silicon Valley<br/>CA 94043, United States</p>
                 </div>
              </div>
              <div className="text-right space-y-4">
                 <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-200 dark:text-white/5 opacity-50 -mb-2">QUOTATION</h1>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Number</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white font-mono tracking-tighter">{quotation.number}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Customer & Dates Section */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-slate-50 dark:border-white/5">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <User className="h-4 w-4 text-blue-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quotation For</h3>
              </div>
              <div className="group">
                 <p className="text-lg font-black text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors flex items-center gap-2">
                   {quotation.customerName}
                   <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">Authorized Representative</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Calendar className="h-4 w-4 text-emerald-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Issue Date</h3>
                </div>
                <p className="font-bold text-slate-800 dark:text-white italic">{new Date(quotation.issueDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Clock className="h-4 w-4 text-red-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Valid Until</h3>
                </div>
                <p className="font-bold text-red-500 italic">{new Date(quotation.validUntil).toLocaleDateString()}</p>
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <FileText className="h-4 w-4 text-purple-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Subject</h3>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-2xl italic border border-slate-100 dark:border-white/5">
                {quotation.title || 'Professional Service Quotation'}
              </p>
           </div>
        </div>

        {/* Items Table */}
        <div className="p-8 md:p-12">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">
                    <th className="pb-4 pt-0 px-2 italic w-12">#</th>
                    <th className="pb-4 pt-0 px-4 italic">Description</th>
                    <th className="pb-4 pt-0 px-4 text-center italic">Qty</th>
                    <th className="pb-4 pt-0 px-4 text-right italic">Unit Price</th>
                    <th className="pb-4 pt-0 px-4 text-center italic">Disc %</th>
                    <th className="pb-4 pt-0 px-4 text-center italic">Tax %</th>
                    <th className="pb-4 pt-0 px-4 text-right italic">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                 {quotation.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                       <td className="py-5 px-2 text-[10px] font-bold text-slate-400 font-mono italic">{String(idx + 1).padStart(2, '0')}</td>
                       <td className="py-5 px-4 font-bold text-slate-800 dark:text-slate-100 italic">{item.description}</td>
                       <td className="py-5 px-4 text-center font-bold text-slate-600 dark:text-slate-400 font-mono italic">{item.quantity}</td>
                       <td className="py-5 px-4 text-right font-bold text-slate-600 dark:text-slate-400 font-mono italic">${item.unitPrice.toLocaleString()}</td>
                       <td className="py-5 px-4 text-center text-[10px] font-bold text-red-500 font-mono italic">{item.discountPercent || 0}%</td>
                       <td className="py-5 px-4 text-center">
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-[9px] font-bold uppercase tracking-tight h-5">{item.taxPercent}%</Badge>
                       </td>
                       <td className="py-5 px-4 text-right font-black text-slate-900 dark:text-white font-mono tracking-tighter italic">
                         ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Footer Summary */}
        <div className="p-8 md:p-12 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row justify-between gap-12">
            <div className="flex-1 space-y-8">
               <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Terms & Conditions</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed bg-white dark:bg-[#1C1F26] p-6 rounded-2xl border border-slate-100 dark:border-white/5 italic">
                    {quotation.terms}
                  </div>
               </div>
               {quotation.notes && (
                 <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Notes</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">“ {quotation.notes} ”</p>
                 </div>
               )}
            </div>

            <div className="w-full md:w-80 space-y-4">
               <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic font-medium">Subtotal</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white font-mono italic">${quotation.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               {quotation.discountValue > 0 && (
                 <div className="flex justify-between items-center px-4 py-1">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                     Overall Discount ({quotation.discountType === 'Percentage' ? `${quotation.discountValue}%` : 'Fixed'})
                   </span>
                   <span className="text-xs font-bold text-red-400 font-mono italic">
                     {quotation.discountType === 'Percentage' ? '-' : '-$'}
                     {formDataDiscountAmount(quotation).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </span>
                 </div>
               )}
               <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-red-500">Total Discount</span>
                  <span className="text-sm font-bold text-red-500 font-mono italic">-${quotation.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-emerald-500">Tax Total</span>
                  <span className="text-sm font-bold text-emerald-500 font-mono italic">+${quotation.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               
               <motion.div 
                 initial={{ scale: 0.95 }}
                 animate={{ scale: 1 }}
                 className="p-6 bg-slate-900 dark:bg-white rounded-3xl shadow-2xl relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 p-4 bg-white/10 dark:bg-black/5 rounded-full transform translate-x-2 -translate-y-2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative flex justify-between items-center mb-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">Grand Total</span>
                     <span className="text-[8px] font-black text-white dark:text-slate-900 bg-blue-600 px-2 py-0.5 rounded-full">USD</span>
                  </div>
                  <div className="relative text-3xl font-black text-white dark:text-slate-900 font-mono tracking-tighter italic">
                     ${quotation.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
               </motion.div>
            </div>
        </div>
      </Card>
    </div>
  );
}
