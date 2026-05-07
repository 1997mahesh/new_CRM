import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Users as UsersIcon,
  CheckSquare,
  Columns,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Blue", value: "blue" },
  { name: "Purple", value: "purple" },
  { name: "Emerald", value: "emerald" },
  { name: "Indigo", value: "indigo" },
  { name: "Amber", value: "amber" },
  { name: "Cyan", value: "cyan" },
  { name: "Rose", value: "rose" },
];

export default function TodoGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue"
  });

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todo-groups");
      if (res.success) setGroups(res.data);
    } catch (error) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => 
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  const handleOpenModal = (group: any = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        description: group.description || "",
        color: group.color || "blue"
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: "",
        description: "",
        color: "blue"
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!formData.name) {
      toast.error("Group name is required");
      return;
    }

    setFormLoading(true);
    try {
      let res;
      if (editingGroup) {
        res = await api.put(`/todo-groups/${editingGroup.id}`, formData);
      } else {
        res = await api.post("/todo-groups", formData);
      }

      if (res.success) {
        toast.success(editingGroup ? "Group updated" : "Group created");
        setIsModalOpen(false);
        fetchGroups();
      }
    } catch (error) {
      toast.error("Failed to save group");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure? This will delete all tasks in this group!")) return;
    try {
      const res = await api.delete(`/todo-groups/${id}`);
      if (res.success) {
        toast.success("Group deleted");
        fetchGroups();
      }
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Todo Groups</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Organise todos into shared workspaces for teams.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2"
          >
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Group Name</th>
                <th className="px-6 py-4 text-center">Todos</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No groups found.
                  </td>
                </tr>
              ) : filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-3 w-3 rounded-full ring-4 ring-opacity-20", `ring-${group.color}-500 bg-${group.color}-500`)}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{group.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{group.description || "No description provided."}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold py-0 h-5 px-2 bg-blue-50 dark:bg-white/5 text-blue-600 border-none">
                        {group._count?.todos || 0} Tasks
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => handleOpenModal(group)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteGroup(group.id)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="text-xs font-bold py-2">View Analytics</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold py-2">Archive Group</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              {editingGroup ? "Edit Team Hub" : "Create Team Hub"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Set up a shared space for collaboration.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hub Name</Label>
              <Input 
                placeholder="e.g. Sales, Marketing, Project X"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 rounded-xl border-slate-200 dark:border-white/5"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Theme Color</Label>
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setFormData({ ...formData, color: c.value })}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all ring-offset-2",
                      `bg-${c.value}-500`,
                      formData.color === c.value ? "ring-2 ring-blue-600 scale-110" : "opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Purpose/Description</Label>
              <Textarea 
                placeholder="What is this hub for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px] rounded-xl border-slate-200 dark:border-white/5"
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-100 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={handleSaveGroup}
              disabled={formLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-bold shadow-premium"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : editingGroup ? "Update Hub" : "Create Hub"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
