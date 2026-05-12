import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  LayoutGrid, 
  List, 
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
  ExternalLink,
  Loader2,
  ChevronRight,
  Zap,
  ArrowRight,
  GripVertical
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  defaultDropAnimationSideEffects,
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
  { id: "New", name: "New", color: "from-blue-500 to-blue-600" },
  { id: "Contacted", name: "Contacted", color: "from-indigo-500 to-indigo-600" },
  { id: "Qualified", name: "Qualified", color: "from-cyan-500 to-cyan-600" },
  { id: "Proposal", name: "Proposal", color: "from-purple-500 to-purple-600" },
  { id: "Negotiation", name: "Negotiation", color: "from-amber-500 to-amber-600" },
  { id: "Won", name: "Won", color: "from-emerald-500 to-emerald-600" },
  { id: "Lost", name: "Lost", color: "from-red-500 to-red-600" },
];

export default function LeadsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLead, setActiveLead] = useState<any>(null);

  const filterStage = searchParams.get("stage");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads', { 
        limit: 100, 
        search,
        pipelineStage: filterStage ? filterStage.charAt(0).toUpperCase() + filterStage.slice(1) : undefined
      });
      if (response.success && response.data) {
        setLeads(response.data.items || []);
      }
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, filterStage]);

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.pipelineStage === stageId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  const moveStage = async (leadId: string, newStage: string) => {
    try {
      const response = await api.patch(`/leads/${leadId}/stage`, { 
        pipelineStage: newStage,
        sortOrder: 0 // Default to top when manually triggered via menu
      });
      if (response.success) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipelineStage: newStage, sortOrder: 0 } : l));
        toast.success(`Lead moved to ${newStage}`);
      }
    } catch (error) {
      toast.error("Failed to update lead stage");
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await api.delete(`/leads/${id}`);
      if (response.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
        toast.success("Lead deleted");
      }
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  // DND Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    setActiveLead(lead);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveInLeads = leads.some((l) => l.id === activeId);
    const isOverInLeads = leads.some((l) => l.id === overId);
    const isOverAColumn = STAGES.some((s) => s.id === overId);

    if (!isActiveInLeads) return;

    // Dragging over another card
    if (isOverInLeads) {
      setLeads((prev) => {
        const activeIndex = prev.findIndex((l) => l.id === activeId);
        const overIndex = prev.findIndex((l) => l.id === overId);
        const activeItem = prev[activeIndex];
        const overItem = prev[overIndex];

        if (activeItem.pipelineStage !== overItem.pipelineStage) {
          const newLeads = [...prev];
          newLeads[activeIndex] = { ...activeItem, pipelineStage: overItem.pipelineStage };
          return arrayMove(newLeads, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Dragging over a column (empty area)
    if (isOverAColumn) {
      setLeads((prev) => {
        const activeIndex = prev.findIndex((l) => l.id === activeId);
        const activeItem = prev[activeIndex];
        const newLeads = [...prev];
        newLeads[activeIndex] = { ...activeItem, pipelineStage: overId as string };
        return newLeads;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newStage = lead.pipelineStage;
    
    // Calculate new order
    const stageItems = leads.filter(l => l.pipelineStage === newStage);
    const newOrder = stageItems.findIndex(l => l.id === leadId);

    try {
      // Optimistic set is already done in DragOver/DragEnd local state
      // Now persist to DB
      await api.patch(`/leads/${leadId}/stage`, {
        pipelineStage: newStage,
        sortOrder: newOrder
      });
      toast.success("Pipeline updated");
    } catch (error) {
      toast.error("Failed to sync pipeline");
      fetchLeads(); // Revert on failure
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Loading Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Leads Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track your sales opportunities through the funnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button 
            onClick={() => navigate('/sales/leads/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Lead</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-lg">
           <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center border border-blue-100 dark:border-blue-600/20">
             <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">Open Pipeline</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">{leads.length} Leads</p>
           </div>
        </Card>
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-lg">
           <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-600/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-600/20">
             <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">Won This View</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                ${leads.filter(l => l.pipelineStage === 'Won').reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
             </p>
           </div>
        </Card>
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-lg">
           <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-600/20">
             <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">Visible Value</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                ${leads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
             </p>
           </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search leads by title or company..." 
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("flex-1 md:flex-none h-9 px-4 rounded-lg font-bold text-xs gap-2 transition-all", viewMode === "kanban" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400")}
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("flex-1 md:flex-none h-9 px-4 rounded-lg font-bold text-xs gap-2 transition-all", viewMode === "list" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400")}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
        <Button variant="outline" className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-bold w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          Filters
        </Button>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto h-[calc(100vh-340px)] min-h-[500px] lead-kanban-scroll pb-4">
            {STAGES.map(stage => (
              <KanbanColumn 
                key={stage.id} 
                stage={stage} 
                leads={getLeadsByStage(stage.id)} 
                navigate={navigate}
                moveStage={moveStage}
                deleteLead={deleteLead}
              />
            ))}
          </div>
          <DragOverlay>
            {activeLead ? (
              <LeadCard 
                lead={activeLead} 
                className="opacity-90 shadow-2xl scale-105 border-blue-500 border-2" 
                isDragging 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4">Lead Details</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Potential</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{lead.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <Briefcase className="h-3 w-3 text-slate-400" />
                           <p className="text-[10px] text-slate-400 font-medium">{lead.companyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none",
                        lead.pipelineStage === "Won" ? "bg-emerald-50 text-emerald-600" : 
                        lead.pipelineStage === "Lost" ? "bg-red-50 text-red-600" :
                        "bg-blue-50 text-blue-600"
                      )}>
                        {lead.pipelineStage}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 h-5 border-slate-200 dark:border-white/10 text-slate-500">
                        {lead.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100 font-mono italic">
                         ${(lead.value || 0).toLocaleString()}
                       </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarFallback className="text-[8px] bg-slate-100 dark:bg-white/10 text-slate-600">
                             {lead.assignedUser ? `${lead.assignedUser.firstName?.[0]}${lead.assignedUser.lastName?.[0]}` : "?"}
                           </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {lead.assignedUser ? `${lead.assignedUser.firstName} ${lead.assignedUser.lastName}` : "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 group-hover">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// Sub-components for Kanban
function KanbanColumn({ stage, leads, navigate, moveStage, deleteLead }: any) {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: {
      type: "Column",
      stage,
    },
  });

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[300px] flex flex-col h-full">
      <div className={cn(
        "p-3 rounded-t-2xl border-x border-t border-slate-100 dark:border-white/5 bg-gradient-to-r flex items-center justify-between",
        stage.color,
        "text-white shadow-md relative z-10"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider">{stage.name}</span>
          <Badge className="bg-white/20 text-white border-none h-5 px-1.5 text-[10px] font-mono">{leads.length}</Badge>
        </div>
        <MoreHorizontal className="h-4 w-4 opacity-70" />
      </div>
      <div className="flex-1 bg-slate-50/50 dark:bg-white/5 rounded-b-2xl border-x border-b border-slate-100 dark:border-white/5 p-3 space-y-3 overflow-y-auto custom-scrollbar shadow-inner min-h-[150px]">
        <SortableContext items={leads.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead: any) => (
            <SortableLeadCard 
              key={lead.id} 
              lead={lead} 
              navigate={navigate} 
              moveStage={moveStage} 
              deleteLead={deleteLead} 
            />
          ))}
        </SortableContext>
        <Button 
          onClick={() => navigate('/sales/leads/new')}
          variant="ghost" 
          className="w-full border-2 border-dashed border-slate-100 dark:border-white/5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/5 h-10 text-xs font-bold gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>
    </div>
  );
}

function SortableLeadCard({ lead, navigate, moveStage, deleteLead }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 p-3 border-2 border-dashed border-blue-400 bg-slate-50 rounded-xl h-[140px]"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard 
        lead={lead} 
        navigate={navigate} 
        moveStage={moveStage} 
        deleteLead={deleteLead} 
      />
    </div>
  );
}

function LeadCard({ lead, navigate, moveStage, deleteLead, className, isDragging }: any) {
  return (
    <Card className={cn(
      "p-3 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-sm hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-blue-500",
      isDragging ? "cursor-grabbing" : "cursor-grab",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{lead.title}</h4>
            <div className="flex items-center gap-1">
                <p className="text-[10px] text-slate-400 font-medium">{lead.companyName}</p>
            </div>
          </div>
          <div onPointerDown={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl overflow-hidden shadow-premium p-1.5 border-slate-100">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-2 py-1.5 tracking-widest">Management</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/sales/leads/${lead.id}/edit`)} className="rounded-lg text-xs font-bold gap-2 py-2.5">
                    <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit Details
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="bg-slate-50 mx-1 my-1.5" />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-2 py-1.5 tracking-widest">Pipeline Actions</DropdownMenuLabel>
                  
                  {STAGES.map(stage => (
                    <DropdownMenuItem 
                      key={stage.id}
                      onClick={() => moveStage(lead.id, stage.id)}
                      className={cn(
                        "rounded-lg text-xs font-bold gap-2 py-2.5",
                        lead.pipelineStage === stage.id ? "bg-slate-50 text-blue-600" : ""
                      )}
                    >
                      <ArrowRight className={cn("h-3.5 w-3.5", lead.pipelineStage === stage.id ? "text-blue-600" : "text-slate-300")} />
                      Move to {stage.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-50 mx-1 my-1.5" />
                <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="rounded-lg text-xs font-bold gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 py-2.5 focus:bg-red-50 focus:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="outline" className={cn(
          "text-[9px] font-bold uppercase py-0 px-1.5 h-4 tracking-tighter border-none",
          lead.priority === "Urgent" ? "bg-red-50 text-red-600" :
          lead.priority === "High" ? "bg-orange-50 text-orange-600" :
          "bg-blue-50 text-blue-600"
        )}>
          {lead.priority}
        </Badge>
        <Badge variant="secondary" className="text-[9px] font-bold bg-slate-100 text-slate-500 dark:bg-white/5 h-4 py-0 px-1.5 uppercase">{lead.source}</Badge>
        <Badge className="bg-blue-600 text-white text-[9px] h-4 py-0 px-1.5 border-none font-bold font-mono tracking-tighter">
          ${(lead.value || 0).toLocaleString()}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-4 w-4 border border-white dark:border-white/10">
            <AvatarFallback className="text-[8px] bg-blue-600 text-white">
              {lead.assignedUser ? `${lead.assignedUser.firstName?.[0]}${lead.assignedUser.lastName?.[0]}` : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {lead.assignedUser ? `${lead.assignedUser.firstName} ${lead.assignedUser.lastName}` : "Unassigned"}
          </span>
        </div>
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
           {lead.pipelineStage !== "Won" && lead.pipelineStage !== "Lost" ? (
             <>
               <Button size="icon" variant="ghost" className="h-5 w-5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md" onClick={() => moveStage(lead.id, "Won")}>
                 <CheckCircle2 className="h-3 w-3" />
               </Button>
               <Button size="icon" variant="ghost" className="h-5 w-5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md" onClick={() => moveStage(lead.id, "Lost")}>
                 <XCircle className="h-3 w-3" />
               </Button>
             </>
           ) : (
             <Badge variant="outline" className={cn(
               "text-[9px] font-bold uppercase h-4 px-1 border-none",
               lead.pipelineStage === "Won" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
             )}>
               {lead.pipelineStage}
             </Badge>
           )}
        </div>
      </div>
    </Card>
  );
}
