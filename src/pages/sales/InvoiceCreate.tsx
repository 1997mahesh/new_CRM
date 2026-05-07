import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader2
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
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([
    { id: Date.now(), description: "", quantity: 1, price: 0, total: 0 }
  ]);

  const [formData, setFormData] = useState({
    number: "",
    customerId: "",
    customerName: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: "",
    status: "unpaid"
  });

  useEffect(() => {
    const fetchRequired = async () => {
      try {
        const [custRes, numRes] = await Promise.all([
          api.get('/crm/customers'),
          api.get('/system/number-series/next/invoice')
        ]);
        if (custRes.success) setCustomers(custRes.data);
        if (numRes.success) setFormData(prev => ({ ...prev, number: numRes.data }));
      } catch (error) {
        console.error("Failed to load required data");
      }
    };
    fetchRequired();
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0, total: 0 }]);
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

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.total, 0);
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.15; // 15% VAT example
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        amount: subtotal,
        taxAmount: tax,
        totalAmount: total,
        dueDate: new Date(formData.dueDate)
      };

      const response = await api.post('/invoices', payload);
      if (response.success) {
        toast.success("Invoice generated successfully");
        navigate('/sales/invoices');
      }
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 italic">Create Sales Invoice</h1>
            <p className="text-sm text-slate-500">Draft a new invoice for services or products delivered.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl px-8 shadow-premium"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Confirm & Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <User className="h-5 w-5 text-blue-600" />
                 Billing Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="grid gap-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Customer *</Label>
                 <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                   <SelectTrigger className="h-12 rounded-xl border-slate-200">
                     <SelectValue placeholder="Begin typing or select customer..." />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl overflow-hidden">
                     {customers.map(c => (
                       <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Issue Date</Label>
                    <Input 
                      type="date"
                      className="h-12 rounded-xl border-slate-200" 
                      value={formData.issueDate}
                      onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Due Date</Label>
                    <Input 
                      type="date"
                      className="h-12 rounded-xl border-slate-200" 
                      value={formData.dueDate}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Calculator className="h-5 w-5 text-slate-400" />
                 Invoice Items
               </CardTitle>
               <Button variant="ghost" onClick={addItem} className="h-8 text-blue-600 font-bold text-xs gap-1.5 hover:bg-blue-50 rounded-lg">
                 <Plus className="h-3 w-3" /> Add Item
               </Button>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50/30 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                     <th className="px-6 py-4">Item Description</th>
                     <th className="px-6 py-4 w-28">Quantity</th>
                     <th className="px-6 py-4 w-36">Price</th>
                     <th className="px-6 py-4 w-36 text-right">Total</th>
                     <th className="px-6 py-4 w-16"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                   {items.map((item) => (
                     <tr key={item.id}>
                       <td className="px-6 py-4">
                         <Input 
                           placeholder="Item name or description..." 
                           className="h-8 border-none focus:ring-0 font-medium"
                           value={item.description}
                           onChange={e => updateItem(item.id, "description", e.target.value)}
                         />
                       </td>
                       <td className="px-6 py-4">
                          <Input 
                            type="number"
                            className="h-10 rounded-lg border-slate-100 text-center" 
                            value={item.quantity}
                            onChange={e => updateItem(item.id, "quantity", e.target.value)}
                          />
                       </td>
                       <td className="px-6 py-4">
                          <Input 
                            type="number"
                            className="h-10 rounded-lg border-slate-100 font-mono" 
                            value={item.price}
                            onChange={e => updateItem(item.id, "price", e.target.value)}
                          />
                       </td>
                       <td className="px-6 py-4 text-right font-bold text-slate-700 font-mono italic">
                         ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </td>
                       <td className="px-4 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-900 border-b border-slate-800 py-6">
               <CardTitle className="text-white text-sm font-bold uppercase tracking-widest leading-none">Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 bg-slate-900 text-white">
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span>Subtotal</span>
                 <span className="font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm opacity-60">
                 <span>Tax (15% VAT)</span>
                 <span className="font-mono">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="h-px bg-white/10 my-2" />
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold italic">Grand Total</span>
                 <span className="text-2xl font-bold font-mono tracking-tighter text-blue-400">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
               </div>
            </CardContent>
            <CardContent className="p-6 bg-slate-50 space-y-5">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Invoice #</Label>
                 <div className="relative">
                   <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input 
                      placeholder="INV-0001" 
                      className="h-11 pl-10 rounded-xl border-slate-200 bg-white font-mono" 
                      value={formData.number}
                      onChange={e => setFormData({ ...formData, number: e.target.value })}
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Additional Notes</Label>
                 <Textarea 
                   placeholder="Notes for the customer..." 
                   className="rounded-xl border-slate-200 bg-white min-h-[100px]" 
                   value={formData.notes}
                   onChange={e => setFormData({ ...formData, notes: e.target.value })}
                 />
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
