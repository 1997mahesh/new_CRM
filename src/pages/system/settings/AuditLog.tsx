import React from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  User, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileText,
  Monitor
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
import { cn } from "@/lib/utils";

const AUDIT_LOGS = [
  { id: 1, user: "admin@tpdcrm.io", action: "User Updated", module: "Users", ip: "192.168.1.1", date: "2026-05-06 10:24 AM", severity: "Info" },
  { id: 2, user: "sales@tpdcrm.io", action: "Invoice Deleted", module: "Sales", ip: "192.168.1.45", date: "2026-05-06 09:12 AM", severity: "Warning" },
  { id: 3, user: "admin@tpdcrm.io", action: "Login Success", module: "Auth", ip: "192.168.1.1", date: "2026-05-06 08:30 AM", severity: "Info" },
  { id: 4, user: "finance@tpdcrm.io", action: "Expense Approved", module: "Finance", ip: "192.168.1.12", date: "2026-05-05 06:45 PM", severity: "Success" },
  { id: 5, user: "unknown", action: "Failed Login Attempt", module: "Auth", ip: "45.12.89.23", date: "2026-05-05 11:20 PM", severity: "Critical" },
];

export default function AuditLogPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none dark:bg-white/10">
            <Activity className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Audit Log</h1>
            <p className="text-sm text-slate-500 font-medium">Track all critical actions and system events for security auditing and compliance.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm h-11 px-6 dark:border-slate-800">
            <Download className="h-4 w-4 mr-2" /> Export Log
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search by user, action, or module..." 
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Date/Time</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">User</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Action</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Module</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">IP Address</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AUDIT_LOGS.map((log) => (
              <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                  {log.date}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2">
                       <User className="h-3 w-3 text-slate-400" />
                       <span className="text-sm font-medium text-slate-700">{log.user}</span>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-slate-800 text-sm">
                   {log.action}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="outline" className="bg-slate-50 text-slate-400 border-none text-[10px] uppercase font-bold">{log.module}</Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs font-mono text-slate-400 italic">
                   {log.ip}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                   <Badge className={cn(
                       "rounded-full px-2 py-0 text-[10px] font-bold uppercase",
                       log.severity === 'Success' ? "bg-emerald-50 text-emerald-600" :
                       log.severity === 'Warning' ? "bg-amber-50 text-amber-600" :
                       log.severity === 'Critical' ? "bg-rose-50 text-rose-600" :
                       "bg-blue-50 text-blue-600"
                   )}>
                       {log.severity}
                   </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
