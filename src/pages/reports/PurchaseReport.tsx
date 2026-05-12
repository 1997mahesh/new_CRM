import React, { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  Search, 
  Package, 
  Truck, 
  Clock, 
  DollarSign,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function PurchaseReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-31");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/purchase', { startDate, endDate });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load purchase report");
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
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Compiling procurement analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Purchase Report</h1>
          <p className="text-sm text-slate-500 font-medium"> Procurement insights and vendor performance analytics.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
           <div className="flex-1 min-w-[150px] space-y-1.5">
             <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Start Date</label>
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
             <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">End Date</label>
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
             <Button onClick={fetchReport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20">Analyze</Button>
           </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Total Spend" value={`$${(data?.totalSpend || 0).toLocaleString()}`} icon={DollarSign} color="blue" />
        <ReportStatCard title="Purchase Orders" value={data?.purchaseOrders?.length || 0} subtitle="Orders in period" icon={Package} color="amber" />
        <ReportStatCard title="Pending Fulfillment" value={(data?.purchaseOrders || []).filter((po: any) => po.status === 'Pending').length} icon={Truck} color="indigo" />
        <ReportStatCard title="Active Vendors" value={data?.topVendors?.length || 0} icon={Truck} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Spend by Vendor</CardTitle>
            <CardDescription>Top suppliers by procurement value</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data?.topVendors}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                 <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Recent Purchase Orders</CardTitle>
            <CardDescription>Tracking recent fulfillment workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {(data?.purchaseOrders || []).map((po: any) => (
                <div key={po.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        po.status === 'Received' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {po.status === 'Received' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{po.number}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{po.vendor.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-slate-800">${po.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(po.date).toLocaleDateString()}</p>
                   </div>
                </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportStatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-5 flex items-center gap-4">
         <div className={cn("p-3 rounded-2xl", colorMap[color])}>
           <Icon className="h-5 w-5" />
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
