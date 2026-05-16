import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SupportTicketFilters } from "@/components/support/SupportTicketFilters";
import { 
  Plus, 
  Download, 
  Eye, 
  MoreHorizontal, 
  ChevronRight, 
  Building2, 
  Activity,
  Trash2,
  CheckCircle2,
  RefreshCcw,
  User,
  Tag,
  Clock,
  ExternalLink,
  ChevronLeft,
  Settings2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const COLUMN_CONFIG = [
  { id: 'ticketNumber', label: 'Ticket ID' },
  { id: 'subject', label: 'Subject' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: 'category', label: 'Category' },
  { id: 'assignedUser', label: 'Assignee' },
  { id: 'customerName', label: 'Customer' },
  { id: 'createdAt', label: 'Created Date' },
  { id: 'slaDueDate', label: 'SLA' },
  { id: 'actions', label: 'Actions' }
];

export default function SupportTicketsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(COLUMN_CONFIG.map(c => c.id));
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  // Filters from URL
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const department = searchParams.get("department") || "";
  const category = searchParams.get("category") || "";
  const assignedUserId = searchParams.get("assignedUserId") || "";
  const dateRange = searchParams.get("dateRange") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/users');
        if (response.success) setUsers(response.data || []);
      } catch (err) {}
    };
    fetchAgents();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 1000 }; // Fetch a large sample for client-side pagination
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (department) params.department = department;
      if (category) params.category = category;
      if (assignedUserId) params.assignedUserId = assignedUserId;
      if (dateRange) params.dateRange = dateRange;
      if (search) params.search = search;
      
      const response = await api.get('/support/tickets', params);
      if (response.success && response.data) {
        setTickets(response.data.items || []);
        setCurrentPage(1); // Reset to page 1 on new fetch
      }
    } catch (error) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const toggleColumn = (colId: string) => {
    setVisibleColumns(prev => 
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/support/tickets/${id}/status`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      fetchTickets();
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await api.delete(`/support/tickets/${id}`);
      toast.success("Ticket deleted successfully");
      fetchTickets();
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const handleAssign = async () => {
    if (!selectedTicketId || !selectedAgentId) {
      toast.error("Please select an agent");
      return;
    }
    try {
      await api.patch(`/support/tickets/${selectedTicketId}/assign`, { assignedUserId: selectedAgentId });
      toast.success("Ticket assigned successfully");
      setAssignModalOpen(false);
      fetchTickets();
    } catch (error) {
      toast.error("Failed to assign ticket");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(tickets.length / rowsPerPage);
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const isVisible = (id: string) => visibleColumns.includes(id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Support Tickets</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic ml-12">
            Manage customer requests, track performance, and resolve tickets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2 italic">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button 
            onClick={() => navigate('/support/tickets/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic"
          >
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>

      {/* Support Ticket Filter Toolbar */}
      <SupportTicketFilters 
        search={search}
        status={status}
        priority={priority}
        category={category}
        assignedUserId={assignedUserId}
        dateRange={dateRange}
        users={users}
        COLUMN_CONFIG={COLUMN_CONFIG}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        updateFilter={updateFilter}
        onRefresh={fetchTickets}
        loading={loading}
      />

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden relative">
         <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left min-w-[1000px]">
               <thead className="sticky top-0 z-10">
               <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/80 dark:bg-[#211c1f]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 italic">
                  {isVisible('ticketNumber') && <th className="px-6 py-5">Ticket ID</th>}
                  {isVisible('subject') && <th className="px-6 py-5">Subject</th>}
                  {isVisible('status') && <th className="px-6 py-5 text-center">Status</th>}
                  {isVisible('priority') && <th className="px-6 py-5 text-center">Priority</th>}
                  {isVisible('category') && <th className="px-6 py-5">Category</th>}
                  {isVisible('assignedUser') && <th className="px-6 py-5">Assignee</th>}
                  {isVisible('customerName') && <th className="px-6 py-5">Customer</th>}
                  {isVisible('createdAt') && <th className="px-6 py-5">Created Date</th>}
                  {isVisible('slaDueDate') && <th className="px-6 py-5">SLA</th>}
                  {isVisible('actions') && <th className="px-6 py-5 text-right">Actions</th>}
               </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium italic">
               <AnimatePresence>
               {paginatedTickets.length > 0 ? (
                 paginatedTickets.map((tk) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={tk.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group relative border-l-4 border-l-transparent hover:border-l-blue-500"
                  >
                     {isVisible('ticketNumber') && (
                        <td className="px-6 py-5">
                           <span className="font-mono font-black text-slate-400 text-[10px] uppercase bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                              {tk.ticketNumber || `#${tk.id.slice(0, 8)}`}
                           </span>
                        </td>
                     )}
                     {isVisible('subject') && (
                        <td className="px-6 py-5 max-w-[250px]">
                           <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 leading-none">{tk.subject}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                 {tk.description.slice(0, 60)}...
                              </span>
                           </div>
                        </td>
                     )}
                     {isVisible('status') && (
                        <td className="px-6 py-5 text-center">
                           <Badge className={cn(
                              "text-[8px] font-black uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                              tk.status === "Open" ? "bg-blue-50 text-blue-600 dark:bg-blue-600/10" : 
                              tk.status === "In Progress" ? "bg-purple-50 text-purple-600 dark:bg-purple-600/10" :
                              tk.status === "Pending" ? "bg-orange-50 text-orange-600 dark:bg-orange-600/10" :
                              tk.status === "Resolved" || tk.status === "Solved" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10" :
                              tk.status === "Closed" ? "bg-slate-100 text-slate-500 dark:bg-white/10" :
                              tk.status === "Overdue" ? "bg-red-50 text-red-600 dark:bg-red-600/10" :
                              "bg-slate-100 text-slate-400"
                           )}>
                              {tk.status}
                           </Badge>
                        </td>
                     )}
                     {isVisible('priority') && (
                        <td className="px-6 py-5 text-center">
                           <Badge variant="outline" className={cn(
                              "text-[8px] font-black uppercase py-0.5 px-2 h-5 tracking-widest italic border-2",
                              tk.priority === "Critical" ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-600/10" : 
                              tk.priority === "High" ? "border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-600/10" :
                              tk.priority === "Medium" ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-600/10" :
                              "border-slate-200 text-slate-400 bg-slate-50 dark:bg-white/5 dark:border-white/10"
                           )}>
                              {tk.priority}
                           </Badge>
                        </td>
                     )}
                     {isVisible('category') && (
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <Tag className="h-3 w-3 text-indigo-400" />
                              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9px] tracking-wider italic">{tk.category || tk.department}</span>
                           </div>
                        </td>
                     )}
                     {isVisible('assignedUser') && (
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 border-2 border-white dark:border-[#211c1f] shadow-sm">
                                 <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tk.assignedUser?.firstName || 'unassigned'}`} />
                                 <AvatarFallback className="text-[10px] font-black">{tk.assignedUser?.firstName?.charAt(0) || "?"}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                 <span className="font-bold text-slate-700 dark:text-slate-300 italic leading-none">{tk.assignedUser ? `${tk.assignedUser.firstName} ${tk.assignedUser.lastName}` : "Unassigned"}</span>
                                 <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Support Agent</span>
                              </div>
                           </div>
                        </td>
                     )}
                     {isVisible('customerName') && (
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                              <span className="font-bold italic">{tk.customerName || "Walk-In Customer"}</span>
                           </div>
                        </td>
                     )}
                     {isVisible('createdAt') && (
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <span className="text-slate-500 dark:text-slate-400 font-bold">{new Date(tk.createdAt).toLocaleDateString()}</span>
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest">{new Date(tk.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </td>
                     )}
                     {isVisible('slaDueDate') && (
                        <td className="px-6 py-5">
                           {tk.slaDueDate ? (
                              <div className={cn(
                                "flex items-center gap-2 px-2 py-1 rounded-lg border",
                                new Date(tk.slaDueDate) < new Date() ? "bg-red-50 border-red-100 text-red-600 dark:bg-red-600/10 dark:border-red-900/20" : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400"
                              )}>
                                 <Clock className="h-3 w-3" />
                                 <span className="font-black text-[9px] tracking-tight">{new Date(tk.slaDueDate).toLocaleDateString()}</span>
                              </div>
                           ) : (
                              <span className="text-slate-300 dark:text-slate-700 italic">-- No SLA --</span>
                           )}
                        </td>
                     )}
                     {isVisible('actions') && (
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/support/tickets/${tk.id}`)} className="h-9 w-9 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                                 <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-100">
                                       <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-56 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 italic p-2">
                                    <DropdownMenuGroup>
                                       <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2 italic border-b border-slate-50 dark:border-white/5 mb-1">Ticket Actions</DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate(`/support/tickets/${tk.id}`)} className="text-xs font-bold gap-3 rounded-lg py-2.5">
                                       <Eye className="h-4 w-4 text-blue-500" /> View Detailed Case
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                       setSelectedTicketId(tk.id);
                                       setSelectedAgentId(tk.assignedUserId || "");
                                       setAssignModalOpen(true);
                                    }} className="text-xs font-bold gap-3 rounded-lg py-2.5">
                                       <User className="h-4 w-4 text-indigo-500" /> Assign To Expert
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/support/tickets/${tk.id}/edit`)} className="text-xs font-bold gap-3 rounded-lg py-2.5">
                                       <Settings2 className="h-4 w-4 text-slate-400" /> Edit Ticket
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(tk.id, "Solved")} className="text-xs font-bold gap-3 rounded-lg py-2.5 focus:bg-emerald-50 dark:focus:bg-emerald-600/10">
                                       <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mark Solved
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 bg-slate-50 dark:bg-white/5" />
                                    <DropdownMenuItem onClick={() => handleDelete(tk.id)} className="text-xs font-bold gap-3 rounded-lg py-2.5 text-red-500 focus:bg-red-50 dark:focus:bg-red-600/10">
                                       <Trash2 className="h-4 w-4" /> Delete Ticket
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>
                        </td>
                     )}
                  </motion.tr>
                 ))
               ) : (
                  <tr>
                     <td colSpan={visibleColumns.length} className="px-6 py-24 text-center">
                        {loading ? (
                          <div className="flex flex-col items-center gap-3">
                             <RefreshCcw className="h-8 w-8 text-blue-600 animate-spin" />
                             <p className="text-sm font-bold text-slate-400 italic">Syncing with Intelligence Cloud...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                             <div className="h-16 w-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                <FileText className="h-8 w-8 text-slate-300" />
                             </div>
                             <div>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">📭 No tickets found</p>
                                <p className="text-sm text-slate-500 italic mt-1">Try adjusting your filters or search query.</p>
                             </div>
                             <Button 
                                onClick={() => navigate('/support/tickets/new')}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-10 font-bold italic shadow-premium gap-2 transform transition-all hover:scale-105"
                             >
                                <Plus className="h-4 w-4" />
                                Create First Ticket
                             </Button>
                          </div>
                        )}
                     </td>
                  </tr>
               )}
               </AnimatePresence>
               </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/5 shadow-sm">
                  TOTAL: {tickets.length} TICKETS In System
               </span>
               <Select value={String(rowsPerPage)} onValueChange={(val) => {
                 setRowsPerPage(Number(val));
                 setCurrentPage(1);
               }}>
                  <SelectTrigger className="h-8 w-[100px] rounded-lg border-slate-200 dark:border-white/5 text-[9px] font-black uppercase italic bg-white dark:bg-white/5">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="italic rounded-xl">
                     <SelectItem value="10">10 Rows</SelectItem>
                     <SelectItem value="25">25 Rows</SelectItem>
                     <SelectItem value="50">50 Rows</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex items-center gap-1.5">
               <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black text-[10px] uppercase italic gap-2 transition-all hover:border-blue-500"
               >
                  <ChevronLeft className="h-4 w-4" />
                  PREVIOUS
               </Button>
               
               <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1;
                    // Only show a limited number of page buttons if there are too many
                    if (totalPages > 7) {
                      if (p !== 1 && p !== totalPages && (p < currentPage - 1 || p > currentPage + 1)) {
                        if (p === 2 || p === totalPages - 1) return <span key={p} className="text-slate-400">...</span>;
                        return null;
                      }
                    }
                    return (
                      <Button 
                        key={p}
                        variant="ghost" 
                        onClick={() => setCurrentPage(p)}
                        className={cn(
                          "h-9 w-9 rounded-xl font-black text-[10px] transition-all",
                          p === currentPage ? "bg-blue-600 text-white shadow-premium scale-110" : "text-slate-500 hover:bg-white dark:hover:bg-white/5 hover:border-slate-100 dark:hover:border-white/10 italic"
                        )}
                      >{p}</Button>
                    );
                  })}
               </div>

               <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black text-[10px] uppercase italic gap-2 transition-all hover:border-blue-500"
               >
                  NEXT
                  <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </Card>

      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="rounded-2xl dark:bg-[#1f1a1d] dark:border-white/10 font-jakarta italic">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50 italic">Assign Support Expert</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest italic ml-1">Select Support Agent</Label>
               <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                 <SelectTrigger className="rounded-xl h-12 italic font-bold border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm">
                   <SelectValue placeholder="Select an agent..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl italic">
                   {users.map((agent) => (
                     <SelectItem key={agent.id} value={agent.id} className="italic font-medium">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                             <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.firstName}`} />
                             <AvatarFallback className="text-[8px] font-black">{agent.firstName?.charAt(0)}</AvatarFallback>
                           </Avatar>
                           {agent.firstName} {agent.lastName}
                        </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)} className="rounded-xl font-bold italic h-11 border-slate-200">Cancel</Button>
            <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold italic h-11 shadow-premium">Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
   </div>
  );
}
