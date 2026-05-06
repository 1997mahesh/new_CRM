import React from "react";
import { 
  Plus, 
  Search, 
  Layers,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronRight,
  Package,
  Columns,
  Search as SearchIcon,
  Tag
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
  { id: "1", name: "Electronics", description: "Laptops, computers, and tablets", status: "Active", products: 452, color: "bg-blue-500" },
  { id: "2", name: "Accessories", description: "Keyboards, mice, and docks", status: "Active", products: 812, color: "bg-indigo-500" },
  { id: "3", name: "Office Supplies", description: "Pens, paper, and organizers", status: "Active", products: 245, color: "bg-emerald-500" },
  { id: "4", name: "Furniture", description: "Chairs, desks, and lamps", status: "Active", products: 124, color: "bg-amber-500" },
  { id: "5", name: "Networking", description: "Routers, cables, and switches", status: "Active", products: 82, color: "bg-rose-500" },
  { id: "6", name: "Storage", description: "Hard drives, SSDs, and NAS", status: "Inactive", products: 34, color: "bg-slate-500" },
];

export default function ProductCategoriesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Organize your products into logical groups for better management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
            <Plus className="h-4 w-4" />
            <span>New Category</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           <Input placeholder="Search category names..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
           <Columns className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[800px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Total Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {CATEGORIES.map((c) => (
               <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className={cn("h-10 w-10 flex items-center justify-center text-white rounded-xl shadow-premium italic font-bold text-[10px]", c.color)}>
                        {c.name.charAt(0)}
                     </div>
                     <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{c.name}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <p className="max-w-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{c.description}</p>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic",
                     c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                     {c.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-tighter italic">{c.products}</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Inventory</p>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 dark:hover:bg-red-600/10">
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
