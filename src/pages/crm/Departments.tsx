import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  Users as UsersIcon,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Download,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Department = {
  id: string;
  name: string;
  description: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    users: number;
    inventory: number;
  };
};

export default function DepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const getDepartmentStatus = (dept: any) => {
    const raw = dept.status || dept.isActive;
    if (
      raw === true ||
      raw === 1 ||
      raw === "1" ||
      String(raw).toLowerCase() === "active" ||
      String(raw).toLowerCase() === "true"
    ) {
      return "active";
    }
    return "inactive";
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const deptStatus = getDepartmentStatus(dept);
      const matchesSearch = dept.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "" ? true : (
        statusFilter === "Active" ? deptStatus === "active" : deptStatus === "inactive"
      );
      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);
  
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("dept_table_columns");
    return saved ? JSON.parse(saved) : ["name", "users", "status", "created"];
  });

  useEffect(() => {
    localStorage.setItem("dept_table_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Modals
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  
  // Form States
  const [deptForm, setDeptForm] = useState({
    id: "" as string | undefined,
    name: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    fetchDepartments(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDepartments();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDepartments = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      // Backend doesn't support server side filtering yet, so we fetch all
      const res = await api.get(`/departments`);
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch departments");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleSaveDepartment = async () => {
    if (!deptForm.name) {
      toast.error("Department name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const res = await api.post("/departments", deptForm);
        if (res.success) {
          toast.success("Department created successfully");
          await fetchDepartments(false);
          handleCloseModal();
        } else {
          toast.error(res.error || res.message || "Failed to create department");
        }
      } else {
        const res = await api.put(`/departments/${deptForm.id}`, deptForm);
        if (res.success) {
          toast.success("Department updated successfully");
          await fetchDepartments(false);
          handleCloseModal();
        } else {
          toast.error(res.error || res.message || "Failed to update department");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error saving department");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await api.delete(`/departments/${id}`);
      if (res.success) {
        toast.success("Department deleted");
        fetchDepartments();
      }
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  const resetDeptForm = () => {
    setDeptForm({
      id: "",
      name: "",
      description: "",
      status: "Active"
    });
  };

  const openCreateModal = () => {
    resetDeptForm();
    setModalMode("create");
    setEditingDept(null);
    setIsDeptModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    const normalizedStatus = getDepartmentStatus(dept);
    setDeptForm({
      id: dept.id,
      name: dept.name,
      description: dept.description || "",
      status: normalizedStatus === "active" ? "Active" : "Inactive"
    });
    setModalMode("edit");
    setIsDeptModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeptModalOpen(false);
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
    
    setTimeout(() => {
      setEditingDept(null);
      setSubmitting(false); 
      resetDeptForm();
    }, 300);
  };

  const columns = [
    { id: "name", label: "Department Name" },
    { id: "users", label: "Users" },
    { id: "status", label: "Status" },
    { id: "created", label: "Created At" },
  ];

  const toggleColumn = (colId: string) => {
    setVisibleColumns(prev => 
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Departments</h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>Manage company departments and their structures.</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400 border-none px-1.5 py-0">
               {departments.length} Total
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
                <Columns className="h-4 w-4 text-slate-400" />
                <span>Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl dark:bg-[#1a1619] dark:border-white/5 shadow-2xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-3 py-2">Table Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-50" />
                {columns.map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={visibleColumns.includes(col.id)}
                    onCheckedChange={() => toggleColumn(col.id)}
                    className="rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDeptModalOpen} onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}>
            <DialogTrigger
              render={
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New Department</span>
                </Button>
              }
            />
            <DialogContent 
              showCloseButton={false} 
              className="sm:max-w-none w-[92vw] lg:w-[600px] rounded-2xl dark:bg-[#1a1619] dark:border-white/5 overflow-hidden p-0 flex flex-col border-none shadow-2xl z-[100]"
            >
               <DepartmentForm 
                mode={modalMode}
                title={modalMode === 'create' ? "Create New Department" : "Edit Department"} 
                formData={deptForm} 
                setFormData={setDeptForm} 
                onSave={handleSaveDepartment}
                onCancel={handleCloseModal}
                submitting={submitting}
               />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by department name..." 
              className="pl-10 h-11 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all" 
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Filter className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-premium border-slate-100 dark:border-white/5">
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {visibleColumns.includes("name") && <th className="px-6 py-4">Department Name</th>}
                {visibleColumns.includes("users") && <th className="px-6 py-4">Users</th>}
                {visibleColumns.includes("status") && <th className="px-6 py-4">Status</th>}
                {visibleColumns.includes("created") && <th className="px-6 py-4">Created At</th>}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
                          <div className="h-3 w-48 bg-slate-100 dark:bg-white/5 rounded-full" />
                       </div>
                    </td>
                  </tr>
                ))
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">No departments found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or search.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  {visibleColumns.includes("name") && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center border border-blue-100 dark:border-blue-600/20 shadow-sm transition-all group-hover:scale-110">
                          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{dept.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">{dept.description || "No description provided."}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("users") && (
                    <td className="px-6 py-5">
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold gap-1.5 px-3">
                         <UsersIcon className="h-3 w-3" />
                         {dept._count?.users || 0} Users
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("status") && (
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter transition-all duration-300",
                          getDepartmentStatus(dept) === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                            : "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 shadow-sm"
                        )}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mr-2",
                          getDepartmentStatus(dept) === "active" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                        )} />
                        {getDepartmentStatus(dept).toUpperCase()}
                      </span>
                    </td>
                  )}
                  {visibleColumns.includes("created") && (
                    <td className="px-6 py-5 text-[10px] text-slate-400">
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl dark:bg-[#1a1619] dark:border-white/5 shadow-2xl">
                        <DropdownMenuItem onClick={() => openEditModal(dept)} className="rounded-xl gap-2 font-bold cursor-pointer">
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer">
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="opacity-10" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDept(dept.id)}
                          className="rounded-xl gap-2 font-bold cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Dept.
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredDepartments.length > 0 ? "1" : "0"}-{filteredDepartments.length} of {filteredDepartments.length} departments
           </p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}

function DepartmentForm({ 
  mode = "create",
  title, 
  formData, 
  setFormData, 
  onSave,
  onCancel,
  submitting
}: { 
  mode?: "create" | "edit";
  title: string;
  formData: any;
  setFormData: any;
  onSave: () => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1a1619] overflow-hidden">
      {/* modal-header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white dark:bg-[#1a1619]">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <p className="text-slate-500 text-[11px] font-medium mt-1">Configure department details and status.</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-white/10 rounded-full transition-all"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* modal-body */}
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department Name *</Label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Engineering, Sales, Human Resources" 
              className="h-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department's purpose..." 
              className="resize-none h-32 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger className="h-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-white/5">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* modal-footer */}
      <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1619] flex items-center justify-end gap-3 shrink-0 relative z-[20]">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="h-11 px-6 rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Button>
        <Button 
          disabled={submitting}
          onClick={onSave}
          className="h-11 px-6 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-premium transition-all gap-2"
        >
          {submitting ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : mode === 'create' ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <span>{mode === 'create' ? 'Create Department' : 'Update Department'}</span>
        </Button>
      </div>
    </div>
  );
}
