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
  User,
  ArrowUpLeft,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function StockPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("levels");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;

      if (activeTab === "levels") {
        const res = await api.get("/inventory/products", params);
        setProducts(res.data || []);
      } else {
        const dashboard = await api.get("/inventory/dashboard");
        setMovements(dashboard.data?.recentMovements || []);
      }
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusBadge = (product: any) => {
    const status = product.status;
    switch(status) {
        case 'In Stock': return <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold italic h-5">HEALTHY</Badge>;
        case 'Low Stock': return <Badge className="bg-amber-50 text-amber-600 border-none font-bold italic h-5">LOW STOCK</Badge>;
        case 'Out of Stock': return <Badge className="bg-red-50 text-red-600 border-none font-bold italic h-5">CRITICAL</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <Button variant="outline" onClick={() => navigate('/inventory/dashboard')} className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>Inventory Insights</span>
          </Button>
          <Button onClick={() => navigate('/inventory/products')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic leading-none">
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
                placeholder="Search..." 
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
                        <span className="text-[10px] font-mono text-slate-400 italic">SKU: {p.sku}</span>
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
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/inventory/products/${p.id}`)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                         <ArrowUpRight className="h-4 w-4" />
                      </Button>
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
           <table className="w-full text-left min-w-[900px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Reference</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium">
               {movements.map((m) => (
                 <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 text-[10px] font-bold font-mono text-slate-400">#{m.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-5">
                       <span className="font-bold text-slate-800 dark:text-slate-100 italic">{m.productName}</span>
                    </td>
                    <td className="px-6 py-5 text-slate-400 text-[10px]">{new Date(m.date).toLocaleString()}</td>
                    <td className="px-6 py-5 text-center">
                       <div className={cn(
                         "h-6 w-10 mx-auto flex items-center justify-center rounded-lg text-[10px] font-bold italic",
                         m.type === "IN" ? "bg-emerald-50 text-emerald-600" : 
                         m.type === "OUT" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                       )}>
                         {m.type}
                       </div>
                    </td>
                    <td className={cn("px-6 py-5 text-center font-bold font-mono italic text-sm", m.type === "IN" ? "text-emerald-500" : m.type === "OUT" ? "text-red-500" : "text-blue-500")}>
                      {m.type === "IN" ? "+" : "-"}{m.quantity}
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5 text-slate-500 text-[10px] italic">
                          <Warehouse className="h-3 w-3" /> {m.warehouse}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-slate-700 dark:text-slate-300 italic">{m.reference || "N/A"}</td>
                 </tr>
               ))}
               {movements.length === 0 && (
                   <tr>
                       <td colSpan={7} className="p-12 text-center text-slate-400 italic text-xs font-bold">No movements recorded yet.</td>
                   </tr>
               )}
             </tbody>
           </table>
         )}
      </Card>
      {!loading && (
          <div className="flex justify-center pt-4">
              <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-white/5 italic text-[10px] font-bold uppercase tracking-widest h-8 px-4">
                Total Products Monitored: {products.length}
              </Badge>
          </div>
      )}
    </div>
  );
}
