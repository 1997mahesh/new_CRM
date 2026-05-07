import React, { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Calendar,
  FileText
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Cell, 
  Pie,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const COLORS = ["#3b82f6", "#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function FinanceDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/finance/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch finance stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="h-[60vh] flex items-center justify-center text-slate-500 font-medium">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Finance Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium italic">Overview of your financial performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Wallet className="h-4 w-4 mr-2" /> Expenses
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <FileText className="h-4 w-4 mr-2" /> Ledger
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            Full Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Expenses MTD" value={`$${stats.mtdExpenses.toLocaleString()}`} trend="+4.2%" icon={ArrowUpRight} color="rose" />
        <StatCard title="Expenses YTD" value={`$${stats.ytdExpenses.toLocaleString()}`} trend="+2.1%" icon={TrendingUp} color="rose" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} subtitle="Awaiting action" icon={Clock} color="amber" />
        <StatCard title="Recent Transactions" value={stats.recentExpenses.length} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Expense Trend</CardTitle>
              <CardDescription>Monthly expenses for the last 6 months</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none">Expenses</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
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
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Expenses by Category</CardTitle>
            <CardDescription>Breakdown of spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {stats.categoryStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {stats.categoryStats.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Activity</CardTitle>
              <CardDescription>Latest expenses across all categories</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">See History</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Transaction</TableHead>
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Status</TableHead>
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Amount</TableHead>
                  <TableHead className="py-3 px-6 text-right text-[10px] uppercase font-bold text-slate-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentExpenses.map((item: any) => (
                  <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{item.description || item.merchant}</p>
                      <span className="text-[10px] text-slate-400">{item.category?.name}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn(
                        "rounded-full px-2 py-0 text-[10px] font-bold uppercase",
                        item.status === 'approved' ? "bg-emerald-50 text-emerald-600" :
                        item.status === 'rejected' ? "bg-rose-50 text-rose-600" :
                        "bg-slate-50 text-slate-500"
                      )}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-sm text-slate-800">
                      ${item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-xs text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-600/40 p-0">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}

function StatCard({ title, value, trend, subtitle, icon: Icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <Card className="border-none shadow-soft group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2 rounded-xl", colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <Badge variant="outline" className={cn(
              "border-none px-1.5 py-0 text-[10px] font-bold",
              trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
            {subtitle && <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
