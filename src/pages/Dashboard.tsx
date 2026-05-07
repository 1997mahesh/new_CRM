import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  DollarSign, 
  Users, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Ticket,
  Plus,
  FilePlus,
  TicketPlus,
  UserPlus,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_REVENUE_DATA = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 31000 },
  { month: "Apr", revenue: 61000, expenses: 42000 },
  { month: "May", revenue: 55000, expenses: 38000 },
  { month: "Jun", revenue: 67000, expenses: 45000 },
  { month: "Jul", revenue: 72000, expenses: 48000 },
  { month: "Aug", revenue: 68000, expenses: 46000 },
  { month: "Sep", revenue: 75000, expenses: 51000 },
  { month: "Oct", revenue: 82000, expenses: 55000 },
  { month: "Nov", revenue: 79000, expenses: 53000 },
  { month: "Dec", revenue: 95000, expenses: 62000 },
];

const STATS = [
  { 
    title: "Revenue MTD", 
    value: "$128,450.00", 
    change: "+12.5%", 
    trend: "up", 
    icon: DollarSign, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50" 
  },
  { 
    title: "Open Invoices", 
    value: "12", 
    change: "3 Overdue", 
    trend: "down", 
    icon: FileCheck, 
    color: "text-blue-600", 
    bg: "bg-blue-50" 
  },
  { 
    title: "Pipeline Leads", 
    value: "45", 
    change: "8 New Today", 
    trend: "up", 
    icon: TrendingUp, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50" 
  },
  { 
    title: "Spend MTD", 
    value: "$24,500.00", 
    change: "-2.4%", 
    trend: "down", 
    icon: Clock, 
    color: "text-orange-600", 
    bg: "bg-orange-50" 
  },
  { 
    title: "AP Outstanding", 
    value: "$21,218.00", 
    change: "2 open POs", 
    trend: "neutral", 
    icon: AlertTriangle, 
    color: "text-amber-600", 
    bg: "bg-amber-50" 
  },
  { 
    title: "Low Stock", 
    value: "6", 
    change: "Below threshold", 
    trend: "down", 
    icon: Package, 
    color: "text-red-600", 
    bg: "bg-red-50" 
  },
  { 
    title: "Open Tickets", 
    value: "3", 
    change: "5 overdue", 
    trend: "up", 
    icon: Ticket, 
    color: "text-purple-600", 
    bg: "bg-purple-50" 
  },
  { 
    title: "Expenses MTD", 
    value: "$0.00", 
    change: "Finance dashboard →", 
    trend: "neutral", 
    icon: Users, 
    color: "text-cyan-600", 
    bg: "bg-cyan-50" 
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Dashboard data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic leading-none">Synchronizing Data...</p>
       </div>
     )
  }

  const stats = data?.stats || {};
  
  const STAT_CONFIG = [
    { 
      title: "Revenue MTD", 
      value: `$${(stats.revenueMTD || 0).toLocaleString()}`, 
      change: "Global total", 
      trend: "up", 
      icon: DollarSign, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      link: "/reports/sales",
      linkText: "Sales dashboard →"
    },
    { 
      title: "Open Invoices", 
      value: stats.openInvoices?.toString() || "0", 
      change: `${stats.overdueInvoices || 0} Overdue`, 
      trend: "down", 
      icon: FileCheck, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      link: "/finance/invoices",
      linkText: "Finance dashboard →"
    },
    { 
      title: "Pipeline Leads", 
      value: stats.pipelineLeads?.toString() || "0", 
      change: `${stats.newLeadsToday || 0} New Today`, 
      trend: "up", 
      icon: TrendingUp, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      link: "/sales/leads",
      linkText: "Sales dashboard →"
    },
    { 
      title: "Pending revenue", 
      value: `$${(stats.pendingRevenue || 0).toLocaleString()}`, 
      change: "Unpaid invoices", 
      trend: "neutral", 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      link: "/finance/payments",
      linkText: "Finance dashboard →"
    },
    { 
      title: "Open Tickets", 
      value: stats.openTickets?.toString() || "0", 
      change: `${stats.overdueTickets || 0} Overdue`, 
      trend: "up", 
      icon: Ticket, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      link: "/support/tickets",
      linkText: "Ticket dashboard →"
    },
    { 
      title: "Low Stock Items", 
      value: stats.lowStockCount?.toString() || "0", 
      change: "Inventory alert", 
      trend: "down", 
      icon: Package, 
      color: "text-red-600", 
      bg: "bg-red-50",
      link: "/inventory/products",
      linkText: "Inventory alerts →"
    },
    { 
      title: "Expenses MTD", 
      value: `$${(stats.expensesMTD || 0).toLocaleString()}`, 
      change: "Approved expenses", 
      trend: "neutral", 
      icon: DollarSign, 
      color: "text-cyan-600", 
      bg: "bg-cyan-50",
      link: "/finance/expenses",
      linkText: "Finance dashboard →"
    },
    { 
      title: "AP Outstanding", 
      value: `$${(stats.apOutstanding || 0).toLocaleString()}`, 
      change: "Unpaid bills", 
      trend: "neutral", 
      icon: AlertTriangle, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      link: "/purchase/orders",
      linkText: "Purchase dashboard →"
    },
    { 
      title: "Spend MTD", 
      value: `$${(stats.spendMTD || 0).toLocaleString()}`, 
      change: "Cumulative spend", 
      trend: "up", 
      icon: Clock, 
      color: "text-slate-600", 
      bg: "bg-slate-50",
      link: "/finance/dashboard",
      linkText: "Finance dashboard →"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time performance and key metrics across all modules.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={() => navigate('/sales/leads/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-sm gap-2 transition-all hover:translate-y-[-1px]"
          >
            <UserPlus className="h-4 w-4" />
            <span>New Lead</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/sales/invoices/new')}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 dark:hover:bg-white/10 font-bold h-10 px-4 rounded-lg gap-2 transition-all hover:translate-y-[-1px]"
          >
            <FilePlus className="h-4 w-4" />
            <span>New Invoice</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/support/tickets/new')}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 dark:hover:bg-white/10 font-bold h-10 px-4 rounded-lg gap-2 transition-all hover:translate-y-[-1px]"
          >
            <TicketPlus className="h-4 w-4" />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CONFIG.map((stat, idx) => (
          <div key={idx} className="stat-card flex flex-col justify-between min-h-[140px] p-4 bg-white dark:bg-[#211c1f] rounded-xl border border-slate-200 dark:border-white/5 shadow-soft transition-all hover:border-slate-300 dark:hover:border-white/10 group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">{stat.value}</p>
                <p className={cn(
                  "text-[11px] mt-1 font-semibold truncate",
                  stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : stat.trend === "down" ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-slate-500"
                )}>
                  {stat.change}
                </p>
              </div>
              <div className={cn("p-2 rounded-lg shrink-0 ml-3 transition-transform group-hover:scale-110", stat.bg, "dark:bg-white/5")}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-white/5 flex items-center">
              <button 
                onClick={() => navigate(stat.link)}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase tracking-tight"
              >
                {stat.linkText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Revenue Growth</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Performance tracking for the fiscal year</p>
            </div>
            <select className="text-xs border border-slate-200 dark:border-white/5 rounded p-1.5 bg-slate-50 dark:bg-white/5 dark:text-slate-300 outline-none">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[350px] w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data?.revenueChart || []}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="month" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                   dy={10}
                 />
                 <YAxis 
                   hide
                 />
                 <RechartsTooltip 
                   contentStyle={{ 
                     backgroundColor: '#fff', 
                     borderRadius: '8px', 
                     border: '1px solid #e2e8f0', 
                     boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                     fontSize: '11px',
                     fontWeight: '600'
                   }} 
                 />
                 <Area 
                   type="monotone" 
                   dataKey="revenue" 
                   stroke="#2563eb" 
                   strokeWidth={2}
                   fillOpacity={1} 
                   fill="url(#colorRev)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
          </div>
          <div className="flex-1 p-5 space-y-5 overflow-hidden">
             {[
               { color: "bg-emerald-500", title: "Invoice #8841 Paid", desc: "By TechFlow Solutions", time: "2m ago" },
               { color: "bg-blue-500", title: "New Lead Qualified", desc: "Assigned to Sarah J.", time: "15m ago" },
               { color: "bg-amber-500", title: "Stock Alert: SSD", desc: "Low inventory threshold", time: "1h ago" },
               { color: "bg-slate-300", title: "Meeting with Client", desc: "Global Trade Corp", time: "3h ago" }
             ].map((activity, idx) => (
               <div key={idx} className="flex items-start">
                 <div className={cn("h-2 w-2 rounded-full mt-1.5 mr-4", activity.color)}></div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{activity.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{activity.desc} • {activity.time}</p>
                 </div>
               </div>
             ))}
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 mt-auto">
            <Button variant="ghost" className="w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 h-8 uppercase tracking-widest">
              View Audit Log
            </Button>
          </div>
        </Card>
      </div>

      {/* Design Theme AI Insight Banner */}
      <div className="bg-blue-600 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Secure AI Insights Panel</h3>
            <p className="text-sm text-blue-100 opacity-90 leading-tight">Based on your current pipeline, 3 deals are stalled. Suggested follow-up today.</p>
          </div>
        </div>
        <Button className="px-6 py-2 bg-white text-blue-600 font-bold hover:bg-blue-50 rounded-lg text-sm shadow-lg shadow-blue-900/20 whitespace-nowrap">
          Review Suggestions
        </Button>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
