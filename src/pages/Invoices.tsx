import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Printer, 
  Send,
  FileText,
  DollarSign,
  Calendar,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const INVOICES = [
  { id: "INV-2026-001", customer: "TechFlow Inc.", amount: 12500, status: "Paid", date: "2026-05-01", dueDate: "2026-05-15" },
  { id: "INV-2026-002", customer: "Nexus Digital", amount: 8400, status: "Pending", date: "2026-05-03", dueDate: "2026-05-17" },
  { id: "INV-2026-003", customer: "Global Systems", amount: 15000, status: "Overdue", date: "2026-04-20", dueDate: "2026-05-04" },
  { id: "INV-2026-004", customer: "Creative Minds", amount: 2200, status: "Pending", date: "2026-05-04", dueDate: "2026-05-18" },
  { id: "INV-2026-005", customer: "GreenField LLC", amount: 5500, status: "Paid", date: "2026-04-28", dueDate: "2026-05-12" },
];

export function InvoicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Invoices</h1>
          <p className="text-sm text-slate-500">Manage and track your sales invoices and billing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-soft bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-transparent">MTD</Badge>
            </div>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Invoiced</p>
            <h3 className="text-3xl font-bold mt-1">$128,450.00</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft bg-amber-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-transparent">Unpaid</Badge>
            </div>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Pending Amount</p>
            <h3 className="text-3xl font-bold mt-1">$42,800.00</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft bg-rose-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-white/10">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-transparent">Critical</Badge>
            </div>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Overdue Amount</p>
            <h3 className="text-3xl font-bold mt-1">$15,000.00</h3>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input placeholder="Search invoices, customers..." className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Invoice ID</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Due Date</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Amount</TableHead>
              <TableHead className="py-4 px-6 text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((invoice) => (
              <TableRow key={invoice.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6 font-semibold text-blue-600 text-sm">
                  {invoice.id}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <p className="font-medium text-slate-800 text-sm">{invoice.customer}</p>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                    invoice.status === "Paid" ? "bg-emerald-50 text-emerald-600" : 
                    invoice.status === "Pending" ? "bg-amber-50 text-amber-600" : 
                    "bg-rose-50 text-rose-600"
                  )}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {invoice.date}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {invoice.dueDate}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-slate-800 text-sm">
                  ${invoice.amount.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-premium border-slate-100">
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                        <Printer className="mr-2 h-4 w-4 text-slate-400" /> Print Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                        <Send className="mr-2 h-4 w-4 text-slate-400" /> Email Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50">
                        <FileText className="mr-2 h-4 w-4" /> Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
