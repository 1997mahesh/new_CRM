import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Save, 
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
  DollarSign,
  Receipt,
  FileSearch,
  CheckCircle2
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

interface BillItem {
  id?: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
}

export default function BillCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const poIdFromQuery = queryParams.get('poId');
  
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    purchaseOrderId: "",
    number: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days
    currency: "USD",
    notes: "",
    terms: "",
  });

  const [items, setItems] = useState<BillItem[]>([
    {
      productId: "",
      productName: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxPercent: 0,
      taxAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      lineTotal: 0
    }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    balance: 0
  });

  useEffect(() => {
    fetchInitialData();
    if (isEdit) {
      fetchBill();
    } else if (poIdFromQuery) {
        fetchPurchaseOrder(poIdFromQuery);
    }
  }, [id, poIdFromQuery]);

  useEffect(() => {
    calculateTotals();
  }, [items]);

  const fetchInitialData = async () => {
    try {
      const [vendorRes, prodRes, poRes] = await Promise.all([
        api.get("/vendors"),
        api.get("/inventory"),
        api.get("/purchase/orders?status=confirmed,partially received,received")
      ]);
      setVendors(Array.isArray(vendorRes.data) ? vendorRes.data : []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setPurchaseOrders(Array.isArray(poRes.data) ? poRes.data : []);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase/bills/${id}`);
      const bill = response.data;
      if (!bill) {
          toast.error("Bill not found");
          navigate("/purchase/bills");
          return;
      }
      setFormData({
        vendorId: bill.vendorId || "",
        vendorName: bill.vendorName || "",
        purchaseOrderId: bill.purchaseOrderId || "",
        number: bill.number || "",
        issueDate: bill.issueDate ? new Date(bill.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        currency: bill.currency || "USD",
        notes: bill.notes || "",
        terms: bill.terms || "",
      });
      setItems(Array.isArray(bill.items) ? bill.items : []);
    } catch (error) {
      toast.error("Failed to load Bill");
      navigate("/purchase/bills");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseOrder = async (poId: string) => {
    if (!poId || poId === "none") {
        setFormData(prev => ({
            ...prev,
            purchaseOrderId: "",
        }));
        return;
    }

    try {
        setLoading(true);
        const response = await api.get(`/purchase/orders/${poId}`);
        const po = response.data;
        
        if (!po) {
            toast.error("Purchase Order not found");
            return;
        }

        setFormData(prev => ({
            ...prev,
            vendorId: po.vendorId || "",
            vendorName: po.vendorName || "",
            purchaseOrderId: po.id || "",
            currency: po.currency || "USD",
            notes: po.notes || "",
            terms: po.terms || ""
        }));

        const poItems = Array.isArray(po.items) ? po.items.map((item: any) => ({
            productId: item.productId || "",
            productName: item.productName || "",
            description: item.description || "",
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || 0,
            taxPercent: item.taxPercent || 0,
            taxAmount: item.taxAmount || 0,
            discountPercent: 0,
            discountAmount: item.discountAmount || 0,
            lineTotal: item.totalAmount || 0
        })) : [];
        
        setItems(poItems.length > 0 ? poItems : [{
            productId: "",
            productName: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            taxPercent: 0,
            taxAmount: 0,
            discountPercent: 0,
            discountAmount: 0,
            lineTotal: 0
        }]);
    } catch (error: any) {
        console.error("Fetch PO error:", error);
        toast.error(error.response?.data?.message || "Failed to load Purchase Order");
    } finally {
        setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const updatedItems = items.map(item => {
      const lineSubtotal = item.unitPrice * item.quantity;
      const lineDiscount = (lineSubtotal * item.discountPercent) / 100;
      const taxableAmount = lineSubtotal - lineDiscount;
      const lineTax = (taxableAmount * item.taxPercent) / 100;
      const lineTotal = taxableAmount + lineTax;

      subtotal += lineSubtotal;
      totalTax += lineTax;
      totalDiscount += lineDiscount;

      return {
        ...item,
        discountAmount: lineDiscount,
        taxAmount: lineTax,
        lineTotal: lineTotal
      };
    });

    // Note: We don't update state here to avoid infinite loop since it's in useEffect triggered by items
    // But we use these values for the totals summary
    setTotals({
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      totalAmount: subtotal - totalDiscount + totalTax,
      paidAmount: totals.paidAmount,
      balance: subtotal - totalDiscount + totalTax - totals.paidAmount
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
      discountPercent: 0,
      discountAmount: 0,
      lineTotal: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productName = product.name;
        item.unitPrice = product.unitPrice;
        item.description = product.description || "";
      }
    }
    
    // Recalculate line total before setting
    const lineSubtotal = item.unitPrice * item.quantity;
    const lineDiscount = (lineSubtotal * item.discountPercent) / 100;
    const taxableAmount = lineSubtotal - lineDiscount;
    const lineTax = (taxableAmount * item.taxPercent) / 100;
    item.lineTotal = taxableAmount + lineTax;
    item.taxAmount = lineTax;
    item.discountAmount = lineDiscount;

    newItems[index] = item as BillItem;
    setItems(newItems);
  };

  const handleSubmit = async (markAsPaid = false) => {
    try {
      if (!formData.vendorId) {
        toast.error("Please select a vendor");
        return;
      }

      if (items.some(i => !i.productName)) {
        toast.error("Please ensure all items have a product name");
        return;
      }

      setLoading(true);
      const payload = {
        ...formData,
        items: items.map(item => ({
            ...item,
            lineTotal: item.lineTotal // Ensure latest is sent
        }))
      };

      let billId = id;
      if (isEdit) {
        await api.put(`/purchase/bills/${id}`, payload);
        toast.success("Bill updated successfully");
      } else {
        const response = await api.post("/purchase/bills", payload);
        billId = response.data.id;
        toast.success("Bill created successfully");
      }

      if (markAsPaid && billId) {
        await api.post(`/purchase/bills/${billId}/payments`, {
            amount: totals.totalAmount,
            paymentMethod: "Bank Transfer",
            paymentDate: new Date().toISOString(),
            notes: "Initial payment at creation"
        });
        toast.success("Bill marked as paid");
      }

      navigate(`/purchase/bills/${billId}`);
    } catch (error: any) {
      console.error("Submit Bill error:", error);
      toast.error(error.response?.data?.message || "Failed to save Bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase/bills")}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 italic">
                    {isEdit ? "Edit Vendor Bill" : "New Vendor Bill"}
                </h1>
            </div>
            <p className="text-sm text-slate-500 italic">
              {isEdit ? "Update vendor invoice details and items." : "Record a new invoice received from your vendor."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="rounded-xl border-slate-200 dark:border-white/5 font-bold gap-2 italic h-11"
          >
            <Save className="h-4 w-4" />
            {isEdit ? "Update Bill" : "Save as Unpaid"}
          </Button>
          {!isEdit && (
            <Button 
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-premium font-bold gap-2 italic h-11"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save & Mark Paid
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-emerald-500" /> Vendor *
                  </Label>
                  <Select 
                    value={formData.vendorId} 
                    onValueChange={(val) => {
                      const v = vendors.find(v => v.id === val);
                      setFormData({ ...formData, vendorId: val, vendorName: v?.name || "" });
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-white/5 font-medium italic">
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
                    <FileSearch className="h-3 w-3 text-blue-500" /> Linked PO (Optional)
                  </Label>
                  <Select 
                    value={formData.purchaseOrderId} 
                    onValueChange={fetchPurchaseOrder}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-white/5 font-medium italic">
                      <SelectValue placeholder="Select Purchase Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {purchaseOrders.map(po => (
                        <SelectItem key={po.id} value={po.id}>{po.number} - {po.vendorName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Receipt className="h-3 w-3 text-purple-500" /> Bill Number *
                  </Label>
                  <Input 
                    placeholder="e.g. BILL-2023-001"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="h-11 rounded-xl border-slate-200 dark:border-white/5 font-medium italic"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3 text-emerald-500" /> Bill Date *
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="h-11 rounded-xl border-slate-200 dark:border-white/5 font-medium italic" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 text-rose-500">
                    <CalendarIcon className="h-3 w-3" /> Due Date *
                  </Label>
                  <Input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="h-11 rounded-xl border-slate-200 dark:border-white/5 font-medium italic" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
             <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 italic tracking-tight">
                 <Package className="h-4 w-4 text-emerald-600" /> Line Items
               </h3>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={handleAddItem}
                 className="text-emerald-600 font-bold text-xs gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 italic"
               >
                 <Plus className="h-3 w-3" /> Add Row
               </Button>
             </div>
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                   <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5 bg-slate-50/30">
                       <th className="px-6 py-3 w-[35%]">Product / Description</th>
                       <th className="px-4 py-3 w-[10%]">Qty</th>
                       <th className="px-4 py-3 w-[15%]">Unit Price</th>
                       <th className="px-4 py-3 w-[10%] text-center">Tax %</th>
                       <th className="px-4 py-3 w-[10%] text-center">Disc %</th>
                       <th className="px-4 py-3 w-[15%] text-right">Total</th>
                       <th className="px-4 py-3 w-10"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                     {items.map((item, index) => (
                       <tr key={index} className="group transition-colors align-top">
                         <td className="px-6 py-4 space-y-2">
                           <Select 
                             value={item.productId || ""} 
                             onValueChange={(val) => handleItemChange(index, 'productId', val)}
                           >
                             <SelectTrigger className="h-10 rounded-lg border-slate-200 dark:border-white/5 text-xs italic">
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
                             value={item.description}
                             onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                             className="h-8 text-[10px] rounded-lg border-slate-100 dark:border-white/5 italic" 
                           />
                         </td>
                         <td className="px-4 py-4">
                           <Input 
                             type="number" 
                             min="0"
                             step="1"
                             value={item.quantity}
                             onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                             className="h-10 rounded-lg border-slate-200 dark:border-white/5 text-center font-mono italic" 
                           />
                         </td>
                         <td className="px-4 py-4">
                           <Input 
                               type="number" 
                               min="0"
                               step="0.01"
                               value={item.unitPrice}
                               onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                               className="h-10 rounded-lg border-slate-200 dark:border-white/5 text-right font-mono italic" 
                           />
                         </td>
                         <td className="px-4 py-4 text-center">
                            <Input 
                               type="number" 
                               min="0"
                               max="100"
                               value={item.taxPercent}
                               onChange={(e) => handleItemChange(index, 'taxPercent', parseFloat(e.target.value) || 0)}
                               className="h-10 rounded-lg border-slate-200 dark:border-white/5 text-center font-mono italic" 
                            />
                         </td>
                         <td className="px-4 py-4 text-center text-rose-500">
                             <Input 
                                type="number" 
                                min="0"
                                max="100"
                                value={item.discountPercent}
                                onChange={(e) => handleItemChange(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                                className="h-10 rounded-lg border-slate-200 dark:border-white/5 text-center font-mono italic text-rose-500" 
                             />
                         </td>
                         <td className="px-4 py-4 text-right">
                             <div className="flex flex-col items-end pt-2">
                               <span className="font-bold text-slate-800 dark:text-slate-100 font-mono italic">
                                 ${item.lineTotal.toLocaleString()}
                               </span>
                               {item.discountAmount > 0 && (
                                 <span className="text-[9px] text-rose-500 font-bold uppercase italic tracking-tighter">-{item.discountAmount.toFixed(2)} Disc</span>
                               )}
                             </div>
                         </td>
                         <td className="px-4 py-4">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleRemoveItem(index)}
                             className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors"
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
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
               <CardContent className="p-4 space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Notes / Remarks</Label>
                 <Textarea 
                   placeholder="Add internal notes for your team..." 
                   className="min-h-[100px] rounded-xl border-slate-200 dark:border-white/5 italic font-medium"
                   value={formData.notes}
                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 />
               </CardContent>
            </Card>
            <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
               <CardContent className="p-4 space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Terms & Conditions</Label>
                 <Textarea 
                   placeholder="Payment terms, delivery conditions..." 
                   className="min-h-[100px] rounded-xl border-slate-200 dark:border-white/5 italic font-medium"
                   value={formData.terms}
                   onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                 />
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-premium rounded-3xl overflow-hidden bg-slate-900 text-white sticky top-6">
            <div className="px-6 py-5 border-b border-white/5 bg-white/5">
              <h3 className="text-sm font-bold flex items-center gap-2 italic tracking-tight">
                <Calculator className="h-4 w-4 text-emerald-500" /> Bill Summary
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm font-medium italic">
                   <span className="text-slate-400">Sub Total</span>
                   <span className="font-mono">${totals.subtotal.toLocaleString()}</span>
                 </div>
                 
                 <div className="flex justify-between items-center text-sm font-medium italic">
                   <span className="text-slate-400">Total Discount</span>
                   <span className="text-rose-400 font-mono">-${totals.discountAmount.toLocaleString()}</span>
                 </div>

                 <div className="flex justify-between items-center text-sm font-medium italic">
                   <span className="text-slate-400">Tax Total</span>
                   <span className="text-emerald-400 font-mono">${totals.taxAmount.toLocaleString()}</span>
                 </div>

                 <div className="h-px bg-white/10 w-full" />

                 <div className="flex justify-between items-center pt-2 italic">
                   <span className="text-base font-bold">Grand Total</span>
                   <span className="text-2xl font-black text-emerald-400 font-mono tracking-tighter">
                     ${totals.totalAmount.toLocaleString()}
                   </span>
                 </div>
                 
                 <div className="flex justify-between items-center text-xs italic">
                   <span className="text-slate-400">Paid Amount</span>
                   <span className="font-mono text-slate-300">${totals.paidAmount.toLocaleString()}</span>
                 </div>

                 <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 italic">
                   <span className="text-xs font-bold text-slate-300">Balance Due</span>
                   <span className="text-lg font-black text-rose-400 font-mono tracking-tighter">
                     ${totals.balance.toLocaleString()}
                   </span>
                 </div>
               </div>

               <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 space-y-3">
                 <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-emerald-200/70 font-medium italic">
                      Verify bill details before saving. Status will be automatically updated based on payments.
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
