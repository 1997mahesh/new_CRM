import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Layers,
  Edit2,
  Trash2,
  Search as SearchIcon,
  Columns,
  RefreshCw,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Hash,
  Package,
  Calendar,
  ChevronRight,
  Info
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
    DialogFooter,
    DialogDescription
  } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
  "Active": { label: "Active", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400", icon: CheckCircle },
  "Inactive": { label: "Inactive", color: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400", icon: XCircle },
};

const COLUMN_KEYS = [
  { key: "categoryInfo", label: "Category Info" },
  { key: "slug", label: "Slug" },
  { key: "productsCount", label: "Products Count" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created Date" },
  { key: "actions", label: "Actions" }
];

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ 
    id: "",
    name: "", 
    slug: "",
    description: "",
    status: "Active"
  });

  // Columns Visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("category_columns");
    return saved ? JSON.parse(saved) : COLUMN_KEYS.map(c => c.key);
  });

  useEffect(() => {
    localStorage.setItem("category_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/inventory/categories?search=${searchTerm}`);
      setCategories(res.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setForm({ id: "", name: "", slug: "", description: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setIsEditMode(true);
    setForm({ 
      id: category.id,
      name: category.name, 
      slug: category.slug || "",
      description: category.description || "",
      status: category.status || "Active"
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("Category name is required");

    try {
      setSaving(true);
      if (isEditMode) {
        const res = await api.put(`/inventory/categories/${form.id}`, form);
        if (res.error) throw new Error(res.error);
        toast.success("Category updated successfully");
      } else {
        const res = await api.post("/inventory/categories", form);
        if (res.error) throw new Error(res.error);
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setSaving(true);
      const res = await api.delete(`/inventory/categories/${categoryToDelete.id}`);
      if (res.error) throw new Error(res.error);
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  const COLORS = ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-500'];
  const isVisible = (key: string) => visibleColumns.includes(key);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-black italic uppercase tracking-tight text-slate-800 dark:text-slate-100">Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic tracking-wide">Manage product categories and organizational hierarchy.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 px-6 rounded-xl shadow-premium gap-2 tracking-widest uppercase text-[10px]"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           <Input 
            placeholder="Search category name, slug, description..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-bold italic" 
           />
           {loading && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] gap-2 font-black text-[10px] uppercase tracking-widest italic">
                <Columns className="h-4 w-4 text-slate-400" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl dark:bg-[#1f1a1d] dark:border-white/10 shadow-2xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-2">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLUMN_KEYS.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="rounded-lg text-xs font-bold py-2 italic"
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setVisibleColumns(COLUMN_KEYS.map(c => c.key))}
                  className="rounded-lg text-[10px] font-black uppercase tracking-widest py-2 text-center justify-center text-indigo-600 focus:text-indigo-600"
                >
                  Reset Defaults
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchCategories} 
            disabled={loading} 
            className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]"
          >
            <RefreshCw className={cn("h-4 w-4 text-slate-400", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden overflow-x-auto">
         <table className="w-full text-left min-w-[900px]">
           <thead>
             <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {isVisible("categoryInfo") && <th className="px-6 py-4 italic">Category Details</th>}
                {isVisible("slug") && <th className="px-6 py-4 italic">Slug</th>}
                {isVisible("productsCount") && <th className="px-6 py-4 text-center italic">Products</th>}
                {isVisible("status") && <th className="px-6 py-4 text-center italic">Status</th>}
                {isVisible("createdAt") && <th className="px-6 py-4 italic">Created Date</th>}
                {isVisible("actions") && <th className="px-6 py-4 text-right italic">Actions</th>}
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-white/5">
             {loading && categories.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-full"></div></td>
                    </tr>
                ))
             ) : categories.map((c, idx) => (
               <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-default">
                 {isVisible("categoryInfo") && (
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 flex items-center justify-center text-white rounded-2xl shadow-lg italic font-black text-sm transition-transform group-hover:scale-110 duration-300", 
                        COLORS[idx % COLORS.length]
                      )}>
                         {c.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100 italic tracking-tight">{c.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1 italic max-w-[200px]">{c.description || "No description provided."}</span>
                      </div>
                    </div>
                  </td>
                 )}
                 {isVisible("slug") && (
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono italic">
                      <Hash className="h-3 w-3 opacity-50" />
                      {c.slug}
                    </div>
                  </td>
                 )}
                 {isVisible("productsCount") && (
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-0.5 group/count">
                       <span className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tighter italic group-hover/count:text-indigo-600 transition-colors">{c._count?.products || 0}</span>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic group-hover/count:text-slate-500">Products</p>
                    </div>
                  </td>
                 )}
                 {isVisible("status") && (
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <Badge variant="outline" className={cn(
                         "text-[8px] font-black uppercase tracking-widest px-2.5 h-6 border-none italic shadow-sm", 
                         (STATUS_CONFIG[c.status || "Active"]).color
                       )}>
                         {c.status || "Active"}
                       </Badge>
                    </div>
                  </td>
                 )}
                 {isVisible("createdAt") && (
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-[10px] font-mono italic uppercase tracking-wider">
                       <Calendar className="h-3.5 w-3.5 opacity-50" />
                       {format(new Date(c.createdAt), "MMM dd, yyyy")}
                    </div>
                  </td>
                 )}
                 {isVisible("actions") && (
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEdit(c)}
                        className="h-9 w-9 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 rounded-xl"
                       >
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 dark:bg-[#1f1a1d] dark:border-white/10 shadow-2xl">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => handleOpenEdit(c)} className="rounded-lg text-xs font-bold gap-3 py-2 italic text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600">
                                <Edit2 className="h-3.5 w-3.5" /> Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setCategoryToDelete(c);
                                setIsDeleteModalOpen(true);
                              }} className="rounded-lg text-xs font-bold gap-3 py-2 italic text-red-500 focus:bg-red-50 focus:text-red-500">
                                <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </td>
                 )}
               </tr>
             ))}
             {!loading && categories.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-24 w-24 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-200 dark:text-slate-800 rotate-12 transition-transform hover:rotate-0 duration-500">
                                <Layers className="h-12 w-12" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic uppercase tracking-widest">No categories found</h3>
                                <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium italic">We couldn't find any categories matching your criteria.</p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => setSearchTerm("")}
                                className="mt-4 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all border-dashed"
                            >
                                Clear All Search
                            </Button>
                        </div>
                    </td>
                 </tr>
             )}
           </tbody>
         </table>
      </Card>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden dark:bg-[#1f1a1d]">
            <DialogHeader className="p-8 bg-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
                        {isEditMode ? "Edit Category" : "New Category"}
                    </DialogTitle>
                    <DialogDescription className="text-white/70 font-medium italic text-xs">
                        {isEditMode ? "Update existing category information" : "Create a new organizational group for products"}
                    </DialogDescription>
                  </div>
                </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                      <Label htmlFor="catName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Category Name</Label>
                      <Input 
                        id="catName" 
                        value={form.name} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        placeholder="e.g. Mechanical Keyboards" 
                        className="h-12 rounded-xl border-slate-200 dark:border-white/5 font-bold italic focus:ring-indigo-500"
                        required 
                      />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="catSlug" className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Slug (URL Name)</Label>
                      <Input 
                        id="catSlug" 
                        value={form.slug} 
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} 
                        placeholder="e.g. keyboards-mech" 
                        className="h-12 rounded-xl border-slate-200 dark:border-white/5 font-bold italic font-mono lowercase"
                      />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status</Label>
                    <Select 
                      value={form.status} 
                      onValueChange={(val) => setForm(f => ({ ...f, status: val }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/5 font-bold italic">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
                        <SelectItem value="Active" className="italic font-bold text-emerald-600">Active</SelectItem>
                        <SelectItem value="Inactive" className="italic font-bold text-slate-500">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                      <Label htmlFor="catDesc" className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Description</Label>
                      <Textarea 
                        id="catDesc" 
                        value={form.description} 
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                        placeholder="Describe the type of products in this category..." 
                        className="min-h-[100px] rounded-xl border-slate-200 dark:border-white/5 font-medium italic resize-none"
                      />
                  </div>
               </div>

               <DialogFooter className="pt-4 flex flex-row gap-3">
                   <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic hover:bg-slate-100"
                   >
                     Cancel
                   </Button>
                   <Button 
                    type="submit" 
                    disabled={saving} 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic shadow-premium shadow-indigo-500/20"
                   >
                       {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                       {isEditMode ? "Update Category" : "Save Category"}
                   </Button>
               </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 dark:bg-[#1f1a1d] border-none shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
                    <Trash2 className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic uppercase tracking-wider">Are you absolutely sure?</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2 italic">
                        This will permanently delete the category <span className="text-slate-900 dark:text-white font-black underline decoration-red-500/30 underline-offset-4 tracking-tight px-1 italic">"{categoryToDelete?.name}"</span> 
                        and remove all organizational links. This action cannot be undone.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full pt-4">
                    <Button 
                        variant="ghost" 
                        disabled={saving}
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic"
                    >
                        Keep Category
                    </Button>
                    <Button 
                        variant="destructive" 
                        className="flex-1 bg-red-600 hover:bg-red-700 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic shadow-lg shadow-red-600/20"
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : "Delete Forever"}
                    </Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
