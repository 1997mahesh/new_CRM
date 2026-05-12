import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Eye,
  Edit2,
  Trash2,
  Calendar,
  MoreHorizontal,
  Columns,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  "Draft": { label: "Draft", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400" },
  "Sent": { label: "Sent", color: "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400" },
  "Accepted": { label: "Accepted", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" },
  "Rejected": { label: "Rejected", color: "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400" },
  "Expired": { label: "Expired", color: "bg-amber-50 text-amber-600 dark:bg-amber-600/10 dark:text-amber-400" },
};

export default function QuotationsPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  const [columns, setColumns] = useState({
    number: true,
    customer: true,
    status: true,
    issueDate: true,
    validUntil: true,
    total: true,
    actions: true
  });

  useEffect(() => {
    fetchQuotations();
  }, [activeTab, search, pagination.page]);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const params = {
        status: activeTab === 'all' ? undefined : activeTab,
        search: search || undefined,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const res = await api.get('/quotations', params);
      if (res.success) {
        setQuotations(res.data.items);
        setPagination(prev => ({ 
          ...prev, 
          total: res.data.pagination.total, 
          pages: res.data.pagination.pages 
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, number: string) => {
    if (!window.confirm(`Are you sure you want to delete quotation ${number}?`)) return;
    try {
      const res = await api.delete(`/quotations/${id}`);
      if (res.success) {
        toast.success("Successfully removed quotation.");
        fetchQuotations();
      }
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const toggleColumn = (col: keyof typeof columns) => {
    setColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-800 dark:text-slate-100 uppercase">Quotations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Business Proposal & Quote Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-11 px-6 rounded-xl shadow-sm gap-2 uppercase tracking-widest text-[10px]">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button 
            onClick={() => navigate('/sales/quotations/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-premium gap-2 uppercase tracking-widest text-[10px]"
          >
            <Plus className="h-4 w-4" />
            <span>New Quotation</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPagination(p => ({ ...p, page: 1 })); }} className="w-full md:w-auto">
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-12 rounded-2xl border border-slate-200/50 dark:border-white/5">
              {["all", "draft", "sent", "accepted", "rejected", "expired"].map((tab) => (
                <TabsTrigger key={tab} value={tab} className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-72 group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <Input 
                 placeholder="Search by number or customer..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-10 h-12 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-2xl shadow-soft focus-visible:ring-blue-500 font-bold italic text-sm" 
               />
             </div>
             
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] group">
                   <Columns className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1f1a1d] p-2">
                 <DropdownMenuGroup>
                   <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-3 py-2">Toggle Columns</DropdownMenuLabel>
                   <DropdownMenuSeparator className="opacity-50" />
                   {Object.entries(columns).map(([key, value]) => (
                     key !== 'actions' && (
                       <DropdownMenuCheckboxItem
                         key={key}
                         checked={value}
                         onCheckedChange={() => toggleColumn(key as any)}
                         className="rounded-xl py-2.5 px-3 text-xs font-bold capitalize hover:bg-slate-50 dark:hover:bg-white/5"
                       >
                         {key.replace(/([A-Z])/g, ' $1')}
                       </DropdownMenuCheckboxItem>
                     )
                   ))}
                 </DropdownMenuGroup>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-[2rem] shadow-soft dark:shadow-2xl overflow-hidden relative">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[1000px]">
             <thead>
               <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  {columns.number && <th className="px-8 py-5">Number <ArrowUpDown className="h-3 w-3 inline ml-1 opacity-50" /></th>}
                  {columns.customer && <th className="px-6 py-5">Customer Informtion</th>}
                  {columns.status && <th className="px-6 py-5 text-center">Status</th>}
                  {columns.issueDate && <th className="px-6 py-5">Issue Date</th>}
                  {columns.validUntil && <th className="px-6 py-5">Valid Until</th>}
                  {columns.total && <th className="px-6 py-5">Total Amount</th>}
                  <th className="px-8 py-5 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5">
               <AnimatePresence>
                 {quotations.map((q) => (
                   <motion.tr 
                     key={q.id}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                     onClick={() => navigate(`/sales/quotations/${q.id}`)}
                   >
                     {columns.number && (
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="p-2.5 bg-blue-50 dark:bg-blue-600/10 rounded-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                             <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                           </div>
                           <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono italic tracking-tighter">{q.number}</span>
                         </div>
                       </td>
                     )}
                     {columns.customer && (
                       <td className="px-6 py-6">
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors uppercase tracking-tight italic">{q.customerName}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{q.items?.length || 0} Line Items</span>
                         </div>
                       </td>
                     )}
                     {columns.status && (
                       <td className="px-6 py-6 text-center">
                         <Badge className={cn("text-[9px] font-black uppercase py-0.5 px-3 border-none h-6 shadow-sm", STATUS_CONFIG[q.status]?.color)}>
                           {q.status}
                         </Badge>
                       </td>
                     )}
                     {columns.issueDate && (
                       <td className="px-6 py-6">
                         <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold italic">
                           <Calendar className="h-3.5 w-3.5 opacity-50" />
                           <span className="text-xs uppercase tracking-tight">{new Date(q.issueDate).toLocaleDateString()}</span>
                         </div>
                       </td>
                     )}
                     {columns.validUntil && (
                       <td className="px-6 py-6">
                         <div className="flex items-center gap-2 text-slate-500 dark:text-red-400/80 font-bold italic">
                           <Clock className="h-3.5 w-3.5 opacity-50" />
                           <span className="text-xs uppercase tracking-tight">{new Date(q.validUntil).toLocaleDateString()}</span>
                         </div>
                       </td>
                     )}
                     {columns.total && (
                       <td className="px-6 py-6">
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 dark:text-white font-mono tracking-tighter italic">
                             ${(q.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">USD Currency</span>
                         </div>
                       </td>
                     )}
                     <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/sales/quotations/${q.id}`)}
                            className="h-9 w-9 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-xl"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200 rounded-xl">
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-44 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-[#1f1a1d] p-2 shadow-2xl">
                               <DropdownMenuItem onClick={() => navigate(`/sales/quotations/${q.id}/edit`)} className="rounded-xl py-2.5 text-xs font-bold gap-2">
                                 <Edit2 className="h-3.5 w-3.5" /> Edit Quote
                               </DropdownMenuItem>
                               <DropdownMenuSeparator className="opacity-50" />
                               <DropdownMenuItem 
                                 onClick={() => handleDelete(q.id, q.number)} 
                                 className="rounded-xl py-2.5 text-xs font-bold gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                               >
                                 <Trash2 className="h-3.5 w-3.5" /> Delete
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                     </td>
                   </motion.tr>
                 ))}
               </AnimatePresence>
             </tbody>
           </table>
         </div>

         {loading && (
           <div className="py-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
           </div>
         )}

         {!loading && quotations.length === 0 && (
           <div className="py-28 flex flex-col items-center justify-center text-center space-y-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 bg-slate-50 dark:bg-white/5 rounded-[3rem] shadow-inner"
              >
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700" />
              </motion.div>
              <div className="space-y-2">
                 <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em] italic">Zero Proposals Found</h3>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">No matching quotations were found in the database for the current filters.</p>
              </div>
              <Button 
                onClick={() => navigate('/sales/quotations/new')}
                className="font-black uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded-[1rem] h-12 px-8 shadow-premium"
              >
                 <Plus className="h-4 w-4 mr-2" />
                 Initiate New Quote
              </Button>
           </div>
         )}

         {/* Pagination */}
         <div className="p-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.01]">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Showing Page {pagination.page} of {pagination.pages}</p>
            <div className="flex items-center gap-2">
               <Button 
                 variant="outline" 
                 size="icon" 
                 disabled={pagination.page === 1}
                 onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                 className="h-10 w-10 rounded-2xl border-slate-200 dark:border-white/5"
               >
                 <ChevronLeft className="h-4 w-4" />
               </Button>
               <div className="flex items-center gap-1">
                 {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                   <Button 
                     key={p}
                     variant="ghost" 
                     size="sm" 
                     onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                     className={cn(
                       "h-10 w-10 rounded-2xl text-[10px] font-black uppercase tracking-widest",
                       pagination.page === p ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-100 dark:hover:bg-white/5"
                     )}
                   >
                     {p}
                   </Button>
                 ))}
               </div>
               <Button 
                 variant="outline" 
                 size="icon" 
                 disabled={pagination.page === pagination.pages}
                 onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                 className="h-10 w-10 rounded-2xl border-slate-200 dark:border-white/5"
               >
                 <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </Card>
    </div>
  );
}
