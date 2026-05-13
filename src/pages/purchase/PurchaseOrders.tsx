import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search as SearchIcon, 
  ShoppingCart,
  Eye,
  Printer,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Calendar,
  Columns,
  ArrowDownToLine,
  Truck,
  CreditCard,
  Trash2
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
import { format } from "date-fns";
import { toast } from "sonner";
import { ColumnVisibilityDropdown } from "@/components/shared/ColumnVisibilityDropdown";

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pos, setPos] = useState<any[]>([]);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    number: true,
    vendor: true,
    date: true,
    status: true,
    total: true,
  });

  const PO_COLUMNS = [
    { key: "number", label: "PO Number" },
    { key: "vendor", label: "Vendor" },
    { key: "date", label: "Order Date" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total Amount" },
  ];

  useEffect(() => {
    fetchPOs();
  }, [activeTab, searchTerm]);

  const fetchPOs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== "all") params.append("status", activeTab);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await api.get(`/purchase/orders?${params.toString()}`);
      setPos(response.data);
    } catch (error) {
      console.error("Fetch POs error:", error);
      toast.error("Failed to load Purchase Orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Purchase Order?")) return;
    try {
      await api.delete(`/purchase/orders/${id}`);
      toast.success("Purchase Order deleted");
      fetchPOs();
    } catch (error) {
      toast.error("Failed to delete Purchase Order");
    }
  };

  const handleCreateBill = async (id: string) => {
    try {
      await api.post(`/purchase/orders/${id}/create-bill`);
      toast.success("Bill created successfully");
      fetchPOs();
    } catch (error) {
      toast.error("Failed to create bill");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Purchase Orders</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Track your procurement orders and incoming inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <ArrowDownToLine className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button 
            onClick={() => navigate("/purchase/orders/new")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide"
          >
            <Plus className="h-4 w-4" />
            <span>New PO</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">All</TabsTrigger>
              <TabsTrigger value="Draft" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Draft</TabsTrigger>
              <TabsTrigger value="Sent" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Sent</TabsTrigger>
              <TabsTrigger value="Confirmed" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Confirmed</TabsTrigger>
              <TabsTrigger value="Partially Received" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Partial</TabsTrigger>
              <TabsTrigger value="Received" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Received</TabsTrigger>
              <TabsTrigger value="Cancelled" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full lg:w-auto min-w-[300px]">
             <div className="relative flex-1 lg:w-64 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <Input 
                 placeholder="Search PO # or Vendor..." 
                 className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <ColumnVisibilityDropdown 
                columns={PO_COLUMNS}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
                persistenceKey="purchase_orders_column_visibility"
              />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[800px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  {visibleColumns.number && <th className="px-6 py-4">PO Number</th>}
                  {visibleColumns.vendor && <th className="px-6 py-4">Vendor</th>}
                  {visibleColumns.date && <th className="px-6 py-4">Order Date</th>}
                  {visibleColumns.status && <th className="px-6 py-4 text-center">Status</th>}
                  {visibleColumns.total && <th className="px-6 py-4 text-right">Total Amount</th>}
                  <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
               {loading ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                     <div className="flex flex-col items-center gap-2">
                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                       <span>Loading order data...</span>
                     </div>
                   </td>
                 </tr>
               ) : pos.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">No purchase orders found matching your criteria.</td>
                 </tr>
               ) : pos.map((po) => (
                 <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                   {visibleColumns.number && (
                     <td className="px-6 py-5 cursor-pointer" onClick={() => navigate(`/purchase/orders/${po.id}`)}>
                       <span className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors bg-indigo-50 dark:bg-indigo-600/10 px-2 py-0.5 rounded-lg italic underline decoration-indigo-200 underline-offset-4">
                         {po.number}
                       </span>
                     </td>
                   )}
                   {visibleColumns.vendor && (
                     <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{po.vendorName}</span>
                       </div>
                     </td>
                   )}
                   {visibleColumns.date && (
                     <td className="px-6 py-5 cursor-pointer" onClick={() => navigate(`/purchase/orders/${po.id}`)}>
                       <div className="flex items-center gap-2 text-slate-500 font-medium italic">
                         <Calendar className="h-3.5 w-3.5" />
                         {format(new Date(po.issueDate), 'MMM dd, yyyy')}
                       </div>
                     </td>
                   )}
                   {visibleColumns.status && (
                     <td className="px-6 py-5 text-center">
                       <Badge className={cn(
                         "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                         po.status === "Received" ? "bg-emerald-50 text-emerald-600" : 
                         po.status === "Sent" ? "bg-blue-50 text-blue-600" :
                         po.status === "Partially Received" ? "bg-amber-50 text-amber-600" :
                         po.status === "Cancelled" ? "bg-rose-100 text-rose-600" :
                         "bg-slate-100 text-slate-400"
                       )}>
                         {po.status}
                       </Badge>
                     </td>
                   )}
                   {visibleColumns.total && (
                     <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white font-mono">
                       {po.totalAmount.toLocaleString('en-US', { style: 'currency', currency: po.currency || 'USD' })}
                     </td>
                   )}
                   <td className="px-6 py-5 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => navigate(`/purchase/orders/${po.id}`)}
                          className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-600/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 p-1">
                             <DropdownMenuItem onClick={() => navigate(`/purchase/orders/${po.id}/edit`)} className="text-xs font-bold gap-2 py-2">
                               <FileText className="h-3.5 w-3.5" /> Edit PO
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => navigate(`/purchase/orders/${po.id}/receive`)} className="text-xs font-bold gap-2 py-2 text-amber-600 bg-amber-50/10">
                               <Truck className="h-3.5 w-3.5" /> Goods Receipt
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleCreateBill(po.id)} className="text-xs font-bold gap-2 py-2 text-emerald-600 bg-emerald-50/10">
                               <CreditCard className="h-3.5 w-3.5" /> Create Bill
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-xs font-bold gap-2 py-2">
                               <ArrowDownToLine className="h-3.5 w-3.5" /> Download PDF
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleDelete(po.id)} className="text-xs font-bold gap-2 py-2 text-rose-600 hover:bg-rose-50">
                               <Trash2 className="h-3.5 w-3.5" /> Delete
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-indigo-500/10 underline underline-offset-4 font-mono">
              Showing {pos.length} Orders
            </span>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
               <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-indigo-600 text-white shadow-premium">1</Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
            </div>
         </div>
      </Card>
    </div>
  );
}

