import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  User, 
  Calendar, 
  FileText,
  DollarSign,
  Briefcase,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    number: "",
    customerId: "",
    customerName: "",
    quotationId: "",
    title: "",
    issueDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "Draft",
    notes: "",
    discount: 0,
    terms: "1. Payment: 50% advance, 50% on delivery.\n2. Delivery: Expected within 7 working days.\n3. Warranty: Standard manufacturer warranty applies."
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: "", quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, quoteRes, numRes] = await Promise.all([
          api.get('/customers'),
          api.get('/quotations?status=Accepted'),
          api.get('/system/number-series/next/order')
        ]);
        
        if (custRes.success) setCustomers(custRes.data);
        if (quoteRes.success) setQuotations(quoteRes.data.items || []);
        if (numRes.success && !isEdit) {
          setFormData(prev => ({ ...prev, number: numRes.data }));
        }

        if (isEdit) {
          const res = await api.get(`/orders/${id}`);
          if (res.success) {
            const o = res.data;
            setFormData({
              number: o.number,
              customerId: o.customerId,
              customerName: o.customerName,
              quotationId: o.quotationId || "",
              title: o.title || "",
              issueDate: new Date(o.issueDate).toISOString().split('T')[0],
              deliveryDate: o.deliveryDate ? new Date(o.deliveryDate).toISOString().split('T')[0] : "",
              status: o.status,
              notes: o.notes || "",
              discount: o.discount || 0,
              terms: o.terms || ""
            });
            setItems(o.items || []);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id, isEdit]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discount]);

  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemTax = itemSubtotal * (item.taxPercent / 100);

      subtotal += itemSubtotal;
      taxTotal += itemTax;
    });

    let overallDiscount = formData.discount;
    if (overallDiscount > subtotal) overallDiscount = subtotal;

    const finalTotal = subtotal - overallDiscount + taxTotal;

    setTotals({
      subtotal,
      taxAmount: taxTotal,
      discountAmount: overallDiscount,
      totalAmount: Math.max(0, finalTotal)
    });
  };

  const loadQuotation = async (quoteId: string) => {
    const quote = quotations.find(q => q.id === quoteId);
    if (quote) {
      setFormData(prev => ({
        ...prev,
        quotationId: quoteId,
        customerId: quote.customerId,
        customerName: quote.customerName,
        title: quote.title,
        items: quote.items,
        discount: quote.discount,
        terms: quote.terms
      }));
      setItems(quote.items || []);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substr(2, 9), description: "", quantity: 1, unitPrice: 0, taxPercent: 0, total: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        const sub = updatedItem.quantity * updatedItem.unitPrice;
        const tax = sub * (updatedItem.taxPercent / 100);
        updatedItem.total = sub + tax;
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSubmit = async (statusOverride?: string) => {
    if (!formData.customerId || !formData.number || items.some(i => !i.description)) {
      toast.error("Please fill all required fields and item descriptions.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        ...totals,
        items,
        status: statusOverride || formData.status
      };

      const res = isEdit 
        ? await api.put(`/orders/${id}`, payload)
        : await api.post('/orders', payload);

      if (res.success) {
        toast.success(`Successfully ${isEdit ? 'updated' : 'created'} order ${formData.number}.`);
        navigate('/sales/orders');
      }
    } catch (err) {
      toast.error("Failed to save order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight italic">
              {isEdit ? 'Edit' : 'New'} Sales Order
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{formData.number || 'Generating SO...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 h-11 border-slate-200 dark:border-white/5"
            onClick={() => handleSubmit("Draft")}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 h-11 bg-blue-600 hover:bg-blue-700 shadow-premium"
            onClick={() => handleSubmit("Confirmed")}
            disabled={loading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Confirm Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Left */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-blue-500 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Order Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Title / Project</Label>
                <div className="relative group">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input 
                     placeholder="e.g. Q2 Hardware Supply" 
                     className="pl-10 h-12 bg-slate-50 border-none dark:bg-white/5 focus-visible:ring-blue-500 rounded-xl font-medium"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quotation (Optional)</Label>
                <Select value={formData.quotationId} onValueChange={loadQuotation}>
                  <SelectTrigger className="h-12 bg-slate-50 border-none dark:bg-white/5 rounded-xl font-medium">
                    <SelectValue placeholder="Link Quotation" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1C1F26] border-slate-200 dark:border-white/10 rounded-xl">
                    <SelectItem value="none">None</SelectItem>
                    {quotations.map((q) => (
                      <SelectItem key={q.id} value={q.id}>{q.number} - {q.customerName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</Label>
                <Select 
                  value={formData.customerId} 
                  onValueChange={(val) => {
                    const cust = customers.find(c => c.id === val);
                    setFormData({ ...formData, customerId: val, customerName: cust?.name || "" });
                  }}
                  disabled={!!formData.quotationId && formData.quotationId !== "none"}
                >
                  <SelectTrigger className="h-12 bg-slate-50 border-none dark:bg-white/5 rounded-xl font-medium">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1C1F26] border-slate-200 dark:border-white/10 rounded-xl">
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Order Date</Label>
                <div className="relative group">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input 
                     type="date" 
                     className="pl-10 h-12 bg-slate-50 border-none dark:bg-white/5 focus-visible:ring-blue-500 rounded-xl font-medium"
                     value={formData.issueDate}
                     onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expected Delivery</Label>
                <div className="relative group">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input 
                     type="date" 
                     className="pl-10 h-12 bg-slate-50 border-none dark:bg-white/5 focus-visible:ring-blue-500 rounded-xl font-medium border-blue-100 dark:border-blue-500/20"
                     value={formData.deliveryDate}
                     onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                   />
                </div>
              </div>
            </div>
          </Card>

          {/* Line Items */}
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                 <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Order Line Items</h2>
               </div>
               <Button 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="rounded-xl h-9 font-bold bg-blue-50 text-blue-600 border-none hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
               {/* Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="col-span-5">Product / Service Description</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1 text-center">Tax %</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
               </div>

               <AnimatePresence initial={false}>
                 {items.map((item) => (
                   <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] group"
                   >
                     <div className="col-span-5 relative group/input">
                        <Input 
                          placeholder="Web Application Development..." 
                          className="h-11 bg-white dark:bg-[#1C1F26] border-none shadow-sm rounded-xl font-medium focus-visible:ring-blue-500"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                     </div>
                     <div className="col-span-1">
                        <Input 
                          type="number" 
                          className="h-11 bg-white dark:bg-[#1C1F26] border-none shadow-sm rounded-xl font-medium text-center"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        />
                     </div>
                     <div className="col-span-2 relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input 
                          type="number" 
                          className="pl-8 h-11 bg-white dark:bg-[#1C1F26] border-none shadow-sm rounded-xl font-medium"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        />
                     </div>
                     <div className="col-span-1">
                        <Input 
                          type="number" 
                          className="h-11 bg-white dark:bg-[#1C1F26] border-none shadow-sm rounded-xl font-medium text-center"
                          value={item.taxPercent}
                          onChange={(e) => updateItem(item.id, "taxPercent", parseFloat(e.target.value) || 0)}
                        />
                     </div>
                     <div className="col-span-2 flex items-center justify-end">
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-white tracking-tighter">
                          ${(item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                     </div>
                     <div className="col-span-1 flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg group-hover:opacity-100 opacity-0 transition-opacity"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Summary Right */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#252831] rounded-2xl shadow-xl overflow-hidden relative group">
             <div className="relative flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-amber-500 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Order Summary</h2>
             </div>

              <div className="space-y-4 relative">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Subtotal</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">${(totals.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="space-y-2 py-2 border-b border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic text-red-400">Discount Amount</span>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      type="number"
                      placeholder="0.00"
                      className="h-10 bg-slate-50 dark:bg-white/5 border-none shadow-inner rounded-xl font-bold text-sm focus-visible:ring-blue-500 pl-9 transition-all"
                      value={formData.discount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, discount: Math.max(0, val) });
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Tax Total</span>
                   <span className="text-sm font-bold text-emerald-400 font-mono">+${(totals.taxAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg transform transition-transform group-hover:scale-[1.02] border border-white/10">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 italic">Grand Total</span>
                      <Badge className="bg-white/20 text-white border-none text-[8px] uppercase tracking-tighter">USD</Badge>
                   </div>
                   <div className="text-3xl font-black text-white font-mono tracking-tighter italic">
                     ${(totals.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-slate-400 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Additional Notes</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Customer Notes</Label>
                <Textarea 
                  placeholder="Additional order instructions..." 
                  className="min-h-[100px] bg-slate-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm p-4"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Terms & Conditions</Label>
                <Textarea 
                  placeholder="Order specific terms..." 
                  className="min-h-[120px] bg-slate-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm p-4"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
