import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Wallet, 
  MoreVertical,
  Eye,
  FileText,
  Trash2,
  Calendar,
  MoreHorizontal,
  CreditCard,
  Building2,
  CheckCircle2,
  Receipt,
  ArrowDownLeft,
  ChevronRight,
  Printer,
  History,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PAYMENTS = [
  { id: "PAY-2024-001", invoice: "INV-2024-001", customer: "Global Trade Corp", method: "Bank Transfer", ref: "TXN12345678", amount: "$4,250.00", date: "May 01, 2024" },
  { id: "PAY-2024-002", invoice: "INV-2023-854", customer: "TechFlow Solutions", method: "Credit Card", ref: "CARD-8812", amount: "$1,200.00", date: "Apr 28, 2024" },
  { id: "PAY-2024-003", invoice: "INV-2024-009", customer: "Nexa Logistics", method: "PayPal", ref: "PP-9921-X", amount: "$2,400.00", date: "May 03, 2024" },
  { id: "PAY-2024-004", invoice: "INV-2024-012", customer: "Zenith Design", method: "Bank Transfer", ref: "TXN8827331", amount: "$8,500.00", date: "May 05, 2024" },
  { id: "PAY-2024-005", invoice: "INV-2024-002", customer: "Alpha Tech", method: "Stripe", ref: "ST-002-991", amount: "$650.00", date: "Apr 25, 2024" },
  { id: "PAY-2024-006", invoice: "INV-2023-010", customer: "Blue Sky Media", method: "Check", ref: "CHK-11102", amount: "$3,100.00", date: "May 02, 2024" },
  { id: "PAY-2024-007", invoice: "INV-2024-005", customer: "Prime Properties", method: "Cash", ref: "CASH-991", amount: "$150.00", date: "May 06, 2024" },
];

const METHOD_ICONS: Record<string, any> = {
  "Bank Transfer": Building2,
  "Credit Card": CreditCard,
  "PayPal": Receipt,
  "Stripe": Wallet,
  "Check": FileText,
  "Cash": DollarSign,
};

import { DollarSign } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Payments Received</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and track all incoming revenue and payment distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export CSV</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide">
            <Plus className="h-4 w-4" />
            <span>Register Payment</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Total Collections MTD</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">$85,240.00</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                  <ArrowDownLeft className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold h-5 px-1.5">+12.4%</Badge>
               <span className="text-[10px] text-slate-400 font-medium italic">vs previous month</span>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Pending Clearances</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">$12,400.00</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-600/10 flex items-center justify-center text-amber-600">
                  <Clock className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-400 font-medium italic decoration-amber-500/30 underline underline-offset-4 font-bold">5 Transactions processing</span>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Average Payment Time</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">4.2 Days</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <History className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold h-5 px-1.5">-1.5 Days</Badge>
               <span className="text-[10px] text-slate-400 font-medium italic italic">Faster than Q1</span>
            </div>
         </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
           <Input placeholder="Search by customer, invoice or ref..." className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <Button variant="outline" className="h-11 flex-1 md:flex-none border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl px-4 gap-2 font-bold dark:text-slate-300">
             <Filter className="h-4 w-4 text-slate-400" />
             Advance Filter
           </Button>
           <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
             <Printer className="h-4 w-4 text-slate-400" />
           </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
            <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Receipt Info</th>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Method / Reference</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
               {PAYMENTS.map((p) => {
                  const Icon = METHOD_ICONS[p.method] || Wallet;
                  return (
                     <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-600/10 group-hover:scale-105 transition-all text-slate-400 group-hover:text-blue-600">
                                 <span className="text-[8px] font-bold uppercase tracking-widest">May</span>
                                 <span className="text-sm font-bold -mt-0.5">{p.date.split(' ')[1].replace(',', '')}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{p.id}</span>
                                 <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter italic">May 2024 Period</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <Badge variant="ghost" className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-600/10 text-xs px-2 h-6 border-none hover:bg-blue-100 italic cursor-pointer">
                              {p.invoice}
                           </Badge>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{p.customer}</span>
                              <span className="text-[10px] text-slate-400 font-medium italic">Verified Customer</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500">
                                 <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{p.method}</span>
                                 <code className="text-[9px] text-slate-400 opacity-70 italic">{p.ref}</code>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tighter italic decoration-emerald-500/20 underline underline-offset-4">{p.amount}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 italic">Success</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                     <MoreHorizontal className="h-4 w-4" />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                                   <DropdownMenuItem className="text-xs font-bold gap-2">
                                      <Receipt className="h-3.5 w-3.5 text-blue-500" /> View Receipt
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500">
                                      <Trash2 className="h-3.5 w-3.5" /> Refund
                                   </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                           </div>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>

         {/* Table Pagination */}
         <div className="bg-slate-50/50 dark:bg-white/5 p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-widest">Transactions: 1 - 7 of 1.2k</p>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-20"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white border border-slate-100 dark:border-white/5 uppercase italic">1</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic uppercase">2</Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] text-slate-500 hover:bg-slate-100 italic uppercase">3</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
