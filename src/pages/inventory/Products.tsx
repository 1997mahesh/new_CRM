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
  History,
  Box,
  LayoutGrid,
  Filter,
  Columns,
  Layers,
  ArrowRight
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
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Column Toggle State
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("products_columns");
    return saved ? JSON.parse(saved) : ["Info", "SKU", "Status", "Cost", "Value", "Stock"];
  });

  const columns = [
    { id: "Info", label: "Product Info" },
    { id: "SKU", label: "SKU" },
    { id: "Status", label: "Status" },
    { id: "Cost", label: "Cost" },
    { id: "Value", label: "Value" },
    { id: "Stock", label: "Stock" }
  ];

  useEffect(() => {
    localStorage.setItem("products_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      const res = await api.get("/inventory/products", params);
      setProducts(res.data || []);
    } catch (error) {
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
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
          case 'In Stock': return <Badge className="bg-emerald-50 text-emerald-600 border-none font-black italic rounded-full px-3 h-5 text-[10px]">IN STOCK</Badge>;
          case 'Low Stock': return <Badge className="bg-amber-50 text-amber-600 border-none font-black italic rounded-full px-3 h-5 text-[10px]">LOW STOCK</Badge>;
          case 'Out of Stock': return <Badge className="bg-red-50 text-red-600 border-none font-black italic rounded-full px-3 h-5 text-[10px]">OUT OF STOCK</Badge>;
          default: return <Badge variant="outline" className="italic font-bold rounded-full">{status}</Badge>;
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
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600">
              <Box className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 italic">Products</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium italic">Manage your catalog, prices, and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()} className="bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 dark:text-slate-200 font-black h-10 px-4 rounded-xl shadow-sm gap-2 italic text-xs">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>

          <Button onClick={() => navigate("/inventory/products/new")} className="bg-blue-600 hover:bg-blue-700 text-white font-black h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic text-xs">
             <Plus className="h-4 w-4" />
             <span>New Product</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-2 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26] rounded-2xl shadow-soft transition-all ring-1 ring-slate-200 dark:ring-white/5">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 group w-full">
                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                 <Input 
                    placeholder="Search by name, SKU..." 
                    className="pl-10 h-10 border-transparent bg-slate-50 dark:bg-white/5 rounded-xl font-bold italic text-xs focus:bg-white dark:focus:bg-white/10 transition-all focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="ghost" className="h-10 px-4 text-slate-400 hover:text-blue-600 font-bold italic gap-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent hover:bg-blue-50/50">
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-wider">Filters</span>
                </Button>

                <div className="h-10 p-1 bg-slate-100 dark:bg-white/5 rounded-xl flex gap-1">
                   <Button variant="ghost" size="icon" className="h-8 w-8 bg-white dark:bg-white/10 shadow-sm rounded-lg text-blue-600">
                     <LayoutGrid className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg">
                     <Layers className="h-4 w-4" />
                   </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 px-4 text-slate-400 hover:text-slate-600 font-bold italic gap-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent">
                            <Columns className="h-4 w-4" />
                            <span className="text-[10px] uppercase tracking-wider">Columns</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl dark:bg-[#1C1F26] dark:border-white/10 shadow-premium">
                        <div className="px-2 py-2 mb-1 border-b border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase text-slate-400 italic">Toggle Columns</span>
                        </div>
                        {columns.map(col => (
                            <DropdownMenuItem 
                                key={col.id} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setVisibleColumns(prev => 
                                        prev.includes(col.id) ? prev.filter(c => c !== col.id) : [...prev, col.id]
                                    );
                                }}
                                className="flex items-center justify-between text-xs font-bold italic py-2 rounded-lg cursor-pointer transition-all"
                            >
                                <span>{col.label}</span>
                                {visibleColumns.includes(col.id) ? (
                                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full border-2 border-slate-200 dark:border-white/10" />
                                )}
                            </DropdownMenuItem>
                        ))}
                        <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                        <DropdownMenuItem 
                            onClick={() => setVisibleColumns(columns.map(c => c.id))}
                            className="text-[10px] font-black uppercase italic text-blue-500 justify-center py-2 rounded-lg"
                        >
                            Reset Defaults
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
      </Card>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/5">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[900px]">
             <thead>
               <tr className="text-[10px] uppercase font-black italic tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  {visibleColumns.includes("Info") && <th className="px-6 py-5">Product Info</th>}
                  {visibleColumns.includes("SKU") && <th className="px-6 py-5">SKU</th>}
                  {visibleColumns.includes("Status") && <th className="px-6 py-5">Status</th>}
                  {visibleColumns.includes("Cost") && <th className="px-6 py-5 text-right">Cost</th>}
                  {visibleColumns.includes("Value") && <th className="px-6 py-5 text-right">Value</th>}
                  {visibleColumns.includes("Stock") && <th className="px-6 py-5 text-center">Stock</th>}
                  <th className="px-6 py-5 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5">
               {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                   <tr key={i}>
                     <td colSpan={7} className="px-6 py-6"><Skeleton className="h-12 w-full rounded-xl" /></td>
                   </tr>
                 ))
               ) : products.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic font-bold">No products found in the database.</td>
                 </tr>
               ) : products.map((p) => (
                 <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all group">
                   {visibleColumns.includes("Info") && (
                     <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-200/50 dark:border-white/5 overflow-hidden">
                            <Package className="h-5 w-5 transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/inventory/products/${p.id}`)}>
                             <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic tracking-tight group-hover:text-blue-600 transition-colors">{p.name}</span>
                             <div className="flex items-center gap-2 mt-1 opacity-70">
                               <span className="text-[10px] text-slate-500 font-bold italic">{p.category?.name || "Uncategorized"}</span>
                               <span className="text-[10px] text-slate-300">•</span>
                               <span className="text-[10px] text-slate-500 font-bold italic">{p.warehouse?.name || "Main Warehouse"}</span>
                             </div>
                          </div>
                        </div>
                     </td>
                   )}
                   {visibleColumns.includes("SKU") && (
                     <td className="px-6 py-5">
                       <span className="font-mono font-black text-xs text-slate-500 italic bg-blue-50/50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-blue-100/30 dark:border-transparent">{p.sku}</span>
                     </td>
                   )}
                   {visibleColumns.includes("Status") && (
                     <td className="px-6 py-5 whitespace-nowrap">
                        {getStatusBadge(p.status)}
                     </td>
                   )}
                   {visibleColumns.includes("Cost") && (
                     <td className="px-6 py-5 text-right font-bold text-slate-800 dark:text-slate-200 font-mono italic text-xs">
                        {formatCurrency(p.costPrice)}
                     </td>
                   )}
                   {visibleColumns.includes("Value") && (
                     <td className="px-6 py-5 text-right font-black text-emerald-600 font-mono italic text-xs">
                        {formatCurrency(p.costPrice * p.currentStock)}
                     </td>
                   )}
                   {visibleColumns.includes("Stock") && (
                     <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center">
                           <span className={cn(
                             "text-lg font-black font-mono italic tracking-tighter",
                             p.currentStock <= p.minimumStock ? "text-red-500" : "text-slate-800 dark:text-white"
                           )}>
                             {p.currentStock}
                           </span>
                           <span className="text-[9px] font-black text-slate-400 uppercase italic opacity-40 -mt-1 tracking-widest">Units</span>
                        </div>
                     </td>
                   )}
                   <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                         <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/products/${p.id}`)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg">
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-xl dark:bg-[#1C1F26] dark:border-white/10 shadow-premium p-1">
                              <DropdownMenuItem onClick={() => navigate(`/inventory/products/${p.id}`)} className="text-xs font-bold gap-3 py-2.5 cursor-pointer italic px-3 rounded-lg">
                                <History className="h-4 w-4 text-amber-500" /> Stock Movements
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/inventory/products/${p.id}/edit`)} className="text-xs font-bold gap-3 py-2.5 cursor-pointer italic px-3 rounded-lg">
                                <Edit2 className="h-4 w-4 text-blue-500" /> Edit Product
                              </DropdownMenuItem>
                              <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                              <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-xs font-bold gap-3 py-2.5 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer italic px-3 rounded-lg">
                                <Trash2 className="h-4 w-4" /> Delete Product
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
          <div className="bg-slate-50/50 dark:bg-white/5 px-8 py-5 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono">
                Inventory Engine 3.0 • {products.length} Items Indexed • Ready for Scan
              </span>
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="sm" className="h-9 px-4 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-600 rounded-xl">Previous</Button>
                <div className="flex items-center gap-1.5 mx-2">
                    <Badge className="bg-blue-600 text-white h-9 w-9 flex items-center justify-center rounded-xl italic font-black shadow-lg shadow-blue-500/20">1</Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-9 px-4 text-[10px] font-black uppercase italic text-slate-400 hover:text-blue-600 rounded-xl">Next</Button>
              </div>
          </div>
         )}
      </Card>
    </div>
  );
}
