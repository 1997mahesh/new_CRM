import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Receipt, 
  AlertCircle, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  TrendingDown,
  Info,
  Calendar,
  MoreVertical,
  Plus,
  Search,
  MessageSquare,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const REVENUE_DATA = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 58000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 85000 },
  { month: "Aug", revenue: 81000 },
  { month: "Sep", revenue: 94000 },
  { month: "Oct", revenue: 105000 },
  { month: "Nov", revenue: 98000 },
  { month: "Dec", revenue: 120000 },
];

const LEADS_BY_STAGE = [
  { stage: "New", count: 45, color: "bg-blue-500", percentage: 100 },
  { stage: "Contacted", count: 32, color: "bg-indigo-500", percentage: 80 },
  { stage: "Qualified", count: 24, color: "bg-cyan-500", percentage: 65 },
  { stage: "Proposal", count: 18, color: "bg-purple-500", percentage: 50 },
  { stage: "Negotiation", count: 12, color: "bg-amber-500", percentage: 35 },
  { stage: "Won", count: 8, color: "bg-emerald-500", percentage: 20 },
  { stage: "Lost", count: 15, color: "bg-red-500", percentage: 30 },
];

const TOP_CUSTOMERS = [
  { name: "Global Trade Corp", revenue: "$124,500.00", status: "Premium" },
  { name: "TechFlow Solutions", revenue: "$98,400.00", status: "Gold" },
  { name: "Nexa Logistics", revenue: "$85,200.00", status: "Gold" },
  { name: "Zenith Design", revenue: "$72,150.00", status: "Silver" },
  { name: "Alpha Tech", revenue: "$65,000.00", status: "Silver" },
];

const OVERDUE_INVOICES = [
  { id: "INV-2024-001", customer: "Blue Sky Media", date: "May 1, 2024", days: 5, amount: "$4,250.00", status: "Overdue" },
  { id: "INV-2024-004", customer: "Prime Properties", date: "Apr 25, 2024", days: 11, amount: "$8,100.00", status: "Critical" },
  { id: "INV-2024-009", customer: "Omega Systems", date: "May 3, 2024", days: 3, amount: "$2,400.00", status: "Overdue" },
];

export default function SalesDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Sales Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time sales performance and business insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm">
            Invoices
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium">
            Leads
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: "Revenue MTD", value: "$42,500", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Revenue YTD", value: "$524,000", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Open Invoices", value: "24", icon: Receipt, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Overdue", value: "$8,450", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Pipeline Leads", value: "156", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Pipeline Value", value: "$1.2M", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Forecast", value: "$85k", icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50" },
        ].map((stat, idx) => (
          <div key={idx} className="stat-card flex flex-col justify-between p-4 min-h-[110px]">
             <div className="flex items-center justify-between mb-2">
               <div className={cn("p-1.5 rounded-lg", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-4 w-4", stat.color)} />
               </div>
               <ArrowUpRight className="h-3 w-3 text-slate-300" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <p className="text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Revenue Trend</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total sales revenue across the last 12 months</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
               <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider px-3 bg-white dark:bg-white/10 shadow-sm">Monthly</Button>
               <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider px-3 text-slate-400">Quarterly</Button>
            </div>
          </div>
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-white/5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '600'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leads by Stage */}
        <Card className="border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Leads by Stage</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Pipeline distribution by conversion stage</p>
          <div className="space-y-4">
            {LEADS_BY_STAGE.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-400">{stage.stage}</span>
                  <span className="text-slate-800 dark:text-slate-100">{stage.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", stage.color)} 
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
             <div className="flex items-center gap-2 mb-2">
               <Info className="h-3.5 w-3.5 text-blue-500" />
               <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Pipeline Insights</p>
             </div>
             <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
               "Most common lost reason: <span className="font-bold text-red-500">Price Resistance</span>. Consider offering bundles for qualified leads."
             </p>
          </div>
        </Card>
      </div>

      {/* Recommendations and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deep Insights */}
        <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl rounded-2xl">
           <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
             <TrendingUp className="h-4 w-4 text-emerald-500" />
             Pipeline Insights
           </h2>
           <div className="space-y-4">
             {[
               { label: "Opportunities closing soon", value: "8 Cards", color: "text-blue-600" },
               { label: "Top lost reason", value: "Pricing", color: "text-red-500" },
               { label: "Weighted forecast summary", value: "$450k", color: "text-emerald-600" },
               { label: "Active pipeline summary", value: "156 Leads", color: "text-indigo-600" },
               { label: "Largest opportunity cluster", value: "Enterprise", color: "text-purple-600" },
             ].map((insight, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all">
                 <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{insight.label}</span>
                 <span className={cn("text-xs font-bold", insight.color)}>{insight.value}</span>
               </div>
             ))}
           </div>
        </Card>

        {/* AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 px-1 flex items-center gap-2">
             <Target className="h-4 w-4 text-blue-500" />
             AI-driven Recommendations
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               { title: "Prepare Proposal", desc: "For Global Trade Corp - High priority", action: "Go to Lead", priority: "High" },
               { title: "Follow up lead", desc: "Nexa Logistics hasn't responded in 3 days", action: "Send Email", priority: "Medium" },
               { title: "Capture Requirements", desc: "Alpha Tech needs software spec doc", action: "Add Note", priority: "Normal" },
               { title: "Push Deal to Close", desc: "Zenith Design is in negotiation stage", action: "View Deal", priority: "Urgent" },
             ].map((rec, idx) => (
               <Card key={idx} className="group p-4 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] hover:border-blue-200 dark:hover:border-blue-500/30 transition-all shadow-sm">
                 <div className="flex justify-between items-start mb-3">
                   <Badge className={cn(
                     "text-[9px] font-bold uppercase tracking-tighter h-5",
                     rec.priority === "Urgent" ? "bg-red-50 text-red-600" : 
                     rec.priority === "High" ? "bg-orange-50 text-orange-600" :
                     "bg-blue-50 text-blue-600"
                   )}>
                     {rec.priority}
                   </Badge>
                   <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowRight className="h-4 w-4 text-blue-500" />
                   </Button>
                 </div>
                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{rec.title}</h3>
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">{rec.desc}</p>
                 <Button variant="ghost" className="h-8 w-full border border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                   {rec.action}
                 </Button>
               </Card>
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Section Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Top Customers */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Top Customers by Revenue</h2>
            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4 text-right">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                {TOP_CUSTOMERS.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{customer.name}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{customer.revenue}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="secondary" className="text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400">{customer.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Overdue Invoices */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Overdue Invoices</h2>
            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50">Collect Payments</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Overdue</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                {OVERDUE_INVOICES.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{inv.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{inv.customer}</td>
                    <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-red-500 font-bold">
                         <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                         {inv.days} days
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">{inv.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 text-center">
             <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">View All Overdue</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
