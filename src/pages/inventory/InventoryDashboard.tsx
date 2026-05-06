import React from "react";
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  TrendingUp, 
  Calendar,
  MoreVertical,
  Plus,
  ArrowRight,
  TrendingDown,
  Box,
  Truck,
  History,
  Activity,
  ArrowUpLeft,
  Search,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STOCK_VALUE_DATA = [
  { name: "Electronics", value: 45000, color: "#3b82f6" },
  { name: "Accessories", value: 12000, color: "#818cf8" },
  { name: "Storage", value: 8000, color: "#10b981" },
  { name: "Cables", value: 5000, color: "#f59e0b" },
];

const TOP_PRODUCTS = [
  { name: "MacBook Pro M3", sku: "LAP-001", stock: 125, value: "$245,000", percentage: 92, color: "bg-blue-500" },
  { name: "Dell UltraSharp 27", sku: "MON-042", stock: 84, value: "$52,000", percentage: 75, color: "bg-indigo-500" },
  { name: "Logitech MX Master", sku: "ACC-015", stock: 240, value: "$22,800", percentage: 60, color: "bg-emerald-500" },
  { name: "Sony WH-1000XM5", sku: "ACC-088", stock: 42, value: "$14,700", percentage: 45, color: "bg-amber-500" },
  { name: "Magic Keyboard", sku: "ACC-102", stock: 156, value: "$12,400", percentage: 35, color: "bg-slate-500" },
];

const RECENT_MOVEMENTS = [
  { product: "MacBook Pro M3", date: "2 mins ago", user: "John D.", qty: "+12", type: "IN", color: "text-emerald-500" },
  { product: "Dell Monitor", date: "15 mins ago", user: "Sarah K.", qty: "-2", type: "OUT", color: "text-red-500" },
  { product: "Magic Mouse", date: "1 hour ago", user: "Mike R.", qty: "+50", type: "IN", color: "text-emerald-500" },
  { product: "USB-C Hub", date: "3 hours ago", user: "Sarah K.", qty: "-5", type: "OUT", color: "text-red-500" },
];

const LOW_STOCK_PRODUCTS = [
  { name: "iPhone 15 Case", sku: "ACC-091", stock: 4, threshold: 10 },
  { name: "AA Batteries (Pk 4)", sku: "MISC-001", stock: 12, threshold: 50 },
  { name: "HDMI 2.1 Cable", sku: "CAB-012", stock: 8, threshold: 25 },
];

export default function InventoryDashboard() {
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
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm italic">
            Stock Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium italic">
            New Stock In
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: "1,248", sub: "+12 this week", icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Low Stock Items", value: "42", sub: "Requires attention", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Out of Stock", value: "3", sub: "Immediate restock needed", icon: Package, color: "text-red-600", bg: "bg-red-50" },
          { label: "Total Stock Value", value: "$1.42M", sub: "+5.2% from last month", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl transition-all hover:translate-y-[-2px]">
             <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2.5 rounded-xl", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-5 w-5", stat.color)} />
               </div>
               <Badge className="bg-slate-50 text-slate-400 dark:bg-white/5 border-none text-[9px] font-bold tracking-widest italic uppercase">Realtime</Badge>
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
               <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">{stat.value}</p>
               <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1 italic">
                  {stat.sub}
               </p>
             </div>
          </Card>
        ))}
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
            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">Full Inventory</Button>
          </div>
          <div className="space-y-6">
            {TOP_PRODUCTS.map((product, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{product.name}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">SKU: {product.sku} • Stock: {product.stock} units</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white italic font-mono">{product.value}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", product.color)} 
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
                   data={STOCK_VALUE_DATA}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {STOCK_VALUE_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-6">
              {STOCK_VALUE_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 italic">${(item.value/1000).toFixed(1)}k</span>
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
             <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-amber-600 hover:bg-amber-50 italic">Create PO</Button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-white/5">
             {LOW_STOCK_PRODUCTS.map((item, idx) => (
               <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium italic">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                       <span className="text-sm font-bold font-mono text-red-500">{item.stock}</span>
                       <span className="text-slate-300 text-[10px]">/</span>
                       <span className="text-xs font-bold text-slate-400 italic">{item.threshold}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Required Min</p>
                  </div>
               </div>
             ))}
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
             {RECENT_MOVEMENTS.map((move, idx) => (
               <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-xl font-bold text-[10px] italic shadow-sm",
                      move.type === "IN" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10" : "bg-red-50 text-red-600 dark:bg-red-600/10"
                    )}>
                      {move.type}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{move.product}</span>
                       <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 italic">
                         <Calendar className="h-2.5 w-2.5" />
                         {move.date} by {move.user}
                       </div>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold font-mono tracking-tighter italic", move.color)}>
                    {move.qty}
                  </span>
               </div>
             ))}
           </div>
        </Card>
      </div>
    </div>
  );
}
