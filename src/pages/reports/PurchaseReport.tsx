import React from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  FileText,
  Truck,
  ArrowUpRight,
  PieChart as PieChartIcon,
  RefreshCcw
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

const SPEND_DATA = [
  { name: "Jan", spend: 45000 },
  { name: "Feb", spend: 38000 },
  { name: "Mar", spend: 52000 },
  { name: "Apr", spend: 41000 },
  { name: "May", spend: 85000 },
];

export default function PurchaseReport() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Purchase Report</h1>
          <p className="text-sm text-slate-500 font-medium italic">Period: <span className="text-slate-800 font-bold">May 1, 2026 - May 31, 2026</span></p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export Report
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
          <div className="flex items-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Total Spend" value="$147,000" trend="+4.2%" color="rose" icon={ArrowUpRight} />
        <ReportStatCard title="Open POs" value="15" subtitle="$42,800" color="blue" icon={ShoppingCart} />
        <ReportStatCard title="Bills Due" value="8" subtitle="$12,500" color="amber" icon={FileText} />
        <ReportStatCard title="PO Fulfillment" value="94.2%" trend="+1.5%" color="emerald" icon={Truck} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trend" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto">
          <TabsTrigger value="trend" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Spend Trend</TabsTrigger>
          <TabsTrigger value="vendors" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Top Vendors</TabsTrigger>
          <TabsTrigger value="aging" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Bill Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
           <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Monthly Spend Trend</CardTitle>
              <CardDescription>Analysis of procurement costs over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SPEND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    <Bar dataKey="spend" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
           <Card className="border-none shadow-soft h-[400px] flex flex-col justify-center items-center text-slate-400">
             <Truck className="h-16 w-16 mb-4 opacity-20" />
             <p className="text-lg font-bold">Top Vendors Performance</p>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
           <Card className="border-none shadow-soft h-[400px] flex flex-col justify-center items-center text-slate-400">
             <RefreshCcw className="h-16 w-16 mb-4 opacity-20" />
             <p className="text-lg font-bold">Bill Aging Analytics</p>
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
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-5 text-center sm:text-left">
         <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 mb-3">
            <div className={cn("p-2.5 rounded-2xl", colorMap[color])}>
              <Icon className="h-5 w-5" />
            </div>
            {trend && (
              <Badge variant="secondary" className={cn(
                "border-none text-[10px] font-bold px-1.5 py-0",
                trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {trend}
              </Badge>
            )}
         </div>
         <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
            {subtitle && <p className="text-[10px] text-slate-500 font-medium mt-1">{subtitle}</p>}
         </div>
      </CardContent>
    </Card>
  );
}
