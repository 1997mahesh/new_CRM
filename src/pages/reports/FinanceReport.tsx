import React, { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  Briefcase,
  Layers,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function FinanceReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/finance', { startDate, endDate });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load finance report");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Balancing books and generating P&L...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Finance Report</h1>
          <p className="text-sm text-slate-500 font-medium italic">Period: <span className="text-slate-800 font-bold">{startDate} - {endDate}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">From</label>
            <Input 
              type="date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="h-10 border-none bg-slate-50 rounded-xl" 
            />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
            <Input 
              type="date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="h-10 border-none bg-slate-50 rounded-xl" 
            />
          </div>
          <div className="flex items-end h-full">
            <Button onClick={fetchReport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20 text-xs font-bold uppercase tracking-widest leading-none">Generate Analysis</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Total Income" value={`$${data?.summary.totalIncome.toLocaleString()}`} trend="+12.5%" color="emerald" icon={TrendingUp} />
        <ReportStatCard title="Total Expenses" value={`$${data?.summary.totalExpenses.toLocaleString()}`} trend="+4.2%" color="rose" icon={CreditCard} />
        <ReportStatCard title="Net Profit" value={`$${data?.summary.netProfit.toLocaleString()}`} trend="+18.2%" color="blue" icon={DollarSign} />
        <ReportStatCard title="Net Margin" value={`${data?.summary.margin.toFixed(1)}%`} subtitle="Profitability ratio" color="amber" icon={Briefcase} />
      </div>

      {/* Summary Table and Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Financial Summary</CardTitle>
            <CardDescription>Consolidated P&L statement for the period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-600">Operating Revenue</span>
                <span className="text-sm font-bold text-slate-800 font-mono">${data?.summary.totalIncome.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-600">Operating Expenses</span>
                <span className="text-sm font-bold text-rose-600 font-mono">-${data?.summary.totalExpenses.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center py-4 bg-slate-50 rounded-2xl px-4">
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Net Operating Income</span>
                <span className="text-lg font-black text-blue-600 font-mono">${data?.summary.netProfit.toLocaleString()}</span>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Capital Flow</CardTitle>
            <CardDescription>Outstanding receivables and payables</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Accounts Receivable</p>
                <h4 className="text-xl font-black text-blue-600 font-mono">${data?.receivables.toLocaleString()}</h4>
                <p className="text-[10px] text-blue-400 font-medium mt-1 italic">Expected collections</p>
             </div>
             <div className="p-4 rounded-3xl bg-rose-50/50 border border-rose-100 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Accounts Payable</p>
                <h4 className="text-xl font-black text-rose-600 font-mono">${data?.payables.toLocaleString()}</h4>
                <p className="text-[10px] text-rose-400 font-medium mt-1 italic">Pending obligations</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportStatCard({ title, value, trend, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-5">
         <div className="flex justify-between items-center mb-3">
            <div className={cn("p-2 rounded-xl", colorMap[color])}>
              <Icon className="h-4 w-4" />
            </div>
            {trend && (
              <div className="flex items-center gap-1">
                {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                <span className={cn(
                  "text-[10px] font-bold",
                  trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                )}>
                  {trend}
                </span>
              </div>
            )}
         </div>
         <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <h3 className="text-xl font-black text-slate-800 leading-none">{value}</h3>
            {subtitle && <p className="text-[10px] text-slate-500 font-medium mt-1">{subtitle}</p>}
         </div>
      </CardContent>
    </Card>
  );
}
