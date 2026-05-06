import React from "react";
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
  UserCheck
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

const SPEND_DATA = [
  { month: "Jan", spend: 32000 },
  { month: "Feb", spend: 28000 },
  { month: "Mar", spend: 35000 },
  { month: "Apr", spend: 42000 },
  { month: "May", spend: 38000 },
  { month: "Jun", spend: 45000 },
  { month: "Jul", spend: 52000 },
  { month: "Aug", spend: 48000 },
  { month: "Sep", spend: 55000 },
  { month: "Oct", spend: 62000 },
  { month: "Nov", spend: 58000 },
  { month: "Dec", spend: 75000 },
];

const TOP_VENDORS = [
  { name: "TechSupplies Ltd", amount: "$84,500", percentage: 85, color: "bg-blue-500" },
  { name: "CloudWorks Inc", amount: "$62,400", percentage: 65, color: "bg-indigo-500" },
  { name: "OfficePro Solutions", amount: "$45,200", percentage: 45, color: "bg-emerald-500" },
  { name: "Global Logistics", amount: "$38,150", percentage: 38, color: "bg-amber-500" },
  { name: "Digital Assets Co", amount: "$25,000", percentage: 25, color: "bg-rose-500" },
];

const OVERDUE_BILLS = [
  { id: "BILL-2024-081", vendor: "TechSupplies Ltd", date: "May 01, 2024", days: 5, amount: "$4,250.00", status: "Overdue" },
  { id: "BILL-2024-074", vendor: "Prime Logistics", date: "Apr 25, 2024", days: 11, amount: "$8,100.00", status: "Critical" },
  { id: "BILL-2024-092", vendor: "Omega Systems", date: "May 03, 2024", days: 3, amount: "$2,400.00", status: "Overdue" },
];

const PENDING_POS = [
  { id: "PO-2024-102", vendor: "CloudWorks Inc", date: "May 05, 2024", amount: "$15,400.00", status: "Confirmed" },
  { id: "PO-2024-105", vendor: "OfficePro Solutions", date: "May 04, 2024", amount: "$2,200.00", status: "Sent" },
  { id: "PO-2024-108", vendor: "Global Logistics", date: "May 06, 2024", amount: "$6,800.00", status: "Draft" },
];

export default function PurchaseDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Purchase Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Track procurement performance and accounts payable.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm">
            Purchase Orders
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium">
            Bills
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Spend MTD", value: "$38,240", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Spend YTD", value: "$412,000", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Open POs", value: "18", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Outstanding Bills", value: "$12,450", icon: Receipt, color: "text-red-600", bg: "bg-red-50" },
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
               <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">{stat.value}</p>
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
               <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-4 bg-white dark:bg-white/10 shadow-sm rounded-lg">Spend</Button>
               <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-4 text-slate-400">Volume</Button>
            </div>
          </div>
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPEND_DATA}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => `$${value/1000}k`}
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
                />
                <Area 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Vendors by Spend */}
        <Card className="border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl bg-white dark:bg-[#211c1f] p-6 flex flex-col">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 italic mb-1">Top Vendors by Spend</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Leading suppliers by total purchase value (YTD)</p>
          <div className="space-y-5">
            {TOP_VENDORS.map((vendor, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                  <span className="text-slate-600 dark:text-slate-400">{vendor.name}</span>
                  <span className="text-slate-800 dark:text-slate-200">{vendor.amount}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", vendor.color)} 
                    style={{ width: `${vendor.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
             <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 py-4 italic">
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
          <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">Overdue Bills</h2>
            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50 italic">Process Payments</Button>
          </div>
          <div className="overflow-x-auto">
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
                {OVERDUE_BILLS.map((bill, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{bill.id}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{bill.vendor}</td>
                    <td className="px-6 py-4">
                       <span className="flex items-center gap-1.5 text-red-500 font-bold decoration-red-500/20 underline underline-offset-4">
                         <Clock className="h-3 w-3" />
                         {bill.days} days
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100 italic">{bill.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {OVERDUE_BILLS.length === 0 && (
             <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2 italic">
               <Receipt className="h-8 w-8 opacity-20" />
               <p className="text-xs">No overdue bills at the moment.</p>
             </div>
          )}
        </Card>

        {/* Pending Purchase Orders */}
        <Card className="bg-white dark:bg-[#211c1f] rounded-2xl border border-slate-100 dark:border-white/5 shadow-soft dark:shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">Pending Purchase Orders</h2>
            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-blue-600 hover:bg-blue-50 italic">View All POs</Button>
          </div>
          <div className="overflow-x-auto">
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
                {PENDING_POS.map((po, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{po.id}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{po.vendor}</td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={cn(
                         "text-[9px] font-bold uppercase tracking-tighter px-2 h-5 border-none",
                         po.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" :
                         po.status === "Sent" ? "bg-blue-50 text-blue-600" :
                         "bg-slate-100 text-slate-500"
                       )}>
                         {po.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100 italic">{po.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
