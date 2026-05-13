import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Receipt,
  Eye,
  Printer,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  Building2,
  Columns,
  Search as SearchIcon,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ColumnVisibilityDropdown } from "@/components/shared/ColumnVisibilityDropdown";

export default function BillsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    unpaidBillsCount: 0,
    unpaidBillsTotal: 0,
    partialPaymentsCount: 0,
    paidThisMonth: 0
  });

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    number: true,
    vendor: true,
    issueDate: true,
    dueDate: true,
    status: true,
    total: true,
    balance: true,
  });

  const BILL_COLUMNS = [
    { key: "number", label: "Bill Number" },
    { key: "vendor", label: "Vendor" },
    { key: "issueDate", label: "Issue Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total Amount" },
    { key: "balance", label: "Balance Due" },
  ];

  useEffect(() => {
    fetchBills();
    fetchSummary();
  }, [activeTab, searchTerm, pagination.page]);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/purchase/bills/summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Fetch summary error:", error);
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "all") params.append("status", activeTab);
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      
      const response = await api.get(`/purchase/bills?${params.toString()}`);
      setBills(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Fetch bills error:", error);
      toast.error("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (bill: any) => {
    try {
      await api.post(`/purchase/bills/${bill.id}/payments`, { 
        amount: bill.balance,
        paymentMethod: "Bank Transfer", // Default or open a dialog
        paymentDate: new Date().toISOString()
      });
      toast.success(`Full payment recorded for ${bill.number}`);
      fetchBills();
      fetchSummary();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  const handleVoid = async (billId: string) => {
    if (!confirm("Are you sure you want to void this bill? This action cannot be undone.")) return;
    try {
      await api.post(`/purchase/bills/${billId}/void`);
      toast.success("Bill marked as void");
      fetchBills();
      fetchSummary();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to void bill");
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    toast.success(`Exporting as ${format}...`);
    // Implementation would go here
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return "bg-emerald-50 text-emerald-600 shadow-emerald-100/50";
      case 'overdue': return "bg-red-50 text-red-600 shadow-red-100/50";
      case 'partial':
      case 'partially paid': return "bg-amber-50 text-amber-600 shadow-amber-100/50";
      case 'unpaid': return "bg-slate-100 text-slate-500 shadow-slate-100/50";
      case 'void': return "bg-slate-200 text-slate-400 line-through";
      default: return "bg-slate-100 text-slate-400";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Bills</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage vendor invoices and manage your accounts payable.</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl">
              <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate("/purchase/bills/new")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
            <Plus className="h-4 w-4" />
            <span>New Bill</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Outstanding", value: summary.totalOutstanding, count: summary.unpaidBillsCount + summary.partialPaymentsCount, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Unpaid Bills", value: summary.unpaidBillsTotal, count: summary.unpaidBillsCount, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Partial Payments", value: 0, count: summary.partialPaymentsCount, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Paid This Month", value: summary.paidThisMonth, count: 0, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-soft flex items-center gap-4 transition-all hover:translate-y-[-2px]">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-inner", item.bg, "dark:bg-white/5")}>
              <AlertCircle className={cn("h-6 w-6", item.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">${item.value.toLocaleString()}</span>
                {item.count > 0 && <span className="text-[10px] font-medium text-slate-400 italic">({item.count})</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="all" className="w-full xl:w-auto" onValueChange={(val) => {
            setActiveTab(val);
            setPagination(prev => ({ ...prev, page: 1 }));
          }}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-6 italic">All</TabsTrigger>
              <TabsTrigger value="unpaid" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-6 italic">Unpaid</TabsTrigger>
              <TabsTrigger value="partial" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-6 italic">Partial</TabsTrigger>
              <TabsTrigger value="paid" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-6 italic">Paid</TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-6 italic text-red-500">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full xl:w-auto">
             <div className="relative flex-1 xl:w-64 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
               <Input 
                placeholder="Search Bill # or Vendor..." 
                className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
             </div>
             <Button onClick={() => { fetchBills(); fetchSummary(); }} variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
             </Button>
             <ColumnVisibilityDropdown 
                columns={BILL_COLUMNS}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
                persistenceKey="bills_column_visibility"
              />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                 {visibleColumns.number && <th className="px-6 py-4">Bill Number</th>}
                 {visibleColumns.vendor && <th className="px-6 py-4">Vendor</th>}
                 {visibleColumns.issueDate && <th className="px-6 py-4">Issue Date</th>}
                 {visibleColumns.dueDate && <th className="px-6 py-4">Due Date</th>}
                 {visibleColumns.status && <th className="px-6 py-4 text-center">Status</th>}
                 {visibleColumns.total && <th className="px-6 py-4 text-right">Total Amount</th>}
                 {visibleColumns.balance && <th className="px-6 py-4 text-right">Balance Due</th>}
                 <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {loading ? (
               Array.from({ length: pagination.limit }).map((_, i) => (
                 <tr key={i}><td colSpan={8} className="px-6 py-4"><Skeleton className="h-10 w-full rounded-lg" /></td></tr>
               ))
             ) : bills.length === 0 ? (
               <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic text-sm">No bills found for the selected filter.</td></tr>
             ) : bills.map((bill) => (
               <tr 
                key={bill.id} 
                className={cn(
                  "hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer",
                  bill.status === "void" && "opacity-60"
                )}
                onClick={() => navigate(`/purchase/bills/${bill.id}`)}
              >
                 {visibleColumns.number && (
                   <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 italic transition-colors font-mono tracking-tighter">
                        {bill.number}
                      </span>
                   </td>
                 )}
                 {visibleColumns.vendor && (
                   <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="underline decoration-slate-200 underline-offset-4 decoration-dashed font-bold text-slate-700 dark:text-slate-300 italic">
                          {bill.vendorName || bill.vendor?.name}
                        </span>
                        {bill.purchaseOrder && (
                          <span className="text-[9px] text-slate-400 font-medium">PO: {bill.purchaseOrder.number}</span>
                        )}
                      </div>
                   </td>
                 )}
                 {visibleColumns.issueDate && (
                   <td className="px-6 py-5 text-slate-500 font-medium italic">
                     {format(new Date(bill.issueDate), 'MMM dd, yyyy')}
                   </td>
                 )}
                 {visibleColumns.dueDate && (
                   <td className="px-6 py-5">
                     <div className={cn(
                       "flex items-center gap-2 font-bold italic",
                       new Date(bill.dueDate) < new Date() && bill.status === 'unpaid' ? "text-red-500" : "text-slate-500"
                     )}>
                       <Clock className="h-3.5 w-3.5" />
                       {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                     </div>
                   </td>
                 )}
                 {visibleColumns.status && (
                   <td className="px-6 py-5 text-center">
                     <Badge className={cn(
                       "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                       getStatusColor(bill.status)
                     )}>
                       {bill.status}
                     </Badge>
                   </td>
                 )}
                 {visibleColumns.total && (
                   <td className="px-6 py-5 text-right font-bold text-slate-500 line-through decoration-slate-300/50 font-mono italic opacity-50">
                      ${bill.totalAmount.toLocaleString()}
                   </td>
                 )}
                 {visibleColumns.balance && (
                   <td className="px-6 py-5 text-right">
                     <span className={cn(
                       "font-bold text-sm font-mono italic tracking-tighter px-2 py-1 rounded-lg",
                       bill.balance === 0 ? "text-emerald-600 bg-emerald-50" : "text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5"
                     )}>
                       ${bill.balance.toLocaleString()}
                     </span>
                   </td>
                 )}
                 <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                       {bill.balance > 0 && bill.status !== "void" && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => handlePay(bill)}
                           className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-600/10 cursor-pointer"
                           title="Record Payment"
                         >
                           <CreditCard className="h-4 w-4" />
                         </Button>
                       )}
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => navigate(`/purchase/bills/${bill.id}`)}
                         className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10"
                       >
                         <Eye className="h-4 w-4" />
                       </Button>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 shadow-premium p-1">
                            <DropdownMenuItem className="text-xs font-bold gap-2 italic py-2 cursor-pointer">
                              <Printer className="h-3.5 w-3.5" /> Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold gap-2 italic py-2 cursor-pointer">
                              <FileText className="h-3.5 w-3.5" /> View Ledger
                            </DropdownMenuItem>
                            {bill.status !== "void" && bill.status !== "paid" && (
                              <DropdownMenuItem 
                                onClick={() => handleVoid(bill.id)}
                                className="text-xs font-bold gap-2 text-red-500 italic py-2 cursor-pointer"
                              >
                                <AlertCircle className="h-3.5 w-3.5" /> Mark as Void
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {/* Pagination */}
         {!loading && bills.length > 0 && (
          <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic font-mono decoration-emerald-500/10 underline underline-offset-4">
                Showing {bills.length} of {pagination.total} Accounts Payable
              </span>
              <div className="flex gap-1">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                   <ChevronRight className="h-4 w-4 rotate-180" />
                 </Button>
                 
                 {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                   <Button 
                    key={p}
                    variant="ghost" 
                    className={cn(
                      "h-8 min-w-[32px] rounded-xl font-bold text-[10px]",
                      p === pagination.page ? "bg-emerald-600 text-white shadow-premium" : "text-slate-500"
                    )}
                    onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                   >
                    {p}
                   </Button>
                 ))}

                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
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

