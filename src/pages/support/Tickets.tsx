import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  LifeBuoy,
  Eye,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  Building2,
  Columns,
  Search as SearchIcon,
  MessageCircle,
  UserCheck,
  Tag,
  Clock,
  AlertCircle,
  User,
  ShieldAlert,
  Activity
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const TICKETS = [
  { id: "TK-081", subject: "Portal Login Issue", customer: "TechSupplies Ltd", status: "Open", priority: "High", sla: "Overdue", assignee: "John D.", created: "2h ago", category: "Technical" },
  { id: "TK-074", subject: "Billing Query: Order #204", customer: "CloudWorks Inc", status: "In Progress", priority: "Medium", sla: "2h left", assignee: "Sarah K.", created: "4h ago", category: "Billing" },
  { id: "TK-092", subject: "API Token Revoked", customer: "Digital Assets Co", status: "Open", priority: "Critical", sla: "10m left", assignee: "-", created: "30m ago", category: "Security" },
  { id: "TK-065", subject: "Feature Request: Export to CSV", customer: "Global Logistics", status: "Solved", priority: "Low", sla: "Met", assignee: "Mike R.", created: "1d ago", category: "Product" },
  { id: "TK-088", subject: "Mobile App Crashing", customer: "OfficePro Solutions", status: "Pending", priority: "High", sla: "1h left", assignee: "Sarah K.", created: "3h ago", category: "Technical" },
  { id: "TK-095", subject: "Invoice Discrepancy", customer: "TechSupplies Ltd", status: "Open", priority: "Medium", sla: "5h left", assignee: "John D.", created: "1h ago", category: "Billing" },
];

export default function SupportTicketsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Support Tickets</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic italic">Manage incoming requests, track SLAs, and resolve customer issues.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="border-slate-100 dark:border-white/5 bg-white dark:bg-[#1f1a1d] p-4 shadow-soft rounded-2xl">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="xl:col-span-2 relative group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <Input placeholder="Search subject or ticket #..." className="pl-10 h-10 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl font-medium italic" />
            </div>
            
            <Select>
               <SelectTrigger className="h-10 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl text-xs font-bold italic">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </div>
               </SelectTrigger>
               <SelectContent className="rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 italic">
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
               </SelectContent>
            </Select>

            <Select>
               <SelectTrigger className="h-10 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl text-xs font-bold italic">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="Priority" />
                  </div>
               </SelectTrigger>
               <SelectContent className="rounded-xl italic">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
               </SelectContent>
            </Select>

            <Select>
               <SelectTrigger className="h-10 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl text-xs font-bold italic">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <SelectValue placeholder="Category" />
                  </div>
               </SelectTrigger>
               <SelectContent className="rounded-xl italic">
                  <SelectItem value="tech">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
               </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
               <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 dark:border-white/10 shrink-0">
                  <Columns className="h-4 w-4 text-slate-400" />
               </Button>
               <Button variant="ghost" className="h-10 px-4 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 italic rounded-xl">Reset</Button>
            </div>
         </div>
      </Card>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[1000px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 italic">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject & Customer</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">SLA Status</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium italic">
             {TICKETS.map((tk) => (
               <tr key={tk.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                    <span className="font-mono font-bold text-slate-400">{tk.id}</span>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{tk.subject}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                         <Building2 className="h-2.5 w-2.5" /> {tk.customer}
                         <span className="text-slate-200 dark:text-slate-800">•</span>
                         <span className="text-indigo-400">{tk.category}</span>
                      </div>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic shadow-sm",
                     tk.status === "Open" ? "bg-blue-50 text-blue-600" : 
                     tk.status === "In Progress" ? "bg-indigo-50 text-indigo-600" :
                     tk.status === "Solved" ? "bg-emerald-50 text-emerald-600" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {tk.status}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className={cn(
                     "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic shadow-sm",
                     tk.priority === "Critical" ? "bg-red-600 text-white" : 
                     tk.priority === "High" ? "bg-red-50 text-red-500" :
                     tk.priority === "Medium" ? "bg-blue-50 text-blue-600" :
                     "bg-slate-100 text-slate-400"
                   )}>
                     {tk.priority}
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center">
                    <div className={cn(
                       "flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter italic decoration-slate-200 underline underline-offset-4",
                       tk.sla === "Overdue" ? "text-red-500" : 
                       tk.sla === "Met" ? "text-emerald-500" : "text-amber-500"
                    )}>
                       <Clock className="h-3 w-3" />
                       {tk.sla}
                    </div>
                 </td>
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <Avatar className="h-6 w-6 border-2 border-white dark:border-[#211c1f] shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tk.assignee}`} />
                        <AvatarFallback className="text-[8px]">{tk.assignee.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <span className="font-bold text-slate-600 dark:text-slate-300 italic">{tk.assignee}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-slate-400 text-[10px]">{tk.created}</td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 italic">
                           <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 dark:focus:bg-blue-600/10">
                             <UserCheck className="h-3.5 w-3.5" /> Assign to Me
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2">
                             <Tag className="h-3.5 w-3.5" /> Change Category
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500 hover:bg-red-50">
                             <AlertCircle className="h-3.5 w-3.5" /> Close Ticket
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-blue-500/10 underline underline-offset-4 font-mono">Showing 1-10 of 42 TICKETS In Queue</span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-blue-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic">2</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
