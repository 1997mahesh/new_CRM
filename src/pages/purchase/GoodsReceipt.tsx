import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Truck, 
  Save, 
  CheckCircle2, 
  Package, 
  User, 
  Calendar, 
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function GoodsReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [po, setPo] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    receivedBy: "",
    notes: ""
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchPO();
  }, [id]);

  const fetchPO = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/purchase/orders/${id}`);
      const poData = response.data;
      setPo(poData);
      
      // Initialize items with remaining quantities to be received
      const initialItems = Array.isArray(poData.items) ? poData.items.map((item: any) => ({
        purchaseOrderItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.quantity,
        alreadyReceived: item.receivedQuantity,
        quantity: Math.max(0, item.quantity - item.receivedQuantity)
      })) : [];
      setItems(initialItems);
    } catch (error) {
      toast.error("Failed to load Purchase Order");
      navigate("/purchase/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, val: number) => {
    const newItems = [...items];
    const item = newItems[index];
    const maxAllowed = item.orderedQuantity - item.alreadyReceived;
    
    // Allow over-receiving or cap it? Enterprise systems often cap it unless configured otherwise.
    // For now, let's just warn if they exceed, but allow it for flexibility.
    newItems[index].quantity = val;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      if (items.every(i => i.quantity <= 0)) {
        toast.error("Please enter quantities for at least one item");
        return;
      }

      setSaving(true);
      const payload = {
        ...formData,
        items: items.filter(i => i.quantity > 0).map(i => ({
          purchaseOrderItemId: i.purchaseOrderItemId,
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity
        }))
      };

      await api.post(`/purchase/orders/${id}/receive`, payload);
      toast.success("Goods Receipt posted successfully");
      navigate(`/purchase/orders/${id}`);
    } catch (error) {
      console.error("Post receipt error:", error);
      toast.error("Failed to post Goods Receipt");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!po) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/purchase/orders/${id}`)}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Truck className="h-6 w-6 text-amber-600" /> New Goods Receipt
            </h1>
            <p className="text-sm text-slate-500">
              Receiving items for <span className="font-bold text-slate-800 italic underline decoration-indigo-200">{po.number}</span> from {po.vendorName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/purchase/orders/${id}`)}
            disabled={saving}
            className="rounded-xl border-slate-200 font-bold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 font-bold gap-2"
          >
            <Save className="h-4 w-4" />
            Post Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" /> Receive Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                       <th className="px-6 py-3 w-[45%]">Product</th>
                       <th className="px-4 py-3 text-center">Ordered</th>
                       <th className="px-4 py-3 text-center">Already Recv</th>
                       <th className="px-4 py-3 text-center w-[20%]">Recv Quantity</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-xs">
                     {items.map((item, index) => (
                       <tr key={item.purchaseOrderItemId} className="hover:bg-slate-50/20 transition-colors">
                         <td className="px-6 py-4">
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-800">{item.productName}</span>
                             <span className="text-[10px] text-slate-400 font-mono mt-1">{item.productId || "NO-SKU"}</span>
                           </div>
                         </td>
                         <td className="px-4 py-4 text-center font-bold text-slate-500">{item.orderedQuantity}</td>
                         <td className="px-4 py-4 text-center font-bold text-slate-500">{item.alreadyReceived}</td>
                         <td className="px-4 py-4">
                            <Input 
                              type="number" 
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, parseFloat(e.target.value) || 0)}
                              className={cn(
                                "h-11 rounded-xl border-slate-200 text-center font-bold",
                                item.quantity > (item.orderedQuantity - item.alreadyReceived) ? "text-rose-500 border-rose-200 bg-rose-50/10" : "text-emerald-600 border-emerald-100 bg-emerald-50/10"
                              )} 
                            />
                            {item.quantity > (item.orderedQuantity - item.alreadyReceived) && (
                              <p className="text-[9px] text-rose-500 text-center mt-1 font-bold italic uppercase">Over-receiving detected</p>
                            )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/20 border-b border-slate-100">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Receipt Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                   <Calendar className="h-3 w-3" /> Receipt Date
                 </Label>
                 <Input 
                   type="date" 
                   value={formData.date}
                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                   className="h-11 rounded-xl border-slate-200" 
                 />
               </div>

               <div className="space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                   <User className="h-3 w-3" /> Received By
                 </Label>
                 <Input 
                   placeholder="Name of recipient..." 
                   value={formData.receivedBy}
                   onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                   className="h-11 rounded-xl border-slate-200" 
                 />
               </div>

               <div className="space-y-2">
                 <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                   <FileText className="h-3 w-3" /> Remarks
                 </Label>
                 <Textarea 
                   placeholder="Damage report, missing items, etc..." 
                   className="min-h-[100px] rounded-xl border-slate-200"
                   value={formData.notes}
                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 />
               </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-amber-100 shadow-sm">
                 <AlertCircle className="h-5 w-5 text-amber-600" />
               </div>
               <h4 className="font-bold text-amber-800 text-sm">Stock Impact</h4>
             </div>
             <p className="text-xs text-amber-700/80 leading-relaxed italic">
               Posting this receipt will automatically update the inventory levels for products with linked SKU/IDs.
               Stock movements will be tracked against PO <strong>{po.number}</strong>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
