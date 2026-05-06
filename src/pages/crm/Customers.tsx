import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Upload,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  User,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CUSTOMERS = [
  { id: 1, name: "Global Trade Corp", email: "contact@globaltrade.com", type: "Company", status: "Active", nextFollowUp: "2026-05-12", source: "Referral", assignedTo: "Sarah Jenkins", phone: "+1 234 567 8901", avatar: "G" },
  { id: 2, name: "TechFlow Solutions", email: "info@techflow.io", type: "Company", status: "Active", nextFollowUp: "2026-05-15", source: "Website", assignedTo: "Sarah Jenkins", phone: "+1 345 678 9012", avatar: "T" },
  { id: 3, name: "John Smith", email: "john@smith.me", type: "Individual", status: "Active", nextFollowUp: "2026-05-08", source: "Direct", assignedTo: "Sarah Jenkins", phone: "+1 456 789 0123", avatar: "JS" },
  { id: 4, name: "Nexa Logistics", email: "ops@nexa.com", type: "Company", status: "Inactive", nextFollowUp: "2026-04-20", source: "Cold Call", assignedTo: "Sarah Jenkins", phone: "+1 567 890 1234", avatar: "N" },
  { id: 5, name: "Zenith Design", email: "hello@zenith.design", type: "Company", status: "Active", nextFollowUp: "2026-05-20", source: "Partner", assignedTo: "Sarah Jenkins", phone: "+1 678 901 2345", avatar: "Z" },
  { id: 6, name: "Alpha Tech", email: "support@alphatech.com", type: "Company", status: "Active", nextFollowUp: "2026-05-10", source: "Website", assignedTo: "Sarah Jenkins", phone: "+1 789 012 3456", avatar: "A" },
  { id: 7, name: "Blue Sky Media", email: "ads@bluesky.com", type: "Company", status: "Inactive", nextFollowUp: "2026-03-15", source: "Trade Show", assignedTo: "Sarah Jenkins", phone: "+1 890 123 4567", avatar: "B" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Customers</h1>
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-600/20 text-[10px] h-5">Total 2,450</Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of your customer database and activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>Import</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 min-w-max">
          <div className="relative w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
          <div className="h-6 w-px bg-slate-100 dark:bg-white/5 mx-2" />
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2 px-3">
            <Filter className="h-4 w-4 text-slate-400" />
            Status
          </Button>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2 px-3">
            Source
          </Button>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2 px-3">
            Assignee
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <Columns className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Follow-up</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm rounded-xl">
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">{customer.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-[150px]">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       {customer.type === "Company" ? <Building className="h-3 w-3 text-slate-400" /> : <User className="h-3 w-3 text-slate-400" />}
                       <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{customer.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none",
                      customer.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400"
                    )}>
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{customer.nextFollowUp}</p>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border-none">
                      {customer.source}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{customer.assignedTo}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-7 of 2,450 customers</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
