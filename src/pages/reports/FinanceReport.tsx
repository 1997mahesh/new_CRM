import React from "react";
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
  ArrowDownRight
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FINANCE_DATA = [
  { name: "Jan", revenue: 85000, costs: 62000 },
  { name: "Feb", revenue: 92000, costs: 65000 },
  { name: "Mar", revenue: 110000, costs: 68000 },
  { name: "Apr", revenue: 105000, costs: 72000 },
  { name: "May", revenue: 145000, costs: 85000 },
];

export default function FinanceReport() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Finance Report</h1>
          <p className="text-sm text-slate-500 font-medium italic">Period: <span className="text-slate-800 font-bold">May 1, 2026 - May 31, 2026</span></p>
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
            <Input type="date" className="h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-01" />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
            <Input type="date" className="h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-31" />
          </div>
          <div className="flex items-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20 text-xs font-bold uppercase tracking-widest">Generate Analysis</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Revenue" value="$206,000" trend="+12.5%" color="emerald" icon={TrendingUp} />
        <ReportStatCard title="Total Costs" value="$147,000" trend="+4.2%" color="rose" icon={CreditCard} />
        <ReportStatCard title="Net Profit" value="$59,000" trend="+18.2%" color="blue" icon={DollarSign} />
        <ReportStatCard title="Outstanding" value="$12,400" subtitle="Pending collections" color="amber" icon={Briefcase} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pl" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto overflow-x-auto max-w-full">
          <TabsTrigger value="pl" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm whitespace-nowrap">P&L Overview</TabsTrigger>
          <TabsTrigger value="ar" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm whitespace-nowrap">AR Aging</TabsTrigger>
          <TabsTrigger value="ap" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm whitespace-nowrap">AP Aging</TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm whitespace-nowrap">Expenses by Category</TabsTrigger>
        </TabsList>

        <TabsContent value="pl" className="space-y-6">
           <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Revenue vs Costs</CardTitle>
                <CardDescription>Monthly profit and loss analysis report.</CardDescription>
              </div>
               <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none">Revenue</Badge>
                <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none">Costs</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FINANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
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
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="costs" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-none shadow-soft overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CostItem label="Product Procurement" amount="$45,000" percent={45} color="#3b82f6" />
                    <CostItem label="Operational Expenses" amount="$25,000" percent={25} color="#6366f1" />
                    <CostItem label="Marketing & Sales" amount="$15,000" percent={15} color="#f59e0b" />
                    <CostItem label="HR & Admin" amount="$15,000" percent={15} color="#f43f5e" />
                </CardContent>
              </Card>

              <Card className="border-none shadow-soft overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">P&L Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm font-medium text-slate-600">Gross Revenue</span>
                            <span className="text-sm font-bold text-slate-800">$206,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm font-medium text-slate-600">Cost of Goods Sold</span>
                            <span className="text-sm font-bold text-rose-600">-$120,400</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm font-bold text-slate-800">Gross Profit</span>
                            <span className="text-sm font-black text-emerald-600">$85,600</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm font-medium text-slate-600">Operating Expenses</span>
                            <span className="text-sm font-bold text-rose-600">-$26,600</span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-slate-50 rounded-xl px-4 mt-4">
                            <span className="text-base font-black text-slate-800 uppercase tracking-tight">Net Profit</span>
                            <span className="text-xl font-black text-blue-600">$59,000</span>
                        </div>
                    </div>
                </CardContent>
              </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CostItem({ label, amount, percent, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">{label}</span>
                <span className="text-xs font-black text-slate-800">{amount}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
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
