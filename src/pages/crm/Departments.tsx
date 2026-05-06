import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  Users as UsersIcon,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  { id: 1, name: "Finance", users: 5, status: "Active", icon: Building2 },
  { id: 2, name: "Inventory", users: 12, status: "Active", icon: Building2 },
  { id: 3, name: "Operations", users: 8, status: "Active", icon: Building2 },
  { id: 4, name: "Purchase", users: 4, status: "Active", icon: Building2 },
  { id: 5, name: "Sales", users: 15, status: "Active", icon: Building2 },
  { id: 6, name: "Support", users: 20, status: "Active", icon: Building2 },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Departments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage company departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Columns className="h-4 w-4 text-slate-400" />
            <span>Columns</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New Department</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search departments..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            <Filter className="h-4 w-4" />
            Status
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {DEPARTMENTS.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center border border-blue-100 dark:border-blue-600/20 shadow-sm transition-all group-hover:scale-110">
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{dept.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold gap-1.5 px-3">
                       <UsersIcon className="h-3 w-3" />
                       {dept.users} Users
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400">
                      {dept.status}
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
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-6 of 6 departments</p>
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
