import React from "react";
import { 
  Plus, 
  Search, 
  Key, 
  Filter, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Shield, 
  Building2,
  Lock,
  MoreVertical,
  Columns
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PERMISSIONS = [
  { key: "dashboard.view", group: "Dashboard", description: "Allow viewing main dashboard" },
  { key: "user.view", group: "User", description: "View list of users" },
  { key: "user.create", group: "User", description: "Create new users" },
  { key: "user.edit", group: "User", description: "Edit existing users" },
  { key: "user.delete", group: "User", description: "Delete users" },
  { key: "role.view", group: "Role", description: "View access roles" },
  { key: "role.create", group: "Role", description: "Create new roles" },
  { key: "role.edit", group: "Role", description: "Modify existing roles" },
  { key: "permission.view", group: "Permission", description: "View full permissions list" },
  { key: "department.view", group: "Department", description: "View company departments" },
];

const GROUP_COLORS: Record<string, string> = {
    Dashboard: "bg-blue-50 text-blue-600",
    User: "bg-indigo-50 text-indigo-600",
    Role: "bg-emerald-50 text-emerald-600",
    Permission: "bg-amber-50 text-amber-600",
    Department: "bg-rose-50 text-rose-600"
};

export default function PermissionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Permissions</h1>
          <p className="text-sm text-slate-500 font-medium">Define fine-grained access control keys for the system.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm">
            <Columns className="h-4 w-4 mr-2" /> Columns
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> New Permission
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search permissions by key or group..." 
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Permission Key</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Group</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Description</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSIONS.map((perm) => (
              <TableRow key={perm.key} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                       <Lock className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-800">{perm.key}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="outline" className={cn("border-none px-2 py-0.5 text-[10px] uppercase font-bold rounded-full", GROUP_COLORS[perm.group])}>
                      {perm.group}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                   {perm.description}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100"><Edit2 className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       {/* Pagination */}
       <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-500 font-medium">Showing 1 to 10 of 145 results</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-xs font-bold text-slate-600 border-slate-200">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-xs font-bold text-slate-600 border-slate-200">Next</Button>
        </div>
      </div>
    </div>
  );
}
