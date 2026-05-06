import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ShoppingCart, 
  MoreVertical,
  Eye,
  FileText,
  Trash2,
  Calendar,
  MoreHorizontal,
  LayoutDashboard,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "SO-2024-001", customer: "Global Trade Corp", status: "Confirmed", date: "May 01, 2024", total: "$8,450.00", items: 3 },
  { id: "SO-2024-002", customer: "TechFlow Solutions", status: "Processing", date: "Apr 28, 2024", total: "$5,200.00", items: 5 },
  { id: "SO-2024-003", customer: "Nexa Logistics", status: "Shipped", date: "May 03, 2024", total: "$12,500.00", items: 12 },
  { id: "SO-2024-004", customer: "Zenith Design", status: "Delivered", date: "Apr 25, 2024", total: "$3,100.00", items: 2 },
  { id: "SO-2024-005", customer: "Alpha Tech", status: "Cancelled", date: "Apr 15, 2024", total: "$650.00", items: 1 },
  { id: "SO-2024-006", customer: "Blue Sky Media", status: "Processing", date: "May 02, 2024", total: "$2,800.00", items: 4 },
  { id: "SO-2024-007", customer: "Prime Properties", status: "Confirmed", date: "May 04, 2024", total: "$1,400.00", items: 1 },
];

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400", icon: FileText },
  "Confirmed": { label: "Confirmed", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400", icon: CheckCircle },
  "Processing": { label: "Processing", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400", icon: Clock },
  "Shipped": { label: "Shipped", color: "bg-purple-50 text-purple-600 dark:bg-purple-600/10 dark:text-purple-400", icon: Truck },
  "Delivered": { label: "Delivered", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400", icon: Package },
  "Cancelled": { label: "Cancelled", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400", icon: XCircle },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = activeTab === "all" 
    ? ORDERS 
    : ORDERS.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Sales Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track and manage your order fulfillment workflow.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {/* Tabs and Actions Row */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
          <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
             <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl w-full lg:w-auto justify-start">
               <TabsTrigger value="all" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">All</TabsTrigger>
               <TabsTrigger value="confirmed" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Confirmed</TabsTrigger>
               <TabsTrigger value="processing" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Processing</TabsTrigger>
               <TabsTrigger value="shipped" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Shipped</TabsTrigger>
               <TabsTrigger value="delivered" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Delivered</TabsTrigger>
               <TabsTrigger value="cancelled" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Cancelled</TabsTrigger>
             </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input placeholder="Search order number..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Filter className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Grid view for Desktop, list for overall */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                   <th className="px-6 py-4">Order Details</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Order Date</th>
                   <th className="px-6 py-4">Total Amount</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2.5 rounded-xl transition-all group-hover:scale-110 shadow-sm",
                            STATUS_CONFIG[o.status].color
                          )}>
                             <ShoppingCart className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{o.id}</span>
                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter italic">{o.items} Items ordered</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{o.customer}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", STATUS_CONFIG[o.status].color.split(' ')[1].replace('text-', 'bg-'))}></div>
                          <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-tighter px-2 h-5 border-none", STATUS_CONFIG[o.status].color)}>
                            {o.status}
                          </Badge>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium italic">{o.date}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[14px] font-bold text-slate-900 dark:text-white font-mono tracking-tighter italic decoration-blue-500/20 underline underline-offset-4">{o.total}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                               <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 dark:focus:bg-blue-600/10">
                                 <Truck className="h-3.5 w-3.5 text-blue-500" /> Mark Shipped
                               </DropdownMenuItem>
                               <DropdownMenuItem className="text-xs font-bold gap-2">
                                 <FileText className="h-3.5 w-3.5" /> View Details
                               </DropdownMenuItem>
                               <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500">
                                 <Trash2 className="h-3.5 w-3.5" /> Delete
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

         {/* Empty State */}
         {filteredOrders.length === 0 && (
           <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
                 <ShoppingCart className="h-10 w-10" />
              </div>
              <div className="text-center">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest italic">No Orders Found</h3>
                 <p className="text-slate-400 text-sm max-w-xs mt-1">There are no orders in this category yet. Start selling to see orders here!</p>
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl shadow-premium uppercase tracking-widest text-[10px]">
                 Create Order
              </Button>
           </div>
         )}

         {/* Table Footer */}
         <div className="bg-slate-50/50 dark:bg-white/5 p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Page 1 of 12</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-7 w-7 rounded-lg font-bold text-[10px] bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white">1</Button>
               <Button variant="ghost" className="h-7 w-7 rounded-lg font-bold text-[10px] text-slate-400">2</Button>
               <Button variant="ghost" className="h-7 w-7 rounded-lg font-bold text-[10px] text-slate-400">3</Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
