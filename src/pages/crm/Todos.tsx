import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical,
  Calendar,
  LayoutList,
  LayoutGrid,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TODO_GROUPS = [
  { id: "sales", name: "Sales Team", color: "border-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
  { id: "marketing", name: "Marketing", color: "border-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  { id: "development", name: "Development", color: "border-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "personal", name: "Personal", color: "border-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
];

const INITIAL_TODOS = [
  { id: "1", title: "Follow up with TechFlow about proposal", group: "Sales Team", status: "Pending", priority: "High", dueDate: "2026-05-10", desc: "Discussion about the cloud migration services.", overdue: true },
  { id: "2", title: "Prepare weekly marketing report", group: "Marketing", status: "In Progress", priority: "Medium", dueDate: "2026-05-08", desc: "Gather stats from Facebook and Google Ads.", overdue: false },
  { id: "3", title: "Fix bug in customer dashboard", group: "Development", status: "Completed", priority: "High", dueDate: "2026-05-05", desc: "The chart resize issue on mobile.", overdue: false },
  { id: "4", title: "Review quarterly financial report", group: "Sales Team", status: "Pending", priority: "Medium", dueDate: "2026-05-15", desc: "Draft for the board meeting.", overdue: false },
  { id: "5", title: "Update laptop inventory list", group: "Development", status: "Pending", priority: "Low", dueDate: "2026-05-20", desc: "Verify serial numbers for new batch.", overdue: false },
];

export default function CRM_Todos() {
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Sales Team", "Marketing", "Development"]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  const getStatusCount = (status: string) => {
    return INITIAL_TODOS.filter(t => t.status.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Todos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage tasks, track progress, collaborate with your team.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0 rounded-md", view === "list" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400")}
              onClick={() => setView("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0 rounded-md", view === "grid" ? "bg-white dark:bg-white/10 shadow-sm" : "text-slate-400")}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New Todo</span>
          </Button>
        </div>
      </div>

      {/* Goal Banner */}
      <Card className="bg-white dark:bg-[#211c1f] border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 leading-none uppercase tracking-widest flex items-center gap-2">
              Daily productivity goal
              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] h-4">Active</Badge>
            </h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">You're making great progress!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete 3 more tasks to reach your daily goal of 8 tasks.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-white/5" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="175" strokeDashoffset={175 - (175 * 0.65)} className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                  65%
                </div>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Efficiency</p>
               <p className="text-xl font-bold text-slate-800 dark:text-slate-100">+12%</p>
             </div>
          </div>
        </div>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" 
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              <Filter className="h-4 w-4 text-slate-400" />
              Priority
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
           </Button>
           <Button variant="outline" className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              Group
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
           </Button>
           <Button variant="outline" className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              Assignee
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
           </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-slate-200 dark:border-white/5 mb-6">
          <TabsList className="bg-transparent h-12 w-full justify-start gap-8 px-0">
            {[
              { id: "pending", label: "Pending", count: getStatusCount("Pending") },
              { id: "in-progress", label: "In Progress", count: getStatusCount("In Progress") },
              { id: "completed", label: "Completed", count: getStatusCount("Completed") },
              { id: "cancelled", label: "Cancelled", count: 0 },
            ].map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white transition-all h-full gap-2"
              >
                {tab.label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                  activeTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"
                )}>
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="space-y-6 pb-12">
          {TODO_GROUPS.map(group => {
            const groupTodos = INITIAL_TODOS.filter(t => t.group === group.name && (
              activeTab === "pending" ? t.status === "Pending" :
              activeTab === "in-progress" ? t.status === "In Progress" :
              activeTab === "completed" ? t.status === "Completed" : false
            ));

            if (groupTodos.length === 0) return null;

            const isExpanded = expandedGroups.includes(group.name);

            return (
              <div key={group.id} className="space-y-3">
                <button 
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                  <span className={cn("text-xs font-bold uppercase tracking-widest", group.text)}>
                    {group.name}
                  </span>
                  <span className="h-px flex-1 bg-slate-100 dark:bg-white/5 mx-2"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{groupTodos.length} Tasks</span>
                </button>

                {isExpanded && (
                  <div className="space-y-3 pl-6">
                    {groupTodos.map(todo => (
                      <Card 
                        key={todo.id} 
                        className={cn(
                          "bg-white dark:bg-[#1f1a1d] border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-soft dark:shadow-2xl transition-all hover:translate-x-1 border-l-4",
                          group.color
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox className="mt-1 h-5 w-5 rounded-md border-slate-300 dark:border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" checked={todo.status === "Completed"} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={cn(
                                "text-sm font-bold text-slate-800 dark:text-slate-100",
                                todo.status === "Completed" && "line-through text-slate-400"
                              )}>
                                {todo.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {todo.overdue && (
                                  <Badge className="bg-red-50 text-red-600 border-none text-[9px] font-bold tracking-tighter h-5 px-1.5 gap-1 uppercase">
                                    <AlertCircle className="h-2.5 w-2.5" />
                                    Overdue
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-[9px] font-bold tracking-tighter h-5 px-1.5 uppercase border-slate-200 dark:border-white/10 dark:text-slate-400">
                                  <Flag className={cn("h-2.5 w-2.5 mr-1", todo.priority === "High" ? "text-red-500 fill-red-500" : "text-blue-500 fill-blue-500")} />
                                  {todo.priority}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                  <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{todo.desc}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span className={cn("text-[10px] font-bold", todo.overdue ? "text-red-500" : "text-slate-400 dark:text-slate-500")}>
                                  Due {todo.dueDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white", group.bg.replace('bg-', 'bg-').replace('-50', '-500'))}>
                                  SJ
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Sarah Jenkins</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="ghost" className="w-full border-2 border-dashed border-slate-100 dark:border-white/5 h-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-bold gap-2 rounded-xl">
                      <Plus className="h-4 w-4" />
                      Add new task to {group.name}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {activeTab === "cancelled" && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-[#211c1f] rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5">
              <CheckCircle2 className="h-12 w-12 text-slate-100 dark:text-white/5 mb-4" />
              <p className="font-bold text-sm">No cancelled tasks!</p>
              <p className="text-xs">Your workspace is clean and organized.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
