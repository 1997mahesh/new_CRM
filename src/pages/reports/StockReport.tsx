import React, { useState, useEffect, useCallback } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Package, 
  AlertTriangle, 
  ArrowDownWideNarrow,
  Box,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Search,
  Loader2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function StockReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [warehouseId, setWarehouseId] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/stock', { warehouseId });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load stock report");
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const distributionData = data ? Object.entries(data.warehouseDistribution).map(([name, value]) => ({ name, value })) : [];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Auditing inventory levels...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Stock Report</h1>
          <p className="text-sm text-slate-500 font-medium">Detailed inventory analysis and stock movement.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export Inventory
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Warehouse Filter</label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger className="h-10 border-none bg-slate-50 rounded-xl font-medium">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="">All Warehouses</SelectItem>
                <SelectItem value="wh-main">Main Distribution Center</SelectItem>
                <SelectItem value="wh-secondary">Secondary Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end h-full">
            <Button onClick={fetchReport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20 text-xs font-bold uppercase tracking-widest leading-none">Apply Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StockStatCard title="Inventory Valuation" value={`$${(data?.totalValuation || 0).toLocaleString()}`} subtitle="Total asset worth" color="blue" icon={Package} />
        <StockStatCard title="Total SKU Count" value={data?.inventory.length} subtitle="Active product records" color="emerald" icon={BarChart3} />
        <StockStatCard title="Low Stock Alerts" value={data?.lowStockCount} subtitle="Items requiring reorder" color="amber" icon={AlertTriangle} />
        <StockStatCard title="Warehouses" value={Object.keys(data?.warehouseDistribution || {}).length} subtitle="Operational sites" color="rose" icon={LayoutDashboard} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="levels" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto">
          <TabsTrigger value="levels" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Stock Levels</TabsTrigger>
          <TabsTrigger value="distribution" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="levels">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Product</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">SKU</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Warehouse</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Stock</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Valuation</TableHead>
                  <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.inventory.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Box className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-[10px] font-mono text-slate-400 uppercase">{item.sku}</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px] px-2 py-0">
                        {item.warehouse.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">{item.quantity}</TableCell>
                    <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">${(item.valuation || 0).toLocaleString()}</TableCell>
                    <TableCell className="py-4 px-6 text-right">
                       <Badge className={cn(
                         "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                         item.quantity >= 10 ? "bg-emerald-50 text-emerald-600" :
                         item.quantity > 0 ? "bg-amber-50 text-amber-600" :
                         "bg-rose-50 text-rose-600"
                       )}>
                         {item.quantity >= 10 ? 'OK' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
           <Card className="border-none shadow-soft overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Warehouse Distribution</CardTitle>
                <CardDescription>Asset distribution across facilities</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={distributionData}
                       cx="50%"
                       cy="50%"
                       innerRadius={80}
                       outerRadius={120}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {distributionData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StockStatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <Card className="border-none shadow-soft overflow-hidden group">
      <CardContent className="p-6">
         <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2.5 rounded-2xl transition-transform group-hover:scale-110 duration-300", colorMap[color])}>
              <Icon className="h-5 w-5" />
            </div>
         </div>
         <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
            {subtitle && <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">{subtitle}</p>}
         </div>
      </CardContent>
    </Card>
  );
}
