import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LifeBuoy, 
  Users, 
  MessageSquare, 
  Timer, 
  Tag, 
  MoreVertical,
  Plus,
  ArrowRight,
  ChevronRight,
  Calendar,
  Activity,
  UserCheck,
  Filter,
  RefreshCcw,
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Loader2,
  Sparkles
} from "lucide-react";
import { 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SupportDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [overdueTickets, setOverdueTickets] = useState<any[]>([]);
  const [unassignedTickets, setUnassignedTickets] = useState<any[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [assignmentData, setAssignmentData] = useState({
    userId: "",
    priority: "Medium"
  });

  // Filters
  const [filters, setFilters] = useState({
    dateRange: "all",
    priority: "all",
    status: "all",
    department: "all"
  });

  const [seeding, setSeeding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.dateRange && filters.dateRange !== "all") params.dateRange = filters.dateRange;
      if (filters.priority && filters.priority !== "all") params.priority = filters.priority;
      if (filters.status && filters.status !== "all") params.status = filters.status;
      if (filters.department && filters.department !== "all") params.department = filters.department;

      const response = await api.get('/support/tickets/stats', params);
      if (response.success && response.data) {
        setStats(response.data.stats);
        setOverdueTickets(response.data.overdueTickets || []);
        setUnassignedTickets(response.data.unassignedTickets || []);
      }
      
      const agentsRes = await api.get('/users');
      if (agentsRes.success && Array.isArray(agentsRes.data)) {
        setAgents(agentsRes.data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setSeeding(true);
    try {
      const response = await api.post('/support/tickets/seed', {});
      if (response.success) {
        toast.success(`Seeded ${response.data?.count || 0} sample tickets!`);
        fetchData();
      } else {
        toast.error("Failed to seed tickets");
      }
    } catch (error) {
      toast.error("Error seeding data");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleAssign = async () => {
    if (!selectedTicketId || !assignmentData.userId) {
      toast.error("Please select an agent");
      return;
    }

    try {
      await api.put(`/support/tickets/${selectedTicketId}`, {
        assignedUserId: assignmentData.userId,
        priority: assignmentData.priority
      });
      toast.success("Ticket assigned successfully");
      setAssignModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to assign ticket");
    }
  };

  const handleQuickAssign = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setAssignModalOpen(true);
  };

  const statusDistribution = stats?.statusDistribution?.map((s: any) => ({
    name: s.status,
    value: s._count,
    color: s.status === 'Open' ? '#3b82f6' : 
           s.status === 'In Progress' ? '#818cf8' : 
           s.status === 'Solved' ? '#10b981' : '#94a3b8'
  })) || [];

  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const priorityDistribution = priorityOrder.map(p => {
    const found = stats?.priorityDistribution?.find((s: any) => s.priority === p);
    return {
      name: p,
      count: found?._count || 0,
      color: p === 'Critical' ? '#ef4444' : 
             p === 'High' ? '#f59e0b' : 
             p === 'Medium' ? '#3b82f6' : '#94a3b8'
    };
  });

  const categoryDistribution = stats?.departmentDistribution?.map((d: any) => ({
    name: d.department,
    val: Math.round((d._count / (stats?.totalTickets || 1)) * 100),
    color: d.department === 'Technical' ? "bg-blue-500" : 
           d.department === 'Billing' ? "bg-emerald-500" : 
           d.department === 'Sales' ? "bg-purple-500" :
           d.department === 'Onboarding' ? "bg-amber-500" : "bg-slate-400"
  })) || [];

  if (loading && !stats) {
    return <div className="flex items-center justify-center h-[50vh] italic font-bold text-slate-400">Loading Support Intelligence...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Support Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Monitor support performance, ticket trends, and agent workload.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/support/tickets')} className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm italic gap-2 transition-all hover:bg-slate-50">
            <LayoutDashboard className="h-4 w-4" />
            All Tickets
          </Button>
          <Button variant="outline" onClick={() => navigate('/support/reports')} className="hidden sm:flex dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm italic transition-all hover:bg-slate-50">
            Ticket Reports
          </Button>
          <Button 
            onClick={() => navigate('/support/tickets/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium italic gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#1f1a1d] shadow-soft rounded-2xl overflow-visible">
         <div className="flex flex-wrap items-center justify-between gap-4 w-full px-4">
            {/* Left Side: Intelligence Label */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 shrink-0">
               <Filter className="h-4 w-4 text-blue-600" />
               <span className="text-[10px] font-black text-slate-500 underline decoration-blue-500/30 underline-offset-4 uppercase tracking-widest italic whitespace-nowrap">Intelligence Filters</span>
            </div>
            
            {/* Right Side Group: Filters + Refresh aligned right */}
            <div className="flex flex-wrap items-center gap-4 ml-auto overflow-visible">
               <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={seedData} 
                    disabled={seeding}
                    className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-100 italic text-[10px] font-bold uppercase tracking-widest gap-2 h-10 px-6 rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-blue-500" />}
                    Re-Seed Sample Tickets
                  </Button>
                  {/* Time Filter */}
                  <div className="w-[180px] shrink-0">
                     <Select value={filters.dateRange} onValueChange={(val) => setFilters({...filters, dateRange: val})}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/10 italic text-xs font-bold bg-white dark:bg-white/5 shadow-sm hover:border-blue-400 transition-colors">
                           <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <SelectValue placeholder="Date" />
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic">
                           <SelectItem value="all" className="font-bold underline decoration-blue-500/20 italic">All</SelectItem>
                           <SelectItem value="today">Today</SelectItem>
                           <SelectItem value="week">Last 7 Days</SelectItem>
                           <SelectItem value="month">Last 30 Days</SelectItem>
                           <SelectItem value="this_month">This Month</SelectItem>
                           <SelectItem value="this_year">This Year</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
 
                  {/* Priority Filter */}
                  <div className="w-[180px] shrink-0">
                     <Select value={filters.priority} onValueChange={(val) => setFilters({...filters, priority: val})}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/10 italic text-xs font-bold bg-white dark:bg-white/5 shadow-sm hover:border-blue-400 transition-colors">
                           <div className="flex items-center gap-2">
                              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                              <SelectValue placeholder="Priority" />
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic">
                           <SelectItem value="all" className="font-bold underline decoration-blue-500/20 italic">All</SelectItem>
                           <SelectItem value="Critical" className="text-red-600 font-bold">Critical</SelectItem>
                           <SelectItem value="High" className="text-orange-500 font-bold">High</SelectItem>
                           <SelectItem value="Medium" className="text-blue-500 font-bold">Medium</SelectItem>
                           <SelectItem value="Low" className="text-slate-500 font-bold">Low</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
 
                  {/* Status Filter */}
                  <div className="w-[180px] shrink-0">
                     <Select value={filters.status} onValueChange={(val) => setFilters({...filters, status: val})}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/10 italic text-xs font-bold bg-white dark:bg-white/5 shadow-sm hover:border-blue-400 transition-colors">
                           <div className="flex items-center gap-2">
                              <Activity className="h-3.5 w-3.5 text-slate-400" />
                              <SelectValue placeholder="Status" />
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic">
                           <SelectItem value="all" className="font-bold underline decoration-blue-500/20 italic">All</SelectItem>
                           <SelectItem value="Open">Open</SelectItem>
                           <SelectItem value="In Progress">In Progress</SelectItem>
                           <SelectItem value="Pending">Pending</SelectItem>
                           <SelectItem value="Solved">Resolved</SelectItem>
                           <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
 
                  {/* Department Filter */}
                  <div className="w-[180px] shrink-0">
                     <Select value={filters.department} onValueChange={(val) => setFilters({...filters, department: val})}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-white/10 italic text-xs font-bold bg-white dark:bg-white/5 shadow-sm hover:border-blue-400 transition-colors">
                           <div className="flex items-center gap-2">
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                              <SelectValue placeholder="Category" />
                           </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic">
                           <SelectItem value="all" className="font-bold underline decoration-blue-500/20 italic">All</SelectItem>
                           <SelectItem value="Technical Support">Technical Support</SelectItem>
                           <SelectItem value="Billing & Finance">Billing & Finance</SelectItem>
                           <SelectItem value="API Integration">API Integration</SelectItem>
                           <SelectItem value="Authentication">Authentication</SelectItem>
                           <SelectItem value="Feature Requests">Feature Requests</SelectItem>
                           <SelectItem value="Customer Portal">Customer Portal</SelectItem>
                           <SelectItem value="Security Issues">Security Issues</SelectItem>
                           <SelectItem value="Server Infrastructure">Server Infrastructure</SelectItem>
                           <SelectItem value="CRM Automation">CRM Automation</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
 
               <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchData} 
                  className="text-blue-600 hover:bg-blue-50 italic text-[10px] font-bold uppercase tracking-widest gap-2 h-10 px-6 rounded-xl border border-transparent hover:border-blue-100 shadow-sm transition-all whitespace-nowrap min-w-[140px] shrink-0 ml-2"
               >
                  <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                  Refresh Data
               </Button>

               {(!stats || stats.totalTickets === 0) && (
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={seedData} 
                   disabled={seeding}
                   className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-100 italic text-[10px] font-bold uppercase tracking-widest gap-2 h-10 px-6 rounded-xl shadow-sm transition-all whitespace-nowrap"
                 >
                   {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-blue-500" />}
                   Seed Sample Data
                 </Button>
               )}
            </div>
         </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          { label: "Open Tickets", value: stats?.openTickets || 0, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", link: "/support/tickets?status=Open" },
          { label: "In Progress", value: stats?.inProgressTickets || 0, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50", link: "/support/tickets?status=In Progress" },
          { label: "Overdue", value: stats?.overdueCount || 0, icon: Clock, color: "text-red-600", bg: "bg-red-50", link: "/support/tickets?overdue=true" },
          { label: "Resolved Today", value: stats?.resolvedToday || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", link: "/support/tickets?resolved=today" },
          { label: "Unassigned", value: stats?.unassignedCount || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50", link: "/support/tickets?queue=unassigned" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => navigate(stat.link)}
          >
            <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl h-full flex flex-col justify-between">
               <div className="flex items-center gap-3 mb-3">
                 <div className={cn("p-2 rounded-lg", stat.bg, "dark:bg-white/5")}>
                   <stat.icon className={cn("h-4 w-4", stat.color)} />
                 </div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
               </div>
               <div className="flex items-end justify-between">
                 <p className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter">{stat.value}</p>
                 <Badge variant="ghost" className="text-[9px] font-bold text-slate-400 p-0 hover:text-blue-600">View <ArrowRight className="h-2 w-2 ml-1" /></Badge>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft bg-white dark:bg-[#211c1f] p-6 flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/support/tickets')}>
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Ticket Status</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium italic">Active queue distribution</p>
           <div className="h-[220px] w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={statusDistribution}
                   cx="50%"
                   cy="50%"
                   innerRadius={50}
                   outerRadius={70}
                   paddingAngle={8}
                   dataKey="value"
                 >
                   {statusDistribution.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
              {statusDistribution.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-bold text-slate-500 italic">{item.name}: {item.value}</span>
                </div>
              ))}
           </div>
        </Card>

        {/* Tickets by Priority */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft bg-white dark:bg-[#211c1f] p-6 flex flex-col">
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Priority Levels</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium italic">Pending tickets categorized by urgency</p>
           <div className="space-y-6">
             {priorityDistribution.map((p: any, idx: number) => (
               <div key={idx} className="space-y-1.5 cursor-pointer group" onClick={() => navigate(`/support/tickets?priority=${p.name}`)}>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest italic">
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{p.name}</span>
                    <span className="text-slate-800 dark:text-slate-100">{p.count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.count / (stats?.totalTickets || 1)) * 100}%` }}
                      className="h-full rounded-full shadow-sm" 
                      style={{ backgroundColor: p.color }}
                    ></motion.div>
                  </div>
               </div>
             ))}
           </div>
        </Card>

        {/* Tickets by Category */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft bg-white dark:bg-[#211c1f] p-6 flex flex-col">
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Departments</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium italic">Performance by support category</p>
           <div className="space-y-5">
              {categoryDistribution.length > 0 ? categoryDistribution.map((item: any, idx: number) => (
                <div key={idx} className="space-y-1 cursor-pointer group" onClick={() => navigate(`/support/tickets?department=${item.name}`)}>
                   <div className="flex justify-between items-center italic text-xs">
                     <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{item.name}</span>
                     <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{item.val}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 dark:bg-white/5 rounded-full">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        className={cn("h-full rounded-full", item.color)}
                     ></motion.div>
                   </div>
                </div>
              )) : <div className="text-xs text-slate-400 italic">No category data available</div>}
           </div>
        </Card>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 font-jakarta">
        {/* Overdue Tickets */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft overflow-hidden">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
               <AlertCircle className="h-4 w-4 text-red-500" />
               Critical & Overdue Tickets
             </h2>
             <Button variant="ghost" size="sm" onClick={() => navigate('/support/tickets?overdue=true')} className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50 italic">View All</Button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-white/5">
              {overdueTickets.length > 0 ? overdueTickets.map((tk: any, idx: number) => (
                <div key={idx} className="p-4 hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => navigate(`/support/tickets/${tk.id}`)}>
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold font-mono text-slate-400 italic">{tk.id.slice(0, 8)}</span>
                         <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic group-hover:text-blue-600 transition-colors">{tk.subject}</h3>
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-bold uppercase h-4.5 px-2 border-none italic shadow-sm",
                        tk.priority === "Critical" ? "bg-red-600 text-white" : "bg-amber-50 text-amber-600"
                      )}>{tk.priority}</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 italic">
                           <Users className="h-3 w-3" /> {tk.customerName || "System"}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 italic">
                           <UserCheck className="h-3 w-3" /> Agent: {tk.assignedUser?.firstName || "Unassigned"}
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 italic">
                         <Timer className="h-2.5 w-2.5" />
                         Created {new Date(tk.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                </div>
              )) : <div className="p-8 text-center text-slate-400 italic text-xs">No overdue tickets found</div>}
           </div>
        </Card>

        {/* Unassigned Tickets */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft overflow-hidden">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">Unassigned Tickets</h2>
             <Button variant="ghost" size="sm" onClick={() => navigate('/support/tickets?queue=unassigned')} className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">View Queue</Button>
           </div>
           <div className="p-4 space-y-4">
              <div className="space-y-3">
              {unassignedTickets.length > 0 ? unassignedTickets.map((tk: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all cursor-pointer group flex flex-col gap-2">
                   <div className="flex justify-between items-start" onClick={() => navigate(`/support/tickets/${tk.id}`)}>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 italic tracking-tight group-hover:text-blue-600 truncate mr-2">{tk.subject}</p>
                      <span className="text-[9px] font-mono font-bold text-slate-400 italic shrink-0">{tk.id.slice(0, 5)}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium text-slate-500 italic">{tk.customerName || "Direct"}</span>
                        <Badge className="text-[8px] font-bold uppercase h-4 px-1.5 border-none italic">{tk.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => { e.stopPropagation(); handleQuickAssign(tk.id); }}
                          className="h-6 px-2 text-[9px] font-bold text-blue-600 hover:bg-blue-50 italic"
                        >Assign</Button>
                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 italic">
                           <Clock className="h-2.5 w-2.5" />
                           {new Date(tk.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                   </div>
                </div>
              )) : <div className="text-center py-6 text-slate-400 italic text-xs">Queue is clear!</div>}
              </div>
              
              <Button 
                onClick={() => navigate('/support/tickets/new?source=internal&priority=Medium')}
                className="w-full h-10 rounded-xl border border-dashed border-slate-200 dark:border-white/10 bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest italic font-mono transition-all"
              >
                 <Plus className="h-3.5 w-3.5 mr-2" />
                 Create Internal Ticket
              </Button>
           </div>
        </Card>
      </div>

      {/* Assignment Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="rounded-2xl dark:bg-[#1f1a1d] dark:border-white/10 font-jakarta italic">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50 italic">Assign Support Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Support Agent</Label>
               <Select value={assignmentData.userId} onValueChange={(val) => setAssignmentData({...assignmentData, userId: val})}>
                 <SelectTrigger className="rounded-xl h-11 italic font-bold">
                   <SelectValue placeholder="Select an agent..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl italic">
                   {agents.map((agent) => (
                     <SelectItem key={agent.id} value={agent.id} className="italic font-medium">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                             <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.firstName}`} />
                             <AvatarFallback>{agent.firstName?.charAt(0)}</AvatarFallback>
                           </Avatar>
                           {agent.firstName} {agent.lastName}
                        </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Override Priority</Label>
               <Select value={assignmentData.priority} onValueChange={(val) => setAssignmentData({...assignmentData, priority: val})}>
                 <SelectTrigger className="rounded-xl h-11 italic font-bold">
                   <SelectValue placeholder="Priority" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl italic">
                   <SelectItem value="Critical" className="text-red-500 font-bold italic">Critical</SelectItem>
                   <SelectItem value="High" className="text-orange-500 font-bold italic">High</SelectItem>
                   <SelectItem value="Medium" className="text-blue-500 font-bold italic">Medium</SelectItem>
                   <SelectItem value="Low" className="text-slate-500 font-bold italic">Low</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)} className="rounded-xl font-bold italic h-11">Cancel</Button>
            <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold italic h-11 shadow-premium">Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
