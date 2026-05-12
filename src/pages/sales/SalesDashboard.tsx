import React, { useState, useEffect, useMemo } from "react";
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
  ArrowRight,
  Zap,
  Mail,
  FileText
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
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function SalesDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"monthly" | "quarterly">("monthly");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/stats");
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const revenueData = useMemo(() => {
    if (!data?.revenueChart) return [];
    if (chartType === "monthly") return data.revenueChart;
    
    // Aggregating to quarterly
    const quarterly = [
      { month: "Q1", revenue: data.revenueChart.slice(0, 3).reduce((acc: number, curr: any) => acc + curr.revenue, 0) },
      { month: "Q2", revenue: data.revenueChart.slice(3, 6).reduce((acc: number, curr: any) => acc + curr.revenue, 0) },
      { month: "Q3", revenue: data.revenueChart.slice(6, 9).reduce((acc: number, curr: any) => acc + curr.revenue, 0) },
      { month: "Q4", revenue: data.revenueChart.slice(9, 12).reduce((acc: number, curr: any) => acc + curr.revenue, 0) },
    ];
    return quarterly;
  }, [data, chartType]);

  if (loading) {
    return (
      <div className="space-y-8 p-6 animate-pulse">
        <div className="flex justify-between items-center h-16 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-slate-100 dark:bg-white/5 rounded-xl"></div>
          <div className="h-[400px] bg-slate-100 dark:bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  const kpiCards = [
    { label: "Revenue MTD", value: `$${stats.revenueMTD?.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", route: "/sales/invoices", linkText: "View invoices" },
    { label: "Revenue YTD", value: `$${stats.revenueYTD?.toLocaleString()}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", route: "/sales/reports/revenue", linkText: "Revenue report" },
    { label: "Open Invoices", value: stats.openInvoices?.toString(), icon: Receipt, color: "text-amber-600", bg: "bg-amber-50", route: "/sales/invoices?status=unpaid", linkText: "Manage invoices" },
    { label: "Overdue", value: stats.overdueInvoices?.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", route: "/sales/invoices?status=overdue", linkText: "Recover payments" },
    { label: "Pipeline Leads", value: stats.pipelineLeads?.toString(), icon: Target, color: "text-indigo-600", bg: "bg-indigo-50", route: "/sales/leads", linkText: "Open leads" },
    { label: "Pipeline Value", value: `$${(stats.pipelineValue / 1000000).toFixed(1)}M`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", route: "/sales/pipeline", linkText: "Pipeline view" },
    { label: "Forecast", value: `$${(stats.forecast / 1000).toFixed(0)}k`, icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50", route: "/sales/forecast", linkText: "Forecast report" },
  ];

  const recommendations = [
    { title: "Prepare Proposal", desc: "For Global Trade Corp - High priority", action: "Go to Lead", priority: "High", route: "/sales/leads" },
    { title: "Follow up lead", desc: "Nexa Logistics hasn't responded in 3 days", action: "Send Email", priority: "Medium", route: "#" },
    { title: "Capture Requirements", desc: "Alpha Tech needs software spec doc", action: "Add Note", priority: "Normal", route: "#" },
    { title: "Push Deal to Close", desc: "Zenith Design is in negotiation stage", action: "View Deal", priority: "Urgent", route: "/sales/pipeline" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Sales Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time sales performance and business insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/sales/invoices")}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm"
          >
            Invoices
          </Button>
          <Button 
            onClick={() => navigate("/sales/leads")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium"
          >
            Leads
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((stat, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => navigate(stat.route)}
            className="stat-card flex flex-col justify-between p-4 min-h-[130px] cursor-pointer group transition-all hover:shadow-lg dark:hover:shadow-blue-900/10"
          >
             <div className="flex items-center justify-between mb-2">
               <div className={cn("p-1.5 rounded-lg", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-4 w-4", stat.color)} />
               </div>
               <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <p className="text-xl font-bold mt-0.5 text-slate-800 dark:text-slate-100">{stat.value}</p>
               <div className="mt-2 text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                 {stat.linkText} <ArrowRight className="h-2.5 w-2.5" />
               </div>
             </div>
          </motion.div>
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
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartType("monthly")}
                className={cn(
                  "h-7 text-[10px] font-bold uppercase tracking-wider px-3 transition-all",
                  chartType === "monthly" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400"
                )}
               >
                 Monthly
               </Button>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartType("quarterly")}
                className={cn(
                  "h-7 text-[10px] font-bold uppercase tracking-wider px-3 transition-all",
                  chartType === "quarterly" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400"
                )}
               >
                 Quarterly
               </Button>
            </div>
          </div>
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1000}
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
            {(data?.leadsByStage || []).map((stage: any, idx: number) => (
              <div 
                key={idx} 
                className="space-y-1.5 cursor-pointer group"
                onClick={() => navigate(`/sales/leads?stage=${stage.stage.toLowerCase()}`)}
              >
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">{stage.stage}</span>
                  <span className="text-slate-800 dark:text-slate-100">{stage.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={cn(
                      "h-full rounded-full transition-all", 
                      stage.stage === 'New' ? "bg-blue-500" :
                      stage.stage === 'Contacted' ? "bg-indigo-500" :
                      stage.stage === 'Qualified' ? "bg-cyan-500" :
                      stage.stage === 'Proposal' ? "bg-purple-500" :
                      stage.stage === 'Negotiation' ? "bg-amber-500" :
                      stage.stage === 'Won' ? "bg-emerald-500" : "bg-red-500"
                    )} 
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
             <div className="flex items-center gap-2 mb-2">
               <Zap className="h-3.5 w-3.5 text-blue-500" />
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
               { label: "Opportunities closing soon", value: "8 Cards", color: "text-blue-600", route: "/sales/opportunities?closingSoon=true" },
               { label: "Top lost reason", value: "Pricing", color: "text-red-500", route: "/sales/reports/loss-analysis" },
               { label: "Weighted forecast summary", value: `$${((stats.pipelineValue || 0) * 0.3 / 1000).toFixed(0)}k`, color: "text-emerald-600", route: "/sales/forecast" },
               { label: "Active pipeline summary", value: `${stats.pipelineLeads || 0} Leads`, color: "text-indigo-600", route: "/sales/pipeline" },
               { label: "Largest opportunity cluster", value: "Enterprise", color: "text-purple-600", route: "/sales/opportunities?segment=enterprise" },
             ].map((insight, idx) => (
               <motion.div 
                key={idx} 
                whileHover={{ x: 4 }}
                onClick={() => navigate(insight.route)}
                className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all cursor-pointer"
               >
                 <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{insight.label}</span>
                 <span className={cn("text-xs font-bold", insight.color)}>{insight.value}</span>
               </motion.div>
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
             {recommendations.map((rec, idx) => (
               <Card key={idx} className="group p-4 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] hover:border-blue-200 dark:hover:border-blue-500/30 transition-all shadow-sm">
                 <div className="flex justify-between items-start mb-3">
                   <Badge className={cn(
                     "text-[9px] font-bold uppercase tracking-tighter h-5",
                     rec.priority === "Urgent" ? "bg-red-50 text-red-600 dark:bg-red-950/30" : 
                     rec.priority === "High" ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30" :
                     "bg-blue-50 text-blue-600 dark:bg-blue-950/30"
                   )}>
                     {rec.priority}
                   </Badge>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 dark:bg-white/5 text-blue-500"
                    onClick={() => toast.info(`Recommendation: ${rec.title}`)}
                   >
                     <ArrowRight className="h-4 w-4" />
                   </Button>
                 </div>
                 <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{rec.title}</h3>
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">{rec.desc}</p>
                 <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate(rec.route)}
                      className="h-8 flex-1 border border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10"
                    >
                      {rec.action}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Section Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Top Customers by Revenue</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/crm/customers")}
              className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50"
            >
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                {(data?.topCustomers || []).length > 0 ? (
                  data.topCustomers.map((customer: any, idx: number) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => navigate(`/crm/customers?id=${customer.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-7 w-7 border border-white dark:border-white/5 shadow-sm">
                            <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
                              {customer.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">${customer.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="secondary" className="text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">Active</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No customer data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Overdue Invoices */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-200 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Overdue Invoices</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/sales/payments")}
              className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50"
            >
              Collect Payments
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                {(data?.overdueInvoicesList || []).length > 0 ? (
                  data.overdueInvoicesList.map((inv: any, idx: number) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => navigate(`/sales/invoices`)}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{inv.number}</td>
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{inv.customerName}</td>
                      <td className="px-6 py-4">
                         <span className="flex items-center gap-1.5 text-red-500 font-bold">
                           <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                           {new Date(inv.dueDate).toLocaleDateString()}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">${inv.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No overdue invoices</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-white/5 text-center">
             <Button 
              variant="ghost" 
              onClick={() => navigate("/sales/invoices?status=overdue")}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-500"
             >
               View All Overdue
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

