import React from "react";
import { 
  Plus, 
  Tag, 
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronRight,
  Timer,
  Columns,
  Search as SearchIcon,
  Circle
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

const CATEGORIES = [
  { id: "1", name: "Technical Support", description: "Bugs, login issues, and technical errors", sla: "4 Hours", status: "Active", color: "bg-blue-500", ticketCount: 245 },
  { id: "2", name: "Billing & Finance", description: "Invoices, payments, and subscription plans", sla: "8 Hours", status: "Active", color: "bg-emerald-500", ticketCount: 112 },
  { id: "3", name: "Product Training", description: "How-to guides and onboarding assistance", sla: "24 Hours", status: "Active", color: "bg-amber-500", ticketCount: 88 },
  { id: "4", name: "Feature Requests", description: "New features and product improvements", sla: "7 Days", status: "Active", color: "bg-indigo-500", ticketCount: 156 },
  { id: "5", name: "Security & Privacy", description: "Account security and GDPR requests", sla: "2 Hours", status: "Active", color: "bg-red-500", ticketCount: 12 },
  { id: "6", name: "Marketing Support", description: "Affiliate queries and promo help", sla: "48 Hours", status: "Inactive", color: "bg-slate-500", ticketCount: 0 },
];

export default function SupportCategoriesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Support Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic italic">Categorize your support tickets to optimize response times and routing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
           <Input placeholder="Search categories..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
           <Columns className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[800px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 italic">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">SLA Response</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Tickets</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium italic">
             {CATEGORIES.map((c) => (
               <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className={cn("h-3 w-3 rounded-full shadow-sm", c.color)}></div>
                     <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{c.name}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <p className="max-w-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{c.description}</p>
                 </td>
                 <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold decoration-blue-500/10 underline underline-offset-4 decoration-dashed tracking-tighter">
                       <Timer className="h-3 w-3" />
                       {c.sla}
                    </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic shadow-sm",
                     c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                     {c.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center font-mono font-bold text-slate-800 dark:text-slate-100">
                   {c.ticketCount}
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 dark:border-white/5">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </Card>
    </div>
  );
}
