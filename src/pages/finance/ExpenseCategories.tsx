import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Cloud, 
  Megaphone, 
  Briefcase, 
  Users, 
  Globe, 
  Plane,
  MoreVertical,
  Layers,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  Infrastructure: Cloud,
  Marketing: Megaphone,
  Office: Briefcase,
  Payroll: Users,
  Software: Globe,
  Travel: Plane,
  Other: Layers
};

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", color: "#3b82f6", icon: "Other" });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      if (response.success) setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.name) return;
    try {
      const response = await api.post('/categories', { ...newCategory, type: 'expense' });
      if (response.success) {
        toast.success("Category created");
        setIsAddOpen(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      if (response.success) {
        toast.success("Category deleted");
        fetchCategories();
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Expense Categories</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage and organize your business expense types.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium font-bold uppercase tracking-widest text-xs">Synchronizing categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = ICON_MAP[category.icon] || Layers;
            return (
              <Card key={category.id} className="border-none shadow-soft hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: category.color || '#cbd5e1' }} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-opacity-80 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-5 w-5" style={{ color: category.color || '#64748b' }} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">{category.name}</CardTitle>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Linked Category</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={cn(
                      "border-none rounded-full px-2 py-0 text-[10px] font-bold uppercase",
                      category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                        {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color || '#cbd5e1' }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Color: {category.color || '#CBD5E1'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                          <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(category.id)}
                        variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg"
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                </CardContent>
              </Card>
            );
          })}
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all duration-300 group bg-transparent"
          >
            <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:rotate-90 transition-all duration-500">
                <Plus className="h-6 w-6" />
            </div>
            <p className="font-bold text-sm">Create New Category</p>
          </button>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Add Category</DialogTitle>
            <DialogDescription>Define a new segment for your expenses</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input 
                value={newCategory.name}
                onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="e.g., Marketing, Logistics" className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme Color</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    type="color"
                    value={newCategory.color}
                    onChange={e => setNewCategory({...newCategory, color: e.target.value})}
                    className="h-10 w-10 p-0 border-none bg-transparent" 
                  />
                  <span className="text-xs font-mono text-slate-400">{newCategory.color}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input value="Expense" disabled className="rounded-xl bg-slate-100 border-none opacity-50" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8">Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
