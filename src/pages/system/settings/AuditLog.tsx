import React, { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  User as UserIcon, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  FileText,
  Monitor,
  Loader2,
  RefreshCcw
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
import { api } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/audit-logs');
      if (response.success) {
        setLogs(response.data);
      }
    } catch (error) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.module.toLowerCase().includes(search.toLowerCase()) ||
    (log.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const getSeverity = (action: string) => {
    if (action.includes('DELETE')) return 'Critical';
    if (action.includes('UPDATE')) return 'Warning';
    if (action.includes('CREATE')) return 'Success';
    return 'Info';
  };

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
          <Button variant="outline" onClick={fetchLogs} className="rounded-xl border-slate-200 shadow-sm h-11 px-6 dark:border-slate-800">
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
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
            value={search}
            onChange={e => setSearch(e.target.value)}
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
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && logs.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="py-20 text-center">
                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Compiling Audit Trail...</p>
                 </TableCell>
               </TableRow>
            ) : filteredLogs.map((log) => (
              <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2">
                       <UserIcon className="h-3 w-3 text-slate-400" />
                       <span className="text-sm font-medium text-slate-700">{log.user?.email || 'System'}</span>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-slate-800 text-sm">
                   {log.action}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="outline" className="bg-slate-50 text-slate-400 border-none text-[10px] uppercase font-bold tracking-tight">{log.module}</Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs font-mono text-slate-400 italic">
                   {log.ipAddress || 'Internal'}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                   <Badge className={cn(
                       "rounded-full px-2 py-0 text-[10px] font-bold uppercase border-none",
                       getSeverity(log.action) === 'Success' ? "bg-emerald-50 text-emerald-600" :
                       getSeverity(log.action) === 'Warning' ? "bg-amber-50 text-amber-600" :
                       getSeverity(log.action) === 'Critical' ? "bg-rose-50 text-rose-600" :
                       "bg-blue-50 text-blue-600"
                   )}>
                       {getSeverity(log.action)}
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
