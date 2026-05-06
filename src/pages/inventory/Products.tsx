import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Package,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Layers,
  Columns,
  Search as SearchIcon,
  Tag,
  AlertCircle,
  Box,
  LayoutGrid
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

const PRODUCTS = [
  { id: "1", name: "MacBook Pro M3 Max", sku: "LAP-001", category: "Electronics", type: "Standard", price: "$3,499.00", cost: "$2,800.00", stock: 12, status: "Active" },
  { id: "2", name: "Dell UltraSharp 27", sku: "MON-042", category: "Displays", type: "Storable", price: "$599.00", cost: "$420.00", stock: 84, status: "Active" },
  { id: "3", name: "Cloud Integration", sku: "SVC-881", category: "Services", type: "Service", price: "$1,200.00", cost: "$0.00", stock: "-", status: "Active" },
  { id: "4", name: "Magic Keyboard", sku: "ACC-102", category: "Accessories", type: "Consumable", price: "$99.00", cost: "$65.00", stock: 2, status: "Active" },
  { id: "5", name: "Logitech MX Master", sku: "ACC-015", category: "Accessories", type: "Storable", price: "$95.00", cost: "$68.00", stock: 156, status: "Active" },
  { id: "6", name: "Broken Charger", sku: "ACC-004", category: "Accessories", type: "Storable", price: "$49.00", cost: "$20.00", stock: 0, status: "Inactive" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Products</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage your catalog, prices, and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
            <Plus className="h-4 w-4" />
            <span>New Product</span>
          </Button>
        </div>
      </div>

      {/* Filter and View Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <Input placeholder="Search name, SKU, or category..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium font-mono" />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
             <Filter className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-xl flex gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 bg-white dark:bg-white/10 shadow-sm rounded-lg text-blue-600">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-lg">
                <Columns className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-right">Sale Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {PRODUCTS.map((p) => (
               <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className="h-11 w-11 flex items-center justify-center bg-slate-50 dark:bg-white/5 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                       <Package className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{p.name}</span>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className={cn(
                             "text-[8px] font-bold h-4 px-1 border-none bg-slate-50 text-slate-400 italic",
                             p.status === "Active" ? "text-slate-400" : "text-amber-500"
                           )}>{p.status}</Badge>
                        </div>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <span className="font-mono font-bold text-slate-500 italic bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-lg">{p.sku}</span>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-1.5 text-slate-500 font-bold italic">
                     <Tag className="h-3.5 w-3.5 text-indigo-400" />
                     {p.category}
                   </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-tight italic",
                     p.type === "Service" ? "bg-indigo-50 text-indigo-600" : 
                     p.type === "Storable" ? "bg-blue-50 text-blue-600" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {p.type}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white font-mono italic">{p.price}</td>
                 <td className="px-6 py-5 text-center">
                   <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "text-sm font-bold font-mono tracking-tighter italic",
                        typeof p.stock === 'number' && p.stock <= 5 ? "text-red-500" : "text-slate-900 dark:text-white"
                      )}>
                        {p.stock}
                      </span>
                      {typeof p.stock === 'number' && p.stock <= 5 && p.stock > 0 && (
                        <div className="flex items-center gap-1 text-[8px] text-red-400 font-bold uppercase tracking-widest italic animate-pulse">
                          <AlertCircle className="h-2 w-2" />
                          Low Stock
                        </div>
                      )}
                      {p.stock === 0 && (
                         <Badge className="bg-red-50 text-red-500 text-[8px] font-bold uppercase h-4 px-1">Out of Stock</Badge>
                      )}
                   </div>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 shadow-premium border-white/5">
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <Layers className="h-3.5 w-3.5" /> Item Ledger
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <FileText className="h-3.5 w-3.5" /> Update Barcode
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500 focus:bg-red-50">
                             <Trash2 className="h-3.5 w-3.5" /> Delete Product
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic font-mono decoration-blue-500/10 underline underline-offset-4">Showing 1-10 of 1,248 Skus</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30 transition-all hover:bg-white shadow-soft"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-blue-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">3</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 transition-all hover:bg-white shadow-soft"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
