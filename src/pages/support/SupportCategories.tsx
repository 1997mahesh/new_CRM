import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Tag, 
  Search as SearchIcon,
  Edit2,
  Trash2,
  Timer,
  Columns,
  Check,
  X,
  MoreVertical,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  slaHours: number;
  active: boolean;
  tickets: number;
};

const SEED_DATA: Category[] = [
  { id: "cat_1", name: "Technical Support", description: "Bugs, login issues, and technical errors", slaHours: 4, active: true, color: "#3b82f6", tickets: 245 },
  { id: "cat_2", name: "Billing & Finance", description: "Invoices, payments, and subscription plans", slaHours: 8, active: true, color: "#10b981", tickets: 112 },
  { id: "cat_3", name: "Product Training", description: "How-to guides and onboarding assistance", slaHours: 24, active: true, color: "#f59e0b", tickets: 88 },
  { id: "cat_4", name: "Feature Requests", description: "New features and product improvements", slaHours: 168, active: true, color: "#6366f1", tickets: 156 },
  { id: "cat_5", name: "Security & Privacy", description: "Account security and GDPR requests", slaHours: 2, active: true, color: "#ef4444", tickets: 12 },
  { id: "cat_6", name: "Marketing Support", description: "Affiliate queries and promo help", slaHours: 48, active: false, color: "#64748b", tickets: 0 },
  { id: "cat_7", name: "API Integration", description: "Help with REST API and webhooks", slaHours: 12, active: true, color: "#8b5cf6", tickets: 64 },
  { id: "cat_8", name: "CRM Automation", description: "Workflow triggers and CRM syncing", slaHours: 24, active: true, color: "#ec4899", tickets: 43 },
  { id: "cat_9", name: "Customer Portal", description: "Client dashboard issues", slaHours: 12, active: true, color: "#06b6d4", tickets: 55 },
  { id: "cat_10", name: "Authentication", description: "SSO, OAuth, and MFA setup", slaHours: 4, active: true, color: "#f97316", tickets: 29 },
];

const STORAGE_KEY = "support_categories";

export default function SupportCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') return SEED_DATA;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_DATA;
      } catch (e) {
        return SEED_DATA;
      }
    }
    return SEED_DATA;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeStatus, setActiveStatus] = useState(true);
  
  // Initial mount ref to skip saving on first render
  const isFirstRender = React.useRef(true);
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    description: true,
    sla: true,
    status: true,
    tickets: true,
    actions: true,
  });

  // Save to localStorage whenever categories change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setActiveStatus(true);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveStatus(category.active);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted successfully");
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
    toast.success("Status updated");
  };

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const slaHours = parseInt(formData.get("slaHours") as string) || 0;
    const active = activeStatus;

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (editingCategory) {
      // Update
      setCategories(prev => prev.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name, description, color, slaHours, active } 
          : c
      ));
      toast.success("Category updated");
    } else {
      // Add
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name,
        description,
        color,
        slaHours,
        active,
        tickets: 0,
      };
      setCategories(prev => [newCategory, ...prev]);
      toast.success("Category created");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Support Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Categorize your support tickets to optimize response times and routing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide italic"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 md:w-80 group">
           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
           <Input 
             placeholder="Search categories..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" 
           />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] italic gap-2 text-slate-600">
               <Columns className="h-4 w-4 text-slate-400" />
               <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl italic">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={visibleColumns.name} onCheckedChange={(val) => setVisibleColumns({...visibleColumns, name: !!val})}>Name</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={visibleColumns.description} onCheckedChange={(val) => setVisibleColumns({...visibleColumns, description: !!val})}>Description</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={visibleColumns.sla} onCheckedChange={(val) => setVisibleColumns({...visibleColumns, sla: !!val})}>SLA</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={visibleColumns.status} onCheckedChange={(val) => setVisibleColumns({...visibleColumns, status: !!val})}>Status</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={visibleColumns.tickets} onCheckedChange={(val) => setVisibleColumns({...visibleColumns, tickets: !!val})}>Tickets</DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[800px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 italic">
                  {visibleColumns.name && <th className="px-6 py-4">Category Name</th>}
                  {visibleColumns.description && <th className="px-6 py-4">Description</th>}
                  {visibleColumns.sla && <th className="px-6 py-4 text-center">SLA Response</th>}
                  {visibleColumns.status && <th className="px-6 py-4 text-center">Status</th>}
                  {visibleColumns.tickets && <th className="px-6 py-4 text-center">Tickets</th>}
                  {visibleColumns.actions && <th className="px-6 py-4 text-right">Actions</th>}
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-medium italic">
               {filteredCategories.length > 0 ? (
                 filteredCategories.map((c) => (
                   <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                     {visibleColumns.name && (
                       <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                           <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: c.color }}></div>
                           <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic tracking-tight">{c.name}</span>
                         </div>
                       </td>
                     )}
                     {visibleColumns.description && (
                       <td className="px-6 py-5">
                         <p className="max-w-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{c.description}</p>
                       </td>
                     )}
                     {visibleColumns.sla && (
                       <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold decoration-blue-500/10 underline underline-offset-4 decoration-dashed tracking-tighter">
                             <Timer className="h-3 w-3" />
                             {c.slaHours} {c.slaHours === 1 ? 'Hour' : c.slaHours >= 24 ? `${Math.floor(c.slaHours / 24)} Days` : 'Hours'}
                          </div>
                       </td>
                     )}
                     {visibleColumns.status && (
                       <td className="px-6 py-5 text-center">
                         <button 
                           onClick={() => handleToggleStatus(c.id)}
                           className="focus:outline-none"
                         >
                           <Badge className={cn(
                             "text-[8px] font-bold uppercase py-0.5 px-2 border-none h-4.5 tracking-widest italic shadow-sm hover:opacity-80 transition-opacity",
                             c.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                           )}>
                             {c.active ? "Active" : "Inactive"}
                           </Badge>
                         </button>
                       </td>
                     )}
                     {visibleColumns.tickets && (
                       <td className="px-6 py-5 text-center font-mono font-bold text-slate-800 dark:text-slate-100">
                         {c.tickets}
                       </td>
                     )}
                     {visibleColumns.actions && (
                       <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <Button 
                              onClick={() => handleEditCategory(c)}
                              variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteCategory(c.id)}
                              variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 dark:border-white/5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                         </div>
                       </td>
                     )}
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                     No categories found matches your search.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl italic font-jakarta">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold italic tracking-tight">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="italic">
              Fill in the details below to {editingCategory ? "update" : "create"} a support category.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveCategory} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Name*</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editingCategory?.name}
                placeholder="Category name" 
                className="h-11 rounded-xl border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingCategory?.description}
                placeholder="What kind of tickets belong here?" 
                className="rounded-xl border-slate-200 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color" className="text-xs font-bold uppercase tracking-widest text-slate-500">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="color" 
                    name="color" 
                    type="color"
                    defaultValue={editingCategory?.color || "#6b7280"}
                    className="w-12 h-11 p-1 rounded-xl border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-mono">Hex Code</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slaHours" className="text-xs font-bold uppercase tracking-widest text-slate-500">SLA (hours)</Label>
                <Input 
                  id="slaHours" 
                  name="slaHours" 
                  type="number"
                  defaultValue={editingCategory?.slaHours}
                  placeholder="e.g. 24" 
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="flex flex-col">
                <Label htmlFor="active" className="text-sm font-bold italic">Active Status</Label>
                <span className="text-[10px] text-slate-500 italic">Toggle whether this category is currently available.</span>
              </div>
              <Switch 
                id="active" 
                name="active" 
                checked={activeStatus}
                onCheckedChange={setActiveStatus}
              />
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11 px-6 font-bold italic">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold italic shadow-premium">
                {editingCategory ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

