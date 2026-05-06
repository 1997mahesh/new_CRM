import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  RefreshCcw, 
  Edit2, 
  Trash2, 
  Globe, 
  DollarSign, 
  Euro, 
  BadgeCheck,
  Filter,
  Columns
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
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, status: "Active", isDefault: true },
  { code: "AED", name: "UAE Dirham", symbol: "AED", rate: 3.67, status: "Active", isDefault: false },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, status: "Active", isDefault: false },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, status: "Active", isDefault: false },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.20, status: "Active", isDefault: false },
];

export default function CurrenciesPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-none">
            <Globe className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Currencies</h1>
            <p className="text-sm text-slate-500 font-medium">Manage system currencies, exchange rates, and business-wide fiscal settings.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm h-11 px-6 dark:border-slate-800">
            <RefreshCcw className="h-4 w-4 mr-2" /> Update Rates
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 h-11 px-6">
            <Plus className="h-4 w-4 mr-2" /> Add Currency
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search currencies by code or name..." 
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 text-slate-600">
                <Filter className="h-4 w-4 mr-2" /> Status
            </Button>
            <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 text-slate-600">
                <Columns className="h-4 w-4 mr-2" /> Columns
            </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Code</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Name</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Symbol</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Exchange Rate</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CURRENCIES.map((currency) => (
              <TableRow key={currency.code} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{currency.code}</span>
                    {currency.isDefault && (
                        <Badge className="bg-blue-600 text-white border-none rounded-full px-1.5 py-0 text-[8px] font-bold uppercase">Default</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-medium text-slate-600">
                  {currency.name}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-black text-slate-800">
                  {currency.symbol}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-mono text-slate-500 font-bold">
                  {currency.rate.toFixed(2)}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {currency.status}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!currency.isDefault && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Set Default">
                            <BadgeCheck className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem className={cn("py-2", currency.isDefault ? "text-slate-300" : "text-rose-600")} disabled={currency.isDefault}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
