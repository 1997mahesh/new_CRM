import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Save, 
  Send, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Building2, 
  Calendar as CalendarIcon, 
  ChevronDown,
  Info,
  Package,
  Calculator,
  Type,
  FileText,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { 
  calculateLineTotal, 
  calculateProcurementTotals, 
  formatCurrency 
} from "@/lib/procurement-calculations";

interface POItem {
  id?: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  discountType: 'Fixed' | 'Percentage';
  discountValue: number;
  discountAmount: number;
  totalAmount: number;
}

export default function PurchaseOrderCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    issueDate: new Date().toISOString().split('T')[0],
    expectedDelivery: "",
    currency: "USD",
    notes: "",
    terms: "",
    discountType: "Fixed" as "Fixed" | "Percentage",
    discountValue: 0,
  });

  const [items, setItems] = useState<POItem[]>([
    {
      productId: "",
      productName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxPercent: 0,
      taxAmount: 0,
      discountType: 'Fixed',
      discountValue: 0,
      discountAmount: 0,
      totalAmount: 0
    }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    grandTotal: 0
  });

  useEffect(() => {
    fetchInitialData();
    if (isEdit) {
      fetchPO();
    }
  }, [id]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.discountType, formData.discountValue]);

  const fetchInitialData = async () => {
    try {
      const [vendorRes, prodRes] = await Promise.all([
        api.get("/vendors"),
        api.get("/inventory")
      ]);
      setVendors(Array.isArray(vendorRes.data) ? vendorRes.data : []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  const fetchPO = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase/orders/${id}`);
      const po = response.data;
      setFormData({
        vendorId: po.vendorId || "",
        vendorName: po.vendorName || "",
        issueDate: po.issueDate ? new Date(po.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expectedDelivery: po.expectedDelivery ? new Date(po.expectedDelivery).toISOString().split('T')[0] : "",
        currency: po.currency || "USD",
        notes: po.notes || "",
        terms: po.terms || "",
        discountType: po.discountType || "Fixed",
        discountValue: po.discountValue || 0,
      });
      setItems(Array.isArray(po.items) ? po.items.map((item: any) => ({
        productId: item.productId || "",
        productName: item.productName || "",
        description: item.description || "",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        taxPercent: item.taxPercent || 0,
        taxAmount: item.taxAmount || 0,
        discountType: item.discountType || 'Fixed',
        discountValue: item.discountValue || 0,
        discountAmount: item.discountAmount || 0,
        totalAmount: item.totalAmount || 0
      })) : []);
    } catch (error) {
      toast.error("Failed to load Purchase Order");
      navigate("/purchase/orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const updatedItems = items.map(item => {
      const result = calculateLineTotal(item);
      return {
        ...item,
        discountAmount: result.discountAmount,
        taxAmount: result.taxAmount,
        totalAmount: result.lineTotal
      };
    });

    const summary = calculateProcurementTotals(
      items,
      formData.discountType,
      formData.discountValue
    );

    setTotals({
      subtotal: summary.subtotal,
      discount: summary.discountAmount,
      tax: summary.taxAmount,
      grandTotal: summary.totalAmount
    });
  };

  const handleAddItem = () => {
    setItems([...items, {
      productId: "",
      productName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxPercent: 0,
      taxAmount: 0,
      discountType: 'Fixed',
      discountValue: 0,
      discountAmount: 0,
      totalAmount: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // If product changed, prefill from product data
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productName = product.name;
        item.unitPrice = product.unitPrice;
        item.description = product.description || "";
      }
    }
    
    newItems[index] = item as POItem;
    setItems(newItems);
  };

  const handleSubmit = async (status: string = "Draft") => {
    try {
      if (!formData.vendorId) {
        toast.error("Please select a vendor");
        return;
      }

      if (items.some(i => !i.productId && !i.productName)) {
        toast.error("Please ensure all items have a product name");
        return;
      }

      setLoading(true);
      const payload = {
        ...formData,
        status,
        items,
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        discountAmount: totals.discount,
        totalAmount: totals.grandTotal
      };

      if (isEdit) {
        await api.put(`/purchase/orders/${id}`, payload);
        toast.success("Purchase Order updated");
      } else {
        const response = await api.post("/purchase/orders", payload);
        toast.success("Purchase Order created");
        if (response.data && response.data.id) {
          navigate(`/purchase/orders/${response.data.id}`);
        } else {
          navigate("/purchase/orders");
        }
        return;
      }
      navigate("/purchase/orders");
    } catch (error) {
      console.error("Submit PO error:", error);
      toast.error("Failed to save Purchase Order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase/orders")}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {isEdit ? "Edit Purchase Order" : "New Purchase Order"}
            </h1>
            <p className="text-sm text-slate-500">
              {isEdit ? "Update existing procurement details" : "Create a new procurement request for your suppliers."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit("Draft")}
            disabled={loading}
            className="rounded-xl border-slate-200 font-bold gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit("Sent")}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-bold gap-2"
          >
            <Send className="h-4 w-4" />
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Building2 className="h-3 w-3" /> Vendor *
                  </Label>
                  <Select 
                    value={formData.vendorId || ""} 
                    onValueChange={(val) => {
                      const v = vendors.find(v => v.id === val);
                      setFormData({ ...formData, vendorId: val, vendorName: v?.name || "" });
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" /> Expected Delivery
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.expectedDelivery || ""}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    className="h-11 rounded-xl border-slate-200" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" /> Order Date
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.issueDate || ""}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="h-11 rounded-xl border-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Currency
                  </Label>
                  <Select 
                    value={formData.currency || ""} 
                    onValueChange={(val) => setFormData({ ...formData, currency: val })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
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

          {/* Line Items */}
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                 <Package className="h-4 w-4 text-indigo-600" /> Line Items
               </h3>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={handleAddItem}
                 className="text-indigo-600 font-bold text-xs gap-1 hover:bg-indigo-50"
               >
                 <Plus className="h-3 w-3" /> Add Item
               </Button>
             </div>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                       <th className="px-6 py-3 w-[40%]">Product / Description</th>
                       <th className="px-4 py-3 w-[15%]">Qty</th>
                       <th className="px-4 py-3 w-[15%]">Price</th>
                       <th className="px-4 py-3 w-[10%]">Tax %</th>
                       <th className="px-4 py-3 w-[20%] text-right">Total</th>
                       <th className="px-4 py-3 w-10"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {items.map((item, index) => (
                       <tr key={index} className="group transition-colors align-top">
                         <td className="px-6 py-4 space-y-2">
                           <Select 
                             value={item.productId} 
                             onValueChange={(val) => handleItemChange(index, 'productId', val)}
                           >
                             <SelectTrigger className="h-10 rounded-lg border-slate-200 text-xs">
                               <SelectValue placeholder="Select Product" />
                             </SelectTrigger>
                             <SelectContent>
                               {products.map(p => (
                                 <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                           <Input 
                             placeholder="Line description..." 
                             value={item.description || ""}
                             onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                             className="h-8 text-[10px] rounded-lg border-slate-100" 
                           />
                         </td>
                         <td className="px-4 py-4">
                           <Input 
                             type="number" 
                             min="1"
                             value={item.quantity || 0}
                             onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                             className="h-10 rounded-lg border-slate-200 text-center" 
                           />
                         </td>
                         <td className="px-4 py-4">
                           <Input 
                              type="number" 
                              value={item.unitPrice || 0}
                              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                              className="h-10 rounded-lg border-slate-200 text-right font-mono" 
                           />
                         </td>
                         <td className="px-4 py-4">
                            <Input 
                               type="number" 
                               value={item.taxPercent || 0}
                               onChange={(e) => handleItemChange(index, 'taxPercent', parseFloat(e.target.value))}
                               className="h-10 rounded-lg border-slate-200 text-center" 
                            />
                         </td>
                         <td className="px-4 py-4 text-right">
                            <div className="flex flex-col items-end pt-2">
                              <span className="font-bold text-slate-800 font-mono">
                                {formatCurrency(calculateLineTotal(item).lineTotal, formData.currency)}
                              </span>
                              {item.discountAmount > 0 && (
                                <span className="text-[10px] text-rose-500 font-medium">-{formatCurrency(calculateLineTotal(item).discountAmount, formData.currency)} Disc</span>
                              )}
                            </div>
                         </td>
                         <td className="px-4 py-4">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleRemoveItem(index)}
                             className="h-8 w-8 text-slate-300 hover:text-rose-500"
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

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
               <CardContent className="p-4 space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Notes / Remarks</Label>
                 <Textarea 
                   placeholder="Add internal notes or messages for the supplier..." 
                   className="min-h-[100px] rounded-xl border-slate-200"
                   value={formData.notes || ""}
                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 />
               </CardContent>
            </Card>
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
               <CardContent className="p-4 space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Terms & Conditions</Label>
                 <Textarea 
                   placeholder="Delivery terms, payment instructions, etc..." 
                   className="min-h-[100px] rounded-xl border-slate-200"
                   value={formData.terms || ""}
                   onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                 />
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-premium rounded-2xl overflow-hidden bg-white sticky top-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-indigo-600" /> Order Summary
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium italic">Sub Total</span>
                   <span className="font-bold text-slate-700 font-mono italic decoration-indigo-500/20 underline underline-offset-4">
                     {formatCurrency(totals.subtotal, formData.currency)}
                   </span>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-1.5">
                       <span className="text-slate-500 font-medium italic">Discount</span>
                       <Select 
                         value={formData.discountType} 
                         onValueChange={(val: any) => setFormData({ ...formData, discountType: val })}
                       >
                         <SelectTrigger className="h-6 w-16 text-[10px] rounded bg-slate-50 border-none px-1">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Fixed">Flat</SelectItem>
                           <SelectItem value="Percentage">%</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <span className="font-bold text-rose-500 font-mono italic">
                       -{formatCurrency(totals.discount, formData.currency)}
                     </span>
                   </div>
                   <Input 
                      type="number" 
                      value={formData.discountValue || 0}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      placeholder="Discount value" 
                      className="h-8 text-xs rounded-lg border-slate-100" 
                   />
                 </div>

                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium italic">Tax Total</span>
                   <span className="font-bold text-slate-700 font-mono italic underline underline-offset-4 decoration-indigo-500/10">
                     {formatCurrency(totals.tax, formData.currency)}
                   </span>
                 </div>

                 <div className="h-px bg-slate-100 w-full" />

                 <div className="flex justify-between items-center pt-2">
                   <span className="text-base font-bold text-slate-800">Grand Total</span>
                   <span className="text-2xl font-black text-indigo-600 font-mono tracking-tighter">
                     {formatCurrency(totals.grandTotal, formData.currency)}
                   </span>
                 </div>
               </div>

               <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 space-y-3">
                 <div className="flex items-start gap-3">
                   <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                     <Info className="h-4 w-4 text-indigo-600" />
                   </div>
                   <p className="text-[10px] leading-relaxed text-indigo-600 font-medium italic">
                     Final amount is calculated after applying all row-level and global discounts and taxes. 
                     Check PO number sequence in system settings.
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
