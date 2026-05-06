import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  User,
  MoreHorizontal,
  ChevronRight,
  LayoutGrid,
  Columns,
  Clock
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

const QUOTATIONS = [
  { id: "QT-2024-001", customer: "Global Trade Corp", status: "Sent", issueDate: "May 01, 2024", validUntil: "May 15, 2024", total: "$12,450.00", items: 4 },
  { id: "QT-2024-002", customer: "TechFlow Solutions", status: "Accepted", issueDate: "Apr 28, 2024", validUntil: "May 12, 2024", total: "$8,200.00", items: 2 },
  { id: "QT-2024-003", customer: "Nexa Logistics", status: "Draft", issueDate: "May 03, 2024", validUntil: "May 17, 2024", total: "$4,500.00", items: 1 },
  { id: "QT-2024-004", customer: "Zenith Design", status: "Rejected", issueDate: "Apr 25, 2024", validUntil: "May 09, 2024", total: "$15,000.00", items: 8 },
  { id: "QT-2024-005", customer: "Alpha Tech", status: "Expired", issueDate: "Apr 15, 2024", validUntil: "Apr 30, 2024", total: "$22,100.00", items: 5 },
  { id: "QT-2024-006", customer: "Blue Sky Media", status: "Accepted", issueDate: "May 02, 2024", validUntil: "May 16, 2024", total: "$6,800.00", items: 3 },
  { id: "QT-2024-007", customer: "Prime Properties", status: "Sent", issueDate: "May 04, 2024", validUntil: "May 18, 2024", total: "$3,400.00", items: 2 },
];

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400" },
  "Sent": { label: "Sent", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400" },
  "Accepted": { label: "Accepted", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" },
  "Rejected": { label: "Rejected", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400" },
  "Expired": { label: "Expired", color: "bg-amber-50 text-amber-600 dark:bg-amber-600/10 dark:text-amber-400" },
};

export default function QuotationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredQuotations = activeTab === "all" 
    ? QUOTATIONS 
    : QUOTATIONS.filter(q => q.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Quotations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create and manage professional price quotes for your customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New Quotation</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">All</TabsTrigger>
              <TabsTrigger value="draft" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Draft</TabsTrigger>
              <TabsTrigger value="sent" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Sent</TabsTrigger>
              <TabsTrigger value="accepted" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Accepted</TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Rejected</TabsTrigger>
              <TabsTrigger value="expired" className="rounded-lg text-xs font-bold uppercase tracking-wider px-4">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <Input placeholder="Search quotation..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
             </div>
             <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <Columns className="h-4 w-4 text-slate-400" />
             </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[800px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Number</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Valid Until</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5">
             {filteredQuotations.map((q) => (
               <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 dark:bg-blue-600/10 rounded-lg group-hover:scale-110 transition-transform">
                       <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                     </div>
                     <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{q.id}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.customer}</span>
                     <span className="text-[10px] text-slate-400">{q.items} items</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <Badge className={cn("text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5", STATUS_CONFIG[q.status].color)}>
                     {q.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic">
                     <Calendar className="h-3.5 w-3.5" />
                     <span className="text-xs">{q.issueDate}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic">
                     <Clock className="h-3.5 w-3.5" />
                     <span className="text-xs">{q.validUntil}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <span className="text-[13px] font-bold text-slate-900 dark:text-white font-mono tracking-tighter italic">{q.total}</span>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 dark:border-white/10 dark:bg-[#1f1a1d]">
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <Edit2 className="h-3.5 w-3.5" /> Edit Quote
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
         {filteredQuotations.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full">
                <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest italic">No Quotations Found</h3>
                 <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your filters or create a new quotation to get started.</p>
              </div>
              <Button className="font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-premium">
                 <Plus className="h-4 w-4 mr-2" />
                 Create First Quotation
              </Button>
           </div>
         )}
         {/* Simple Pagination Placeholder */}
         <div className="p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium italic">Showing {filteredQuotations.length} of {QUOTATIONS.length} entries</p>
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="sm" disabled className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest opacity-50">Prev</Button>
               <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-white">1</Button>
               <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest">2</Button>
               <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest">Next</Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
