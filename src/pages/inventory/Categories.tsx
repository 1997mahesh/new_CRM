import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Layers,
  Edit2,
  Trash2,
  Search as SearchIcon,
  Columns,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // In a real app we'd have a POST for categories too
      // For now we assume the backend handles it or we'll focus on listing.
      // Assuming api.post works for /inventory/categories
      const res = await api.post("/inventory/categories", form);
      if (res.error) throw new Error(res.error);
      
      toast.success("Category created");
      setIsModalOpen(false);
      setForm({ name: "", description: "" });
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const COLORS = ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Organize your products into logical groups for better management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic">
                    <Plus className="h-4 w-4" />
                    <span>New Category</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="italic font-bold">New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 py-4">
                   <div className="space-y-2">
                       <Label htmlFor="catName">Category Name</Label>
                       <Input id="catName" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Peripherals" required />
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor="catDesc">Description</Label>
                       <Input id="catDesc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
                   </div>
                   <DialogFooter className="pt-4">
                       <Button type="submit" disabled={saving} className="bg-indigo-600 w-full font-bold italic">
                           {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                           Create Category
                       </Button>
                   </DialogFooter>
                </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           <Input 
            placeholder="Search category names..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" 
           />
        </div>
        <Button variant="outline" onClick={fetchCategories} disabled={loading} size="icon" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
           <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[800px]">
           <thead>
             <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Total Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
             {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="p-6"><RefreshCw className="h-4 w-4 animate-spin mx-auto" /></td></tr>
                ))
             ) : filteredCategories.map((c, idx) => (
               <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                 <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                     <div className={cn("h-10 w-10 flex items-center justify-center text-white rounded-xl shadow-premium italic font-bold text-[10px]", COLORS[idx % COLORS.length])}>
                        {c.name.charAt(0)}
                     </div>
                     <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{c.name}</span>
                   </div>
                 </td>
                 <td className="px-6 py-5">
                   <p className="max-w-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{c.description || "No description provided."}</p>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <Badge className="text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic bg-emerald-50 text-emerald-600">
                     Active
                   </Badge>
                 </td>
                 <td className="px-6 py-5 text-center">
                   <div className="flex flex-col items-center gap-0.5">
                      <span className="text-base font-bold text-slate-900 dark:text-white font-mono tracking-tighter italic">{c._count?.products || 0}</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Units</p>
                   </div>
                 </td>
                 <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 dark:hover:bg-red-600/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                 </td>
               </tr>
             ))}
             {filteredCategories.length === 0 && !loading && (
                 <tr><td colSpan={5} className="p-12 text-center text-slate-400 italic text-sm">No categories found.</td></tr>
             )}
           </tbody>
         </table>
      </Card>
    </div>
  );
}
