import React, { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Target, 
  Users, 
  Clock, 
  FileText,
  MousePointer2,
  PieChart as PieChartIcon,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SalesReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/sales', { startDate, endDate });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load sales report");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const agingData = data ? [
    { name: 'Current', value: data.aging.current },
    { name: '30 Days', value: data.aging['30_days'] },
    { name: '60 Days', value: data.aging['60_days'] },
    { name: '90+ Days', value: data.aging['90_plus'] },
  ] : [];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Generating detailed sales report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Sales Report</h1>
          <p className="text-sm text-slate-500 font-medium italic">Period: <span className="text-slate-800 font-bold">{startDate} - {endDate}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="pl-10 h-10 border-none bg-slate-50 rounded-xl" 
              />
            </div>
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="pl-10 h-10 border-none bg-slate-50 rounded-xl" 
              />
            </div>
          </div>
          <div className="flex items-end h-full">
            <Button onClick={fetchReport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Total Revenue" value={`$${(data?.stats?.totalRevenue || 0).toLocaleString()}`} trend="+12%" color="emerald" icon={TrendingUp} />
        <ReportStatCard title="Paid Amount" value={`$${(data?.stats?.paidRevenue || 0).toLocaleString()}`} color="blue" icon={FileText} />
        <ReportStatCard title="Outstanding" value={`$${(data?.stats?.outstanding || 0).toLocaleString()}`} color="rose" icon={Clock} />
        <ReportStatCard title="Invoices" value={data?.invoices?.length || 0} subtitle="Generated in period" color="amber" icon={Target} />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto">
          <TabsTrigger value="revenue" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Revenue</TabsTrigger>
          <TabsTrigger value="customers" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Top Customers</TabsTrigger>
          <TabsTrigger value="aging" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Invoice Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Revenue Performance</CardTitle>
              <CardDescription>Daily breakdown of invoice volume and value.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={(data?.invoices || []).map((inv: any) => ({ name: new Date(inv.dueDate).toLocaleDateString(), value: inv.amount }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader>
               <CardTitle className="text-xl font-bold text-slate-800">Top Revenue Customers</CardTitle>
               <CardDescription>Accounts contributing the most to your top line.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.topCustomers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis dataKey="id" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} width={100} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Aging Distribution</CardTitle>
                  <CardDescription>Categorized overdue receivables</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {agingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-soft">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Detailed Invoices</CardTitle>
                    <CardDescription>All invoices in selected period</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {(data?.invoices || []).map((inv: any) => (
                         <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                            <div>
                               <p className="text-sm font-bold text-slate-800">{inv.number}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.status}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-slate-800">${(inv.amount || 0).toLocaleString()}</p>
                               <p className="text-[10px] text-slate-400 font-bold">{new Date(inv.dueDate).toLocaleDateString()}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportStatCard({ title, value, trend, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-5">
         <div className="flex justify-between items-start mb-3">
            <div className={cn("p-2 rounded-xl", colorMap[color])}>
              <Icon className="h-4 w-4" />
            </div>
            {trend && (
              <span className={cn(
                "text-[10px] font-bold",
                trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend}
              </span>
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
