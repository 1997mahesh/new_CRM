import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  DollarSign, 
  Calendar,
  Tag,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EXPENSES = [
  { id: "EXP-001", description: "AWS Monthly Infrastructure", category: "Cloud Infrastructure", amount: 4500, date: "2026-05-01", status: "Approved", method: "Credit Card", user: "Alex Tech" },
  { id: "EXP-002", description: "Facebook Ads - Q2 Launch", category: "Marketing", amount: 2850, date: "2026-05-02", status: "Pending", method: "Bank Transfer", user: "Sarah Mark" },
  { id: "EXP-003", description: "Office Stationery & Paper", category: "Office Supplies", amount: 120, date: "2026-05-03", status: "Draft", method: "Cash", user: "Mike Admin" },
  { id: "EXP-004", description: "May Salaries - Dept Sales", category: "Salaries & Payroll", amount: 45000, date: "2026-05-04", status: "Approved", method: "Bank Transfer", user: "Finance Dept" },
  { id: "EXP-005", description: "Slack Pro Subscription", category: "Software Subscriptions", amount: 800, date: "2026-04-28", status: "Rejected", method: "Direct Debit", user: "Alex Tech" },
  { id: "EXP-006", description: "Flight to London - Conference", category: "Travel & Lodging", amount: 1200, date: "2026-04-25", status: "Approved", method: "Corporate Card", user: "John Founder" },
];

const CATEGORIES = [
  "Marketing", 
  "Cloud Infrastructure", 
  "Office Supplies", 
  "Salaries & Payroll", 
  "Software Subscriptions", 
  "Travel & Lodging"
];

const STATUS_COLORS: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Draft: "bg-slate-50 text-slate-500 border-slate-100",
  Rejected: "bg-rose-50 text-rose-600 border-rose-100",
  Pending: "bg-amber-50 text-amber-600 border-amber-100"
};

export default function ExpensesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Expenses</h1>
          <p className="text-sm text-slate-500 font-medium"> Total Approved Amount: <span className="text-emerald-600 font-bold">$50,700.00</span></p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search by description, reference, or user..." 
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-500 font-medium">Columns</Button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <span className="text-xs font-bold text-slate-600">Page 1 of 5</span>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Description</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Method</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">By</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXPENSES.map((expense) => (
              <TableRow key={expense.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                  {expense.date}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{expense.description}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">{expense.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px] px-2 py-0">
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 font-black text-sm text-slate-800">
                  ${expense.amount.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CreditCard className="h-3 w-3" />
                      {expense.method}
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase", STATUS_COLORS[expense.status])}>
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 font-medium text-xs text-slate-600">
                  {expense.user}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" title="Approve">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50" title="Reject">
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem className="text-slate-600 py-2">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-rose-600 py-2">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-500 font-medium">Showing 1 to 6 of 48 results</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="rounded-lg h-8 px-4 text-xs font-bold bg-slate-50 text-slate-300">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-xs font-bold text-slate-600 border-slate-200">Next</Button>
        </div>
      </div>
    </div>
  );
}
