import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Receipt,
  Eye,
  Printer,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  Building2,
  Columns,
  Search as SearchIcon,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2
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

const BILLS_DATA = [
  { id: "BILL-2024-001", vendor: "TechSupplies Ltd", date: "May 01, 2024", due: "May 15, 2024", amount: "$12,450.00", dueAmount: "$12,450.00", status: "Overdue" },
  { id: "BILL-2024-002", vendor: "CloudWorks Inc", date: "May 03, 2024", due: "May 30, 2024", amount: "$820.00", dueAmount: "$0.00", status: "Paid" },
  { id: "BILL-2024-003", vendor: "OfficePro Solutions", date: "May 04, 2024", due: "May 25, 2024", amount: "$2,100.00", dueAmount: "$1,100.00", status: "Partially Paid" },
  { id: "BILL-2024-004", vendor: "Global Logistics", date: "May 04, 2024", due: "May 18, 2024", amount: "$1,250.00", dueAmount: "$1,250.00", status: "Received" },
  { id: "BILL-2024-005", vendor: "Digital Assets Co", date: "May 05, 2024", due: "Jun 05, 2024", amount: "$4,500.00", dueAmount: "$4,500.00", status: "Draft" },
  { id: "BILL-2024-006", vendor: "Prime Stationers", date: "May 05, 2024", due: "May 05, 2024", amount: "$180.00", dueAmount: "$0.00", status: "Paid" },
];

export default function BillsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredBills = activeTab === "all" 
    ? BILLS_DATA 
    : BILLS_DATA.filter(bill => bill.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Bills</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage vendor invoices and manage your accounts payable.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide">
            <Plus className="h-4 w-4" />
            <span>New Bill</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Current", value: "$24,500.00", count: 8, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "1-30 Days Overdue", value: "$12,450.00", count: 3, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "31-60 Days Overdue", value: "$4,200.00", count: 1, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "60+ Days Overdue", value: "$0.00", count: 0, color: "text-red-600", bg: "bg-red-50" },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", item.bg, "dark:bg-white/5")}>
              <AlertCircle className={cn("h-6 w-6", item.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">{item.value}</span>
                <span className="text-[10px] font-medium text-slate-400 italic">({item.count} bills)</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 scrollbar-hide">
          <Tabs defaultValue="all" className="w-full xl:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">All</TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">Draft</TabsTrigger>
              <TabsTrigger value="received" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">Received</TabsTrigger>
              <TabsTrigger value="partially paid" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">Partial</TabsTrigger>
              <TabsTrigger value="paid" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">Paid</TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3 text-red-500">Overdue</TabsTrigger>
              <TabsTrigger value="void" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-3">Void</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full xl:w-auto min-w-[300px]">
             <div className="relative flex-1 xl:w-64 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               <Input placeholder="Search Bill # or Vendor..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Columns className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Bill Number</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Amount Due</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {filteredBills.map((bill) => (
               <tr key={bill.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 italic transition-colors font-mono">
                      {bill.id}
                    </span>
                 </td>
                 <td className="px-6 py-5 underline decoration-slate-200 underline-offset-4 decoration-dashed font-bold text-slate-700 dark:text-slate-300 italic">
                    {bill.vendor}
                 </td>
                 <td className="px-6 py-5">
                   <div className={cn(
                     "flex items-center gap-2 font-bold italic",
                     bill.status === "Overdue" ? "text-red-500" : "text-slate-500"
                   )}>
                     <Clock className="h-3.5 w-3.5" />
                     {bill.due}
                   </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                     bill.status === "Paid" ? "bg-emerald-50 text-emerald-600" : 
                     bill.status === "Overdue" ? "bg-red-50 text-red-600" :
                     bill.status === "Partially Paid" ? "bg-amber-50 text-amber-600" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {bill.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-right font-bold text-slate-500 line-through decoration-slate-300/50 font-mono italic opacity-50">{bill.amount}</td>
                 <td className="px-6 py-5 text-right">
                   <span className={cn(
                     "font-bold text-sm font-mono italic",
                     bill.dueAmount === "$0.00" ? "text-emerald-600" : "text-slate-900 dark:text-white"
                   )}>
                     {bill.dueAmount}
                   </span>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-600/10">
                        <CreditCard className="h-4 w-4" />
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
                             <Eye className="h-3.5 w-3.5" /> View Details
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <FileText className="h-3.5 w-3.5" /> Apply Payment
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500">
                             <AlertCircle className="h-3.5 w-3.5" /> Void Bill
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {/* Pagination */}
         <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic font-mono decoration-emerald-500/10 underline underline-offset-4">Showing 1-10 of 82 Accounts Payable</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-emerald-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
