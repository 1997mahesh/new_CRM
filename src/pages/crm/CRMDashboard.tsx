import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  PhoneCall, 
  UserMinus, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  MoreVertical,
  Plus,
  Search,
  MessageSquare,
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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CUSTOMER_GROWTH_DATA = [
  { month: "Jan", count: 400 },
  { month: "Feb", count: 600 },
  { month: "Mar", count: 550 },
  { month: "Apr", count: 900 },
  { month: "May", count: 850 },
  { month: "Jun", count: 1200 },
  { month: "Jul", count: 1500 },
  { month: "Aug", count: 1400 },
  { month: "Sep", count: 1800 },
  { month: "Oct", count: 2100 },
  { month: "Nov", count: 1950 },
  { month: "Dec", count: 2500 },
];

const SOURCE_DATA = [
  { name: "Cold Call", value: 15, color: "#3b82f6" },
  { name: "Direct", value: 25, color: "#10b981" },
  { name: "Partner", value: 10, color: "#f59e0b" },
  { name: "Referral", value: 20, color: "#6366f1" },
  { name: "Trade Show", value: 15, color: "#8b5cf6" },
  { name: "Website", value: 15, color: "#ec4899" },
];

const RECENT_CUSTOMERS = [
  { name: "Global Trade Corp", email: "contact@globaltrade.com", role: "Sarah Jenkins", status: "Active", source: "Referral", avatar: "G" },
  { name: "TechFlow Solutions", email: "info@techflow.io", role: "Sarah Jenkins", status: "Active", source: "Website", avatar: "T" },
  { name: "Nexa Logistics", email: "operations@nexa.com", role: "Sarah Jenkins", status: "Pending", source: "Cold Call", avatar: "N" },
  { name: "Zenith Design", email: "hello@zenith.design", role: "Sarah Jenkins", status: "Active", source: "Direct", avatar: "Z" },
];

const NO_ACTIVITY_CUSTOMERS = [
  { name: "Blue Sky Media", email: "marketing@bluesky.com", executive: "Mike Ross", status: "Inactive", lastActive: "45 days ago" },
  { name: "Omega Systems", email: "it@omega.com", executive: "Sarah Jenkins", status: "Dormant", lastActive: "60 days ago" },
  { name: "Prime Properties", email: "sales@prime.com", executive: "Sarah Jenkins", status: "Inactive", lastActive: "38 days ago" },
];

export default function CRMDashboard() {
  const navigate = useNavigate();

  const STAT_CONFIG = [
    { label: "Total Customers", value: "2,450", icon: Users, color: "text-blue-600", bg: "bg-blue-50", link: "/crm/customers", linkText: "View customers →" },
    { label: "New This Month", value: "124", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50", link: "/crm/customers?filter=new", linkText: "View new customers →" },
    { label: "Active", value: "1,890", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", link: "/crm/customers?status=active", linkText: "Active customer list →" },
    { label: "Upcoming Follow-ups", value: "12", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50", link: "/crm/followups", linkText: "View follow-ups →" },
    { label: "Inactive", value: "436", icon: UserMinus, color: "text-slate-600", bg: "bg-slate-50", link: "/crm/customers?status=inactive", linkText: "Inactive customer report →" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">CRM Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of your customer relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/crm/customers')}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm transition-all hover:translate-y-[-1px]"
          >
            Customers
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/crm/contacts')}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm transition-all hover:translate-y-[-1px]"
          >
            Contacts
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CONFIG.map((stat, idx) => (
          <div key={idx} className="stat-card flex flex-col justify-between min-h-[140px] p-4 bg-white dark:bg-[#211c1f] rounded-xl border border-slate-200 dark:border-white/5 shadow-soft transition-all hover:border-slate-300 dark:hover:border-white/10 group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">{stat.value}</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Customer Growth</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total customers over the last 12 months</p>
            </div>
            <select className="text-xs border border-slate-200 dark:border-white/5 rounded p-1.5 bg-slate-50 dark:bg-white/5 dark:text-slate-300 outline-none">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CUSTOMER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                <YAxis hide />
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
                  dataKey="count" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all hover:border-slate-300 dark:hover:border-white/10">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Customers by Source</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Discovery channels for your customers</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={SOURCE_DATA} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Main Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Added Customers */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Added Customers</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
          <div className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-white/5">
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Assigned</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                  {RECENT_CUSTOMERS.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-lg border border-white dark:border-white/10 shadow-sm">
                            <AvatarFallback className="bg-blue-600 text-white font-bold text-[10px]">{customer.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{customer.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{customer.role}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold uppercase tracking-tighter h-5",
                          customer.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-600/10 dark:text-emerald-400 dark:border-emerald-600/20" : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-600/10 dark:text-blue-400 dark:border-blue-600/20"
                        )}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="secondary" className="text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400">
                          {customer.source}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 mt-auto">
            <Button 
              onClick={() => navigate('/crm/customers')}
              variant="ghost" 
              className="w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 h-8 uppercase tracking-widest"
            >
              View All Customers
            </Button>
          </div>
        </Card>

        {/* No Activity (30+ Days) */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">No Activity (30+ Days)</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
          <div className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-white/5">
                    <th className="px-4 py-3 font-bold">Company</th>
                    <th className="px-4 py-3 font-bold">Executive</th>
                    <th className="px-4 py-3 font-bold">Inactivity</th>
                    <th className="px-4 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                  {NO_ACTIVITY_CUSTOMERS.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{customer.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{customer.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{customer.executive}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                          <p className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{customer.lastActive}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-600/10">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 mt-auto">
            <Button 
              onClick={() => navigate('/reports/crm-activity')}
              variant="ghost" 
              className="w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 h-8 uppercase tracking-widest"
            >
              View Activity Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
