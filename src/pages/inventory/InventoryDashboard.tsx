import React, { useState, useEffect, useCallback } from "react";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Plus,
  Box,
  Activity,
  Search,
  Filter,
  RefreshCw,
  FileDown
} from "lucide-react";
import { 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    warehouseId: "all",
    categoryId: "all"
  });
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [stockEntryForm, setStockEntryForm] = useState({
    productId: "",
    warehouseId: "",
    quantity: 1,
    type: "IN",
    reason: "Stock In",
    notes: "",
    referenceType: "MANUAL"
  });
  const [products, setProducts] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.warehouseId !== "all") params.warehouseId = filters.warehouseId;
      if (filters.categoryId !== "all") params.categoryId = filters.categoryId;

      const [dashboardRes, whRes, catRes, prodRes] = await Promise.all([
        api.get("/inventory/dashboard", params),
        api.get("/inventory/warehouses"),
        api.get("/inventory/categories"),
        api.get("/inventory/products")
      ]);

      setStats(dashboardRes.data);
      setWarehouses(whRes.data || []);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleStockEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/inventory/products/adjust", stockEntryForm);
      if (res.error) throw new Error(res.error);
      
      toast.success("Stock updated successfully");
      setIsStockInModalOpen(false);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
  };

  const COLORS = ['#3b82f6', '#818cf8', '#10b981', '#f59e0b', '#64748b', '#ec4899', '#8b5cf6'];

  if (loading && !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
        <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-bold italic animate-pulse">Loading Inventory Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2">
             <Package className="h-6 w-6 text-blue-600" />
             <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Inventory Dashboard</h1>
           </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Analyze stock levels, values, and movements across all locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()} className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm italic">
            <FileDown className="h-4 w-4 mr-2" />
            Stock Report
          </Button>

          <Dialog open={isStockInModalOpen} onOpenChange={setIsStockInModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium italic">
                <Plus className="h-4 w-4 mr-2" />
                New Stock In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="italic font-bold">New stock Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleStockEntry} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select 
                    value={stockEntryForm.productId} 
                    onValueChange={(v) => setStockEntryForm(p => ({ ...p, productId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouseId">Warehouse</Label>
                  <Select 
                    value={stockEntryForm.warehouseId} 
                    onValueChange={(v) => setStockEntryForm(p => ({ ...p, warehouseId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                        value={stockEntryForm.type} 
                        onValueChange={(v) => setStockEntryForm(p => ({ ...p, type: v }))}
                    >
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="IN">Stock In</SelectItem>
                        <SelectItem value="OUT">Stock Out</SelectItem>
                        <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      value={stockEntryForm.quantity} 
                      onChange={(e) => setStockEntryForm(p => ({ ...p, quantity: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    value={stockEntryForm.notes} 
                    onChange={(e) => setStockEntryForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Reference #, supplier, or reason..."
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full bg-blue-600 font-bold italic">
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Confirm Entry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic leading-none">Filters:</span>
        </div>
        
        <Select 
            value={filters.warehouseId} 
            onValueChange={(v) => setFilters(p => ({ ...p, warehouseId: v }))}
        >
            <SelectTrigger className="w-[180px] h-9 text-xs font-bold italic border-none bg-slate-50 dark:bg-white/5">
                <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
            </SelectContent>
        </Select>

        <Select 
            value={filters.categoryId} 
            onValueChange={(v) => setFilters(p => ({ ...p, categoryId: v }))}
        >
            <SelectTrigger className="w-[180px] h-9 text-xs font-bold italic border-none bg-slate-50 dark:bg-white/5">
                <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
        </Select>

        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilters({ warehouseId: "all", categoryId: "all" })}
            className="text-xs font-bold text-slate-400 hover:text-blue-600 h-9 italic"
        >
            Reset
        </Button>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats?.totalProducts || 0, sub: "Items in catalog", icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Stock Value", value: formatCurrency(stats?.totalStockValue || 0), sub: "Total asset valuation", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Fulfill", value: stats?.pendingFulfillments || 0, sub: "Outgoing sales orders", icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Incoming Stock", value: stats?.pendingPurchaseOrders || 0, sub: "Active purchase orders", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, idx) => (
          <Card key={idx} className={cn(
            "p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl transition-all hover:translate-y-[-2px]"
          )}>
             <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2.5 rounded-xl", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-5 w-5", stat.color)} />
               </div>
               <Badge className="bg-slate-50 text-slate-400 dark:bg-white/5 border-none text-[9px] font-bold tracking-widest italic uppercase">Realtime</Badge>
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
               <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">{stat.value}</p>
               <p className="text-[10px] font-medium mt-1 flex items-center gap-1 italic text-slate-400">
                  {stat.sub}
               </p>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 border-l-4 border-l-amber-500 bg-white dark:bg-[#211c1f] flex items-center justify-between">
              <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Low Stock Alerts</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white italic">{stats?.lowStockCount || 0} Items</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/inventory/products?status=Low Stock')} className="text-[10px] font-bold text-amber-600 italic">View All</Button>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500 bg-white dark:bg-[#211c1f] flex items-center justify-between">
              <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Out of Stock</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white italic">{stats?.outOfStockCount || 0} Items</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/inventory/products?status=Out of Stock')} className="text-[10px] font-bold text-red-600 italic">View All</Button>
          </Card>
      </div>

      {/* Main Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products by Stock Value */}
        <Card className="lg:col-span-2 border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 italic">Top Products by Stock Value</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Focus inventory management on high-value assets</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/inventory/products')} className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">Full Inventory</Button>
          </div>
          <div className="space-y-6">
            {stats?.topProducts?.map((product: any, idx: number) => {
              const maxVal = stats.topProducts[0]?.value || 1;
              const percentage = (product.value / maxVal) * 100;
              return (
                <div key={idx} className="space-y-2 cursor-pointer" onClick={() => navigate(`/inventory/products/${product.id}`)}>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{product.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">SKU: {product.sku} • Stock: {product.stock} units</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white italic font-mono">{formatCurrency(product.value)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000 shadow-sm")} 
                      style={{ width: `${percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stock Value Distribution */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col">
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Value Distribution</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Stock value by category</p>
           <div className="h-[280px] w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={stats?.categoryDistribution || []}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {(stats?.categoryDistribution || []).map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <RechartsTooltip formatter={(v: number) => formatCurrency(v)} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-6">
              {(stats?.categoryDistribution || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 italic">{formatCurrency(item.value)}</span>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Low Stock Alerts */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden shadow-premium">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
               <AlertTriangle className="h-4 w-4 text-amber-500" />
               Low Stock Alerts
             </h2>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/purchase/create')}
                className="h-8 text-[11px] font-bold text-amber-600 hover:bg-amber-50 italic"
            >
                Create PO
            </Button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-white/5">
             {products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').slice(0, 5).map((item, idx) => (
               <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/inventory/products/${item.id}`)}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium italic">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                       <span className="text-sm font-bold font-mono text-red-500">{item.currentStock}</span>
                       <span className="text-slate-300 text-[10px]">/</span>
                       <span className="text-xs font-bold text-slate-400 italic">{item.minimumStock}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Required Min</p>
                  </div>
               </div>
             ))}
             {products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-xs font-bold">
                    All stock levels are healthy!
                </div>
             )}
           </div>
        </Card>

        {/* Recent Stock Movements */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
               <Activity className="h-4 w-4 text-blue-500" />
               Recent Stock Movements
             </h2>
             <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">Full Log</Button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-white/5">
             {stats?.recentMovements?.map((move: any, idx: number) => (
               <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-xl font-bold text-[10px] italic shadow-sm",
                      move.type === "IN" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10" : 
                      move.type === "OUT" ? "bg-red-50 text-red-600 dark:bg-red-600/10" :
                      "bg-blue-50 text-blue-600 dark:bg-blue-600/10"
                    )}>
                      {move.type}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{move.productName}</span>
                       <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 italic">
                         <Calendar className="h-2.5 w-2.5" />
                         {new Date(move.date).toLocaleString()} {move.reference ? `• Ref: ${move.reference}` : ''}
                       </div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-bold font-mono tracking-tighter italic", 
                    move.type === 'IN' ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {move.type === 'IN' ? '+' : '-'}{move.quantity}
                  </span>
               </div>
             ))}
             {(!stats?.recentMovements || stats.recentMovements.length === 0) && (
                <div className="p-8 text-center text-slate-400 italic text-xs font-bold">
                    No recent movements recorded.
                </div>
             )}
           </div>
        </Card>
      </div>
    </div>
  );
}
