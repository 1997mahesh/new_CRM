import React from "react";
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
  TrendingDown,
  ChevronRight,
  Info,
  Calendar,
  Search,
  Activity,
  History,
  UserCheck
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const TICKET_STATUS_DATA = [
  { name: "Open", value: 12, color: "#3b82f6" },
  { name: "Pending", value: 8, color: "#818cf8" },
  { name: "Solved", value: 45, color: "#10b981" },
  { name: "Closed", value: 30, color: "#94a3b8" },
];

const PRIORITY_DATA = [
  { name: "Critical", count: 3, color: "#ef4444" },
  { name: "High", count: 8, color: "#f59e0b" },
  { name: "Medium", count: 24, color: "#3b82f6" },
  { name: "Low", count: 12, color: "#94a3b8" },
];

const OVERDUE_TICKETS = [
  { id: "#TK-021", subject: "Portal Login Issue", customer: "TechSupplies Ltd", agent: "John D.", priority: "High", overdue: "2 hrs" },
  { id: "#TK-018", subject: "Billing Query", customer: "CloudWorks Inc", agent: "Sarah K.", priority: "Critical", overdue: "4 hrs" },
  { id: "#TK-034", subject: "API Integration Fail", customer: "Global Logistics", agent: "Mike R.", priority: "Medium", overdue: "45 mins" },
];

const UNASSIGNED_TICKETS = [
  { id: "#TK-045", subject: "Feature Request: Dashboard Filters", customer: "Digital Assets Co", time: "10 mins ago" },
  { id: "#TK-046", subject: "Password Reset Help", customer: "OfficePro Solutions", time: "22 mins ago" },
];

export default function SupportDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
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
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm italic">
            Ticket Reports
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium italic gap-2">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          { label: "Open Tickets", value: "24", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Progress", value: "18", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Overdue", value: "3", icon: Clock, color: "text-red-600", bg: "bg-red-50" },
          { label: "Resolved Today", value: "12", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg Resolution", value: "4.2h", icon: Timer, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl hover:translate-y-[-2px] transition-transform">
             <div className="flex items-center gap-3 mb-3">
               <div className={cn("p-2 rounded-lg", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-4 w-4", stat.color)} />
               </div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
             </div>
             <p className="text-xl font-bold text-slate-800 dark:text-white italic tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft bg-white dark:bg-[#211c1f] p-6 flex flex-col">
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Ticket Status</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium italic">Active queue distribution</p>
           <div className="h-[220px] w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={TICKET_STATUS_DATA}
                   cx="50%"
                   cy="50%"
                   innerRadius={50}
                   outerRadius={70}
                   paddingAngle={8}
                   dataKey="value"
                 >
                   {TICKET_STATUS_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <RechartsTooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
              {TICKET_STATUS_DATA.map((item, idx) => (
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
             {PRIORITY_DATA.map((p, idx) => (
               <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest italic">
                    <span className="text-slate-600 dark:text-slate-400">{p.name}</span>
                    <span className="text-slate-800 dark:text-slate-100">{p.count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-sm" 
                      style={{ width: `${(p.count/47)*100}%`, backgroundColor: p.color }}
                    ></div>
                  </div>
               </div>
             ))}
           </div>
        </Card>

        {/* Tickets by Category */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft bg-white dark:bg-[#211c1f] p-6 flex flex-col">
           <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Categories</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium italic">Performance by support category</p>
           <div className="space-y-5">
              {[
                { name: "Technical Support", val: 88, color: "bg-blue-500" },
                { name: "Billing & Finance", val: 65, color: "bg-emerald-500" },
                { name: "Feature Requests", val: 42, color: "bg-amber-500" },
                { name: "Feedback", val: 24, color: "bg-slate-400" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                   <div className="flex justify-between items-center italic">
                     <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{item.name}</span>
                     <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{item.val}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 dark:bg-white/5 rounded-full">
                     <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 font-jakarta">
        {/* Overdue Tickets */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft shadow-premium overflow-hidden">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
               <AlertCircle className="h-4 w-4 text-red-500" />
               Critical & Overdue Tickets
             </h2>
             <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50 italic">Assign Agents</Button>
           </div>
           <div className="divide-y divide-slate-50 dark:divide-white/5">
              {OVERDUE_TICKETS.map((tk, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50/30 transition-colors group">
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold font-mono text-slate-400 italic underline decoration-slate-200 underline-offset-4">{tk.id}</span>
                         <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic group-hover:text-blue-600 transition-colors">{tk.subject}</h3>
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-bold uppercase h-4.5 px-2 border-none italic shadow-sm",
                        tk.priority === "Critical" ? "bg-red-600 text-white" : "bg-amber-50 text-amber-600"
                      )}>{tk.priority}</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 italic decoration-blue-500/10 underline underline-offset-4">
                           <Users className="h-3 w-3" /> {tk.customer}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 italic">
                           <UserCheck className="h-3 w-3" /> Agent: {tk.agent}
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 italic decoration-red-500/20 underline underline-offset-2">
                         <Timer className="h-2.5 w-2.5" />
                         Overdue {tk.overdue}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* Unassigned Tickets */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft overflow-hidden">
           <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">Unassigned Tickets</h2>
             <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">View Queue</Button>
           </div>
           <div className="p-4 space-y-4">
              {UNASSIGNED_TICKETS.map((tk, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 italic tracking-tight group-hover:text-blue-600 truncate mr-2">{tk.subject}</p>
                      <span className="text-[9px] font-mono font-bold text-slate-400 italic shrink-0">{tk.id}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-500 italic decoration-dashed underline underline-offset-2 decoration-slate-200">{tk.customer}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                         <Clock className="h-2.5 w-2.5" />
                         {tk.time}
                      </span>
                   </div>
                </div>
              ))}
              <Button className="w-full h-10 rounded-xl border border-dashed border-slate-200 dark:border-white/10 bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest italic font-mono transition-all">
                 <Plus className="h-3.5 w-3.5 mr-2" />
                 Create Internal Ticket
              </Button>
           </div>
        </Card>
      </div>
    </div>
  );
}
