import React from "react";
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
  PieChart as PieChartIcon
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const REVENUE_DATA = [
  { name: "Jan", revenue: 125000, target: 110000 },
  { name: "Feb", revenue: 142000, target: 115000 },
  { name: "Mar", revenue: 138000, target: 120000 },
  { name: "Apr", revenue: 165000, target: 130000 },
  { name: "May", revenue: 206000, target: 150000 },
];

const TOP_CUSTOMERS = [
  { name: "Global Tech", value: 45000 },
  { name: "Blue Horizon", value: 38000 },
  { name: "Innovate Ltd", value: 32000 },
  { name: "Omega Corp", value: 28000 },
  { name: "Zenith Inc", value: 25000 },
];

export default function SalesReport() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Sales Report</h1>
          <p className="text-sm text-slate-500 font-medium italic">Period: <span className="text-slate-800 font-bold">May 1, 2026 - May 31, 2026</span></p>
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
              <Input type="date" className="pl-10 h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-01" />
            </div>
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input type="date" className="pl-10 h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-31" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Customer</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 border-none bg-slate-50 rounded-xl font-medium">
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="1">Global Tech Solutions</SelectItem>
                <SelectItem value="2">Blue Horizon Corp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ReportStatCard title="Revenue" value="$206,000" trend="+12%" color="emerald" icon={TrendingUp} />
        <ReportStatCard title="Open Invoices" value="24" subtitle="$84,500" color="blue" icon={FileText} />
        <ReportStatCard title="Overdue" value="8" subtitle="$12,300" color="rose" icon={Clock} />
        <ReportStatCard title="Pipeline" value="$420,000" subtitle="15 Deals" color="amber" icon={Target} />
        <ReportStatCard title="Quote Rate" value="68%" trend="+5%" color="indigo" icon={MousePointer2} />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto">
          <TabsTrigger value="revenue" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Revenue</TabsTrigger>
          <TabsTrigger value="funnel" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Lead Funnel</TabsTrigger>
          <TabsTrigger value="customers" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Top Customers</TabsTrigger>
          <TabsTrigger value="aging" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Invoice Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Revenue Performance</CardTitle>
              <CardDescription>Monthly comparison between actual revenue and targets.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                      tick={{ fill: "#94a3b8", fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 border-t border-slate-50 pt-8">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Best Month</p>
                    <h4 className="text-lg font-black text-slate-800">May 2026</h4>
                    <p className="text-xs text-emerald-500 font-bold">$206,000</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Average Monthly</p>
                    <h4 className="text-lg font-black text-slate-800">$151,200</h4>
                    <p className="text-xs text-slate-400 font-bold">Last 5 months</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Target Achievement</p>
                    <h4 className="text-lg font-black text-slate-800">114.2%</h4>
                    <p className="text-xs text-emerald-500 font-bold">Above goal</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Yearly Forecast</p>
                    <h4 className="text-lg font-black text-slate-800">$2.4M</h4>
                    <p className="text-xs text-indigo-500 font-bold">Projected</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card className="border-none shadow-soft h-[500px] flex flex-col justify-center items-center text-slate-400">
             <PieChartIcon className="h-16 w-16 mb-4 opacity-20" />
             <p className="text-lg font-bold">Top Customers Data Visualization</p>
             <p className="text-sm">Detailed customer metrics would be displayed here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="funnel">
           <Card className="border-none shadow-soft h-[500px] flex flex-col justify-center items-center text-slate-400">
             <Target className="h-16 w-16 mb-4 opacity-20" />
             <p className="text-lg font-bold">Sales Lead Funnel</p>
             <p className="text-sm">Conversion rates and funnel analytics.</p>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
           <Card className="border-none shadow-soft h-[500px] flex flex-col justify-center items-center text-slate-400">
             <FileText className="h-16 w-16 mb-4 opacity-20" />
             <p className="text-lg font-bold">Invoice Aging Report</p>
             <p className="text-sm">Snapshot of unpaid invoice duration.</p>
          </Card>
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
