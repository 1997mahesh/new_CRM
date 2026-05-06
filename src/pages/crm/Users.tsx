import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  Shield,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const USERS = [
  { id: 1, name: "admin", code: "EMP001", email: "admin@erp-pro.com", role: "Super Admin", department: "IT", status: "Active", avatar: "A" },
  { id: 2, name: "Operations User", code: "EMP002", email: "ops@erp-pro.com", role: "Operations Head", department: "Operations", status: "Active", avatar: "O" },
  { id: 3, name: "Sales Executive", code: "EMP003", email: "sales@erp-pro.com", role: "Sales Lead", department: "Sales", status: "Active", avatar: "S" },
  { id: 4, name: "Purchase Executive", code: "EMP004", email: "purchase@erp-pro.com", role: "Procurement Officer", department: "Purchase", status: "Active", avatar: "P" },
  { id: 5, name: "Finance Executive", code: "EMP005", email: "finance@erp-pro.com", role: "Accountant", department: "Finance", status: "Active", avatar: "F" },
  { id: 6, name: "Support Team", code: "EMP006", email: "support@erp-pro.com", role: "Support Specialist", department: "Support", status: "Active", avatar: "ST" },
  { id: 7, name: "Warehouse Manager", code: "EMP007", email: "whm@erp-pro.com", role: "Manager", department: "Inventory", status: "Inactive", avatar: "WM" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Users</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage system users, roles, and access.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>Invite</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New User</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 min-w-max">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search users..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
          <div className="h-6 w-px bg-slate-100 dark:bg-white/5 mx-2" />
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            <Filter className="h-4 w-4" />
            Status
          </Button>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            Role
          </Button>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            Department
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <Columns className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <Download className="h-4 w-4" />
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Employee Code</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm rounded-xl">
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="text-[11px] font-mono border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                       {user.code}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{user.email}</p>
                    <p className="text-[10px] text-slate-400">{user.department} Dept.</p>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none",
                      user.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400"
                    )}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
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
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-7 of 7 users</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
