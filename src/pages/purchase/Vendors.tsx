import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  UserCheck, 
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MoreHorizontal,
  Building2,
  Columns,
  Search as SearchIcon,
  ChevronRight,
  FileText
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

const VENDORS = [
  { id: "1", name: "TechSupplies Ltd", contact: "John Smith", email: "john@techsupplies.com", status: "Active", orders: 45, category: "IT Hardware" },
  { id: "2", name: "CloudWorks Inc", contact: "Alice Johnson", email: "alice@cloudworks.io", status: "Active", orders: 12, category: "Software" },
  { id: "3", name: "OfficePro Solutions", contact: "Mark Brown", email: "mark@officepro.com", status: "Inactive", orders: 8, category: "Stationery" },
  { id: "4", name: "Global Logistics", contact: "Sarah Wilson", email: "sarah@globlog.co", status: "Active", orders: 32, category: "Shipping" },
  { id: "5", name: "Digital Assets Co", contact: "Robert Paul", email: "rob@digiassets.net", status: "Active", orders: 24, category: "Marketing" },
  { id: "6", name: "Prime Stationers", contact: "Lisa Ray", email: "lisa@prime.com", status: "Inactive", orders: 3, category: "Stationery" },
  { id: "7", name: "Security First", contact: "Kevin Hart", email: "kevin@secfirst.com", status: "Active", orders: 15, category: "Security" },
];

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredVendors = activeTab === "all" 
    ? VENDORS 
    : VENDORS.filter(v => v.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Vendors</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage your supplier directory and procurement relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>Import</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide">
            <Plus className="h-4 w-4" />
            <span>New Vendor</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">All</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">Active</TabsTrigger>
              <TabsTrigger value="inactive" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-72 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <Input placeholder="Search vendors by name or email..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
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
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {filteredVendors.map((v) => (
               <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                       <Building2 className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{v.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest italic">{v.category}</span>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                     <span className="font-bold text-slate-700 dark:text-slate-200">{v.contact}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 w-fit px-2 py-0.5 rounded-lg border border-slate-100 dark:border-white/5">
                     <Mail className="h-3 w-3" />
                     <span className="text-[10px] font-mono italic">{v.email}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                     v.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                     {v.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{v.orders}</span>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
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
                         <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                           <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 dark:focus:bg-blue-600/10">
                             <Phone className="h-3.5 w-3.5" /> Call Vendor
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <FileText className="h-3.5 w-3.5" /> View Purchase History
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500">
                             <Trash2 className="h-3.5 w-3.5" /> Archive Vendor
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic italic decoration-blue-500/10 underline underline-offset-4">Showing 1-10 of 42 Suppliers</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-blue-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>

      {/* Empty State Mock */}
      {filteredVendors.length === 0 && (
         <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
               <Building2 className="h-10 w-10" />
            </div>
            <div className="text-center">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest italic">No Vendors Found</h3>
               <p className="text-slate-400 text-sm max-w-xs mt-1">There are no vendors in this category yet. Start adding suppliers to see them here!</p>
            </div>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl shadow-premium uppercase tracking-widest text-[10px]">
               Add New Vendor
            </Button>
         </div>
      )}
    </div>
  );
}
