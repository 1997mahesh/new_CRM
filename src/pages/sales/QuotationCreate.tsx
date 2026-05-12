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
  Briefcase
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
  discountPercent: number;
  total: number;
}

export function QuotationCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    number: "",
    customerId: "",
    customerName: "",
    title: "",
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "Draft",
    notes: "",
    discountType: "Percentage",
    discountValue: 0,
    terms: "1. Validity: This quotation is valid for 14 days from the date of issue.\n2. Payment Terms: 50% advance, 50% upon completion.\n3. Delivery: As per project timeline discussed."
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: "", quantity: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0, total: 0 }
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
        const [custRes, numRes] = await Promise.all([
          api.get('/customers'),
          api.get('/system/number-series/next/quotation')
        ]);
        
        if (custRes.success) setCustomers(custRes.data);
        if (numRes.success && !isEdit) {
          setFormData(prev => ({ ...prev, number: numRes.data }));
        }

        if (isEdit) {
          const res = await api.get(`/quotations/${id}`);
          if (res.success) {
            const q = res.data;
            setFormData({
              number: q.number,
              customerId: q.customerId,
              customerName: q.customerName,
              title: q.title || "",
              issueDate: new Date(q.issueDate).toISOString().split('T')[0],
              validUntil: new Date(q.validUntil).toISOString().split('T')[0],
              status: q.status,
              notes: q.notes || "",
              discountType: q.discountType || "Percentage",
              discountValue: q.discountValue || 0,
              terms: q.terms || ""
            });
            setItems(q.items || []);
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
  }, [items, formData.discountType, formData.discountValue]);

  const calculateTotals = () => {
    let subtotal = 0;
    let lineDiscountTotal = 0;
    let taxTotal = 0;

    // Line items calculation
    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = itemSubtotal * (item.discountPercent / 100);
      const itemTaxable = itemSubtotal - itemDiscount;
      const itemTax = itemTaxable * (item.taxPercent / 100);

      subtotal += itemSubtotal;
      lineDiscountTotal += itemDiscount;
      taxTotal += itemTax;
    });

    // Overall discount calculation
    let overallDiscount = 0;
    const amountAfterLineDiscounts = subtotal - lineDiscountTotal;
    
    if (formData.discountType === "Percentage") {
      overallDiscount = amountAfterLineDiscounts * (formData.discountValue / 100);
    } else {
      overallDiscount = formData.discountValue;
    }

    // Ensure overall discount does not exceed the amount after line discounts
    if (overallDiscount > amountAfterLineDiscounts) {
      overallDiscount = amountAfterLineDiscounts;
    }

    const finalTotal = amountAfterLineDiscounts - overallDiscount + taxTotal;

    setTotals({
      subtotal,
      taxAmount: taxTotal,
      discountAmount: lineDiscountTotal + overallDiscount,
      totalAmount: Math.max(0, finalTotal)
    });
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substr(2, 9), description: "", quantity: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0, total: 0 }
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
        // Recalculate item total
        const sub = updatedItem.quantity * updatedItem.unitPrice;
        const disc = sub * (updatedItem.discountPercent / 100);
        const tax = (sub - disc) * (updatedItem.taxPercent / 100);
        updatedItem.total = sub - disc + tax;
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
        ? await api.put(`/quotations/${id}`, payload)
        : await api.post('/quotations', payload);

      if (res.success) {
        toast.success(`Successfully ${isEdit ? 'updated' : 'created'} quotation ${formData.number}.`);
        navigate('/sales/quotations');
      }
    } catch (err) {
      toast.error("Failed to save quotation. Please try again.");
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
            onClick={() => navigate('/sales/quotations')}
            className="rounded-xl border border-slate-200 dark:border-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight italic">
              {isEdit ? 'Edit' : 'New'} Quotation
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{formData.number || 'Generating number...'}</p>
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
            onClick={() => handleSubmit("Sent")}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Left */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-blue-500 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Quotation Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quotation Title</Label>
                <div className="relative group">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input 
                     placeholder="e.g. Website Redesign Project" 
                     className="pl-10 h-12 bg-slate-50 border-none dark:bg-white/5 focus-visible:ring-blue-500 rounded-xl font-medium"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</Label>
                <Select 
                  value={formData.customerId} 
                  onValueChange={(val) => {
                    const cust = customers.find(c => c.id === val);
                    setFormData({ ...formData, customerId: val, customerName: cust?.name || "" });
                  }}
                >
                  <SelectTrigger className="h-12 bg-slate-50 border-none dark:bg-white/5 rounded-xl font-medium">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1C1F26] border-slate-200 dark:border-white/10 rounded-xl">
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="font-medium hover:bg-slate-50 dark:hover:bg-white/5">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Issue Date</Label>
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
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Valid Until</Label>
                <div className="relative group">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input 
                     type="date" 
                     className="pl-10 h-12 bg-slate-50 border-none dark:bg-white/5 focus-visible:ring-blue-500 rounded-xl font-medium border-red-200 dark:border-red-500/20"
                     value={formData.validUntil}
                     onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
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
                 <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Line Items</h2>
               </div>
               <Button 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="rounded-xl h-9 font-bold bg-blue-50 text-blue-600 border-none hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Row
              </Button>
            </div>

            <div className="space-y-4">
               {/* Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1 text-center">Tax %</div>
                  <div className="col-span-1 text-center">Disc %</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
               </div>

               <AnimatePresence initial={false}>
                 {items.map((item, idx) => (
                   <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] group"
                   >
                     <div className="col-span-4 relative group/input">
                        <Input 
                          placeholder="Project Milestone 1..." 
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
                     <div className="col-span-1">
                        <Input 
                          type="number" 
                          className="h-11 bg-white dark:bg-[#1C1F26] border-none shadow-sm rounded-xl font-medium text-center border-blue-100 dark:border-blue-500/20"
                          value={item.discountPercent}
                          onChange={(e) => {
                            const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                            updateItem(item.id, "discountPercent", val);
                          }}
                        />
                     </div>
                     <div className="col-span-2 flex items-center justify-end">
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-white tracking-tighter">
                          ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

        {/* Totals Right */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#252831] rounded-2xl shadow-xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 bg-white/5 rounded-full" />
             <div className="relative flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-amber-500 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Summary</h2>
             </div>

              <div className="space-y-4 relative">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Subtotal</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="space-y-3 py-2 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Overall Discount</span>
                    <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-0.5 h-7">
                      <button 
                        onClick={() => setFormData({ ...formData, discountType: "Percentage" })}
                        className={cn("px-2 rounded-md text-[8px] font-black uppercase transition-all", formData.discountType === "Percentage" ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-400")}
                      >
                        %
                      </button>
                      <button 
                        onClick={() => setFormData({ ...formData, discountType: "Fixed" })}
                        className={cn("px-2 rounded-md text-[8px] font-black uppercase transition-all", formData.discountType === "Fixed" ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-400")}
                      >
                        FIXED
                      </button>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 group-focus-within:text-blue-500 transition-colors uppercase">
                      {formData.discountType === "Percentage" ? "% OFF" : "USD"}
                    </div>
                    <Input 
                      type="number"
                      className="h-9 bg-slate-50 dark:bg-white/5 border-none shadow-inner rounded-xl font-bold text-xs focus-visible:ring-blue-500 pr-12"
                      value={formData.discountValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (formData.discountType === "Percentage") {
                          setFormData({ ...formData, discountValue: Math.min(100, Math.max(0, val)) });
                        } else {
                          setFormData({ ...formData, discountValue: Math.max(0, val) });
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                     <span className="text-[10px] font-bold text-slate-400 italic">Total Discount</span>
                     <span className="text-sm font-bold text-red-400 font-mono">-${totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Tax (VAT)</span>
                   <span className="text-sm font-bold text-emerald-400 font-mono">+${totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="mt-8 p-4 bg-blue-600 rounded-2xl shadow-lg transform transition-transform group-hover:scale-[1.02]">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 italic">Total Amount</span>
                      <Badge className="bg-white/20 text-white border-none text-[8px] uppercase tracking-tighter">USD</Badge>
                   </div>
                   <div className="text-3xl font-black text-white font-mono tracking-tighter italic">
                     ${totals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-8 w-1 bg-slate-400 rounded-full" />
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Additional Info</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Customer Notes</Label>
                <Textarea 
                  placeholder="Thank you for your business..." 
                  className="min-h-[100px] bg-slate-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm p-4 h-24"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Terms & Conditions</Label>
                <Textarea 
                  placeholder="Standard terms apply..." 
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
