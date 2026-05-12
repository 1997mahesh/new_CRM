import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Trophy, 
  Activity, 
  Search, 
  Filter, 
  CalendarDays, 
  Download, 
  RefreshCcw, 
  Plus, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Users,
  Star as StarIcon,
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart3,
  LayoutGrid,
  Loader2,
  Trophy as TrophyIcon,
  ShieldCheck,
  Building2,
  Clock,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Cell, 
  Pie,
  Legend,
  ComposedChart,
  Line
} from "recharts";

// Mock data generator for items not readily available in simple fetch
const MOCK_MONTHLY_FORECAST = [
  { name: 'Jan', forecast: 45000, actual: 42000, profit: 12000 },
  { name: 'Feb', forecast: 52000, actual: 55000, profit: 15600 },
  { name: 'Mar', forecast: 48000, actual: 49000, profit: 13500 },
  { name: 'Apr', forecast: 61000, actual: 58000, profit: 18000 },
  { name: 'May', forecast: 55000, actual: 0, profit: 0 },
  { name: 'Jun', forecast: 67000, actual: 0, profit: 0 },
  { name: 'Jul', forecast: 72000, actual: 0, profit: 0 },
  { name: 'Aug', forecast: 69000, actual: 0, profit: 0 },
  { name: 'Sep', forecast: 75000, actual: 0, profit: 0 },
  { name: 'Oct', forecast: 82000, actual: 0, profit: 0 },
  { name: 'Nov', forecast: 88000, actual: 0, profit: 0 },
  { name: 'Dec', forecast: 95000, actual: 0, profit: 0 },
];

const SATISFACTION_DATA = [
  { name: 'Very Satisfied', value: 400, color: '#10B981' },
  { name: 'Satisfied', value: 300, color: '#3B82F6' },
  { name: 'Neutral', value: 200, color: '#F59E0B' },
  { name: 'Unsatisfied', value: 100, color: '#F97316' },
  { name: 'Very Unsatisfied', value: 50, color: '#EF4444' },
];

export default function SalesForecastingPage() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("monthly");
  const [leads, setLeads] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const [regionSearch, setRegionSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const regionalData = useMemo(() => {
    let data = [
      { region: "North America", forecast: 450000, actual: 482000, risk: "Low", growth: 12.4, confidence: 95 },
      { region: "Europe", forecast: 320000, actual: 305000, risk: "Medium", growth: -2.1, confidence: 82 },
      { region: "Asia Pacific", forecast: 280000, actual: 295000, risk: "Low", growth: 8.5, confidence: 88 },
      { region: "Latin America", forecast: 120000, actual: 98000, risk: "High", growth: 5.2, confidence: 64 },
      { region: "Middle East", forecast: 85000, actual: 82000, risk: "Medium", growth: 1.4, confidence: 76 },
    ];

    if (regionSearch) {
      data = data.filter(r => r.region.toLowerCase().includes(regionSearch.toLowerCase()));
    }

    if (sortConfig) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [regionSearch, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, invoicesRes] = await Promise.all([
        api.get('/leads', { limit: 1000 }),
        api.get('/invoices', { limit: 1000 })
      ]);
      
      if (leadsRes.success) setLeads(leadsRes.data.items || []);
      if (invoicesRes.success) setInvoices(invoicesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch forecast data", error);
      toast.error("Failed to load real data connection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalPipelineValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const wonLeads = leads.filter(l => l.pipelineStage === "Won");
    const wonValue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    
    // Simple forecast: won + weight * pipeline
    const weightedPipeline = leads.reduce((sum, l) => {
        if (l.pipelineStage === "Won") return sum;
        if (l.pipelineStage === "Lost") return sum;
        let weight = 0.1;
        if (l.pipelineStage === "Negotiation") weight = 0.8;
        if (l.pipelineStage === "Proposal") weight = 0.6;
        if (l.pipelineStage === "Qualified") weight = 0.3;
        return sum + (l.value || 0) * weight;
    }, 0);

    const projectedRevenue = wonValue + weightedPipeline;
    const forecastedProfit = projectedRevenue * 0.28; // Estimated 28% margin
    const riskAmount = totalPipelineValue * 0.15; // Estimated 15% slippage risk

    return {
      potentialRevenue: totalPipelineValue,
      forecastedRevenue: projectedRevenue,
      forecastedProfit: forecastedProfit,
      forecastedRisk: riskAmount,
      totalLeads: leads.length,
      winRate: leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0
    };
  }, [leads]);

  const funnelData = useMemo(() => {
    const stages = ["New", "Qualified", "Proposal", "Negotiation", "Won"];
    return stages.map(stage => {
        const count = leads.filter(l => l.pipelineStage === stage).length;
        const value = leads.filter(l => l.pipelineStage === stage).reduce((sum, l) => sum + (l.value || 0), 0);
        return { stage, count, value };
    });
  }, [leads]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/30 dark:bg-transparent p-6 space-y-8 animate-in fade-in">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
                <div className="h-4 w-96 bg-slate-100 dark:bg-white/5 animate-pulse rounded-lg" />
            </div>
            <div className="flex gap-3">
                <div className="h-10 w-24 bg-slate-200 dark:bg-white/5 animate-pulse rounded-xl" />
                <div className="h-10 w-24 bg-slate-200 dark:bg-white/5 animate-pulse rounded-xl" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
                 <div key={i} className="h-32 bg-white dark:bg-[#1C1F26] border border-slate-200 dark:border-white/5 rounded-2xl animate-pulse" />
             ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] bg-white dark:bg-[#1C1F26] border border-slate-200 dark:border-white/5 rounded-2xl animate-pulse" />
            <div className="h-[400px] bg-white dark:bg-[#1C1F26] border border-slate-200 dark:border-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-transparent text-slate-900 dark:text-slate-200 p-6 space-y-8 animate-in fade-in duration-700 pb-20 selection:bg-blue-500/30 font-sans">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white italic flex items-center gap-3"
          >
            <TrendingUp className="h-7 w-7 text-blue-600" />
            Sales Forecasting
          </motion.h1>
          <p className="text-slate-500 font-medium text-sm tracking-tight">Track revenue predictions, pipeline forecasting, and business growth insights.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
             <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px] h-9 border-none bg-transparent font-bold text-xs focus:ring-0">
                    <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                   <SelectItem value="weekly" className="text-xs font-bold">Weekly</SelectItem>
                   <SelectItem value="monthly" className="text-xs font-bold">Monthly</SelectItem>
                   <SelectItem value="quarterly" className="text-xs font-bold">Quarterly</SelectItem>
                   <SelectItem value="yearly" className="text-xs font-bold">Yearly</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <Button 
            variant="outline" 
            className="h-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl px-4 gap-2 font-bold text-xs"
            onClick={() => fetchData()}
          >
            <RefreshCcw className="h-4 w-4 text-slate-400" />
            Refresh
          </Button>

          <Button 
            variant="outline" 
            className="h-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl px-4 gap-2 font-bold text-xs"
          >
            <Download className="h-4 w-4 text-slate-400" />
            Export
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg gap-2 text-xs">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </header>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Potential Revenue", value: stats.potentialRevenue, trend: "+12.5%", color: "text-blue-600", sparkColor: "#3B82F6" },
          { label: "Forecasted Revenue", value: stats.forecastedRevenue, trend: "+8.2%", color: "text-indigo-600", sparkColor: "#6366F1" },
          { label: "Forecasted Profit", value: stats.forecastedProfit, trend: "+14.1%", color: "text-emerald-600", sparkColor: "#10B981" },
          { label: "Forecasted Risk", value: stats.forecastedRisk, trend: "-2.4%", color: "text-rose-600", sparkColor: "#F43F5E" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <Badge variant="outline" className={cn("text-[10px] font-bold border-none", stat.color.replace('text-', 'bg-').concat('/10'), stat.color)}>
                            {stat.trend}
                        </Badge>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">${(stat.value / 1000).toFixed(1)}k</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic tracking-tighter">vs Previous Period</p>
                    </div>
                </div>
                {/* Small Sparkline in background */}
                <div className="absolute inset-x-0 bottom-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 12 }, (_, j) => ({ v: Math.random() * 100 }))}>
                            <Area type="monotone" dataKey="v" stroke={stat.sparkColor} fill={stat.sparkColor} fillOpacity={1} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Forecast Chart */}
        <Card className="lg:col-span-2 p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm group">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white italic flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Revenue Forecast
              </h3>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Predicted vs Actual Revenue Performance</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Forecast</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Actual</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MOCK_MONTHLY_FORECAST}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-white/5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1F26', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="forecast" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorForecast)" />
                <Bar dataKey="actual" barSize={30} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: '#F59E0B' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Satisfaction Donut Chart */}
        <Card className="p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
           <div className="space-y-1 mb-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white italic flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-indigo-600" />
                Customer Satisfaction
              </h3>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Feedback metrics and sentiment analysis</p>
           </div>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={SATISFACTION_DATA}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {SATISFACTION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1C1F26', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                 <span className="text-3xl font-bold text-slate-800 dark:text-white">4.8</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Score</span>
              </div>
           </div>
           <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Retention Rate</p>
                        <p className="text-[10px] text-slate-400">Monthly Average</p>
                    </div>
                 </div>
                 <span className="text-sm font-bold text-emerald-600">92.4%</span>
              </div>
           </div>
        </Card>
      </div>

      {/* Sales Funnel & Gauge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Sales Funnel Visualization */}
         <Card className="p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white italic mb-8 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Sales Funnel Section
            </h3>
            <div className="space-y-4">
               {funnelData.map((item, idx) => {
                  const maxVal = Math.max(...funnelData.map(d => d.value));
                  const percentage = (item.value / (maxVal || 1)) * 100;
                  return (
                    <div key={item.stage} className="relative group cursor-default">
                       <div className="flex justify-between items-center mb-1 relative z-10 px-2">
                          <div className="flex items-center gap-3">
                             <div className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[10px] font-bold text-slate-500">{idx + 1}</div>
                             <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.stage}</span>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-slate-800 dark:text-white">${(item.value / 1000).toFixed(1)}k</p>
                             <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.count} Opportunity</p>
                          </div>
                       </div>
                       <div className="h-10 w-full bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={cn(
                                "h-full transition-all duration-500",
                                idx === 0 ? "bg-blue-500/20" : 
                                idx === 1 ? "bg-indigo-500/30" : 
                                idx === 2 ? "bg-purple-500/40" : 
                                idx === 3 ? "bg-amber-500/50" : "bg-emerald-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                          {idx < funnelData.length - 1 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                <span>Conversion</span>
                                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />
                                <span className="text-blue-600">24%</span>
                            </div>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
         </Card>

         {/* Gauge Charts - Custom Visual Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Current Revenue", val: 84, target: "$1M", icon: DollarSign, color: "#2563eb", textColor: "text-blue-600", bg: "bg-blue-500/10" },
              { label: "Forecast Accuracy", val: 92, target: "95%", icon: Zap, color: "#9333ea", textColor: "text-purple-600", bg: "bg-purple-500/10" },
              { label: "Revenue Projection", val: 78, target: "$1.2M", icon: TrendingUp, color: "#10b981", textColor: "text-emerald-600", bg: "bg-emerald-500/10" },
              { label: "Conversion Cycle", val: 65, target: "14 Days", icon: Clock, color: "#f97316", textColor: "text-orange-600", bg: "bg-orange-500/10" },
            ].map((g, i) => {
              const radius = 40;
              const circumference = 2 * Math.PI * radius;
              
              return (
                <Card key={g.label} className="p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center group">
                   <div className={cn("h-10 w-10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110", g.bg)}>
                      <g.icon className={cn("h-5 w-5", g.textColor)} />
                   </div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-4">{g.label}</p>
                   <div className="relative h-28 w-28 mb-4">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                         {/* Background Track */}
                         <circle 
                           className="stroke-slate-100 dark:stroke-white/5 fill-none" 
                           strokeWidth="10" 
                           cx="50" 
                           cy="50" 
                           r={radius} 
                         />
                         {/* Progress Ring */}
                         <motion.circle 
                           initial={{ strokeDashoffset: circumference }}
                           animate={{ strokeDashoffset: circumference - (g.val / 100) * circumference }}
                           transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.15 }}
                           stroke={g.color}
                           strokeWidth="10" 
                           strokeDasharray={circumference} 
                           strokeLinecap="round" 
                           fill="none"
                           cx="50" cy="50" r={radius} 
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">{g.val}%</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-tight">Target: {g.target}</Badge>
                   </div>
                </Card>
              );
            })}
         </div>
      </div>

      {/* Mini Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
         <Card className="p-5 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white italic">Forecast Accuracy</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Performance Reliability</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-600/10 p-2 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-end gap-3">
                   <div className="text-4xl font-bold italic tracking-tighter">98.2%</div>
                   <div className="flex items-center text-xs font-bold text-emerald-600 pb-1">
                      <ArrowUpRight className="h-3 w-3" />
                      1.4%
                   </div>
                </div>
                <p className="text-[10px] font-medium text-slate-500 italic">Your forecasting model reaches industry-best alignment standards.</p>
            </div>
         </Card>

         <Card className="p-5 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white italic mb-4">Number of Units Sold Forecast</h4>
            <div className="h-[80px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                     { v: 120 }, { v: 158 }, { v: 142 }, { v: 190 }, { v: 210 }, { v: 185 }, { v: 230 }
                  ]}>
                     <Bar dataKey="v" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Total units</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white italic leading-none">1,245</p>
            </div>
         </Card>

         <Card className="p-5 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white italic mb-4">Forecast Change Analysis</h4>
            <div className="space-y-3">
               {[
                 { label: "Upgrade Changes", val: 42, color: "bg-emerald-500" },
                 { label: "Downgrade Changes", val: 18, color: "bg-rose-500" },
                 { label: "Unchanged", val: 40, color: "bg-slate-300" },
               ].map(item => (
                 <div key={item.label}>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                       <span>{item.label}</span>
                       <span>{item.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className={cn("h-full", item.color)} style={{ width: `${item.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="p-5 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm">
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white italic">Opportunities Generated</h4>
                    <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-4 py-2 text-center">
                   <div className="flex-1">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{leads.length}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Lead volume</p>
                   </div>
                   <div className="h-8 w-px bg-slate-100 dark:bg-white/5" />
                   <div className="flex-1">
                      <p className="text-xl font-bold text-emerald-600">{funnelData[4].count}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Won Deals</p>
                   </div>
                </div>
                <Button variant="outline" className="w-full text-[9px] font-bold uppercase tracking-widest h-8 border-slate-200 dark:border-white/5 rounded-lg text-slate-500">Pipeline Report</Button>
             </div>
         </Card>
      </div>

      {/* Region Summary Table */}
      <Card className="bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Regional Forecast Summary
            </h3>
            <div className="flex items-center gap-2">
               <div className="relative group w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                   <Input 
                     placeholder="Filter by region..." 
                     className="pl-9 h-9 border-slate-100 dark:border-white/5 rounded-xl text-xs" 
                     value={regionSearch}
                     onChange={(e) => setRegionSearch(e.target.value)}
                   />
               </div>
               <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 dark:border-white/5">
                 <Filter className="h-4 w-4 text-slate-400" />
               </Button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                     <th className="px-8 py-5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('region')}>Region</th>
                     <th className="px-8 py-5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('forecast')}>Forecast</th>
                     <th className="px-8 py-5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('actual')}>Actual</th>
                     <th className="px-8 py-5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('risk')}>Risk</th>
                     <th className="px-8 py-5 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('growth')}>Growth %</th>
                     <th className="px-8 py-5 text-right font-medium italic cursor-pointer hover:text-blue-600 transition-colors" onClick={() => requestSort('confidence')}>Confidence</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {regionalData.map(row => (
                    <tr key={row.region} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-5">
                          <span className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{row.region}</span>
                       </td>
                       <td className="px-8 py-5">
                          <span className="font-mono font-bold italic text-blue-600">${row.forecast.toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-5">
                          <span className="font-mono font-bold italic text-slate-700 dark:text-slate-300">${row.actual.toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-5">
                          <Badge variant="outline" className={cn(
                            "text-[9px] font-bold uppercase px-2 py-0 border-none rounded-md",
                            row.risk === "Low" ? "bg-emerald-50 text-emerald-600" : 
                            row.risk === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                          )}>
                             {row.risk}
                          </Badge>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 font-bold">
                             {row.growth > 0 ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : <ArrowDownRight className="h-3 w-3 text-rose-600" />}
                             <span className={cn(row.growth > 0 ? "text-emerald-600" : "text-rose-600")}>{Math.abs(row.growth)}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                <span>{row.confidence}%</span>
                             </div>
                             <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${row.confidence}%` }} />
                             </div>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}
