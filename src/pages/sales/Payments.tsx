import React, { useState, useEffect, useMemo } from "react";
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
  Clock,
  Loader2,
  AlertCircle,
  Undo2
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
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ColumnVisibilityDropdown } from "@/components/shared/ColumnVisibilityDropdown";

const METHOD_ICONS: Record<string, any> = {
  "Bank Transfer": Building2,
  "Credit Card": CreditCard,
  "PayPal": Receipt,
  "Stripe": Wallet,
  "Check": FileText,
  "Cash": DollarSign,
  "UPI": CreditCard,
};

import { DollarSign } from "lucide-react";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalMTD: 0, growth: 0, pendingCount: 0, pendingAmount: 0, avgTime: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    receipt: true,
    invoice: true,
    customer: true,
    method: true,
    amount: true,
    status: true,
  });

  const PAYMENT_COLUMNS = [
    { key: "receipt", label: "Receipt Info" },
    { key: "invoice", label: "Invoice #" },
    { key: "customer", label: "Customer" },
    { key: "method", label: "Method / Reference" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/payments?page=${page}&limit=${itemsPerPage}&search=${searchTerm}&status=${filterStatus === 'all' ? '' : filterStatus}`);
      if (response.success) {
        setPayments(response.data.items);
        setTotalItems(response.data.total);
      }
      
      const statsRes = await api.get('/payments/stats');
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, searchTerm, filterStatus]);

  const handleExport = async () => {
    try {
      const response = await api.get('/payments/export');
      if (response.success) {
        const link = document.createElement('a');
        link.href = response.data.url;
        link.setAttribute('download', `payments_export_${format(new Date(), "yyyy_MM_dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Payments export generated successfully");
      }
    } catch (error) {
      toast.error("Failed to generate export");
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Payments Received</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and track all incoming revenue and payment distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export CSV</span>
          </Button>
          <Button 
            onClick={() => navigate('/sales/payments/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide"
          >
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
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">
                    ${(stats.totalMTD || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                  <ArrowDownLeft className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Badge className={cn(
                 "border-none text-[9px] font-bold h-5 px-1.5",
                 stats.growth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
               )}>
                 {stats.growth >= 0 ? "+" : ""}{stats.growth}%
               </Badge>
               <span className="text-[10px] text-slate-400 font-medium italic">vs previous month</span>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Pending Clearances</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">
                    ${(stats.pendingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-600/10 flex items-center justify-center text-amber-600">
                  <Clock className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-400 font-medium italic decoration-amber-500/30 underline underline-offset-4 font-bold">
                 {stats.pendingCount || 0} Transactions processing
               </span>
            </div>
         </Card>
         <Card className="p-6 border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Average Payment Time</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white italic tracking-tight">
                    {stats.avgTime || 0} Days
                  </p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <History className="h-5 w-5" />
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold h-5 px-1.5">-1.2 Days</Badge>
               <span className="text-[10px] text-slate-400 font-medium italic italic">Faster than Q3 average</span>
            </div>
         </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
           <Input 
            placeholder="Search by customer, invoice or ref..." 
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" className="h-11 flex-1 md:flex-none border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl px-4 gap-2 font-bold dark:text-slate-300">
                    <Filter className="h-4 w-4 text-slate-400" />
                    Advance Filter
                  </Button>
                }
              />
              <SheetContent className="dark:bg-[#1f1a1d] dark:border-white/10">
                 <SheetHeader>
                    <SheetTitle>Filter Payments</SheetTitle>
                    <SheetDescription>Configure parameters to refine the payment list.</SheetDescription>
                 </SheetHeader>
                 <div className="space-y-6 py-6">
                    <div className="space-y-2">
                       <Label>Status</Label>
                       <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="rounded-xl h-11">
                             <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                             <SelectItem value="all">All Statuses</SelectItem>
                             <SelectItem value="Success">Success</SelectItem>
                             <SelectItem value="Pending">Pending</SelectItem>
                             <SelectItem value="Failed">Failed</SelectItem>
                             <SelectItem value="Refunded">Refunded</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    {/* Add more filters as needed */}
                 </div>
                 <SheetFooter>
                    <Button onClick={() => { setFilterStatus('all'); setSearchTerm(''); }} variant="ghost" className="w-full">Reset Filters</Button>
                 </SheetFooter>
              </SheetContent>
           </Sheet>
           <Button variant="outline" size="icon" onClick={() => window.print()} className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
             <Printer className="h-4 w-4 text-slate-400" />
           </Button>
           <ColumnVisibilityDropdown 
              columns={PAYMENT_COLUMNS}
              visibleColumns={visibleColumns}
              onChange={setVisibleColumns}
              persistenceKey="sales_payments_column_visibility"
            />
        </div>
      </div>

      {/* Payments Table */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
               <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
               <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Syncing with Financial Ledger...</p>
            </div>
         ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-slate-400">
               <Receipt className="h-16 w-16 opacity-10" />
               <p className="text-sm font-bold uppercase italic tracking-widest">No payment records found</p>
               <Button variant="ghost" onClick={() => { setFilterStatus('all'); setSearchTerm(''); }}>Clear Filters</Button>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[900px]">
                  <thead>
                     <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                        {visibleColumns.receipt && <th className="px-6 py-4">Receipt Info</th>}
                        {visibleColumns.invoice && <th className="px-6 py-4">Invoice #</th>}
                        {visibleColumns.customer && <th className="px-6 py-4">Customer</th>}
                        {visibleColumns.method && <th className="px-6 py-4">Method / Reference</th>}
                        {visibleColumns.amount && <th className="px-6 py-4">Amount</th>}
                        {visibleColumns.status && <th className="px-6 py-4">Status</th>}
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
                     {payments.map((p) => {
                        const Icon = METHOD_ICONS[p.method] || Wallet;
                        const pDate = new Date(p.date);
                        return (
                           <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                              {visibleColumns.receipt && (
                                <td className="px-6 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-600/10 group-hover:scale-105 transition-all text-slate-400 group-hover:text-blue-600">
                                         <span className="text-[8px] font-bold uppercase tracking-widest">{format(pDate, "MMM")}</span>
                                         <span className="text-sm font-bold -mt-0.5">{format(pDate, "dd")}</span>
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">{p.receiptNumber}</span>
                                         <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter italic">{format(pDate, "yyyy")} Fiscal period</span>
                                      </div>
                                   </div>
                                </td>
                              )}
                              {visibleColumns.invoice && (
                                <td className="px-6 py-5">
                                   <Badge 
                                      variant="ghost" 
                                      onClick={() => navigate(`/sales/invoices/${p.invoiceId}`)}
                                      className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-600/10 text-xs px-2 h-6 border-none hover:bg-blue-100 italic cursor-pointer uppercase"
                                   >
                                      {p.invoice?.number || "N/A"}
                                   </Badge>
                                </td>
                              )}
                              {visibleColumns.customer && (
                                <td className="px-6 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{p.customerName || p.customer?.name}</span>
                                      <span className="text-[10px] text-slate-400 font-medium italic opacity-60">Revenue Contributor</span>
                                   </div>
                                </td>
                              )}
                              {visibleColumns.method && (
                                <td className="px-6 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500">
                                         <Icon className="h-4 w-4" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{p.method}</span>
                                         <code className="text-[9px] text-slate-400 opacity-70 italic">{p.reference || "No Ref"}</code>
                                      </div>
                                   </div>
                                </td>
                              )}
                              {visibleColumns.amount && (
                                <td className="px-6 py-5">
                                   <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tighter italic decoration-emerald-500/20 underline underline-offset-4">
                                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                   </span>
                                </td>
                              )}
                              {visibleColumns.status && (
                                <td className="px-6 py-5">
                                   <div className="flex items-center gap-1.5">
                                      {p.status === 'Success' ? (
                                         <>
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 italic">Success</span>
                                         </>
                                      ) : p.status === 'Refunded' ? (
                                         <>
                                            <Undo2 className="h-3.5 w-3.5 text-red-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 italic">Refunded</span>
                                         </>
                                      ) : (
                                         <>
                                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 italic">{p.status}</span>
                                         </>
                                      )}
                                   </div>
                                </td>
                              )}
                              <td className="px-6 py-5 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       onClick={() => navigate(`/sales/payments/${p.id}`)}
                                       className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg"
                                    >
                                       <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-white/10 rounded-lg">
                                       <Printer className="h-3.5 w-3.5" />
                                    </Button>
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg">
                                             <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 dark:bg-[#1f1a1d] dark:border-white/10 glass-effect">
                                          <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-xs font-bold gap-3" onClick={() => navigate(`/sales/payments/${p.id}`)}>
                                             <Receipt className="h-4 w-4 text-blue-500" /> View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-xs font-bold gap-3">
                                             <Download className="h-4 w-4 text-slate-400" /> Download PDF
                                          </DropdownMenuItem>
                                          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                                          <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-xs font-bold gap-3 text-red-500">
                                             <Trash2 className="h-4 w-4" /> Delete Record
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
            </div>
         )}

         {/* Table Pagination */}
         {!loading && payments.length > 0 && (
            <div className="bg-slate-50/50 dark:bg-white/5 p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
               <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-widest">
                  Showing {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, totalItems)} of {totalItems} entries
               </p>
               <div className="flex gap-1">
                  <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-20"
                     onClick={() => setPage(p => Math.max(1, p - 1))}
                     disabled={page === 1}
                  >
                     <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  
                  {Number.isFinite(totalPages) && totalPages > 0 && [...Array(Math.min(totalPages, 50))].map((_, i) => (
                     <Button 
                        key={i}
                        variant="ghost" 
                        onClick={() => setPage(i + 1)}
                        className={cn(
                           "h-8 min-w-[32px] rounded-xl font-bold text-[10px] uppercase italic transition-all",
                           page === i + 1 
                              ? "bg-blue-600 text-white shadow-premium" 
                              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                        )}
                     >
                        {i + 1}
                     </Button>
                  ))}
                  
                  <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-20"
                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                  >
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         )}
      </Card>
    </div>
  );
}
