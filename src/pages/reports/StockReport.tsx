import React from "react";
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
  Search
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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

const STOCK_ITEMS = [
  { product: "MacBook Pro M3", sku: "MAC-001", category: "Electronics", stock: 12, threshold: 5, value: 24000, status: "OK" },
  { product: "iPhone 15 Pro", sku: "IPH-002", category: "Electronics", stock: 4, threshold: 10, value: 4800, status: "Low Stock" },
  { product: "Office Desk", sku: "FUR-003", category: "Furniture", stock: 0, threshold: 2, value: 0, status: "Out of Stock" },
  { product: "Wireless Mouse", sku: "ACC-004", category: "Accessories", stock: 45, threshold: 15, value: 2250, status: "OK" },
  { product: "Dell Monitor 27\"", sku: "MON-005", category: "Electronics", stock: 8, threshold: 5, value: 3200, status: "OK" },
];

export default function StockReport() {
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
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Movement From</label>
            <Input type="date" className="h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-01" />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To</label>
            <Input type="date" className="h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-31" />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Warehouse</label>
            <Select defaultValue="main">
              <SelectTrigger className="h-10 border-none bg-slate-50 rounded-xl font-medium">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="secondary">Secondary Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-8 shadow-lg shadow-blue-600/20 text-xs font-bold uppercase tracking-widest">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StockStatCard title="Total Products" value="1,240" subtitle="Across 12 categories" color="blue" icon={Package} />
        <StockStatCard title="Stock Value" value="$420,500" subtitle="Total inventory worth" color="emerald" icon={BarChart3} />
        <StockStatCard title="Low Stock" value="18" subtitle="Products below threshold" color="amber" icon={AlertTriangle} />
        <StockStatCard title="Out of Stock" value="4" subtitle="Needs immediate reorder" color="rose" icon={ArrowDownWideNarrow} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="levels" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-soft border border-slate-100 inline-flex w-auto">
          <TabsTrigger value="levels" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Stock Levels</TabsTrigger>
          <TabsTrigger value="low" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Low Stock</TabsTrigger>
          <TabsTrigger value="value" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Top by Value</TabsTrigger>
          <TabsTrigger value="movements" className="rounded-lg px-6 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-sm">Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="levels">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Product</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">SKU</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Stock</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Threshold</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Value</TableHead>
                  <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STOCK_ITEMS.map((item) => (
                  <TableRow key={item.sku} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Box className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.product}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-[10px] font-mono text-slate-400 uppercase">{item.sku}</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px] px-2 py-0">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">{item.stock}</TableCell>
                    <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">{item.threshold}</TableCell>
                    <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">${item.value.toLocaleString()}</TableCell>
                    <TableCell className="py-4 px-6 text-right">
                       <Badge className={cn(
                         "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                         item.status === 'OK' ? "bg-emerald-50 text-emerald-600" :
                         item.status === 'Low Stock' ? "bg-amber-50 text-amber-600" :
                         "bg-rose-50 text-rose-600"
                       )}>
                         {item.status}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
