import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search as SearchIcon, 
  Download, 
  Package,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Layers,
  Columns,
  Tag,
  AlertCircle,
  Box,
  LayoutGrid,
  Truck,
  RefreshCw,
  Filter,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    categoryId: "",
    warehouseId: "",
    vendorId: "",
    costPrice: 0,
    currentStock: 0,
    minimumStock: 10,
    uom: "Unit"
  });

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      
      const [prodRes, whRes, catRes, venRes] = await Promise.all([
        api.get("/inventory/products", params),
        api.get("/inventory/warehouses"),
        api.get("/inventory/categories"),
        api.get("/purchase/vendors")
      ]);
      
      setProducts(prodRes.data || []);
      setWarehouses(whRes.data || []);
      setCategories(catRes.data || []);
      setVendors(venRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post("/inventory/products", form);
      if (res.error) throw new Error(res.error);
      
      toast.success("Product created successfully");
      setIsCreateModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      description: "",
      categoryId: "",
      warehouseId: "",
      vendorId: "",
      costPrice: 0,
      currentStock: 0,
      minimumStock: 10,
      uom: "Unit"
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/inventory/products/${id}`);
      toast.success("Product deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'In Stock': return <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold italic h-5">IN STOCK</Badge>;
          case 'Low Stock': return <Badge className="bg-amber-50 text-amber-600 border-none font-bold italic h-5">LOW STOCK</Badge>;
          case 'Out of Stock': return <Badge className="bg-red-50 text-red-600 border-none font-bold italic h-5">OUT OF STOCK</Badge>;
          case 'Overstocked': return <Badge className="bg-blue-50 text-blue-600 border-none font-bold italic h-5">OVERSTOCKED</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Products</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage your catalog, prices, and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()} className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
                <Plus className="h-4 w-4" />
                <span>New Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="italic font-bold">Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. MacBook Pro M3" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. LAP-001" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={form.categoryId} onValueChange={v => setForm(f => ({ ...f, categoryId: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Warehouse</Label>
                        <Select value={form.warehouseId} onValueChange={v => setForm(f => ({ ...f, warehouseId: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select Warehouse" /></SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="costPrice">Cost Price</Label>
                        <Input id="costPrice" type="number" step="0.01" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) }))} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currentStock">Initial Stock</Label>
                        <Input id="currentStock" type="number" value={form.currentStock} onChange={e => setForm(f => ({ ...f, currentStock: parseInt(e.target.value) }))} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minimumStock">Min. Stock Alert</Label>
                        <Input id="minimumStock" type="number" value={form.minimumStock} onChange={e => setForm(f => ({ ...f, minimumStock: parseInt(e.target.value) }))} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product details..." />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={saving} className="bg-blue-600 font-bold italic w-full">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <Input 
                placeholder="Search name, SKU..." 
                className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 bg-white dark:bg-white/5 shadow-soft border border-slate-100 dark:border-white/5 rounded-xl">
                <Filter className="h-4 w-4" />
            </Button>
            <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl flex gap-1 h-10">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white dark:bg-white/10 shadow-sm rounded-lg text-blue-600">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg">
                <Columns className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[900px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                  <th className="px-6 py-4 text-right">Value</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
               {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                   <tr key={i}>
                     <td colSpan={7} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-xl" /></td>
                   </tr>
                 ))
               ) : products.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">No products found. Start by adding items to your inventory.</td>
                 </tr>
               ) : products.map((p) => (
                 <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 flex items-center justify-center bg-slate-50 dark:bg-white/5 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/inventory/products/${p.id}`)}>
                           <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{p.name}</span>
                           <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[10px] text-slate-400 italic font-medium">{p.category?.name || "Uncategorized"}</span>
                             <span className="text-slate-200 text-[10px]">•</span>
                             <span className="text-[10px] text-slate-400 italic font-medium">{p.warehouse?.name || "Main Warehouse"}</span>
                           </div>
                        </div>
                      </div>
                   </td>
                   <td className="px-6 py-5">
                     <span className="font-mono font-bold text-slate-500 italic bg-blue-50/30 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-blue-100/50 dark:border-none">{p.sku}</span>
                   </td>
                   <td className="px-6 py-5">
                      {getStatusBadge(p.status)}
                   </td>
                   <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white font-mono italic">
                      {formatCurrency(p.costPrice)}
                   </td>
                   <td className="px-6 py-5 text-right font-bold text-emerald-600 font-mono italic">
                      {formatCurrency(p.costPrice * p.currentStock)}
                   </td>
                   <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                         <span className={cn(
                           "text-base font-bold font-mono tracking-tighter italic",
                           p.currentStock <= p.minimumStock ? "text-red-500" : "text-slate-900 dark:text-white"
                         )}>
                           {p.currentStock}
                         </span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase italic opacity-50">Units</span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                         <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/products/${p.id}`)} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 shadow-premium border-white/5 p-1">
                              <DropdownMenuItem className="text-xs font-bold gap-2 py-2 cursor-pointer">
                                <Activity className="h-3.5 w-3.5" /> Stock Movements
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-bold gap-2 py-2 cursor-pointer">
                                <Edit2 className="h-3.5 w-3.5" /> Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-xs font-bold gap-2 py-2 text-red-500 focus:text-red-600 cursor-pointer">
                                <Trash2 className="h-3.5 w-3.5" /> Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         {/* Pagination Footer */}
         {!loading && products.length > 0 && (
          <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic font-mono">
                Inventory Intelligence • {products.length} Products Scanned
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
                <Badge className="bg-blue-600 text-white h-8 px-3 rounded-xl italic font-bold">PAGE 1</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
              </div>
          </div>
         )}
      </Card>
    </div>
  );
}
