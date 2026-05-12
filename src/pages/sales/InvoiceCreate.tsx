import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calculator, 
  Calendar as CalendarIcon,
  User,
  FileText,
  Hash,
  Loader2,
  DollarSign,
  Percent,
  ChevronDown,
  Info,
  Send
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

export function InvoiceCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [items, setItems] = useState<any[]>([
    { id: Date.now(), description: "", quantity: 1, price: 0, total: 0, tax: 0, discount: 0 }
  ]);

  const [formData, setFormData] = useState({
    number: "",
    customerId: "",
    customerName: "",
    orderId: "none",
    currency: "USD",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: "",
    terms: "",
    status: "draft",
    discountType: "Fixed",
    discountValue: 0
  });

  useEffect(() => {
    const fetchRequired = async () => {
      try {
        const [custRes, orderRes] = await Promise.all([
          api.get('/customers'),
          api.get('/orders')
        ]);
        if (custRes.success) setCustomers(custRes.data);
        if (orderRes.success) setOrders(orderRes.data.items || []);

        if (isEdit) {
          const invRes = await api.get(`/invoices/${id}`);
          if (invRes.success) {
            const data = invRes.data;
            setFormData({
              number: data.number,
              customerId: data.customerId,
              customerName: data.customerName,
              orderId: data.orderId || "none",
              currency: data.currency || "USD",
              issueDate: format(new Date(data.issueDate), "yyyy-MM-dd"),
              dueDate: format(new Date(data.dueDate), "yyyy-MM-dd"),
              notes: data.notes || "",
              terms: data.terms || "",
              status: data.status,
              discountType: data.discountType || "Fixed",
              discountValue: data.discountValue || 0
            });
            setItems(data.items || []);
          }
        } else {
          const numRes = await api.get('/system/number-series/next/invoice');
          if (numRes.success) setFormData(prev => ({ ...prev, number: numRes.data }));
        }
      } catch (error) {
        console.error("Failed to load required data");
      } finally {
        setFetching(false);
      }
    };
    fetchRequired();
  }, [id, isEdit]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0, total: 0, tax: 0, discount: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "price") {
          updatedItem.total = (Number(updatedItem.quantity) || 0) * (Number(updatedItem.price) || 0);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * 0.15; // Example 15% flat tax
    
    let discount = 0;
    if (formData.discountType === "Percentage") {
      discount = subtotal * (formData.discountValue / 100);
    } else {
      discount = formData.discountValue;
    }

    const totalAmount = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, discount, totalAmount };
  }, [items, formData.discountType, formData.discountValue]);

  const handleSubmit = async (saveAndSend = false) => {
    if (!formData.customerId || items.some(i => !i.description)) {
      toast.error("Please select a customer and provide item descriptions");
      return;
    }

    setLoading(true);
    try {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      const payload = {
        ...formData,
        customerName: selectedCustomer?.name || "",
        items,
        amount: totals.subtotal,
        taxAmount: totals.taxAmount,
        discount: totals.discount,
        totalAmount: totals.totalAmount,
        status: saveAndSend ? 'sent' : formData.status,
        orderId: formData.orderId === 'none' ? null : formData.orderId
      };

      const response = isEdit 
        ? await api.put(`/invoices/${id}`, payload)
        : await api.post('/invoices', payload);

      if (response.success) {
        toast.success(isEdit ? "Invoice updated" : "Invoice created");
        navigate('/sales/invoices');
      }
    } catch (error) {
      toast.error("Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Loading Invoice Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6">
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 italic">
              {isEdit ? "Edit Invoice" : "Create Sales Invoice"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Professional billing management for your business workflow.</p>
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
             Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-premium h-11 font-bold gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] dark:border-white/5">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
               <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                 <User className="h-4 w-4 text-blue-600" />
                 Customer Information
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Customer *</Label>
                   <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                     <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                       <SelectValue placeholder="Select client..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl overflow-hidden">
                       {customers.map(c => (
                         <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Linked Sales Order</Label>
                   <Select value={formData.orderId} onValueChange={(val) => setFormData({ ...formData, orderId: val })}>
                     <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                       <SelectValue placeholder="None" />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl overflow-hidden">
                       <SelectItem value="none">None</SelectItem>
                       {orders.map(o => (
                         <SelectItem key={o.id} value={o.id}>{o.number} - {o.customerName}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Issue Date</Label>
                    <div className="relative">
                       <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input 
                         type="date"
                         className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 pl-10" 
                         value={formData.issueDate}
                         onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Due Date</Label>
                    <div className="relative">
                       <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                       <Input 
                         type="date"
                         className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 pl-10" 
                         value={formData.dueDate}
                         onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Currency</Label>
                    <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl overflow-hidden">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] dark:border-white/5">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex flex-row items-center justify-between py-4">
               <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                 <Calculator className="h-4 w-4" />
                 Line Items
               </CardTitle>
               <Button onClick={addItem} variant="ghost" className="h-8 text-blue-600 font-bold text-xs gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg">
                 <Plus className="h-3 w-3" /> Add Item
               </Button>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[600px]">
                   <thead>
                     <tr className="bg-slate-50/30 dark:bg-black/10 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">
                       <th className="px-6 py-4">Description</th>
                       <th className="px-6 py-4 w-28 text-center">Qty</th>
                       <th className="px-6 py-4 w-36">Price</th>
                       <th className="px-6 py-4 w-36 text-right">Total</th>
                       <th className="px-6 py-4 w-16"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-sm">
                     {items.map((item) => (
                       <tr key={item.id} className="group hover:bg-slate-50/30 dark:hover:bg-white/[0.01]">
                         <td className="px-6 py-4">
                           <Input 
                             placeholder="Item description..." 
                             className="h-10 border-none focus:ring-0 font-medium dark:bg-transparent"
                             value={item.description}
                             onChange={e => updateItem(item.id, "description", e.target.value)}
                           />
                         </td>
                         <td className="px-6 py-4">
                            <Input 
                              type="number"
                              className="h-10 rounded-lg border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 text-center font-bold" 
                              value={item.quantity}
                              onChange={e => updateItem(item.id, "quantity", e.target.value)}
                            />
                         </td>
                         <td className="px-6 py-4">
                            <Input 
                              type="number"
                              className="h-10 rounded-lg border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 font-mono text-center" 
                              value={item.price}
                              onChange={e => updateItem(item.id, "price", e.target.value)}
                            />
                         </td>
                         <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-slate-300 font-mono italic">
                           ${(item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </td>
                         <td className="px-4 py-4 text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] dark:border-white/5">
             <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                  <FileText className="h-4 w-4" />
                  Notes & Terms
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Customer Notes</Label>
                     <Textarea 
                       placeholder="Special instructions for the client..." 
                       className="rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 min-h-[120px] italic" 
                       value={formData.notes}
                       onChange={e => setFormData({ ...formData, notes: e.target.value })}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Terms & Conditions</Label>
                     <Textarea 
                       placeholder="Payment terms, bank details, etc..." 
                       className="rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 min-h-[120px]" 
                       value={formData.terms}
                       onChange={e => setFormData({ ...formData, terms: e.target.value })}
                     />
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-premium rounded-2xl overflow-hidden sticky top-24 bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-900 border-b border-slate-800 py-6">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xs font-bold uppercase tracking-widest leading-none">Invoice Summary</CardTitle>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                     Live Calculation
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-slate-900 text-white">
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span className="italic">Items Subtotal</span>
                 <span className="font-mono">${(totals.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span className="italic flex items-center gap-1.5">
                   VAT / Service Tax
                   <Info className="h-3 w-3" />
                 </span>
                 <span className="font-mono text-emerald-400">+ ${(totals.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span className="italic">Adjusted Discount</span>
                 <span className="font-mono text-red-400">- ${(totals.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="h-px bg-white/10 my-2" />
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold italic">Final Balance</span>
                 <span className="text-3xl font-bold font-mono tracking-tighter text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                    ${(totals.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
               </div>
            </CardContent>
            
            <CardContent className="p-6 bg-slate-50 dark:bg-black/20 space-y-5">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Invoice Label #</Label>
                 <div className="relative">
                   <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input 
                      placeholder="INV-0001" 
                      className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] font-mono font-bold" 
                      value={formData.number}
                      onChange={e => setFormData({ ...formData, number: e.target.value })}
                   />
                 </div>
               </div>

               <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Global Discount</Label>
                    <div className="flex bg-slate-200 dark:bg-white/5 rounded-lg p-0.5">
                       <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, discountType: 'Fixed' })}
                        className={cn("px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all", formData.discountType === 'Fixed' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
                       >
                         Fixed
                       </button>
                       <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, discountType: 'Percentage' })}
                        className={cn("px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all", formData.discountType === 'Percentage' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
                       >
                         %
                       </button>
                    </div>
                 </div>
                 <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                       {formData.discountType === 'Percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    </div>
                    <Input 
                      type="number"
                      placeholder="0.00" 
                      className="h-12 pl-10 rounded-xl border-slate-200 dark:bg-[#1f1a1d] dark:border-white/5 font-bold" 
                      value={formData.discountValue}
                      onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    />
                 </div>
               </div>

               <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-600/5 rounded-xl border border-blue-100 dark:border-blue-500/10">
                     <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                     <p className="text-[10px] font-medium text-blue-700 dark:text-blue-400 leading-relaxed italic">
                        By saving, you generate a legal billing document. Ensure all currency and tax settings are correct.
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
