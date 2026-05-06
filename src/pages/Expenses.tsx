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
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  Wallet,
  Clock
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

const EXPENSES = [
  { id: "EXP-001", description: "Office Rent - May", category: "Rent", amount: 4500, date: "2026-05-01", status: "Approved", method: "Bank Transfer" },
  { id: "EXP-002", description: "Cloud Hosting - AWS", category: "IT Services", amount: 850, date: "2026-05-02", status: "Pending", method: "Credit Card" },
  { id: "EXP-003", description: "Team Lunch", category: "Meals", amount: 120, date: "2026-05-03", status: "Awaiting Receipt", method: "Cash" },
  { id: "EXP-004", description: "Printer Ink & Paper", category: "Supplies", amount: 240, date: "2026-05-04", status: "Approved", method: "Bank Transfer" },
  { id: "EXP-005", description: "Statury Insurance", category: "Insurance", amount: 1200, date: "2026-04-28", status: "Approved", method: "Direct Debit" },
];

export function ExpensesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Expenses</h1>
          <p className="text-sm text-slate-500">Track and manage business expenses and reimbursements.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Log Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Simple cards */}
        <Card className="border-none shadow-soft">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">This Month</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Spend</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">$12,400.50</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <ArrowDownRight className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">vs last month</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Avg Transaction</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">$450.00</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Action required</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Pending Approval</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">4 Items</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Budget status</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Under Budget</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">12% Left</h3>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input placeholder="Search by description, category, or ID..." className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Description</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Method</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Amount</TableHead>
              <TableHead className="py-4 px-6 text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {EXPENSES.map((expense) => (
              <TableRow key={expense.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                       <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{expense.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{expense.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <div className="flex items-center gap-2 text-slate-500">
                     <Tag className="h-3 w-3" />
                     <span className="text-xs">{expense.category}</span>
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className={cn(
                     "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                     expense.status === "Approved" ? "bg-emerald-50 text-emerald-600" : 
                     expense.status === "Pending" ? "bg-amber-50 text-amber-600" : 
                     "bg-blue-50 text-blue-600"
                   )}>
                     {expense.status}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500">
                   <div className="flex items-center gap-1.5">
                     <Calendar className="h-3 w-3" />
                     {expense.date}
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-600">
                   <div className="flex items-center gap-2">
                     <CreditCard className="h-3 w-3 text-slate-400" />
                     {expense.method}
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-slate-800 text-sm">
                  ${expense.amount.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
