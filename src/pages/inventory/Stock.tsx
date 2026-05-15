import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Filter, 
  Package,
  AlertTriangle,
  ArrowUpRight,
  History,
  ChevronRight,
  Search as SearchIcon,
  Activity,
  Warehouse,
  Box,
  RefreshCw,
  User as UserIcon,
  ArrowUpLeft,
  ArrowDownRight,
  ClipboardList,
  Calendar,
  Info,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const MOVEMENT_TYPES = [
  { value: "IN", label: "Stock In", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { value: "OUT", label: "Stock Out", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  { value: "ADJUSTMENT", label: "Adjustment", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { value: "DAMAGED", label: "Damaged", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { value: "RETURNED", label: "Returned", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
];

export default function StockPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("levels");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Manual Movement State
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState({
    productId: "",
    type: "IN",
    quantity: 1,
    reason: "",
    notes: "",
    date: format(new Date(), "yyyy-MM-dd"),
    warehouseId: ""
  });
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;

      const [prodRes, moveRes] = await Promise.all([
        api.get("/inventory/products", params),
        api.get("/inventory/movements", { limit: 10 })
      ]);
      
      setProducts(prodRes.data || []);
      setMovements(moveRes.data || []);
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenMovement = (product?: any) => {
    setSelectedProduct(product || null);
    setMovementForm({
      productId: product?.id || "",
      type: "IN",
      quantity: 1,
      reason: "",
      notes: "",
      date: format(new Date(), "yyyy-MM-dd"),
      warehouseId: product?.warehouseId || ""
    });
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = async () => {
    if (!movementForm.productId) return toast.error("Please select a product");
    if (movementForm.quantity <= 0) return toast.error("Quantity must be greater than 0");

    try {
      setSaving(true);
      const res = await api.post("/inventory/adjust-stock", movementForm);
      if (res.error) throw new Error(res.error);
      
      toast.success("Stock movement recorded successfully");
      setIsMovementModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to record movement");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (product: any) => {
    const status = product.status;
    switch(status) {
        case 'In Stock': return <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold italic h-5">HEALTHY</Badge>;
        case 'Low Stock': return <Badge className="bg-amber-50 text-amber-600 border-none font-bold italic h-5">LOW STOCK</Badge>;
        case 'Out of Stock': return <Badge className="bg-red-50 text-red-600 border-none font-bold italic h-5">CRITICAL</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculatePreview = () => {
    if (!selectedProduct) return null;
    const current = selectedProduct.currentStock;
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
  };

  const preview = calculatePreview();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Stock Management</h1>
          </div>
          <div className="flex items-center gap-2">
             <Badge className="bg-slate-50 text-slate-400 border-none text-[8px] font-bold tracking-widest uppercase italic">Real-time tracking activated</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleOpenMovement()}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-11 px-6 rounded-xl shadow-sm gap-2 italic text-xs uppercase tracking-widest border-emerald-500/20 text-emerald-600"
          >
            <History className="h-4 w-4" />
            Manual Movement
          </Button>
          <Button onClick={() => navigate('/inventory/products')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 rounded-xl shadow-premium gap-2 tracking-widest uppercase text-[10px] italic">
            <Plus className="h-4 w-4" />
             Stock Entries
          </Button>
        </div>
      </div>

      {/* Tabs and Filter Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs value={activeTab} className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="levels" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6 gap-2">
                <Box className="h-3.5 w-3.5" /> Levels
              </TabsTrigger>
              <TabsTrigger value="movements" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6 gap-2">
                <History className="h-3.5 w-3.5" /> Movements
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-72 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               <Input 
                placeholder="Search SKU or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" 
               />
             </div>
             <Button variant="outline" onClick={() => fetchData()} disabled={loading} size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
             </Button>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         {loading && (
             <div className="p-12 text-center text-slate-400 italic text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin" />
                Retrieving Stock Intelligence...
             </div>
         )}
         {!loading && activeTab === "levels" ? (
           <table className="w-full text-left min-w-[800px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">In Stock</th>
                  <th className="px-6 py-4 text-center">Safety Stock</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
               {products.map((p) => (
                 <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 italic font-bold">SKU: {p.sku}</span>
                      </div>
                   </td>
                   <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[9px] font-bold text-slate-400 h-5 border-none uppercase tracking-widest italic">{p.category?.name || "General"}</Badge>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                         <span className={cn(
                           "text-lg font-bold font-mono tracking-tighter italic",
                           p.status === "Out of Stock" ? "text-red-600" : 
                           p.status === "Low Stock" ? "text-amber-500" : "text-slate-900 dark:text-white"
                         )}>{p.currentStock}</span>
                         <span className="text-[8px] font-bold text-slate-400 uppercase italic">Units</span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-50">
                         <AlertTriangle className="h-3 w-3" />
                         <span className="text-xs font-bold font-mono">{p.minimumStock}</span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      {getStatusBadge(p)}
                   </td>
                   <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== "In Stock" && (
                            <Button 
                              onClick={() => handleOpenMovement(p)}
                              className="h-8 px-3 text-[9px] font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white rounded-lg italic"
                            >
                                Restock
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/products/${p.id}`)} className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 rounded-xl">
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                   </td>
                 </tr>
               ))}
               {products.length === 0 && (
                   <tr>
                       <td colSpan={6} className="p-12 text-center text-slate-400 italic text-xs font-bold">No products matching your search.</td>
                   </tr>
               )}
             </tbody>
           </table>
         ) : !loading && (
           <table className="w-full text-left min-w-[1000px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-center">Before</th>
                  <th className="px-6 py-4 text-center">After</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Reference</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium italic">
               {movements.map((m) => (
                 <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100">{m.product?.name || m.productName}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{m.product?.sku || m.sku}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 h-5 border-none",
                          MOVEMENT_TYPES.find(t => t.value === m.type)?.bg || "bg-slate-100",
                          MOVEMENT_TYPES.find(t => t.value === m.type)?.color || "text-slate-500"
                       )}>
                         {m.type}
                       </Badge>
                    </td>
                    <td className={cn("px-6 py-5 text-center font-black font-mono text-sm tracking-tighter", 
                        m.type === "IN" || m.type === "RETURNED" ? "text-emerald-500" : 
                        m.type === "ADJUSTMENT" ? "text-blue-500" : "text-rose-500"
                    )}>
                      {m.type === "IN" || m.type === "RETURNED" ? "+" : ""}{m.quantity}
                    </td>
                    <td className="px-6 py-5 text-center font-mono text-slate-400 font-bold">{m.beforeStock ?? "-"}</td>
                    <td className="px-6 py-5 text-center font-mono font-black text-slate-900 dark:text-white">{m.afterStock ?? "-"}</td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                          <UserIcon className="h-3 w-3 opacity-50" /> {m.creator ? `${m.creator.firstName} ${m.creator.lastName}` : "System"}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex flex-col">
                            <span className="text-slate-700 dark:text-slate-300 font-bold text-[10px]">{format(new Date(m.date), "MMM dd, yyyy")}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{format(new Date(m.date), "HH:mm")}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.referenceType || "MANUAL"}</span>
                            <span className="text-[9px] text-slate-400 max-w-[120px] truncate">{m.notes || m.reference || "No notes"}</span>
                        </div>
                    </td>
                 </tr>
               ))}
               {movements.length === 0 && (
                   <tr>
                       <td colSpan={8} className="p-12 text-center text-slate-400 italic text-xs font-bold">No movements recorded yet.</td>
                   </tr>
               )}
             </tbody>
           </table>
         )}
      </Card>

      <Dialog open={isMovementModalOpen} onOpenChange={setIsMovementModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden dark:bg-[#1f1a1d] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-6 bg-emerald-600 text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Manual Stock Movement</DialogTitle>
                <DialogDescription className="text-emerald-50/70 font-bold italic text-[10px] uppercase tracking-wider">
                  Adjust inventory levels manually.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Product Selection */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Select Product</Label>
                <Select 
                  value={movementForm.productId} 
                  onValueChange={(id) => {
                    const p = products.find(x => x.id === id);
                    setSelectedProduct(p);
                    setMovementForm(f => ({ ...f, productId: id, warehouseId: p?.warehouseId || "" }));
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-bold italic bg-slate-50/50 dark:bg-white/5">
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px] rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id} className="italic font-bold py-2.5">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          <span className="text-[9px] font-mono text-slate-400">SKU: {p.sku} | In Stock: {p.currentStock} {p.unit}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Movement Type */}
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Movement Type</Label>
                <Select 
                  value={movementForm.type} 
                  onValueChange={(val) => setMovementForm(f => ({ ...f, type: val }))}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-bold italic">
                    <SelectValue placeholder="Type" />
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
                <div className="flex items-center gap-2 group">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setMovementForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                        className="h-10 w-10 rounded-xl border-slate-200 group-focus-within:border-emerald-500 transition-colors"
                    >
                        -
                    </Button>
                    <Input 
                        type="number"
                        min="1"
                        value={movementForm.quantity}
                        onChange={e => setMovementForm(f => ({ ...f, quantity: parseInt(e.target.value) || 0 }))}
                        className="h-10 rounded-xl border-slate-200 dark:border-white/5 font-black text-center text-base italic font-mono"
                    />
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setMovementForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                        className="h-10 w-10 rounded-xl border-slate-200 group-focus-within:border-emerald-500 transition-colors"
                    >
                        +
                    </Button>
                </div>
              </div>

              {/* Preview Card */}
              {preview && (
                  <div className="col-span-2 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-white/10">
                     <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic mb-1">Stock Preview</span>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    <span className="text-base font-black font-mono italic">{preview.current}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase italic">Current</span>
                                </div>
                                <ArrowRight className="h-3 w-3 text-slate-300" />
                                <div className="flex flex-col items-center">
                                    <span className={cn(
                                        "text-base font-black font-mono italic",
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
                                    <span className="text-[8px] font-bold text-slate-400 uppercase italic">Final</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {preview.newStock < 0 && (
                                <Badge className="bg-red-500 text-white border-none font-bold italic text-[9px] h-5 py-0">
                                    <AlertTriangle className="h-2.5 w-2.5 mr-1" /> INVALID
                                </Badge>
                            )}
                            {preview.newStock <= (selectedProduct.minimumStock || 10) && preview.newStock >= 0 && (
                                <Badge className="bg-amber-500 text-white border-none font-bold italic text-[9px] h-5 py-0">REORDER</Badge>
                            )}
                        </div>
                     </div>
                  </div>
              )}

              {/* Reason / Notes */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Reference / Reason</Label>
                <Textarea 
                  placeholder="e.g. Damage, Supplier correction..."
                  value={movementForm.reason}
                  onChange={e => setMovementForm(f => ({ ...f, reason: e.target.value }))}
                  className="rounded-xl border-slate-200 dark:border-white/5 italic font-medium min-h-[70px] resize-none text-xs"
                />
              </div>

              {/* Date */}
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Date</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="date"
                      value={movementForm.date}
                      onChange={e => setMovementForm(f => ({ ...f, date: e.target.value }))}
                      className="pl-10 h-11 rounded-xl border-slate-200 dark:border-white/5 font-bold italic text-sm"
                    />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-black/20 flex flex-row gap-3 shrink-0 border-t border-slate-100 dark:border-white/5 z-10 sticky bottom-0">
             <Button 
                variant="ghost" 
                onClick={() => setIsMovementModalOpen(false)}
                className="flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] italic"
             >
                Cancel
             </Button>
             <Button 
                disabled={saving || (preview && preview.newStock < 0)}
                onClick={handleSaveMovement}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] italic shadow-premium shadow-emerald-500/20"
             >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ClipboardList className="h-4 w-4 mr-2" />}
                Save Movement
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
