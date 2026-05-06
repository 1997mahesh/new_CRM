import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ShoppingCart,
  Eye,
  Printer,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  Building2,
  Columns,
  Search as SearchIcon,
  ArrowDownToLine
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

const PO_DATA = [
  { id: "PO-2024-001", vendor: "TechSupplies Ltd", date: "May 01, 2024", amount: "$12,450.00", status: "Received" },
  { id: "PO-2024-002", vendor: "CloudWorks Inc", date: "May 03, 2024", amount: "$820.00", status: "Sent" },
  { id: "PO-2024-003", vendor: "OfficePro Solutions", date: "May 04, 2024", amount: "$2,100.00", status: "Draft" },
  { id: "PO-2024-004", vendor: "Global Logistics", date: "May 04, 2024", amount: "$1,250.00", status: "Confirmed" },
  { id: "PO-2024-005", vendor: "Digital Assets Co", date: "May 05, 2024", amount: "$4,500.00", status: "Sent" },
  { id: "PO-2024-006", vendor: "Prime Stationers", date: "May 05, 2024", amount: "$180.00", status: "Cancelled" },
  { id: "PO-2024-007", vendor: "Security First", date: "May 06, 2024", amount: "$6,200.00", status: "Partially Received" },
];

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPOs = activeTab === "all" 
    ? PO_DATA 
    : PO_DATA.filter(po => po.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Purchase Orders</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Track your procurement orders and incoming inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide">
            <Plus className="h-4 w-4" />
            <span>New PO</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">All</TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Draft</TabsTrigger>
              <TabsTrigger value="sent" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Sent</TabsTrigger>
              <TabsTrigger value="confirmed" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Confirmed</TabsTrigger>
              <TabsTrigger value="partially received" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Partial</TabsTrigger>
              <TabsTrigger value="received" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Received</TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full lg:w-auto min-w-[300px]">
             <div className="relative flex-1 lg:w-64 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <Input placeholder="Search PO # or Vendor..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Columns className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[800px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {filteredPOs.map((po) => (
               <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors bg-indigo-50 dark:bg-indigo-600/10 px-2 py-0.5 rounded-lg italic">
                      {po.id}
                    </span>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{po.vendor}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-slate-500 font-medium italic">
                     <Calendar className="h-3.5 w-3.5" />
                     {po.date}
                   </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                     po.status === "Received" ? "bg-emerald-50 text-emerald-600" : 
                     po.status === "Sent" ? "bg-blue-50 text-blue-600" :
                     po.status === "Partially Received" ? "bg-amber-50 text-amber-600" :
                     po.status === "Cancelled" ? "bg-red-50 text-red-600" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {po.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white font-mono">{po.amount}</td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-600/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <ArrowDownToLine className="h-3.5 w-3.5" /> Download PDF
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <FileText className="h-3.5 w-3.5" /> Edit PO
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2 text-emerald-600">
                             <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Convert to Bill
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {/* Pagination Footer */}
         <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-indigo-500/10 underline underline-offset-4 font-mono">Showing 1-10 of 215 Orders</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-indigo-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">3</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
