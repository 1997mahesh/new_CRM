import React, { useState } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Filter, 
  List, 
  LayoutGrid, 
  ChevronRight,
  TrendingUp,
  Target,
  Users as UsersIcon,
  DollarSign,
  Sparkles,
  Zap
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getSalesInsights } from "@/services/geminiService";

const STAGES = [
  { id: "new", title: "New", color: "bg-blue-500" },
  { id: "contacted", title: "Contacted", color: "bg-indigo-500" },
  { id: "qualified", title: "Qualified", color: "bg-purple-500" },
  { id: "proposal", title: "Proposal", color: "bg-amber-500" },
  { id: "negotiation", title: "Negotiation", color: "bg-orange-500" },
  { id: "won", title: "Won", color: "bg-emerald-500" },
  { id: "lost", title: "Lost", color: "bg-red-500" },
];

const MOCK_LEADS = [
  { id: "1", title: "Global Expansion Project", customer: "TechFlow Inc.", val: 12500, priority: "High", stage: "new", user: "Sarah J." },
  { id: "2", title: "CRM Migration", customer: "BlueSky Digital", val: 8400, priority: "Medium", stage: "contacted", user: "Mike R." },
  { id: "3", title: "Cloud Security Audit", customer: "NexGen Corp", val: 15000, priority: "High", stage: "qualified", user: "Sarah J." },
  { id: "4", title: "Data Analytics Suite", customer: "GreenField LLC", val: 22000, priority: "High", stage: "proposal", user: "Alex B." },
  { id: "5", title: "Mobile App Dev", customer: "StartUp Hub", val: 5500, priority: "Low", stage: "new", user: "Mike R." },
  { id: "6", title: "Enterprise ERP", customer: "Manufacturing Co.", val: 45000, priority: "High", stage: "negotiation", user: "Admin" },
];

export function LeadsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [insights, setInsights] = useState<{title: string, description: string}[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const data = await getSalesInsights(MOCK_LEADS);
    setInsights(data);
    setLoadingInsights(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Leads Pipeline</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Target className="h-4 w-4" />
            <span>45 Active Leads</span>
            <span className="mx-2">•</span>
            <TrendingUp className="h-4 w-4" />
            <span>Expected Value: $245,000</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl shadow-soft border border-slate-100">
            <Button 
              variant={view === "kanban" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("kanban")}
              className="rounded-lg px-3"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button 
              variant={view === "list" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("list")}
              className="rounded-lg px-3"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> New Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input placeholder="Search leads, customers, or owners..." className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
                Sort: Highest Value
              </Button>
            </div>
          </div>

          {view === "kanban" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STAGES.map((stage) => (
                <div key={stage.id} className="flex flex-col gap-4 min-w-[280px]">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{stage.title}</span>
                      <Badge variant="secondary" className="bg-slate-100 text-[10px] py-0 px-1.5 h-4 text-slate-600">
                        {MOCK_LEADS.filter(l => l.stage === stage.id).length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 p-2 space-y-3 min-h-[500px]">
                    {MOCK_LEADS.filter(l => l.stage === stage.id).map((lead) => (
                      <motion.div
                        layoutId={lead.id}
                        key={lead.id}
                        className="bg-white p-4 rounded-xl shadow-soft border border-slate-100 group cursor-grab active:cursor-grabbing hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-blue-600 mb-1">{lead.customer}</p>
                          <Badge className={cn(
                            "text-[10px] leading-none py-0.5 border-none shadow-none",
                            lead.priority === "High" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                          )}>
                            {lead.priority}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mb-4 line-clamp-2">{lead.title}</h4>
                        
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs">{lead.val.toLocaleString()}</span>
                          </div>
                          <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                            <AvatarFallback className="text-[8px] bg-blue-100 text-blue-600 font-bold">{lead.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </div>
                      </motion.div>
                    ))}
                    
                    {MOCK_LEADS.filter(l => l.stage === stage.id).length === 0 && (
                      <div className="h-20 flex items-center justify-center opacity-40">
                        <p className="text-[10px] text-slate-300 font-medium uppercase italic tracking-widest text-center">Empty Stage</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 flex items-center justify-center min-h-[400px]">
               <div className="text-center space-y-2">
                 <List className="h-8 w-8 text-slate-200 mx-auto" />
                 <p className="text-slate-400 font-medium">List view is not yet implemented.</p>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-soft bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-20 w-20" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 fill-current text-yellow-300" />
                AI Sales Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10 text-sm">
              <p className="text-blue-50 leading-relaxed opacity-90">
                Analyze pipeline data to identify stalled deals and high-potential opportunities.
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-white text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
                onClick={fetchInsights}
                disabled={loadingInsights}
              >
                {loadingInsights ? "Analyzing..." : "Generate Insights"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                >
                  <Card className="border-none shadow-soft group hover:shadow-premium transition-all">
                    <CardHeader className="p-4 pb-2">
                       <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                         {insight.title}
                       </h5>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              !loadingInsights && (
                <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                  <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Click generate for AI powered insights.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
