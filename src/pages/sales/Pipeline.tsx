import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  LayoutGrid, 
  List as ListIcon,
  MoreVertical,
  MoreHorizontal,
  Target,
  TrendingUp,
  CreditCard,
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Building2,
  ExternalLink,
  Loader2,
  ChevronRight,
  Zap,
  ArrowRight,
  GripVertical,
  CalendarDays,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Tag as TagIcon,
  SearchCheck,
  AlertCircle,
  Save,
  Phone,
  Mail,
  Video,
  FileText,
  Share2,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Layout,
  Building,
  Star,
  Trophy
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Recharts
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Cell, 
  Pie,
  Legend,
  LineChart,
  Line
} from "recharts";

// DND Imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const STAGES = [
  { id: "New", name: "New", color: "bg-blue-500", glow: "shadow-blue-500/10", accent: "#3B82F6", border: "border-blue-500/20" },
  { id: "Contacted", name: "Contacted", color: "bg-indigo-500", glow: "shadow-indigo-500/10", accent: "#6366F1", border: "border-indigo-500/20" },
  { id: "Qualified", name: "Qualified", color: "bg-cyan-500", glow: "shadow-cyan-500/10", accent: "#06B6D4", border: "border-cyan-500/20" },
  { id: "Proposal", name: "Proposal", color: "bg-purple-500", glow: "shadow-purple-500/10", accent: "#A855F7", border: "border-purple-500/20" },
  { id: "Negotiation", name: "Negotiation", color: "bg-amber-500", glow: "shadow-amber-500/10", accent: "#F59E0B", border: "border-amber-500/20" },
  { id: "Won", name: "Won", color: "bg-emerald-500", glow: "shadow-emerald-500/10", accent: "#10B981", border: "border-emerald-500/20" },
  { id: "Lost", name: "Lost", color: "bg-rose-500", glow: "shadow-rose-500/10", accent: "#F43F5E", border: "border-rose-500/20" },
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function PipelinePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLead, setActiveLead] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    source: "Website",
    pipelineStage: "New",
    value: "0",
    assignedUserId: "",
    priority: "Medium",
    notes: "",
    expectedCloseDate: "",
    tags: [] as string[]
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads', { limit: 100, search });
      if (response.success) setLeads(response.data.items || []);
    } catch (error) {
      toast.error("Failed to fetch pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.success) setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, [search]);

  const stats = useMemo(() => {
    const totalCount = leads.length;
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const wonDeals = leads.filter(l => l.pipelineStage === "Won");
    const wonCount = wonDeals.length;
    const wonValue = wonDeals.reduce((sum, l) => sum + (l.value || 0), 0);
    const conversionRate = totalCount > 0 ? (wonCount / totalCount) * 100 : 0;
    
    return {
      totalCount,
      totalValue,
      wonCount,
      wonValue,
      conversionRate,
      averageDealValue: totalCount > 0 ? totalValue / totalCount : 0
    };
  }, [leads]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveLead(leads.find((l) => l.id === active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    if (STAGES.some((s) => s.id === overId)) {
      setLeads((prev) => prev.map(l => l.id === activeId ? { ...l, pipelineStage: overId as string } : l));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);
    if (!over) return;

    const leadId = active.id as string;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      await api.patch(`/leads/${leadId}/stage`, { pipelineStage: lead.pipelineStage, sortOrder: 0 });
      toast.success("Stage updated");
    } catch (error) {
      toast.error("Failed to sync stage");
      fetchLeads();
    }
  };

  const openModal = (lead?: any) => {
    if (lead) {
      setEditingId(lead.id);
      setFormData({
        title: lead.title || "",
        companyName: lead.companyName || "",
        contactPerson: lead.contactPerson || "",
        email: lead.email || "",
        phone: lead.phone || "",
        source: lead.source || "Website",
        pipelineStage: lead.pipelineStage || "New",
        value: lead.value?.toString() || "0",
        assignedUserId: lead.assignedUserId || "",
        priority: lead.priority || "Medium",
        notes: lead.notes || "",
        expectedCloseDate: lead.expectedCloseDate ? new Date(lead.expectedCloseDate).toISOString().split('T')[0] : "",
        tags: lead.tags || []
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "", companyName: "", contactPerson: "", email: "", phone: "",
        source: "Website", pipelineStage: "New", value: "0", assignedUserId: "",
        priority: "Medium", notes: "", expectedCloseDate: "", tags: []
      });
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, value: parseFloat(formData.value) || 0 };
      const response = editingId ? await api.put(`/leads/${editingId}`, payload) : await api.post('/leads', payload);
      if (response.success) {
        toast.success(editingId ? "Deal updated" : "Deal created");
        setIsModalOpen(false);
        fetchLeads();
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-transparent text-slate-900 dark:text-slate-200 p-6 space-y-8 animate-in fade-in duration-700 pb-20 selection:bg-blue-500/30 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white italic flex items-center gap-3"
          >
            <Layout className="h-7 w-7 text-blue-600" />
            Pipeline Analytics
          </motion.h1>
          <p className="text-slate-500 font-medium text-sm tracking-tight">Sales intelligence & opportunity tracking.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-9 px-4 rounded-lg font-bold text-xs gap-2 transition-all", viewMode === "kanban" ? "bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300")}
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-9 px-4 rounded-lg font-bold text-xs gap-2 transition-all", viewMode === "list" ? "bg-slate-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300")}
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
              List
            </Button>
          </div>

          <Button variant="outline" className="h-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl px-4 gap-2 font-bold text-xs">
            <Download className="h-4 w-4 text-slate-400" />
            Export
          </Button>

          <Button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl shadow-lg gap-2 transition-all hover:scale-105 active:scale-95 text-xs"
          >
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Contacts", value: stats.totalCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-600/10", border: "border-blue-100 dark:border-blue-600/20" },
          { label: "New Deals", value: leads.filter(l => l.pipelineStage === 'New').length, icon: Star, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-600/10", border: "border-indigo-100 dark:border-indigo-600/20" },
          { label: "Pipeline Value", value: `$${(stats.totalValue / 1000).toFixed(1)}k`, icon: DollarSign, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-600/10", border: "border-cyan-100 dark:border-cyan-600/20" },
          { label: "Win Rate", value: `${stats.conversionRate.toFixed(1)}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-600/10", border: "border-emerald-100 dark:border-emerald-600/20" },
          { label: "Closed Won", value: `$${(stats.wonValue / 1000).toFixed(1)}k`, icon: Trophy, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-600/10", border: "border-purple-100 dark:border-purple-600/20" },
          { label: "Avg Deal", value: `$${(stats.averageDealValue / 1000).toFixed(1)}k`, icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-600/10", border: "border-amber-100 dark:border-amber-600/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-500", stat.bg, stat.border)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white leading-none tracking-tight">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white italic flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue Forecast
            </h3>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/5">
                 {['Weekly', 'Monthly'].map(t => (
                   <button key={t} className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", t === 'Monthly' ? "bg-white dark:bg-white/10 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-300")}>{t}</button>
                 ))}
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Jan', val: 40000 }, { name: 'Feb', val: 30000 }, { name: 'Mar', val: 45000 },
                { name: 'Apr', val: 61000 }, { name: 'May', val: 55000 }, { name: 'Jun', val: 67000 },
              ]}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-white/5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1F26', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest italic mb-6">Deals by Stage</h3>
            <div className="space-y-4">
              {STAGES.slice(0, 5).map(s => {
                const count = leads.filter(l => l.pipelineStage === s.id).length;
                const value = leads.filter(l => l.pipelineStage === s.id).reduce((sum, l) => sum + (l.value || 0), 0);
                const perc = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
                return (
                  <div key={s.id} className="group cursor-default">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.name}</span>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white">${(value / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${perc}%` }}
                        className={cn("h-full rounded-full", s.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          <Card className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-700">
               <Target className="h-20 w-20" />
             </div>
             <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Efficiency Score</p>
               <h2 className="text-4xl font-black italic mb-4">A+</h2>
               <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full border border-white/20">
                 <Zap className="h-3.5 w-3.5" />
                 Top 2% Performance
               </div>
               <p className="text-[10px] mt-4 font-medium opacity-80 leading-relaxed italic">Your team's conversion cycle is 14 days faster than average.</p>
             </div>
          </Card>
        </div>
      </div>

      {/* Pipeline Board */}
      <AnimatePresence mode="wait">
        {viewMode === "kanban" ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 group w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  placeholder="Filter pipeline deals..." 
                  className="pl-12 h-12 bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 text-slate-800 dark:text-white rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-10 border-slate-200 dark:border-white/5 rounded-xl px-4 gap-2 font-bold text-xs bg-white dark:bg-white/5">
                  <Filter className="h-4 w-4 text-slate-400" /> Filters
                </Button>
                <Button variant="outline" className="h-10 border-slate-200 dark:border-white/5 rounded-xl px-4 gap-2 font-bold text-xs bg-white dark:bg-white/5">
                  <CalendarDays className="h-4 w-4 text-slate-400" /> Monthly
                </Button>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start h-[calc(100vh-320px)] min-h-[600px] lead-kanban-scroll -mx-6 px-6">
                {STAGES.map(stage => (
                  <KanbanColumn 
                    key={stage.id} 
                    stage={stage} 
                    leads={leads.filter(l => l.pipelineStage === stage.id).sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0))} 
                    openModal={openModal}
                  />
                ))}
              </div>
              <DragOverlay>
                {activeLead ? (
                  <div className="w-[320px] shadow-2xl rotate-3">
                    <DealCard lead={activeLead} isDragging />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                      <th className="px-6 py-5">Deal Details</th>
                      <th className="px-6 py-5">Stage</th>
                      <th className="px-6 py-5">Value</th>
                      <th className="px-6 py-5">Priority</th>
                      <th className="px-6 py-5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-none">{lead.title}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lead.companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge className={cn(
                             "text-[9px] font-bold uppercase tracking-tighter px-2 h-5 border-none rounded-md",
                             "bg-blue-50 dark:bg-blue-600/10 text-blue-600"
                           )}>
                             {lead.pipelineStage}
                           </Badge>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm font-bold font-mono text-slate-800 dark:text-white">${(lead.value || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant="outline" className={cn(
                             "text-[9px] font-bold uppercase px-1.5 h-4.5 border-none",
                             lead.priority === 'Urgent' ? "bg-red-50 text-red-600" : "bg-slate-50 dark:bg-white/5 text-slate-500"
                           )}>
                             {lead.priority}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button onClick={() => openModal(lead)} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg h-9 w-9">
                             <Edit2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-200 rounded-3xl p-0 overflow-hidden shadow-2xl">
          <form onSubmit={handleModalSubmit}>
            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
               <DialogTitle className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                 <LayoutGrid className="h-6 w-6 text-blue-600" />
                 {editingId ? "Edit Opportunity" : "New Sales Opportunity"}
               </DialogTitle>
               <DialogDescription className="text-sm font-medium text-slate-500 mt-1">
                 Configure your deal details for tracking and forecasting.
               </DialogDescription>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar-thin">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-1">Deal Title</Label>
                    <Input 
                      required
                      placeholder="e.g. Enterprise Expansion Phase 2"
                      className="h-12 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl focus:ring-blue-500/20 px-4 font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-1">Account Name</Label>
                    <Input 
                      required
                      placeholder="Company Name"
                      className="h-11 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl px-4"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-1">Deal Value ($)</Label>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      className="h-11 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl font-mono px-4 text-blue-600"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-1">Pipeline Stage</Label>
                    <Select value={formData.pipelineStage} onValueChange={v => setFormData({ ...formData, pipelineStage: v })}>
                      <SelectTrigger className="h-11 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/10 rounded-xl">
                        {STAGES.map(s => <SelectItem key={s.id} value={s.id} className="text-xs py-2.5">{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-1">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger className="h-11 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#1C1F26] border-slate-200 dark:border-white/10 rounded-xl">
                        {PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs py-2.5">{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl px-6 font-bold text-slate-500 h-11">Cancel</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-11 font-bold shadow-lg"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnalyticsCard({ title, value, trend, trendColor, isValue }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-5 bg-white dark:bg-[#1C1F26] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm space-y-3 group transition-all"
    >
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 group-hover:text-blue-600 transition-colors">{title}</p>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className={cn("text-2xl font-bold tracking-tight text-slate-800 dark:text-white", isValue && "font-mono tracking-tighter italic text-xl")}>{value}</h3>
        <div className={cn("text-[10px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-lg", 
          trendColor === "emerald" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : 
          trendColor === "orange" ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10" : 
          "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
        )}>
          {trendColor === "rose" ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", trendColor === 'rose' ? 'bg-rose-500' : 'bg-emerald-500')} style={{ width: '70%', opacity: 0.3 }} />
      </div>
    </motion.div>
  );
}

function KanbanColumn({ stage, leads, openModal }: any) {
  const { setNodeRef } = useSortable({ id: stage.id, data: { type: "Column", stage } });
  const totalValue = leads.reduce((sum: number, l: any) => sum + (l.value || 0), 0);

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[320px] flex flex-col h-full bg-slate-100/50 dark:bg-[#1C1F26]/40 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm relative group/column">
      {/* Header - Sticky */}
      <div className="p-5 flex items-center justify-between bg-white dark:bg-[#1C1F26] border-b border-slate-200 dark:border-white/5 sticky top-0 z-20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", stage.color)} />
            <span className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider">{stage.name}</span>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border-none font-mono text-[9px] h-4.5 px-1.5">{leads.length}</Badge>
          </div>
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono tracking-tighter">
            ${(totalValue / 1000).toFixed(1)}k
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg opacity-0 group-hover/column:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar-thin max-h-[calc(100vh-320px)] min-h-[400px]">
        <SortableContext items={leads.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead: any) => (
            <SortableDealCard key={lead.id} lead={lead} openModal={openModal} stageAccent={stage.accent} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
            <SearchCheck className="h-8 w-8 text-slate-300" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Deals</p>
          </div>
        )}

        <Button 
          onClick={() => openModal({ pipelineStage: stage.id })}
          variant="ghost" 
          className="w-full border-2 border-dashed border-slate-200 dark:border-white/5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/5 h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest gap-2 transition-all mt-2"
        >
          <Plus className="h-4 w-4" />
          Add Deal
        </Button>
      </div>
    </div>
  );
}

function SortableDealCard({ lead, openModal, stageAccent }: any) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { type: "Deal", lead },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard lead={lead} openModal={openModal} isDragging={isDragging} stageAccent={stageAccent} />
    </div>
  );
}

function DealCard({ lead, openModal, isDragging, stageAccent }: any) {
  const progressMap: Record<string, number> = { "New": 15, "Contacted": 30, "Qualified": 50, "Proposal": 70, "Negotiation": 90, "Won": 100, "Lost": 100 };
  const progress = progressMap[lead.pipelineStage] || 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "p-5 bg-white dark:bg-[#211c1f] border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm group cursor-grab relative overflow-hidden transition-all duration-300",
        isDragging && "opacity-50 grayscale cursor-grabbing scale-95 shadow-none",
        lead.pipelineStage === 'Won' && "border-emerald-500/20 shadow-emerald-500/5 shadow-inner",
      )}
      onClick={() => openModal(lead)}
    >
      <div className="absolute top-0 right-0">
        <div className="h-10 w-10 bg-slate-50 dark:bg-white/[0.02] rounded-bl-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <Edit2 className="h-3 w-3 text-blue-500" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1 pr-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{lead.title}</h4>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lead.companyName}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge className={cn(
              "text-[9px] font-bold uppercase px-1.5 py-0 border-none rounded-md tracking-tighter h-4.5 flex items-center",
              lead.priority === 'Urgent' ? "bg-red-100 text-red-600" : 
              lead.priority === 'High' ? "bg-amber-100 text-amber-600" :
              "bg-slate-100 dark:bg-white/10 text-slate-500"
            )}>
              {lead.priority}
            </Badge>
            <span className="text-[10px] font-bold text-slate-400 italic tracking-tighter uppercase font-mono">{lead.source}</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white font-mono tracking-tighter">
            ${(lead.value || 0).toLocaleString()}
          </span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase italic">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3 text-blue-500 opacity-50" />
              {lead.expectedCloseDate ? new Date(lead.expectedCloseDate).toLocaleDateString() : "PENDING"}
            </div>
            <span className="text-blue-500">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn("h-full rounded-full transition-all duration-1000 bg-blue-600", lead.pipelineStage === 'Won' ? "bg-emerald-500" : "bg-blue-600")} 
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-2">
             <Avatar className="h-6 w-6 border-2 border-white dark:border-white/10 shadow-sm">
               <AvatarFallback className="text-[8px] bg-slate-100 dark:bg-white/10 text-blue-600 font-bold">
                 {lead.assignedUser ? `${lead.assignedUser.firstName?.[0]}${lead.assignedUser.lastName?.[0]}` : "U"}
               </AvatarFallback>
             </Avatar>
             <div className="flex flex-col -space-y-0.5">
               <span className="text-[10px] font-bold text-slate-700 dark:text-white italic leading-none">
                 {lead.assignedUser ? `${lead.assignedUser.firstName} ${lead.assignedUser.lastName}` : "UNASSIGNED"}
               </span>
               <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">AGENT</span>
             </div>
          </div>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
               <Mail className="h-3.5 w-3.5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
               <Phone className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
