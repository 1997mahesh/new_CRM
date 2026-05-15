import React, { useState, useEffect } from "react";
import { 
  ChevronLeft,
  Edit2,
  Trash2,
  Package,
  History,
  Box,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Layers,
  Activity,
  User,
  ArrowRight,
  Plus,
  RefreshCw,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  useNavigate, 
  useParams,
  Link
} from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
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

const MOVEMENT_TYPES = [
  { value: "IN", label: "Stock In", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { value: "OUT", label: "Stock Out", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  { value: "ADJUSTMENT", label: "Adjustment", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { value: "DAMAGED", label: "Damaged", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { value: "RETURNED", label: "Returned", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
];

export default function ProductViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  
  // Manual Movement State
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: id || "",
    type: "IN",
    quantity: 1,
    reason: "",
    notes: "",
    date: format(new Date(), "yyyy-MM-dd"),
    warehouseId: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/inventory/products/${id}`);
      if (res.data) {
        setProduct(res.data);
        setMovements(res.data.movements || []);
        setMovementForm(f => ({ ...f, warehouseId: res.data.warehouseId || "" }));
      }
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? All stock history will be lost.")) return;
    try {
      await api.delete(`/inventory/products/${id}`);
      toast.success("Product deleted successfully");
      navigate("/inventory/products");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleSaveMovement = async () => {
    if (movementForm.quantity <= 0) return toast.error("Quantity must be greater than 0");

    try {
      setSaving(true);
      const res = await api.post("/inventory/adjust-stock", { ...movementForm, productId: id });
      if (res.error) throw new Error(res.error);
      
      toast.success("Stock movement recorded successfully");
      setIsMovementModalOpen(false);
      fetchProduct();
    } catch (error: any) {
      toast.error(error.message || "Failed to record movement");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'In Stock': return <Badge className="bg-emerald-50 text-emerald-600 border-none font-black italic rounded-full px-4 h-6 text-[11px]">IN STOCK</Badge>;
      case 'Low Stock': return <Badge className="bg-amber-50 text-amber-600 border-none font-black italic rounded-full px-4 h-6 text-[11px]">LOW STOCK</Badge>;
      case 'Out of Stock': return <Badge className="bg-red-50 text-red-600 border-none font-black italic rounded-full px-4 h-6 text-[11px]">OUT OF STOCK</Badge>;
      default: return <Badge variant="outline" className="italic font-bold rounded-full">{status}</Badge>;
    }
  };

  if (loading) return <div className="p-12 text-center font-bold text-slate-400 italic">Scanning Product Architecture...</div>;
  if (!product) return <div className="p-12 text-center text-red-500 italic">Product not found.</div>;

  const preview = (() => {
    const current = product.currentStock;
    const qty = Math.abs(movementForm.quantity);
    let newStock = current;
    
    if (movementForm.type === 'IN' || movementForm.type === 'RETURNED') {
      newStock += qty;
    } else if (movementForm.type === 'OUT' || movementForm.type === 'DAMAGED') {
      newStock -= qty;
    } else if (movementForm.type === 'ADJUSTMENT') {
      newStock = movementForm.quantity;
    }
    
    return { current, qty, newStock, diff: newStock - current };
  })();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/inventory/products")}
            className="rounded-full bg-white dark:bg-white/5 shadow-sm h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white italic">{product.name}</h1>
                {!product.isActive && <Badge variant="secondary" className="grayscale opacity-50 italic">INACTIVE</Badge>}
             </div>
             <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 w-fit px-2 py-0.5 rounded-lg italic">
               {product.sku || "NO SKU"}
             </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             onClick={() => {
                setMovementForm(f => ({ ...f, type: 'IN' }));
                setIsMovementModalOpen(true);
             }}
             className="h-11 px-6 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black italic rounded-xl shadow-premium"
           >
             <TrendingUp className="h-4 w-4" />
             <span>Restock</span>
           </Button>
           <Button 
             variant="outline"
             onClick={() => navigate(`/inventory/products/${id}/edit`)}
             className="h-11 px-4 gap-2 border-slate-200 dark:border-white/5 font-black italic rounded-xl bg-white dark:bg-[#1C1F26]"
           >
             <Edit2 className="h-4 w-4" />
             <span>Edit</span>
           </Button>
           <Button 
             variant="ghost"
             onClick={handleDelete}
             className="h-11 w-11 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
           >
             <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-px">
          <TabsList className="bg-transparent h-12 p-0 flex gap-8">
            <TabsTrigger 
              value="details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent text-slate-400 data-[state=active]:text-blue-600 font-bold italic tracking-wide h-12 px-2 transition-all"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="movements" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent text-slate-400 data-[state=active]:text-emerald-600 font-bold italic tracking-wide h-12 px-2 transition-all"
            >
              Stock Movements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <Card className="p-8 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Item Name</label>
                           <p className="text-base font-bold italic text-slate-800 dark:text-slate-200">{product.name}</p>
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Category</label>
                           <p className="text-base font-bold italic text-slate-800 dark:text-slate-200">{product.category?.name || "Uncategorized"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Unit</label>
                               <p className="text-base font-bold italic text-slate-800 dark:text-slate-200">{product.unit}</p>
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">SKU</label>
                               <p className="text-base font-mono font-bold italic text-slate-800 dark:text-slate-200">{product.sku}</p>
                            </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Cost Price</label>
                              <p className="text-base font-mono font-bold italic text-slate-800 dark:text-slate-200">${product.costPrice.toFixed(2)}</p>
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Sale Price</label>
                              <p className="text-base font-mono font-bold italic text-blue-600 dark:text-blue-400">${product.sellingPrice.toFixed(2)}</p>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Type</label>
                           <Badge variant="outline" className="font-bold italic">{product.type}</Badge>
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-2">Warehouse</label>
                           <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                             <Package className="h-4 w-4 text-blue-500" />
                             <span className="font-bold italic">{product.warehouse?.name || "Main Warehouse"}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic block mb-3">Product Description</label>
                     <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">
                        {product.description || "No description provided for this catalog item."}
                     </p>
                  </div>
               </Card>
            </div>

            <div className="space-y-6">
               <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-black italic uppercase tracking-widest text-slate-400">Stock Info</h3>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <span className={cn(
                          "text-5xl font-black font-mono italic tracking-tighter transition-colors",
                          product.currentStock <= product.minimumStock ? "text-red-500" : "text-emerald-600"
                        )}>
                          {product.currentStock}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Current Units</span>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                           <span className="text-slate-500 font-bold italic">Status</span>
                           {getStatusBadge(product.status)}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                           <span className="text-slate-500 font-bold italic">Low Stock Alert</span>
                           <span className="font-mono font-bold italic text-amber-500">{product.minimumStock} Units</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                           <span className="text-slate-500 font-bold italic">Stock Value</span>
                           <span className="font-mono font-bold italic text-emerald-600">${(product.currentStock * product.costPrice).toFixed(2)}</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                        <Button 
                            onClick={() => setIsMovementModalOpen(true)}
                            className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black italic uppercase tracking-widest text-[10px]"
                        >
                            <History className="h-4 w-4 mr-2" />
                            Adjust Stock
                        </Button>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="animate-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">
                         <th className="px-6 py-4">Status & Date</th>
                         <th className="px-6 py-4 text-center">Type</th>
                         <th className="px-6 py-4 text-center">Qty</th>
                         <th className="px-6 py-4 text-center">Before</th>
                         <th className="px-6 py-4 text-center">After</th>
                         <th className="px-6 py-4">User</th>
                         <th className="px-6 py-4">Reference</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {movements.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                               No history records found for this product architecture.
                           </td>
                        </tr>
                      ) : (
                        movements.map((m) => (
                           <tr key={m.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 italic">{format(new Date(m.date), "MMM dd, yyyy")}</span>
                                    <span className="text-[10px] text-slate-400 italic font-mono">{format(new Date(m.date), "HH:mm")}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2 h-5 border-none",
                                    MOVEMENT_TYPES.find(t => t.value === m.type)?.bg || "bg-slate-100",
                                    MOVEMENT_TYPES.find(t => t.value === m.type)?.color || "text-slate-500"
                                 )}>
                                   {m.type}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <span className={cn(
                                    "font-mono font-black italic text-sm",
                                    m.type === 'IN' || m.type === 'RETURNED' ? "text-emerald-500" : 
                                    m.type === 'ADJUSTMENT' ? "text-blue-500" : "text-rose-500"
                                 )}>
                                    {m.type === 'IN' || m.type === 'RETURNED' ? '+' : ''}{m.quantity}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-center font-mono text-slate-400 font-bold text-xs">{m.beforeStock ?? "-"}</td>
                              <td className="px-6 py-4 text-center font-mono font-black text-slate-900 dark:text-white text-xs">{m.afterStock ?? "-"}</td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-slate-400 opacity-50" />
                                    <span className="text-xs font-bold text-slate-600 italic">
                                       {m.creator ? `${m.creator.firstName || ''} ${m.creator.lastName || ''}`.trim() : "System"}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-slate-400 italic tracking-wide">{m.referenceType || "MANUAL"}</span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 italic truncate max-w-[150px]">{m.notes || m.reference || "No notes"}</span>
                                 </div>
                              </td>
                           </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isMovementModalOpen} onOpenChange={setIsMovementModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden dark:bg-[#1f1a1d] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 bg-emerald-600 text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Post Inventory Event</DialogTitle>
                <DialogDescription className="text-emerald-50/70 font-bold italic text-[10px] uppercase tracking-wider">
                  Update stock levels for {product.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Product Info (Static) */}
              <div className="col-span-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Product Identity</span>
                          <span className="text-sm font-bold italic text-slate-800 dark:text-slate-200">{product.name}</span>
                      </div>
                      <div className="flex flex-col items-end text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Current Stock</span>
                          <span className="text-sm font-black font-mono italic text-blue-600">{product.currentStock} {product.unit}</span>
                      </div>
                  </div>
              </div>

              {/* Movement Type */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Movement Type</Label>
                <Select 
                  value={movementForm.type} 
                  onValueChange={(val) => setMovementForm(f => ({ ...f, type: val }))}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-bold italic">
                    <SelectValue placeholder="Choose Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                    {MOVEMENT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value} className={cn("italic font-bold", t.color)}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Quantity</Label>
                <Input 
                    type="number"
                    min="1"
                    value={movementForm.quantity}
                    onChange={e => setMovementForm(f => ({ ...f, quantity: parseInt(e.target.value) || 0 }))}
                    className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-black text-center text-lg italic font-mono"
                />
              </div>

              {/* Preview Card */}
              <div className="col-span-2 bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-dashed border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-black font-mono italic">{preview.current}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase italic whitespace-nowrap">Before</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                        <div className="flex flex-col items-center">
                            <span className={cn(
                                "text-lg font-black font-mono italic",
                                preview.diff > 0 ? "text-emerald-500" : preview.diff < 0 ? "text-rose-500" : "text-blue-500"
                            )}>
                                {preview.diff > 0 ? "+" : ""}{preview.diff}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase italic">Move</span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-slate-300" />
                        <div className="flex flex-col items-center">
                            <span className={cn(
                                "text-2xl font-black font-mono italic",
                                preview.newStock < 0 ? "text-red-600 underline" : "text-slate-900 dark:text-white"
                            )}>
                                {preview.newStock}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase italic">After</span>
                        </div>
                    </div>
                    {preview.newStock < 0 && (
                        <Badge className="bg-red-500 text-white font-black italic rounded-lg text-[8px] h-5 py-0 px-2">NEGATIVE STOCK</Badge>
                    )}
                  </div>
              </div>

              {/* Reason / Notes */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Reference / Reason</Label>
                <Textarea 
                  placeholder="Reference or reason for this adjustment..."
                  value={movementForm.reason}
                  onChange={e => setMovementForm(f => ({ ...f, reason: e.target.value }))}
                  className="rounded-xl border-slate-200 dark:border-white/5 italic font-medium min-h-[70px] resize-none text-xs"
                />
              </div>

              {/* Date */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Date</Label>
                <Input 
                  type="date"
                  value={movementForm.date}
                  onChange={e => setMovementForm(f => ({ ...f, date: e.target.value }))}
                  className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-bold italic text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-black/20 flex flex-row gap-3 shrink-0 border-t border-slate-100 dark:border-white/5 sticky bottom-0 z-10">
             <Button 
                variant="ghost" 
                onClick={() => setIsMovementModalOpen(false)}
                className="flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] italic border-none"
             >
                Cancel
             </Button>
             <Button 
                disabled={saving || preview.newStock < 0}
                onClick={handleSaveMovement}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] italic shadow-premium shadow-emerald-500/20"
             >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ClipboardList className="h-4 w-4 mr-2" />}
                Confirm Adjustment
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
