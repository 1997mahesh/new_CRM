import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  History,
  MoreVertical,
  ChevronRight,
  Search as SearchIcon,
  Columns,
  FileOutput,
  FileInput,
  Activity,
  Warehouse,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const STOCK_LEVELS = [
  { id: "1", product: "MacBook Pro M3 Max", category: "Electronics", current: 12, threshold: 5, status: "Healthy" },
  { id: "2", product: "Dell UltraSharp 27", category: "Displays", current: 84, threshold: 20, status: "Healthy" },
  { id: "3", product: "Magic Keyboard", category: "Accessories", current: 2, threshold: 10, status: "Low Stock" },
  { id: "4", product: "Logitech MX Master", category: "Accessories", current: 156, threshold: 50, status: "Healthy" },
  { id: "5", product: "iPhone 15 Case", category: "Accessories", current: 4, threshold: 10, status: "Low Stock" },
  { id: "6", product: "AA Batteries (Pk 4)", category: "Supplies", current: 12, threshold: 50, status: "Critical" },
  { id: "7", product: "HDMI 2.1 Cable", category: "Cables", current: 8, threshold: 25, status: "Low Stock" },
];

const MOVEMENTS = [
  { id: "MOV-001", product: "MacBook Pro M3", date: "May 06, 2024 14:22", type: "IN", qty: "+12", source: "PO-2024-102", user: "John D." },
  { id: "MOV-002", product: "Dell Monitor", date: "May 06, 2024 13:45", type: "OUT", qty: "-2", source: "SO-2024-551", user: "Sarah K." },
  { id: "MOV-003", product: "Logitech Mouse", date: "May 06, 2024 11:12", type: "ADJ", qty: "+1", source: "Manual Adjustment", user: "Admin" },
  { id: "MOV-004", product: "Magic Keyboard", date: "May 06, 2024 09:30", type: "OUT", qty: "-1", source: "SO-2024-548", user: "Sarah K." },
];

export default function StockPage() {
  const [activeTab, setActiveTab] = useState("levels");

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
             <Badge className="bg-red-50 text-red-500 border-none text-[8px] font-bold tracking-widest uppercase italic">4 Items Low Stock</Badge>
             <Badge className="bg-orange-50 text-orange-500 border-none text-[8px] font-bold tracking-widest uppercase italic">1 Item Critical</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>Manual Adjust</span>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic leading-none">
            <Plus className="h-4 w-4" />
             Transfer Stock
          </Button>
        </div>
      </div>

      {/* Tabs and Filter Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="levels" className="w-full md:w-auto" onValueChange={setActiveTab}>
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
               <Input placeholder="Search product or SKU..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Filter className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         {activeTab === "levels" ? (
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
               {STOCK_LEVELS.map((s) => (
                 <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                   <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{s.product}</span>
                   </td>
                   <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[9px] font-bold text-slate-400 h-5 border-none uppercase tracking-widest italic">{s.category}</Badge>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                         <span className={cn(
                           "text-lg font-bold font-mono tracking-tighter italic",
                           s.status === "Critical" ? "text-red-600 animate-pulse" : 
                           s.status === "Low Stock" ? "text-amber-500" : "text-slate-900 dark:text-white"
                         )}>{s.current}</span>
                         <span className="text-[8px] font-bold text-slate-400 uppercase italic">Units</span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-50">
                         <AlertTriangle className="h-3 w-3" />
                         <span className="text-xs font-bold font-mono">{s.threshold}</span>
                      </div>
                   </td>
                   <td className="px-6 py-5 text-center">
                      <Badge className={cn(
                        "text-[8px] font-bold uppercase h-4.5 px-2 border-none italic",
                        s.status === "Healthy" ? "bg-emerald-50 text-emerald-600" : 
                        s.status === "Critical" ? "bg-red-600 text-white shadow-premium" : "bg-amber-50 text-amber-600"
                      )}>
                        {s.status}
                      </Badge>
                   </td>
                   <td className="px-6 py-5 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                         <ArrowUpRight className="h-4 w-4" />
                      </Button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         ) : (
           <table className="w-full text-left min-w-[900px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4 text-right">User</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium">
               {MOVEMENTS.map((m) => (
                 <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 text-[10px] font-bold font-mono text-slate-400">#{m.id}</td>
                    <td className="px-6 py-5">
                       <span className="font-bold text-slate-800 dark:text-slate-100 italic">{m.product}</span>
                    </td>
                    <td className="px-6 py-5 text-slate-400 text-[10px]">{m.date}</td>
                    <td className="px-6 py-5 text-center">
                       <div className={cn(
                         "h-6 w-10 mx-auto flex items-center justify-center rounded-lg text-[10px] font-bold italic",
                         m.type === "IN" ? "bg-emerald-50 text-emerald-600" : 
                         m.type === "OUT" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                       )}>
                         {m.type}
                       </div>
                    </td>
                    <td className={cn("px-6 py-5 text-center font-bold font-mono italic", m.type === "IN" ? "text-emerald-500" : m.type === "OUT" ? "text-red-500" : "text-blue-500")}>
                      {m.qty}
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5 text-slate-500 text-[10px] italic">
                          <History className="h-3 w-3" /> {m.source}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-slate-700 dark:text-slate-300 italic">{m.user}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
      </Card>
    </div>
  );
}
