import React, { useState, useEffect, useMemo } from "react";
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
  Flag,
  Trash2,
  Edit2,
  User,
  Clock3,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];

export default function CRM_Todos() {
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("Pending");
  const [todos, setTodos] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    priority: "all",
    groupId: "all",
    assigneeId: "all"
  });

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    dueTime: "12:00",
    groupId: "",
    assigneeIds: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todosRes, groupsRes, usersRes] = await Promise.all([
        api.get("/todos"),
        api.get("/todo-groups"),
        api.get("/users")
      ]);
      if (todosRes.success) setTodos(todosRes.data);
      if (groupsRes.success) {
        setGroups(groupsRes.data);
        setExpandedGroups(groupsRes.data.map((g: any) => g.id));
      }
      if (usersRes.success) setUsers(usersRes.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = search === "" || 
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = todo.status === activeTab;
      const matchesPriority = filters.priority === "all" || todo.priority === filters.priority;
      const matchesGroup = filters.groupId === "all" || todo.groupId === filters.groupId;
      const matchesAssignee = filters.assigneeId === "all" || todo.assignees.some((a: any) => a.id === filters.assigneeId);

      return matchesSearch && matchesStatus && matchesPriority && matchesGroup && matchesAssignee;
    });
  }, [todos, search, activeTab, filters]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === "Completed").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const counts: Record<string, number> = {
      Pending: todos.filter(t => t.status === "Pending").length,
      "In Progress": todos.filter(t => t.status === "In Progress").length,
      Completed: todos.filter(t => t.status === "Completed").length,
      Cancelled: todos.filter(t => t.status === "Cancelled").length,
    };

    return { total, completed, progress, counts };
  }, [todos]);

  const handleOpenModal = (todo: any = null) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        status: todo.status,
        dueDate: todo.dueDate ? format(new Date(todo.dueDate), "yyyy-MM-dd") : "",
        dueTime: todo.dueDate ? format(new Date(todo.dueDate), "HH:mm") : "12:00",
        groupId: todo.groupId || "",
        assigneeIds: todo.assignees.map((a: any) => a.id)
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: format(new Date(), "yyyy-MM-dd"),
        dueTime: "12:00",
        groupId: groups.length > 0 ? groups[0].id : "",
        assigneeIds: []
      });
    }
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = "Title is required";
    if (!formData.priority) errors.priority = "Priority is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (!formData.groupId) errors.groupId = "Group is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTodo = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setFormLoading(true);
    try {
      // Strip dueTime and prepare payload
      const { dueTime, ...rest } = formData;
      const payload = {
        ...rest,
        dueDate: formData.dueDate ? new Date(`${formData.dueDate}T${formData.dueTime}`) : null
      };

      console.log("Saving todo with payload:", payload);

      let res;
      if (editingTodo) {
        res = await api.put(`/todos/${editingTodo.id}`, payload);
      } else {
        res = await api.post("/todos", payload);
      }

      if (res.success) {
        toast.success(editingTodo ? "Task updated successfully" : "Task deployed successfully");
        setIsModalOpen(false);
        setFormErrors({});
        await fetchData(); // Refresh data to update UI
      } else {
        toast.error(res.error || "Failed to save task");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "An unexpected error occurred while saving");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await api.delete(`/todos/${id}`);
      if (res.success) {
        toast.success("Task deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const toggleStatus = async (todo: any) => {
    const newStatus = todo.status === "Completed" ? "Pending" : "Completed";
    try {
      const res = await api.put(`/todos/${todo.id}`, { status: newStatus });
      if (res.success) {
        toast.success(`Task marked as ${newStatus}`);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
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
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2"
          >
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You've completed {stats.completed} tasks out of {stats.total} total.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-white/5" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="175" strokeDashoffset={175 - (175 * (stats.progress / 100))} className="text-emerald-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                  {stats.progress}%
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft" 
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={filters.priority} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, priority: val }))}
          >
            <SelectTrigger className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>{filters.priority === "all" ? "Priority" : filters.priority}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {PRIORITY_OPTIONS.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.groupId} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, groupId: val }))}
          >
            <SelectTrigger className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              <span>{filters.groupId === "all" ? "Group" : (groups.find(g => g.id === filters.groupId)?.name || "Group")}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.assigneeId} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, assigneeId: val }))}
          >
            <SelectTrigger className="h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] dark:text-slate-300 rounded-xl px-4 gap-2 font-semibold">
              <span>{filters.assigneeId === "all" ? "Assignee" : (users.find(u => u.id === filters.assigneeId)?.firstName || "Assignee")}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-slate-200 dark:border-white/5 mb-6">
          <TabsList className="bg-transparent h-12 w-full justify-start gap-8 px-0">
            {STATUS_OPTIONS.map(status => (
              <TabsTrigger 
                key={status} 
                value={status}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 font-bold text-slate-500 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white transition-all h-full gap-2"
              >
                {status}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                  activeTab === status ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"
                )}>
                  {stats.counts[status] || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="space-y-6 pb-12">
          {loading ? (
             <div className="flex items-center justify-center h-48">
               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
             </div>
          ) : groups.map(group => {
            const groupTodos = filteredTodos.filter(t => t.groupId === group.id);
            if (groupTodos.length === 0) return null;
            const isExpanded = expandedGroups.includes(group.id);

            return (
              <div key={group.id} className="space-y-3">
                <button 
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center gap-2 w-full text-left group"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                  <span className={cn("text-xs font-bold uppercase tracking-widest", `text-${group.color}-600`)}>
                    {group.name}
                  </span>
                  <span className="h-px flex-1 bg-slate-100 dark:bg-white/5 mx-2"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{groupTodos.length} Tasks</span>
                </button>

                {isExpanded && (
                  <div className={cn(
                    "grid gap-4",
                    view === "list" ? "grid-cols-1 pl-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pl-6"
                  )}>
                    {groupTodos.map(todo => {
                      const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && todo.status !== "Completed";
                      
                      return (
                        <Card 
                          key={todo.id} 
                          className={cn(
                            "bg-white dark:bg-[#1f1a1d] border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-soft dark:shadow-2xl transition-all hover:translate-x-1 border-l-4",
                            todo.status === "Completed" ? "grayscale opacity-80" : "",
                            `border-l-${group.color || 'blue'}-500`
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <Checkbox 
                              className="mt-1 h-5 w-5 rounded-md" 
                              checked={todo.status === "Completed"} 
                              onCheckedChange={() => toggleStatus(todo)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={cn(
                                  "text-sm font-bold text-slate-800 dark:text-slate-100 truncate",
                                  todo.status === "Completed" && "line-through text-slate-400"
                                )}>
                                  {todo.title}
                                </h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg ml-2">
                                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-premium border-slate-100">
                                    <DropdownMenuItem onClick={() => handleOpenModal(todo)} className="gap-2 font-bold text-xs py-2.5 rounded-lg">
                                      <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleStatus(todo)} className="gap-2 font-bold text-xs py-2.5 rounded-lg">
                                      {todo.status === "Completed" ? <X className="h-3.5 w-3.5 text-orange-500" /> : <Check className="h-3.5 w-3.5 text-emerald-500" />}
                                      {todo.status === "Completed" ? "Re-open" : "Complete"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDeleteTodo(todo.id)} className="gap-2 font-bold text-xs py-2.5 rounded-lg text-red-500">
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-[9px] font-black uppercase py-0 px-1.5 h-4 tracking-tighter border-slate-200 dark:border-white/10 dark:text-slate-400">
                                  {todo.priority}
                                </Badge>
                                {isOverdue && (
                                  <Badge className="bg-red-50 text-red-600 border-none text-[9px] font-bold px-1.5 h-4">Overdue</Badge>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">{todo.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3 text-slate-400" />
                                  <span className={cn(
                                    "text-[10px] font-bold",
                                    isOverdue ? "text-red-500" : "text-slate-400 dark:text-slate-500"
                                  )}>
                                    {todo.dueDate ? format(new Date(todo.dueDate), "MMM dd, yyyy") : "No due date"}
                                  </span>
                                </div>
                                
                                <div className="flex -space-x-1.5">
                                  {todo.assignees.map((a: any) => (
                                    <div 
                                      key={a.id} 
                                      title={`${a.firstName} ${a.lastName}`}
                                      className="h-5 w-5 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-[#1f1a1d] flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300"
                                    >
                                      {a.firstName?.[0]}{a.lastName?.[0]}
                                    </div>
                                  ))}
                                  {todo.assignees.length === 0 && (
                                    <div className="h-5 w-5 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                      <User className="h-3 w-3 text-slate-300" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    <Button 
                      onClick={() => handleOpenModal()}
                      variant="ghost" 
                      className="w-full border-2 border-dashed border-slate-100 dark:border-white/5 h-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-bold gap-2 rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                      Add new task
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {!loading && Object.keys(stats.counts).length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-[#211c1f] rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5">
              <CheckCircle2 className="h-12 w-12 text-slate-100 dark:text-white/5 mb-4" />
              <p className="font-bold text-sm">No tasks found!</p>
              <p className="text-xs">Try adjusting your filters or search.</p>
            </div>
          )}
        </div>
      </Tabs>

      {/* New/Edit Todo Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              {editingTodo ? "Edit Mission" : "New Mission"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Fill in the details to coordinate with your team.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className={cn(
                  "text-[10px] font-black uppercase tracking-widest ml-1",
                  formErrors.title ? "text-red-500" : "text-slate-400"
                )}>
                  Task Title *
                </Label>
                <Input 
                  placeholder="What needs to be done?" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={cn(
                    "rounded-xl border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 h-11",
                    formErrors.title && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {formErrors.title && <p className="text-[10px] text-red-500 ml-1">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                <Textarea 
                  placeholder="Add context or notes..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={cn(
                    "text-[10px] font-black uppercase tracking-widest ml-1",
                    formErrors.priority ? "text-red-500" : "text-slate-400"
                  )}>
                    Priority *
                  </Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                    <SelectTrigger className={cn(
                      "rounded-xl border-slate-200 dark:border-white/5 h-11",
                      formErrors.priority && "border-red-500"
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={cn(
                    "text-[10px] font-black uppercase tracking-widest ml-1",
                    formErrors.status ? "text-red-500" : "text-slate-400"
                  )}>
                    Status *
                  </Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger className={cn(
                      "rounded-xl border-slate-200 dark:border-white/5 h-11",
                      formErrors.status && "border-red-500"
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={cn(
                    "text-[10px] font-black uppercase tracking-widest ml-1",
                    formErrors.dueDate ? "text-red-500" : "text-slate-400"
                  )}>
                    Due Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={cn(
                        "pl-10 rounded-xl border-slate-200 dark:border-white/5 h-11 flex-row-reverse",
                        formErrors.dueDate && "border-red-500"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Time</Label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      className="pl-10 rounded-xl border-slate-200 dark:border-white/5 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn(
                  "text-[10px] font-black uppercase tracking-widest ml-1",
                  formErrors.groupId ? "text-red-500" : "text-slate-400"
                )}>
                  Team Group *
                </Label>
                <Select 
                  value={formData.groupId} 
                  onValueChange={(val) => {
                    setFormData({ ...formData, groupId: val });
                    if (formErrors.groupId) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.groupId;
                        return next;
                      });
                    }
                  }}
                >
                  <SelectTrigger className={cn(
                    "rounded-xl border-slate-200 dark:border-white/5 h-11",
                    formErrors.groupId && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.groupId && <p className="text-[10px] text-red-500 ml-1">{formErrors.groupId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignees</Label>
                <div className="grid grid-cols-2 gap-2">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        const set = new Set(formData.assigneeIds);
                        if (set.has(u.id)) set.delete(u.id);
                        else set.add(u.id);
                        setFormData({ ...formData, assigneeIds: Array.from(set) });
                      }}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-xl border text-left transition-all",
                        formData.assigneeIds.includes(u.id) 
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20" 
                          : "border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[8px] font-bold">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="text-[11px] font-bold truncate">{u.firstName} {u.lastName}</span>
                      {formData.assigneeIds.includes(u.id) && <Check className="h-3 w-3 text-blue-600 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
             <Button 
              onClick={handleSaveTodo} 
              disabled={formLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-bold shadow-premium"
             >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingTodo ? "Save Changes" : "Deploy Task"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
