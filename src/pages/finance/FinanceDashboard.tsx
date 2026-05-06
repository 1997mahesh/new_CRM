import React from "react";
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

const MTD_DATA = [
  { name: "Week 1", income: 45000, expenses: 32000 },
  { name: "Week 2", income: 52000, expenses: 38000 },
  { name: "Week 3", income: 48000, expenses: 35000 },
  { name: "Week 4", income: 61000, expenses: 42000 },
];

const CATEGORY_DATA = [
  { name: "Marketing", value: 4500, color: "#3b82f6" },
  { name: "Cloud Infra", value: 3200, color: "#10b981" },
  { name: "Salaries", value: 12000, color: "#6366f1" },
  { name: "Supplies", value: 1500, color: "#f59e0b" },
  { name: "Travel", value: 2800, color: "#ef4444" },
];

const PENDING_APPROVALS = [
  { id: "EXP-101", title: "Client Dinner - NYC", employee: "John Doe", date: "2026-05-04", category: "Travel", amount: 450, status: "Pending" },
  { id: "EXP-102", title: "AWS Monthly Bill", employee: "System", date: "2026-05-03", category: "Cloud", amount: 1240, status: "Pending" },
  { id: "EXP-103", title: "New Office Chairs", employee: "Sarah Smith", date: "2026-05-02", category: "Supplies", amount: 890, status: "Pending" },
];

const RECENT_EXPENSES = [
  { id: "EXP-099", title: "Marketing Campaign", category: "Marketing", date: "2026-05-01", amount: 2500, status: "Approved" },
  { id: "EXP-098", title: "GitHub Subscription", category: "Software", date: "2026-04-30", amount: 480, status: "Approved" },
  { id: "EXP-097", title: "Flight to London", category: "Travel", date: "2026-04-28", amount: 1200, status: "Rejected" },
];

export default function FinanceDashboard() {
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
        <StatCard title="Revenue MTD" value="$206,000" trend="+12.5%" icon={TrendingUp} color="emerald" />
        <StatCard title="Expenses MTD" value="$147,000" trend="+4.2%" icon={ArrowUpRight} color="rose" />
        <StatCard title="Net MTD" value="$59,000" trend="+18.2%" icon={Wallet} color="blue" />
        <StatCard title="Pending Approvals" value="12" subtitle="3 critical" icon={Clock} color="amber" />
        <StatCard title="Revenue YTD" value="$1.2M" trend="+8.5%" icon={TrendingUp} color="emerald" />
        <StatCard title="Expenses YTD" value="$840K" trend="+2.1%" icon={ArrowUpRight} color="rose" />
        <StatCard title="Net YTD" value="$360K" trend="+15.0%" icon={Wallet} color="blue" />
        <StatCard title="Approved This Month" value="48" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Income vs Expenses</CardTitle>
              <CardDescription>Monthly trend for the last 12 months</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none">Income</Badge>
              <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none">Expenses</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MTD_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
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
                    data={CATEGORY_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {CATEGORY_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {((item.value / CATEGORY_DATA.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Pending Approvals</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Expense</TableHead>
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Employee</TableHead>
                  <TableHead className="py-3 px-6 text-[10px] uppercase font-bold text-slate-400">Amount</TableHead>
                  <TableHead className="py-3 px-6 text-right text-[10px] uppercase font-bold text-slate-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PENDING_APPROVALS.map((item) => (
                  <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 text-[10px] border-none px-1.5 py-0 capitalize">{item.category}</Badge>
                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{item.employee}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">${item.amount}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 rounded-lg border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">Approve</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Expenses</CardTitle>
              <CardDescription>Latest activity in your account</CardDescription>
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
                {RECENT_EXPENSES.map((item) => (
                  <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn(
                        "rounded-full px-2 py-0 text-[10px] font-bold uppercase",
                        item.status === 'Approved' ? "bg-emerald-50 text-emerald-600" :
                        item.status === 'Rejected' ? "bg-rose-50 text-rose-600" :
                        "bg-slate-50 text-slate-500"
                      )}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-sm text-slate-800">
                      ${item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-xs text-slate-400">
                      {item.date}
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
