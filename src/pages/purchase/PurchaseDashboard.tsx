import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingCart, 
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
  Package,
  ChevronRight,
  ArrowRight,
  FileText,
  UserCheck,
  RefreshCw,
  Download,
  Filter,
  X
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
  Bar,
  Cell
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface DashboardStats {
  spendMTD: number;
  spendYTD: number;
  openPOs: number;
  outstandingBills: number;
}

interface SpendData {
  month: string;
  spend: number;
  volume: number;
}

interface TopVendor {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface OverdueBill {
  id: string;
  number: string;
  vendor: string;
  days: number;
  amount: number;
  status: string;
}

interface PendingPO {
  id: string;
  number: string;
  vendor: string;
  date: string;
  amount: number;
  status: string;
}

interface Vendor {
  id: string;
  name: string;
}

export default function PurchaseDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [spendData, setSpendData] = useState<SpendData[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [overdueBills, setOverdueBills] = useState<OverdueBill[]>([]);
  const [pendingPOs, setPendingPOs] = useState<PendingPO[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // Filters
  const [chartMode, setChartMode] = useState<"spend" | "volume">("spend");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{from: string, to: string}>({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (selectedVendor !== "all") queryParams.append("vendorId", selectedVendor);
      if (dateRange.from) queryParams.append("fromDate", dateRange.from);
      if (dateRange.to) queryParams.append("toDate", dateRange.to);

      const [statsRes, analyticsRes, vendorsRes, topVendorsRes, overdueRes, pendingRes] = await Promise.all([
        api.get(`/purchase/dashboard-stats?${queryParams.toString()}`),
        api.get(`/purchase/spend-analytics?${queryParams.toString()}`),
        api.get("/vendors"),
        api.get("/purchase/top-vendors"),
        api.get("/purchase/overdue-bills"),
        api.get("/purchase/pending-pos")
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (analyticsRes.success) setSpendData(analyticsRes.data);
      if (vendorsRes.success) setVendors(vendorsRes.data);
      if (topVendorsRes.success) setTopVendors(topVendorsRes.data);
      if (overdueRes.success) setOverdueBills(overdueRes.data);
      if (pendingRes.success) setPendingPOs(pendingRes.data);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedVendor, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const smartAlerts = useMemo(() => {
    const alerts = [];
    if (stats && stats.outstandingBills > 50000) {
      alerts.push({
        title: "High Accounts Payable",
        description: `Your outstanding bills are at $${stats.outstandingBills.toLocaleString()}, consider processing payments soon.`,
        type: "warning",
        icon: AlertCircle
      });
    }
    if (overdueBills.length > 5) {
      alerts.push({
        title: "Overdue Bill Warning",
        description: `You have ${overdueBills.length} critical overdue bills that need immediate attention.`,
        type: "critical",
        icon: Clock
      });
    }
    if (pendingPOs.filter(p => p.status === 'Pending Approval').length > 0) {
      alerts.push({
        title: "Pending Approvals",
        description: "Some purchase orders are waiting for your approval before they can be sent.",
        type: "info",
        icon: UserCheck
      });
    }
    return alerts;
  }, [stats, overdueBills, pendingPOs]);

  useEffect(() => {
    if (!loading && smartAlerts.length > 0) {
      // Small delay to show toasts after initial load
      const timers = smartAlerts.map((alert, i) => 
        setTimeout(() => {
          if (alert.type === 'critical') toast.error(alert.title, { description: alert.description });
          else if (alert.type === 'warning') toast.warning(alert.title, { description: alert.description });
          else toast.info(alert.title, { description: alert.description });
        }, 1000 + (i * 1000))
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [loading, smartAlerts]);

  const handleExport = (type: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting ${type.toUpperCase()} report...`);
    // Mock export logic - in real scenario this would trigger a download from backend
    setTimeout(() => {
      toast.info("Report downloaded successfully");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return "bg-emerald-50 text-emerald-600";
      case 'sent': return "bg-blue-50 text-blue-600";
      case 'received': return "bg-indigo-50 text-indigo-600";
      case 'pending approval': return "bg-amber-50 text-amber-600";
      case 'cancelled': return "bg-rose-50 text-rose-600";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Purchase Dashboard</h1>
            {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Track procurement performance and accounts payable.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "dark:bg-[#1f1a1d] dark:border-white/5 font-bold h-10 px-4 rounded-lg shadow-sm border-slate-200",
              showFilters && "bg-slate-50 border-blue-200 text-blue-600"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/purchase/orders")}
            className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm border-slate-200"
          >
            Purchase Orders
          </Button>
          <Button 
            onClick={() => navigate("/purchase/bills")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium"
          >
            Bills
          </Button>
        </div>
      </div>

      {/* Smart Alert Banner */}
      {!loading && smartAlerts.some(a => a.type === 'critical' || a.type === 'warning') && (
        <div className="animate-in slide-in-from-left duration-500">
          <Card className="bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 p-4 flex items-start gap-4 shadow-sm">
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Critical Attention Required</h3>
              <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5 font-medium italic">
                {smartAlerts.find(a => a.type === 'critical')?.description || smartAlerts.find(a => a.type === 'warning')?.description}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/purchase/bills/payments")}
              className="h-8 text-[10px] uppercase font-bold text-red-600 border-red-200 bg-white hover:bg-red-50 dark:bg-transparent dark:border-red-500/30 shadow-none shrink-0"
            >
              Resolve Now
            </Button>
          </Card>
        </div>
      )}

      {/* Global Filters */}
      {showFilters && (
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">Vendor</label>
              <select 
                className="w-full bg-white dark:bg-[#1f1a1d] border border-slate-200 dark:border-white/10 rounded-lg h-10 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
              >
                <option value="all">All Vendors</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">From Date</label>
              <input 
                type="date" 
                className="w-full bg-white dark:bg-[#1f1a1d] border border-slate-200 dark:border-white/10 rounded-lg h-10 px-3 text-xs outline-none"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500">To Date</label>
              <input 
                type="date" 
                className="w-full bg-white dark:bg-[#1f1a1d] border border-slate-200 dark:border-white/10 rounded-lg h-10 px-3 text-xs outline-none"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="flex items-end gap-2 pt-2 sm:pt-0">
              <Button 
                variant="outline" 
                className="h-10 text-xs font-bold flex-1 rounded-xl"
                onClick={() => {
                  setSelectedVendor("all");
                  setDateRange({ from: "", to: "" });
                }}
              >
                Reset
              </Button>
              <Button 
                className="h-10 text-xs font-bold flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                onClick={() => fetchData()}
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Spend MTD", value: stats ? `$${stats.spendMTD.toLocaleString()}` : "$0", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Spend YTD", value: stats ? `$${stats.spendYTD.toLocaleString()}` : "$0", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Open POs", value: stats ? stats.openPOs.toString() : "0", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Outstanding Bills", value: stats ? `$${stats.outstandingBills.toLocaleString()}` : "$0", icon: Receipt, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft dark:shadow-2xl transition-all hover:translate-y-[-2px]">
             <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2.5 rounded-xl", stat.bg, "dark:bg-white/5")}>
                 <stat.icon className={cn("h-5 w-5", stat.color)} />
               </div>
               <Badge className="bg-slate-50 text-slate-400 dark:bg-white/5 border-none text-[10px] font-mono">Live</Badge>
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
               {loading ? (
                 <Skeleton className="h-8 w-24" />
               ) : (
                 <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight animate-in zoom-in-95 duration-500">{stat.value}</p>
               )}
             </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spend */}
        <Card className="lg:col-span-2 border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col transition-all">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 italic">Monthly Spend</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analysis of procurement expenses over 12 months</p>
            </div>
            <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-xl">
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartMode("spend")}
                className={cn(
                  "h-8 text-[10px] font-bold uppercase tracking-wider px-4 rounded-lg",
                  chartMode === "spend" ? "bg-white dark:bg-white/10 shadow-sm text-blue-600" : "text-slate-400"
                )}
              >
                Spend
              </Button>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartMode("volume")}
                className={cn(
                  "h-8 text-[10px] font-bold uppercase tracking-wider px-4 rounded-lg",
                  chartMode === "volume" ? "bg-white dark:bg-white/10 shadow-sm text-blue-600" : "text-slate-400"
                )}
              >
                Volume
              </Button>
            </div>
          </div>
          <div className="h-[320px] w-full min-w-0">
            {loading ? (
              <div className="w-full h-full flex flex-col gap-4">
                <Skeleton className="w-full grow" />
                <div className="flex justify-between">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-10" />)}
                </div>
              </div>
            ) : spendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                    tickFormatter={(value) => chartMode === "spend" ? `$${value/1000}k` : value}
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
                    formatter={(value) => chartMode === "spend" ? [`$${Number(value).toLocaleString()}`, "Spend"] : [value, "Orders"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={chartMode} 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 italic">
                <BarChart3 className="h-12 w-12 opacity-10 mb-2" />
                <p className="text-sm">No analytics data found for this period.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Vendors by Spend */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 italic">Top Vendors by Spend</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleExport("csv")}>
                <Download className="h-3 w-3 text-slate-400" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Leading suppliers by total purchase value (YTD)</p>
          <div className="space-y-5 grow">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-12" /></div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))
            ) : topVendors.length > 0 ? (
              topVendors.map((vendor, idx) => (
                <div 
                  key={idx} 
                  className="space-y-1.5 cursor-pointer group"
                  onClick={() => navigate(`/purchase/vendors/${vendor.id}`)}
                >
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{vendor.name}</span>
                    <span className="text-slate-800 dark:text-slate-200">${vendor.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", vendor.color)} 
                      style={{ width: `${vendor.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                  <UserCheck className="h-10 w-10 opacity-10 mb-2" />
                  <p className="text-xs">No vendor ranking data yet.</p>
                </div>
            )}
          </div>
          <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
             <Button 
                variant="ghost" 
                onClick={() => navigate("/purchase/vendors")}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 py-4 italic"
              >
               View Vendor Analytics
               <ArrowRight className="h-3.5 w-3.5 ml-2" />
             </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Overdue Bills */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Overdue Bills
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/purchase/bills/payments")}
              className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50 italic"
            >
              Process Payments
            </Button>
          </div>
          <div className="overflow-x-auto min-h-[280px]">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : overdueBills.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-50 dark:border-white/5">
                    <th className="px-6 py-4">Bill ID</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Overdue</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                  {overdueBills.map((bill, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/purchase/bills/${bill.id}`)}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{bill.number}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{bill.vendor}</td>
                      <td className="px-6 py-4">
                         <span className={cn(
                            "flex items-center gap-1.5 font-bold decoration-current/20 underline underline-offset-4",
                            bill.status === "Critical" ? "text-red-600" : "text-amber-600"
                         )}>
                           <Clock className="h-3 w-3" />
                           {bill.days} days
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100 italic">${bill.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-2 italic">
                  <Receipt className="h-12 w-12 opacity-10 mb-2" />
                  <p className="text-sm">No overdue bills at the moment.</p>
                </div>
            )}
          </div>
        </Card>

        {/* Pending Purchase Orders */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Pending Purchase Orders
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/purchase/orders")}
              className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic"
            >
              View All POs
            </Button>
          </div>
          <div className="overflow-x-auto min-h-[280px]">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : pendingPOs.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-50 dark:border-white/5">
                    <th className="px-6 py-4">Order #</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                  {pendingPOs.map((po, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/purchase/orders/${po.id}`)}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{po.number}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{po.vendor}</td>
                      <td className="px-6 py-4">
                         <Badge variant="outline" className={cn(
                           "text-[9px] font-bold uppercase tracking-tighter px-2 h-5 border-none",
                           getStatusColor(po.status)
                         )}>
                           {po.status}
                         </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100 italic">${po.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-2 italic">
                  <ShoppingCart className="h-12 w-12 opacity-10 mb-2" />
                  <p className="text-sm">No pending purchase orders.</p>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

