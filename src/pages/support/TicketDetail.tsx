import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings2, 
  User, 
  Building2, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Tag, 
  Globe, 
  CheckCircle2, 
  History, 
  AlertTriangle,
  UserPlus,
  Trash2,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  Loader2,
  Paperclip,
  Share2,
  MoreHorizontal,
  Sparkles,
  FileText,
  Plus,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchTicket();
    fetchUsers();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/support/tickets/${id}`);
      if (response.success) {
        setTicket(response.data);
      } else {
        toast.error("Ticket not found");
        navigate('/support/tickets');
      }
    } catch (error) {
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.success) setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to load users");
    }
  };

  const updateStatus = async (status: string) => {
    setActionLoading(true);
    try {
      const response = await api.patch(`/support/tickets/${id}/status`, { status });
      if (response.success) {
        toast.success(`Ticket status updated to ${status}`);
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const updatePriority = async (priority: string) => {
    setActionLoading(true);
    try {
      const response = await api.patch(`/support/tickets/${id}/priority`, { priority });
      if (response.success) {
        toast.success(`Priority set to ${priority}`);
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to update priority");
    } finally {
      setActionLoading(false);
    }
  };

  const assignAgent = async (userId: string) => {
    setActionLoading(true);
    try {
      const response = await api.patch(`/support/tickets/${id}/assign`, { assignedUserId: userId === 'unassigned' ? null : userId });
      if (response.success) {
        toast.success("Assignee updated");
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to assign agent");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopen = async () => {
    setActionLoading(true);
    try {
      const response = await api.post(`/support/tickets/${id}/reopen`);
      if (response.success) {
        toast.success("Ticket reopened successfully");
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to reopen ticket");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setActionLoading(true);
    try {
      const response = await api.post(`/support/tickets/${id}/duplicate`);
      if (response.success) {
        toast.success("Ticket duplicated successfully");
        navigate(`/support/tickets/${response.data.id}`);
      }
    } catch (error) {
      toast.error("Failed to duplicate ticket");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!content.trim()) return;
    try {
      const response = await api.post(`/support/tickets/${id}/notes`, { content });
      if (response.success) {
        toast.success("Internal note added");
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleSendMessage = async (content: string, isCustomer: boolean = false) => {
    if (!content.trim()) return;
    try {
      const response = await api.post(`/support/tickets/${id}/messages`, { content, isCustomer });
      if (response.success) {
        toast.success(isCustomer ? "Customer message stored" : "Reply sent successfully");
        fetchTicket();
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    
    try {
      const response = await api.delete(`/support/tickets/${id}`);
      if (response.success) {
        toast.success("Ticket deleted");
        navigate('/support/tickets');
      }
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold italic animate-pulse">Loading case intelligence...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <p className="text-slate-500 font-bold italic">Case intelligence not found.</p>
        <Button onClick={() => navigate('/support/tickets')}>Return to Headquarters</Button>
      </div>
    );
  }

  const statusColors: any = {
    'Open': 'bg-blue-500',
    'In Progress': 'bg-purple-500',
    'Pending': 'bg-orange-500',
    'Solved': 'bg-emerald-500',
    'Closed': 'bg-slate-500',
    'Resolved': 'bg-emerald-500' // Compatibility
  };

  const priorityColors: any = {
    'Low': 'bg-slate-100 text-slate-600 border-slate-200',
    'Medium': 'bg-blue-50 text-blue-600 border-blue-100',
    'High': 'bg-orange-50 text-orange-600 border-orange-100',
    'Critical': 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/support/tickets')} 
            className="rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-blue-600 italic tracking-widest uppercase">{ticket.ticketNumber}</span>
              <Separator orientation="vertical" className="h-3 bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 italic">Created {format(new Date(ticket.createdAt), 'MMM d, yyyy · h:mm a')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 italic tracking-tight">{ticket.subject}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <Badge className={cn("border-none text-white font-black italic px-3 h-8 uppercase tracking-widest text-[10px]", statusColors[ticket.status] || 'bg-slate-500')}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className={cn("font-black italic px-3 h-8 uppercase tracking-widest text-[10px]", priorityColors[ticket.priority])}>
              {ticket.priority} Priority
            </Badge>
          </div>
          
          <Button onClick={() => navigate(`/support/tickets/${id}/edit`)} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold italic rounded-xl h-10 px-4 hover:bg-slate-50">
            <Settings2 className="h-4 w-4 mr-2" /> Edit Case
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 border border-slate-200 dark:border-white/10 dark:bg-white/5">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl font-bold italic">
              {ticket.status === 'Solved' || ticket.status === 'Closed' ? (
                <DropdownMenuItem onClick={handleReopen} className="text-blue-600 gap-3 py-2.5">
                  <RefreshCw className="h-4 w-4" /> Reopen Ticket
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => updateStatus('Solved')} className="text-emerald-600 gap-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4" /> Mark as Solved
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate(`/support/tickets/${id}/edit`)} className="gap-3 py-2.5">
                <Settings2 className="h-4 w-4" /> Edit Parameters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} className="gap-3 py-2.5">
                <Plus className="h-4 w-4" /> Duplicate Case
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-2.5">
                <Share2 className="h-4 w-4" /> Share Case Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 gap-3 py-2.5">
                <Trash2 className="h-4 w-4" /> Delete Intelligence Case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Details & Activity */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/30 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black italic flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" /> CASE DESCRIPTION
                    </CardTitle>
                    <Badge variant="ghost" className="text-[9px] uppercase font-black tracking-tighter text-slate-400 italic">Core Narrative</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed text-lg whitespace-pre-wrap bg-slate-50/50 dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                  {ticket.description}
                </p>
              </div>

              {ticket.attachmentUrl && (
                <div className="mt-8">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 italic ml-1">Attached Intelligence</h4>
                  <a 
                    href={ticket.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center shrink-0">
                      <Paperclip className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex flex-col pr-4">
                      <p className="text-sm font-black italic text-slate-800 dark:text-slate-100">view_attachment_asset.pdf</p>
                      <p className="text-[10px] font-bold text-slate-400 italic">PDF Document · 2.4 MB</p>
                    </div>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Timeline */}
          <Card className="border-none shadow-premium rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black italic flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <MessageSquare className="h-4 w-4 text-blue-600" /> CUSTOMER CONVERSATION
                    </CardTitle>
                    <Badge variant="ghost" className="text-blue-600 border-none font-black italic text-[9px] uppercase tracking-widest px-0">Live Thread</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="max-h-[500px] overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                  {/* Subject/Original Message as first entry */}
                  <div className="flex gap-4 p-5 rounded-2xl bg-blue-50/30 dark:bg-blue-600/5 border border-blue-100 dark:border-blue-900/10">
                     <Avatar className="h-10 w-10 shrink-0 border-2 border-white dark:border-white/10 shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.customerName || 'User'}`} />
                        <AvatarFallback>CX</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-black italic text-slate-800 dark:text-slate-100">{ticket.customerName || "Customer"}</span>
                              <Badge className="bg-blue-600 text-white border-none text-[7px] font-black italic h-3.5 px-1.5 uppercase">Opening</Badge>
                           </div>
                           <span className="text-[9px] font-bold text-slate-400 italic">{format(new Date(ticket.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">{ticket.description}</p>
                     </div>
                  </div>

                  {(ticket.messages || []).map((msg: any) => (
                    <div key={msg.id} className={cn(
                      "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      msg.isCustomer ? "flex-row" : "flex-row-reverse text-right"
                    )}>
                       <Avatar className={cn(
                         "h-10 w-10 shrink-0 border-2 border-white dark:border-white/10 shadow-sm",
                         !msg.isCustomer && "bg-blue-600"
                       )}>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.author?.firstName || (msg.isCustomer ? 'Customer' : 'Agent')}`} />
                          <AvatarFallback>{msg.isCustomer ? 'CX' : 'ST'}</AvatarFallback>
                       </Avatar>
                       <div className={cn(
                         "flex-1 max-w-[85%] p-5 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5",
                         !msg.isCustomer && "bg-slate-800 dark:bg-slate-800/80 text-white border-none shadow-soft"
                       )}>
                          <div className={cn(
                            "flex items-center gap-2 mb-2",
                            !msg.isCustomer && "justify-end"
                          )}>
                             <span className={cn(
                               "text-xs font-black italic",
                               !msg.isCustomer ? "text-slate-100" : "text-slate-800 dark:text-slate-100"
                             )}>
                               {msg.author ? `${msg.author.firstName} ${msg.author.lastName}` : (msg.isCustomer ? (ticket.customerName || "Customer") : "Support Expert")}
                             </span>
                             <span className="text-[9px] font-bold text-slate-400 italic">• {format(new Date(msg.createdAt), 'h:mm a')}</span>
                          </div>
                          <p className={cn(
                            "text-sm italic font-medium leading-relaxed",
                            !msg.isCustomer ? "text-slate-200" : "text-slate-600 dark:text-slate-400"
                          )}>{msg.content}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-6 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex gap-4">
                     <Select defaultValue="agent" onValueChange={() => {}}>
                        <SelectTrigger className="w-[110px] h-10 rounded-xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 font-black italic text-[9px] uppercase tracking-tighter shadow-sm">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic text-xs font-bold">
                           <SelectItem value="agent">Support Rep</SelectItem>
                           <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                     </Select>
                     <div className="flex-1 relative">
                        <textarea 
                          placeholder="Type your message to the customer..."
                          className="w-full min-h-[60px] max-h-[150px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 pr-12 text-sm italic font-medium shadow-soft focus:ring-blue-200 outline-none resize-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const isCustomer = (e.currentTarget.parentElement?.previousElementSibling as any).innerText.includes('Customer');
                              handleSendMessage(e.currentTarget.value, isCustomer);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button 
                          size="icon" 
                          onClick={(e) => {
                            const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                            const isCustomer = (textarea.parentElement?.previousElementSibling as any).innerText.includes('Customer');
                            handleSendMessage(textarea.value, isCustomer);
                            textarea.value = '';
                          }}
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg text-white"
                        >
                           <ArrowRight className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                     <div className="flex items-center gap-4">
                       <Button variant="ghost" size="sm" className="h-6 px-2 text-[8px] font-black uppercase tracking-widest text-slate-400 italic gap-1.5 hover:text-blue-600 transition-colors">
                          <Paperclip className="h-3 w-3" /> Add Assets
                       </Button>
                       <Button variant="ghost" size="sm" className="h-6 px-2 text-[8px] font-black uppercase tracking-widest text-slate-400 italic gap-1.5 hover:text-blue-600 transition-colors">
                          <Sparkles className="h-3 w-3" /> AI Assistant
                       </Button>
                     </div>
                     <p className="text-[9px] font-bold text-slate-300 italic tracking-widest uppercase">Internal Intelligence Bridge</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-600/5 border-b border-amber-100 dark:border-amber-900/20 p-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-black italic flex items-center gap-2 text-amber-700 dark:text-amber-500">
                        <FileText className="h-4 w-4" /> INTERNAL AGENT NOTES
                    </CardTitle>
                    <Badge className="bg-amber-600/10 text-amber-600 border-none font-black italic text-[8px] uppercase tracking-widest px-2 py-0.5">Staff Only</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-4">
                 <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                 </Avatar>
                 <div className="flex-1 space-y-3">
                    <textarea 
                      placeholder="Add an internal note or strategic update..."
                      className="w-full min-h-[80px] rounded-xl border border-amber-100 dark:border-amber-900/20 bg-amber-50/30 dark:bg-amber-600/5 p-4 text-sm italic font-medium focus:ring-amber-200 outline-none resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddNote((e.target as HTMLTextAreaElement).value);
                          (e.target as HTMLTextAreaElement).value = '';
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] text-slate-400 italic">Press Enter to save note.</p>
                       <Button 
                         size="sm" 
                         variant="ghost" 
                         onClick={(e) => {
                           const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                           handleAddNote(textarea.value);
                           textarea.value = '';
                         }}
                         className="h-7 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 italic"
                       >
                         Store Note
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                {(ticket.notes || []).map((note: any) => (
                  <div key={note.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 animate-in fade-in duration-300">
                     <Avatar className="h-8 w-8 shrink-0 border border-slate-200 dark:border-white/10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${note.author?.firstName || 'System'}`} />
                        <AvatarFallback>{note.author?.firstName?.charAt(0) || 'S'}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-black italic text-slate-800 dark:text-slate-100">{note.author ? `${note.author.firstName} ${note.author.lastName}` : "Admin"}</span>
                           <span className="text-[9px] font-bold text-slate-400 italic">• {format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed">{note.content}</p>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/30 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
              <CardTitle className="text-lg font-black italic flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" /> CASE ACTIVITY TIMELINE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-white/5">
                {(ticket.ticketActivities || []).length > 0 ? (
                  ticket.ticketActivities.map((activity: any, idx: number) => (
                    <div key={activity.id} className="relative flex items-start gap-6 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#211c1f] border-2 border-slate-100 dark:border-white/10 shadow-sm">
                        {activity.action.includes('Created') && <Sparkles className="h-4 w-4 text-emerald-500" />}
                        {activity.action.includes('Status') && <RefreshCw className="h-4 w-4 text-blue-500" />}
                        {activity.action.includes('Priority') && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {activity.action.includes('Assign') && <UserPlus className="h-4 w-4 text-purple-500" />}
                        {activity.action.includes('Reopened') && <RefreshCw className="h-4 w-4 text-orange-500" />}
                      </div>
                      <div className="flex flex-col space-y-1 mt-1">
                        <div className="flex items-center gap-3">
                          <p className="font-black italic text-slate-800 dark:text-slate-100">{activity.action}</p>
                          <span className="text-[10px] font-bold text-slate-400 italic">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        {activity.newValue && (
                          <div className="flex items-center gap-2 text-sm italic font-medium">
                            {activity.oldValue && (
                              <>
                                <span className="text-slate-400 line-through decoration-slate-300">{activity.oldValue}</span>
                                <ChevronRight className="h-3 w-3 text-slate-300" />
                              </>
                            )}
                            <span className="text-blue-600 bg-blue-50 dark:bg-blue-600/10 px-2 py-0.5 rounded-lg border border-blue-100/50 dark:border-blue-900/20">{activity.newValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 italic">
                    <History className="h-10 w-10 mb-4 opacity-20" />
                    <p className="font-bold">No registered activity for this case.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Quick Info & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card className="border-none shadow-premium rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f] ring-2 ring-blue-600/5">
            <CardHeader className="bg-blue-600 p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 italic">STRATEGIC COMMAND</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-blue-50/30 dark:bg-blue-600/5">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-2 block">Quick Status Toggle</Label>
                  <Select value={ticket.status} onValueChange={updateStatus} disabled={actionLoading}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black italic shadow-sm bg-white dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl italic">
                      <SelectItem value="Open" className="italic font-bold">Open</SelectItem>
                      <SelectItem value="In Progress" className="italic font-bold">In Progress</SelectItem>
                      <SelectItem value="Pending" className="italic font-bold">Pending</SelectItem>
                      <SelectItem value="Solved" className="italic font-bold text-emerald-600">Solved</SelectItem>
                      <SelectItem value="Closed" className="italic font-bold text-slate-500">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-2 block">Intelligence Priority</Label>
                  <Select value={ticket.priority} onValueChange={updatePriority} disabled={actionLoading}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black italic shadow-sm bg-white dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl italic">
                      <SelectItem value="Low" className="italic font-bold text-slate-500">Low</SelectItem>
                      <SelectItem value="Medium" className="italic font-bold text-blue-600">Medium</SelectItem>
                      <SelectItem value="High" className="italic font-bold text-orange-600">High</SelectItem>
                      <SelectItem value="Critical" className="italic font-bold text-red-600 bg-red-50">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                   {ticket.status === 'Solved' || ticket.status === 'Closed' ? (
                       <Button 
                         onClick={handleReopen} 
                         disabled={actionLoading}
                         className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black italic uppercase tracking-widest text-[10px] shadow-premium shadow-orange-600/20"
                       >
                         {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                         REOPEN CASE
                       </Button>
                   ) : (
                        <Button 
                          onClick={() => updateStatus('Solved')} 
                          disabled={actionLoading}
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black italic uppercase tracking-widest text-[10px] shadow-premium shadow-emerald-600/20"
                        >
                          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                          MARK AS SOLVED
                        </Button>
                   )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Metadata */}
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-center">INTELLIGENCE CONTEXT</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Linked Customer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Account Reference</span>
                  <Badge variant="ghost" className="text-blue-600 p-0 hover:bg-transparent">
                      <Link to={`/crm/customers/${ticket.customerId}`} className="flex items-center gap-1">
                        View Profile <ChevronRight className="h-3 w-3" />
                      </Link>
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center border border-slate-100 dark:border-white/5">
                    <Building2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black italic text-slate-800 dark:text-slate-100">{ticket.customerName || ticket.customer?.name || "Independent Case"}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic uppercase italic">{ticket.customer?.email || "System-Entered Profile"}</p>
                  </div>
                </div>
              </div>

              {/* Assigned Agent */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Assigned Strategy Expert</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <Select value={ticket.assignedUserId || 'unassigned'} onValueChange={assignAgent} disabled={actionLoading}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black italic shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl italic">
                            <SelectItem value="unassigned" className="italic font-bold text-slate-400">Not Assigned</SelectItem>
                            {users.map(u => (
                                <SelectItem key={u.id} value={u.id} className="italic font-bold">
                                    {u.firstName} {u.lastName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>

              {/* Other Params */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-1">
                    <Tag className="h-2.5 w-2.5" /> Dept
                  </span>
                  <p className="text-xs font-black italic text-slate-800 dark:text-slate-100">{ticket.department}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" /> Source
                  </span>
                  <p className="text-xs font-black italic text-slate-800 dark:text-slate-100">{ticket.source}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-1">
                   <Clock className="h-2.5 w-2.5" /> SLA Due
                  </span>
                  <p className="text-xs font-black italic text-red-500">
                    {ticket.slaDueDate ? format(new Date(ticket.slaDueDate), 'MMM d, yyyy') : 'No Deadline'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-1">
                   <ShieldAlert className="h-2.5 w-2.5" /> Category
                  </span>
                  <p className="text-xs font-black italic text-slate-800 dark:text-slate-100">{ticket.category || "General"}</p>
                </div>
              </div>

              {/* Resolve/Close Timestamps */}
              {(ticket.resolvedAt || ticket.closedAt) && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-900/20 space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 italic">Resolution Pulse</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                     </div>
                     {ticket.resolvedAt && (
                         <div className="flex justify-between text-[10px] font-bold italic">
                            <span className="text-slate-400">Solved:</span>
                            <span className="text-slate-600 dark:text-slate-300">{format(new Date(ticket.resolvedAt), 'MMM d, h:mm a')}</span>
                         </div>
                     )}
                     {ticket.closedAt && (
                         <div className="flex justify-between text-[10px] font-bold italic">
                            <span className="text-slate-400">Closed:</span>
                            <span className="text-slate-600 dark:text-slate-300">{format(new Date(ticket.closedAt), 'MMM d, h:mm a')}</span>
                         </div>
                     )}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
