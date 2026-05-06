import React from "react";
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  RefreshCcw,
  LayoutDashboard
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const LEDGER_DATA = [
  { id: "TRX-1001", date: "2026-05-05", type: "Income", description: "Payment for INV-2034", party: "Global Tech Solutions", reference: "INV-2034", amount: 12500 },
  { id: "TRX-1002", date: "2026-05-04", type: "Expense", description: "AWS Monthly Hosting", party: "Amazon Web Services", reference: "BILL-202", amount: -450 },
  { id: "TRX-1003", date: "2026-05-03", type: "Income", description: "Payment for INV-2035", party: "Blue Horizon Corp", reference: "INV-2035", amount: 8200 },
  { id: "TRX-1004", date: "2026-05-02", type: "Expense", description: "Office Rent - May", party: "Skyline Properties", reference: "BILL-203", amount: -2500 },
  { id: "TRX-1005", date: "2026-05-01", type: "Expense", description: "Marketing Ads - FB", party: "Meta Platforms", reference: "BILL-204", amount: -1200 },
];

export default function LedgerPage() {
  const [filterType, setFilterType] = React.useState("all");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Finance Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Detailed record of all financial transactions.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/finance/dashboard">
            <Button variant="outline" className="rounded-xl border-slate-200">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">From Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input type="date" className="pl-10 h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-01" />
            </div>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">To Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input type="date" className="pl-10 h-10 border-none bg-slate-50 rounded-xl" defaultValue="2026-05-31" />
            </div>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px]">
             <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Type</label>
             <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10 border-none bg-slate-50 rounded-xl capitalize font-medium">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
             </Select>
          </div>
          <div className="flex items-end h-full mt-4 flex-wrap gap-2">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-10 shadow-lg shadow-blue-600/20">Apply Filters</Button>
             <Button variant="ghost" className="text-slate-500 rounded-xl px-4 h-10 hover:bg-slate-50">Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Total Income" 
          amount="$20,700" 
          icon={ArrowUpCircle} 
          color="emerald" 
          subtitle="+15% from last month"
        />
        <SummaryCard 
          title="Total Outgoing" 
          amount="$4,150" 
          icon={ArrowDownCircle} 
          color="rose" 
          subtitle="+2% increase"
        />
        <SummaryCard 
          title="Net Cash Flow" 
          amount="$16,550" 
          icon={Wallet} 
          color="blue" 
          subtitle="Positive balance"
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Type</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Description</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Party</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Reference</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEDGER_DATA.length > 0 ? (
              LEDGER_DATA.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                    {item.date}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge className={cn(
                      "rounded-full px-2 py-0 text-[10px] font-bold uppercase",
                      item.type === "Income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <p className="text-sm font-semibold text-slate-800">{item.description}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase leading-tight">{item.id}</p>
                  </TableCell>
                  <TableCell className="py-4 px-6 font-medium text-xs text-slate-600">
                    {item.party}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-lg">
                      <FileText className="h-3 w-3" />
                      {item.reference}
                    </div>
                  </TableCell>
                  <TableCell className={cn(
                    "py-4 px-6 font-black text-sm",
                    item.amount > 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {item.amount > 0 ? `+$${item.amount.toLocaleString()}` : `-$${Math.abs(item.amount).toLocaleString()}`}
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                                <RefreshCcw className="h-8 w-8 text-slate-200" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-600">No transactions found</p>
                                <p className="text-sm text-slate-400">No transactions found for the selected period.</p>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, icon: Icon, color, subtitle }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", colorMap[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 leading-none mb-1">{amount}</h3>
            <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
