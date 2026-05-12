import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ShoppingCart, 
  MoreVertical,
  Eye,
  FileText,
  Trash2,
  Calendar,
  MoreHorizontal,
  LayoutDashboard,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Columns,
  RefreshCw,
  Copy,
  Ban,
  ArrowUpDown,
  Edit,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400", icon: FileText },
  "Confirmed": { label: "Confirmed", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400", icon: CheckCircle },
  "Processing": { label: "Processing", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400", icon: FileCheck },
  "Shipped": { label: "Shipped", color: "bg-purple-50 text-purple-600 dark:bg-purple-600/10 dark:text-purple-400", icon: Truck },
  "Delivered": { label: "Delivered", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400", icon: Package },
  "Cancelled": { label: "Cancelled", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400", icon: Ban },
};

const COLUMN_KEYS = [
  { key: "number", label: "Order Number" },
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status" },
  { key: "orderDate", label: "Order Date" },
  { key: "deliveryDate", label: "Delivery Date" },
  { key: "total", label: "Total Amount" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "Actions" }
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  // Columns Visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("orders_columns");
    return saved ? JSON.parse(saved) : COLUMN_KEYS.map(c => c.key);
  });

  useEffect(() => {
    localStorage.setItem("orders_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?status=${activeTab}&search=${search}&page=${pagination.page}&limit=${pagination.limit}`);
      if (res.success) {
        setOrders(res.data.items || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const deleteOrder = async (id: string, number: string) => {
    if (!window.confirm(`Delete order ${number}?`)) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.success) {
        toast.success("Order deleted.");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const duplicateOrder = async (id: string) => {
    try {
      const res = await api.post(`/orders/${id}/duplicate`, {});
      if (res.success) {
        toast.success("Order duplicated.");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to duplicate.");
    }
  };

  const cancelOrder = async (id: string) => {
    try {
       const res = await api.put(`/orders/${id}`, { status: "Cancelled" });
       if (res.success) {
         toast.success("Order cancelled.");
         fetchOrders();
       }
    } catch (err) {
       toast.error("Failed to cancel.");
    }
  };

  const exportData = () => {
    const headers = visibleColumns.map(k => COLUMN_KEYS.find(c => c.key === k)?.label).join(",");
    const rows = orders.map(o => {
      const row: any = [];
      if (visibleColumns.includes("number")) row.push(o.number);
      if (visibleColumns.includes("customer")) row.push(`"${o.customerName}"`);
      if (visibleColumns.includes("status")) row.push(o.status);
      if (visibleColumns.includes("orderDate")) row.push(format(new Date(o.issueDate), "yyyy-MM-dd"));
      if (visibleColumns.includes("deliveryDate")) row.push(o.deliveryDate ? format(new Date(o.deliveryDate), "yyyy-MM-dd") : "");
      if (visibleColumns.includes("total")) row.push(o.totalAmount);
      if (visibleColumns.includes("createdAt")) row.push(format(new Date(o.createdAt), "yyyy-MM-dd"));
      return row.join(",");
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Orders_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVisible = (key: string) => visibleColumns.includes(key);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic uppercase">Sales Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Professional Order Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={exportData}
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26]"
          >
            <Download className="h-4 w-4 mr-2 text-slate-400" />
            Export
          </Button>
          <Button 
            className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 h-11 bg-blue-600 hover:bg-blue-700 shadow-premium"
            onClick={() => navigate('/sales/orders/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Tabs and Actions Row */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
             <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl w-full lg:w-auto justify-start overflow-x-auto scrollbar-none">
               <TabsTrigger value="all" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">All</TabsTrigger>
               <TabsTrigger value="Draft" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">Draft</TabsTrigger>
               <TabsTrigger value="Confirmed" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">Confirmed</TabsTrigger>
               <TabsTrigger value="Processing" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">Processing</TabsTrigger>
               <TabsTrigger value="Shipped" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">Shipped</TabsTrigger>
               <TabsTrigger value="Delivered" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic">Delivered</TabsTrigger>
               <TabsTrigger value="Cancelled" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-6 italic text-red-500">Cancelled</TabsTrigger>
             </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  placeholder="Search order number, customer..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26] rounded-xl shadow-soft" 
                />
                {loading && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />}
             </div>
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26] gap-2 font-bold text-[10px] uppercase tracking-widest">
                    <Columns className="h-4 w-4 text-slate-400" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl dark:bg-[#1C1F26] dark:border-white/10 shadow-2xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2">Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COLUMN_KEYS.map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={visibleColumns.includes(col.key)}
                        onCheckedChange={() => toggleColumn(col.key)}
                        className="rounded-lg text-xs font-bold py-2"
                      >
                        {col.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
             </DropdownMenu>

             <Button 
               variant="outline" 
               size="icon" 
               onClick={() => fetchOrders()}
               className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26]"
             >
               <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
             </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C1F26] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
         <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                   {isVisible("number") && <th className="px-6 py-4 italic">Order Details</th>}
                   {isVisible("customer") && <th className="px-6 py-4 italic">Customer</th>}
                   {isVisible("status") && <th className="px-6 py-4 italic">Status</th>}
                   {isVisible("orderDate") && <th className="px-6 py-4 italic">Order Date</th>}
                   {isVisible("deliveryDate") && <th className="px-6 py-4 italic">Delivery</th>}
                   {isVisible("total") && <th className="px-6 py-4 italic">Total Amount</th>}
                   {isVisible("createdAt") && <th className="px-6 py-4 italic">Created</th>}
                   {isVisible("actions") && <th className="px-6 py-4 text-right italic">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate(`/sales/orders/${o.id}`)}>
                    {isVisible("number") && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "p-2.5 rounded-2xl transition-all group-hover:scale-110 shadow-sm",
                             (STATUS_CONFIG[o.status] || STATUS_CONFIG["Draft"]).color
                           )}>
                              <ShoppingCart className="h-4 w-4" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic tracking-tight">{o.number}</span>
                              <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{o.title || "Sales Order"}</span>
                           </div>
                        </div>
                      </td>
                    )}
                    {isVisible("customer") && (
                      <td className="px-6 py-5">
                         <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight italic">{o.customerName}</span>
                      </td>
                    )}
                    {isVisible("status") && (
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", 
                               (STATUS_CONFIG[o.status] || STATUS_CONFIG["Draft"]).color.split(' ')[1].replace('text-', 'bg-'))}></div>
                            <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-2.5 h-6 border-none", (STATUS_CONFIG[o.status] || STATUS_CONFIG["Draft"]).color)}>
                              {o.status}
                            </Badge>
                         </div>
                      </td>
                    )}
                    {isVisible("orderDate") && (
                      <td className="px-6 py-5 text-slate-500 font-mono text-[11px] font-bold italic">
                        {format(new Date(o.issueDate), "MMM dd, yyyy")}
                      </td>
                    )}
                    {isVisible("deliveryDate") && (
                      <td className="px-6 py-5 text-blue-500 font-mono text-[11px] font-bold italic">
                        {o.deliveryDate ? format(new Date(o.deliveryDate), "MMM dd, yyyy") : "ASAP"}
                      </td>
                    )}
                    {isVisible("total") && (
                      <td className="px-6 py-5">
                         <span className="text-sm font-black text-slate-900 dark:text-white font-mono tracking-tighter decoration-blue-500/20 underline underline-offset-4 italic">
                           ${(o.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </span>
                      </td>
                    )}
                    {isVisible("createdAt") && (
                      <td className="px-6 py-5 text-slate-400 font-mono text-[10px] italic">
                        {format(new Date(o.createdAt), "dd/MM/yy")}
                      </td>
                    )}
                    {isVisible("actions") && (
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-9 w-9 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-xl"
                             onClick={() => navigate(`/sales/orders/${o.id}`)}
                           >
                             <Eye className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-9 w-9 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 rounded-xl"
                             onClick={() => navigate(`/sales/orders/${o.id}/edit`)}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-xl">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 dark:bg-[#1C1F26] dark:border-white/10 shadow-2xl">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem onClick={() => duplicateOrder(o.id)} className="rounded-lg text-xs font-bold gap-3 py-2 italic text-blue-500 focus:bg-blue-50">
                                    <Copy className="h-3.5 w-3.5" /> Duplicate Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => cancelOrder(o.id)} className="rounded-lg text-xs font-bold gap-3 py-2 italic text-amber-500 focus:bg-amber-50">
                                    <Ban className="h-3.5 w-3.5" /> Cancel Order
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => deleteOrder(o.id, o.number)} className="rounded-lg text-xs font-bold gap-3 py-2 italic text-red-500 focus:bg-red-50">
                                    <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                             </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
         </div>

         {/* Empty State */}
         {!loading && orders.length === 0 && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-20">
              <div className="h-24 w-24 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-200 dark:text-slate-800 rotate-12 transition-transform hover:rotate-0 duration-500">
                 <ShoppingCart className="h-12 w-12" />
              </div>
              <div className="text-center">
                 <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic uppercase tracking-widest">No matching orders</h3>
                 <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">We couldn't find any orders that match your current filters or search query.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => { setSearch(""); setActiveTab("all"); }}
                className="mt-4 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] border-blue-200 text-blue-600 hover:bg-blue-50 transition-all border-dashed"
              >
                 Reset All Filters
              </Button>
           </div>
         )}

         {/* Pagination */}
         <div className="mt-auto bg-slate-50/50 dark:bg-white/5 p-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Showing {Math.min(orders.length, pagination.limit)} of {pagination.total} results
              </span>
              <Select 
                value={String(pagination.limit)} 
                onValueChange={(val) => setPagination(p => ({ ...p, limit: Number(val), page: 1 }))}
              >
                <SelectTrigger className="h-7 w-20 text-[9px] font-black rounded-lg bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 uppercase tracking-widest italic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1C1F26] border-white/10">
                   {[10, 20, 50, 100].map(v => (
                     <SelectItem key={v} value={String(v)} className="text-[10px] font-bold uppercase tracking-widest italic">{v} rows</SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1">
               <Button 
                 variant="ghost" 
                 size="icon" 
                 disabled={pagination.page === 1}
                 onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                 className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30"
               >
                 <ChevronRight className="h-4 w-4 rotate-180" />
               </Button>
               
               {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                 // Simple pagination logic for many pages
                 if (pagination.pages > 5) {
                   if (p > 3 && p < pagination.pages && Math.abs(p - pagination.page) > 1) {
                      if (p === 4) return <span key="dots1" className="px-2 text-slate-400 font-black">...</span>;
                      return null;
                   }
                 }
                 
                 return (
                   <Button 
                     key={p}
                     variant="ghost" 
                     onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                     className={cn(
                       "h-8 w-8 rounded-xl font-black text-[10px] tracking-widest transition-all",
                       pagination.page === p 
                        ? "bg-blue-600 text-white shadow-premium scale-110" 
                        : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                     )}
                   >
                     {p}
                   </Button>
                 );
               })}

               <Button 
                 variant="ghost" 
                 size="icon" 
                 disabled={pagination.page === pagination.pages}
                 onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                 className="h-8 w-8 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30"
               >
                 <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
