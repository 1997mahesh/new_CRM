import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Receipt, 
  MoreVertical,
  Eye,
  FileText,
  Trash2,
  Calendar,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Printer
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

const INVOICES = [
  { id: "INV-2024-001", customer: "Global Trade Corp", status: "Sent", issueDate: "May 01, 2024", dueDate: "May 15, 2024", total: "$4,250.00", dueAmount: "$4,250.00" },
  { id: "INV-2024-002", customer: "TechFlow Solutions", status: "Paid", issueDate: "Apr 20, 2024", dueDate: "May 04, 2024", total: "$1,200.00", dueAmount: "$0.00" },
  { id: "INV-2024-003", customer: "Nexa Logistics", status: "Overdue", issueDate: "Apr 15, 2024", dueDate: "Apr 30, 2024", total: "$8,500.00", dueAmount: "$8,500.00", overdueDays: 6 },
  { id: "INV-2024-004", customer: "Zenith Design", status: "Partially Paid", issueDate: "Apr 28, 2024", dueDate: "May 12, 2024", total: "$15,000.00", dueAmount: "$7,500.00" },
  { id: "INV-2024-005", customer: "Alpha Tech", status: "Draft", issueDate: "May 03, 2024", dueDate: "May 17, 2024", total: "$2,100.00", dueAmount: "$2,100.00" },
  { id: "INV-2024-006", customer: "Blue Sky Media", status: "Sent", issueDate: "May 02, 2024", dueDate: "May 16, 2024", total: "$6,800.00", dueAmount: "$6,800.00" },
  { id: "INV-2024-007", customer: "Prime Properties", status: "Void", issueDate: "Apr 10, 2024", dueDate: "Apr 24, 2024", total: "$3,400.00", dueAmount: "$0.00" },
];

const AGING_STATS = [
  { label: "Current", value: "$45,200", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "1-30 Days", value: "$12,400", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "31-60 Days", value: "$8,200", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "60+ Days", value: "$4,500", color: "text-red-600", bg: "bg-red-50" },
];

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400" },
  "Sent": { label: "Sent", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400" },
  "Paid": { label: "Paid", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" },
  "Partially Paid": { label: "Partial", color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-600/10 dark:text-cyan-400" },
  "Overdue": { label: "Overdue", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400" },
  "Void": { label: "Void", color: "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-600" },
};

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredInvoices = activeTab === "all" 
    ? INVOICES 
    : INVOICES.filter(i => i.status.toLowerCase() === activeTab.toLowerCase().replace('partial', 'partially paid'));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic flex items-center gap-3">
             Invoices
             <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 text-[10px] font-bold px-2 py-0 h-5">Enterprise</Badge>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Automated billing and collection management system.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide">
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </Button>
        </div>
      </div>

      {/* Aging Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGING_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#211c1f] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl flex items-center justify-between group transition-all hover:translate-y-[-2px]">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white italic">{stat.value}</p>
             </div>
             <div className={cn("p-2 rounded-xl transition-all group-hover:scale-110", stat.bg, "dark:bg-white/5")}>
                <DollarSign className={cn("h-5 w-5", stat.color)} />
             </div>
          </div>
        ))}
      </div>

      {/* Tabs and Actions Row */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
             <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl w-full lg:w-auto overflow-x-auto scrollbar-none flex gap-1">
               <TabsTrigger value="all" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">All</TabsTrigger>
               <TabsTrigger value="sent" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">Sent</TabsTrigger>
               <TabsTrigger value="paid" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">Paid</TabsTrigger>
               <TabsTrigger value="partial" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">Partial</TabsTrigger>
               <TabsTrigger value="overdue" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">Overdue</TabsTrigger>
               <TabsTrigger value="draft" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4 flex-shrink-0">Draft</TabsTrigger>
             </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input placeholder="Search invoice..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Filter className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Issue / Due</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Amount Due</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {filteredInvoices.map((inv) => (
               <tr key={inv.id} className={cn(
                 "hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group",
                 inv.status === "Overdue" && "bg-red-50/10 dark:bg-red-500/[0.02]"
               )}>
                 <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:rotate-6 transition-transform">
                          <Receipt className="h-5 w-5" />
                       </div>
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{inv.id}</span>
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{inv.customer}</span>
                 </td>
                 <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                       <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-tighter px-2 h-5 border-none w-fit", STATUS_CONFIG[inv.status].color)}>
                         {inv.status}
                       </Badge>
                       {inv.overdueDays && (
                         <span className="text-[9px] font-bold text-red-500 italic flex items-center gap-1">
                            <AlertCircle className="h-2 w-2" />
                            {inv.overdueDays} days late
                         </span>
                       )}
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                       <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px] font-medium">{inv.issueDate}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span className={cn("text-[10px] font-bold", inv.status === "Overdue" && "text-red-500 underline underline-offset-2")}>
                             {inv.dueDate}
                          </span>
                       </div>
                    </div>
                 </td>
                 <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white font-mono tracking-tighter italic">{inv.total}</span>
                 </td>
                 <td className="px-6 py-5">
                    <span className={cn(
                      "text-[13px] font-bold font-mono tracking-tighter italic",
                      inv.dueAmount === "$0.00" ? "text-emerald-600" : "text-blue-600 dark:text-blue-400"
                    )}>{inv.dueAmount}</span>
                 </td>
                 <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
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
                         <DropdownMenuContent align="end" className="w-48 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                            <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 dark:focus:bg-blue-600/10">
                               <Receipt className="h-3.5 w-3.5 text-blue-500" /> Add Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold gap-2">
                               <FileText className="h-3.5 w-3.5" /> Send Reminder
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

         {/* Table Footer */}
         <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rows per page:</span>
                  <select className="bg-transparent text-[10px] font-bold text-slate-600 outline-none">
                     <option>10</option>
                     <option>20</option>
                     <option>50</option>
                  </select>
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-blue-500/20 underline underline-offset-4">Showing 1-10 of 124</span>
            </div>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-blue-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">3</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
      
      {/* Mini Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
               <AlertCircle className="h-4 w-4 text-red-500" />
               Overdue Collection Pipeline
            </h2>
            <div className="space-y-4">
               {[
                 { customer: "Nexa Logistics", invoice: "INV-2024-003", overdue: "6 Days", amount: "$8,500.00", priority: "High" },
                 { customer: "Prime Properties", invoice: "INV-2023-982", overdue: "45 Days", amount: "$12,100.00", priority: "Critical" },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "h-10 w-10 rounded-full flex items-center justify-center text-[10px] font-bold uppercase",
                         item.priority === "Critical" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                       )}>
                          {item.priority[0]}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.customer}</p>
                          <p className="text-[10px] text-slate-400">{item.invoice} • <span className="font-bold text-red-500">{item.overdue} Late</span></p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.amount}</p>
                       <Button variant="ghost" className="h-6 text-[9px] font-bold uppercase text-blue-600 p-0 hover:bg-transparent underline underline-offset-2">Send Reminder</Button>
                    </div>
                 </div>
               ))}
            </div>
         </Card>
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-premium">
            <h2 className="text-sm font-bold mb-4 opacity-90 uppercase tracking-widest italic">Collection Score</h2>
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
               <div className="text-5xl font-bold italic tracking-tighter">84%</div>
               <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Efficiency Rating</p>
            </div>
            <div className="mt-8 space-y-3">
               <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[84%] rounded-full shadow-[0_0_10px_white]"></div>
               </div>
               <p className="text-[11px] font-medium opacity-80 leading-relaxed italic">
                  Your payment collection efficiency is <span className="font-bold underline">12% higher</span> than last month. Great job!
               </p>
            </div>
            <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-slate-100 font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl">View Efficiency Report</Button>
         </Card>
      </div>
    </div>
  );
}
