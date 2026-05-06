import React, { useState } from "react";
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
  ExternalLink
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "new", name: "New", color: "from-blue-500 to-blue-600" },
  { id: "contacted", name: "Contacted", color: "from-indigo-500 to-indigo-600" },
  { id: "qualified", name: "Qualified", color: "from-cyan-500 to-cyan-600" },
  { id: "proposal", name: "Proposal", color: "from-purple-500 to-purple-600" },
  { id: "negotiation", name: "Negotiation", color: "from-amber-500 to-amber-600" },
  { id: "won", name: "Won", color: "from-emerald-500 to-emerald-600" },
  { id: "lost", name: "Lost", color: "from-red-500 to-red-600" },
];

const INITIAL_LEADS = [
  { id: "1", title: "Enterprise Cloud Migration", company: "Global Trade Corp", amount: "$45,000", stage: "new", priority: "High", source: "Website", user: "Sarah Jenkins", avatar: "SJ" },
  { id: "2", title: "Digital Transformation", company: "TechFlow Solutions", amount: "$120,000", stage: "contacted", priority: "Urgent", source: "Referral", user: "Sarah Jenkins", avatar: "SJ" },
  { id: "3", title: "Supply Chain Optimization", company: "Nexa Logistics", amount: "$85,000", stage: "qualified", priority: "Normal", source: "Cold Call", user: "Mike Ross", avatar: "MR" },
  { id: "4", title: "Brand Identity Redesign", company: "Zenith Design", amount: "$12,500", stage: "proposal", priority: "Normal", source: "Partner", user: "Sarah Jenkins", avatar: "SJ" },
  { id: "5", title: "Security Infrastructure", company: "Alpha Tech", amount: "$65,000", stage: "negotiation", priority: "High", source: "Website", user: "Sarah Jenkins", avatar: "SJ" },
  { id: "6", title: "Q3 Marketing Campaign", company: "Blue Sky Media", amount: "$22,000", stage: "won", priority: "Normal", source: "Trade Show", user: "Mike Ross", avatar: "MR" },
  { id: "7", title: "ERP Implementation", company: "Prime Properties", amount: "$95,000", stage: "lost", priority: "High", source: "Cold Call", user: "Sarah Jenkins", avatar: "SJ" },
];

export function LeadsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [leads, setLeads] = useState(INITIAL_LEADS);

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  const moveStage = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
  };

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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
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
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">156 Leads</p>
           </div>
        </Card>
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-lg">
           <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-600/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-600/20">
             <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">Won This View</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">$24,500.00</p>
           </div>
        </Card>
        <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] flex items-center gap-4 transition-all hover:translate-y-[-2px] hover:shadow-lg">
           <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-600/20">
             <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">Visible Value</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">$1.24M</p>
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
        <div className="flex gap-4 overflow-x-auto h-[calc(100vh-340px)] min-h-[500px] lead-kanban-scroll pb-4">
          {STAGES.map(stage => {
            const stageLeads = getLeadsByStage(stage.id);
            return (
              <div key={stage.id} className="flex-1 min-w-[300px] flex flex-col h-full">
                <div className={cn(
                  "p-3 rounded-t-2xl border-x border-t border-slate-100 dark:border-white/5 bg-gradient-to-r flex items-center justify-between",
                  stage.color,
                  "text-white shadow-md relative z-10"
                )}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">{stage.name}</span>
                    <Badge className="bg-white/20 text-white border-none h-5 px-1.5 text-[10px] font-mono">{stageLeads.length}</Badge>
                  </div>
                  <MoreHorizontal className="h-4 w-4 opacity-70" />
                </div>
                <div className="flex-1 bg-slate-50/50 dark:bg-white/5 rounded-b-2xl border-x border-b border-slate-100 dark:border-white/5 p-3 space-y-3 overflow-y-auto custom-scrollbar shadow-inner">
                  {stageLeads.map(lead => (
                    <Card key={lead.id} className="p-3 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing border-l-4 border-l-transparent hover:border-l-blue-500">
                      <div className="flex items-start justify-between mb-3">
                         <div className="flex flex-col gap-0.5">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{lead.title}</h4>
                            <div className="flex items-center gap-1">
                               <p className="text-[10px] text-slate-400 font-medium">{lead.company}</p>
                            </div>
                         </div>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                               <MoreVertical className="h-4 w-4 text-slate-400" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-100 dark:border-white/10 dark:bg-[#1f1a1d]">
                             <DropdownMenuItem className="text-xs font-bold gap-2">
                               <Edit2 className="h-3.5 w-3.5" /> Edit Lead
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-xs font-bold gap-2 text-emerald-600" onClick={() => moveStage(lead.id, "won")}>
                               <CheckCircle2 className="h-3.5 w-3.5" /> Mark Won
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-xs font-bold gap-2 text-red-500" onClick={() => moveStage(lead.id, "lost")}>
                               <XCircle className="h-3.5 w-3.5" /> Mark Lost
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-xs font-bold gap-2 text-slate-400">
                               <Trash2 className="h-3.5 w-3.5" /> Delete
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
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
                        <Badge className="bg-blue-600 text-white text-[9px] h-4 py-0 px-1.5 border-none font-bold font-mono tracking-tighter">{lead.amount}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-4 w-4 border border-white dark:border-white/10">
                            <AvatarFallback className="text-[8px] bg-blue-600 text-white">{lead.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{lead.user}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           {lead.stage !== "won" && lead.stage !== "lost" ? (
                             <>
                               <Button size="icon" variant="ghost" className="h-5 w-5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md" onClick={() => moveStage(lead.id, "won")}>
                                 <CheckCircle2 className="h-3 w-3" />
                               </Button>
                               <Button size="icon" variant="ghost" className="h-5 w-5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md" onClick={() => moveStage(lead.id, "lost")}>
                                 <XCircle className="h-3 w-3" />
                               </Button>
                             </>
                           ) : (
                             <Badge variant="outline" className={cn(
                               "text-[9px] font-bold uppercase h-4 px-1 border-none",
                               lead.stage === "won" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                             )}>
                               {lead.stage}
                             </Badge>
                           )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="ghost" className="w-full border-2 border-dashed border-slate-100 dark:border-white/5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-white/5 h-10 text-xs font-bold gap-2 rounded-xl">
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
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
                           <p className="text-[10px] text-slate-400 font-medium">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none",
                        lead.stage === "won" ? "bg-emerald-50 text-emerald-600" : 
                        lead.stage === "lost" ? "bg-red-50 text-red-600" :
                        "bg-blue-50 text-blue-600"
                      )}>
                        {lead.stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 h-5 border-slate-200 dark:border-white/10 text-slate-500">
                        {lead.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100 font-mono italic">{lead.amount}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarFallback className="text-[8px] bg-slate-100 dark:bg-white/10 text-slate-600">{lead.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{lead.user}</span>
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
