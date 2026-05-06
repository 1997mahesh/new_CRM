import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Users,
  CheckSquare,
  Columns,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const GROUPS = [
  { id: 1, name: "Sales Team", color: "bg-blue-500", members: ["SJ", "MR", "JD"], todos: 12, description: "Main workspace for sales pipeline tracking." },
  { id: 2, name: "Marketing", color: "bg-purple-500", members: ["SJ", "AL", "KB", "TR"], todos: 8, description: "Content planning and social media tasks." },
  { id: 3, name: "Development", color: "bg-emerald-500", members: ["JD", "SK"], todos: 15, description: "Bug tracking and feature releases." },
  { id: 4, name: "Finance", color: "bg-indigo-500", members: ["MR"], todos: 4, description: "Budgeting and recurring payments." },
  { id: 5, name: "Personal", color: "bg-amber-500", members: ["SJ"], todos: 6, description: "Private tasks and reminders." },
  { id: 6, name: "Product Support", color: "bg-cyan-500", members: ["AL", "KB"], todos: 20, description: "Customer tickets and feedback loop." },
];

export default function TodoGroups() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Todo Groups</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Organise todos into shared workspaces for teams.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Columns className="h-4 w-4 text-slate-400" />
            <span>Columns</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>New Group</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search groups..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Group Name</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Todos</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {GROUPS.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-2.5 w-2.5 rounded-full ring-4 ring-opacity-20", group.color.replace('bg-', 'ring-'), group.color)}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{group.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{group.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex -space-x-2">
                      {group.members.map((member, i) => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-white dark:border-[#211c1f] shadow-sm">
                          <AvatarFallback className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members.length > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-white dark:border-[#211c1f] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[8px] font-bold text-slate-400">
                          +{group.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-tight">{group.todos} Tasks</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-6 of 12 groups</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
