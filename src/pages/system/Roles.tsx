import React from "react";
import { 
  Plus, 
  Search, 
  Shield, 
  Users, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Key,
  ShieldAlert,
  ChevronRight,
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

const ROLES = [
  { id: 1, name: "Admin", permissionsCount: 145, usersCount: 2, color: "bg-blue-600" },
  { id: 2, name: "Common User", permissionsCount: 24, usersCount: 15, color: "bg-slate-400" },
  { id: 3, name: "Sales", permissionsCount: 45, usersCount: 8, color: "bg-emerald-500" },
  { id: 4, name: "Purchase", permissionsCount: 45, usersCount: 5, color: "bg-amber-500" },
  { id: 5, name: "Finance", permissionsCount: 52, usersCount: 3, color: "bg-indigo-500" },
];

export default function RolesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Roles</h1>
          <p className="text-sm text-slate-500 font-medium">Manage user access levels and default permissions.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Columns className="h-4 w-4 mr-2" /> Columns
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> New Role
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search roles by name..." 
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Role Name</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Permissions Count</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Users Count</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((role) => (
              <TableRow key={role.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", role.color)}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{role.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {role.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-bold text-xs px-2.5 py-0.5 rounded-lg">
                      {role.permissionsCount} Permissions
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{role.usersCount} users</span>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Permissions Mapping">
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem className="text-rose-600 py-2">Delete Role</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
