import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical,
  Calendar,
  Tag,
  Loader2,
  Database,
  AlertTriangle
} from "lucide-react";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Todo {
  id: string;
  task: string;
  status: string;
  priority: string;
  dueDate: string;
  groupId: string;
  assignedTo: string;
}

export function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    setError(null);
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoData: Todo[] = [];
      snapshot.forEach((doc) => {
        todoData.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todoData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(err);
      setError("Insufficient permissions to view tasks. Please contact your administrator.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTodo = async (todo: Todo) => {
    const newStatus = todo.status === "Completed" ? "Pending" : "Completed";
    const todoRef = doc(db, "todos", todo.id);
    try {
      await updateDoc(todoRef, { status: newStatus });
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `todos/${todo.id}`);
    }
  };

  const seedData = async () => {
    if (!user) return;
    const initialTodos = [
      { task: "Follow up with TechFlow about proposal", status: "In Progress", priority: "High", dueDate: "2026-05-10", groupId: "Sales", assignedTo: user.uid },
      { task: "Review quarterly financial report", status: "Pending", priority: "Medium", dueDate: "2026-05-15", groupId: "Finance", assignedTo: user.uid },
      { task: "Update laptop inventory list", status: "Completed", priority: "Low", dueDate: "2026-05-05", groupId: "Inventory", assignedTo: user.uid },
    ];

    try {
      for (const todo of initialTodos) {
        await addDoc(collection(db, "todos"), {
          ...todo,
          createdAt: serverTimestamp()
        });
      }
      toast.success("Sample tasks added successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "todos");
    }
  };

  const filteredTodos = todos.filter(t => 
    t.task.toLowerCase().includes(search.toLowerCase()) ||
    t.groupId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Tasks & Management</h1>
          <p className="text-sm text-slate-500">Global task list and activity tracking system.</p>
        </div>

        <div className="flex items-center gap-3">
          {todos.length === 0 && !loading && (
            <Button variant="outline" onClick={seedData} className="rounded-lg border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200">
               <Database className="h-4 w-4 mr-2" /> Seed Database
            </Button>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Create Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded-xl shadow-soft border border-slate-200">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search tasks or groups..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-0" 
          />
        </div>
        <Tabs value={view} onValueChange={setView} className="bg-slate-100 p-1 rounded-lg">
           <TabsList className="bg-transparent h-8">
             <TabsTrigger value="list" className="rounded-md h-full text-xs">List View</TabsTrigger>
             <TabsTrigger value="kanban" className="rounded-md h-full text-xs">Kanban</TabsTrigger>
           </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Connecting to secure database...</p>
          </div>
        ) : error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-red-500 gap-2 bg-red-50 rounded-3xl border-2 border-dashed border-red-100">
            <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
            <p className="text-sm font-bold uppercase tracking-tight">Access Restricted</p>
            <p className="text-xs font-medium text-red-400">{error}</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 gap-2 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <CheckCircle2 className="h-10 w-10 text-slate-100 mb-2" />
            <p className="text-sm font-medium">No tasks found. Relax or create one!</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <Card key={todo.id} className="border-none shadow-soft hover:shadow-premium transition-all duration-300 group">
              <CardContent className="p-4 flex items-center gap-4">
                <Checkbox 
                  className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" 
                  checked={todo.status === "Completed"} 
                  onCheckedChange={() => toggleTodo(todo)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={cn(
                      "text-sm font-semibold text-slate-800 truncate",
                      todo.status === "Completed" && "line-through text-slate-400"
                    )}>
                      {todo.task}
                    </h4>
                    <Badge className={cn(
                      "text-[10px] leading-none py-0.5 border-none",
                      todo.priority === "High" ? "bg-red-50 text-red-500" : 
                      todo.priority === "Medium" ? "bg-blue-50 text-blue-600" : 
                      "bg-slate-100 text-slate-500"
                    )}>
                      {todo.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{todo.groupId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {todo.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border-slate-200",
                    todo.status === "In Progress" ? "bg-blue-50 text-blue-600 border-blue-100" : 
                    todo.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                    "bg-slate-50 text-slate-500"
                  )}>
                     {todo.status === "In Progress" && <Clock className="h-2.5 w-2.5 mr-1 inline" />}
                     {todo.status === "Completed" && <CheckCircle2 className="h-2.5 w-2.5 mr-1 inline" />}
                     {todo.status === "Pending" && <Circle className="h-2.5 w-2.5 mr-1 inline" />}
                     {todo.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:opacity-100 opacity-0 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
