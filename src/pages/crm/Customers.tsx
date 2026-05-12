import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Upload,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  User,
  Building,
  X,
  Check,
  Calendar,
  MapPin,
  FileText,
  Briefcase
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  type: string;
  status: string;
  source: string | null;
  assignedUserId: string | null;
  assignedUser?: { id: string; firstName: string; lastName: string } | null;
  companyName: string | null;
  nextFollowUp: string | null;
  notes: string | null;
  address: string | null;
  createdAt: string;
};

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerIdParam = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("customer_table_columns");
    return saved ? JSON.parse(saved) : ["customer", "type", "status", "nextFollowUp", "source", "assignedTo", "phone"];
  });

  useEffect(() => {
    localStorage.setItem("customer_table_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Form States
  const [customerForm, setCustomerForm] = useState({
    id: "" as string | undefined,
    name: "",
    email: "",
    phone: "",
    type: "Company",
    status: "Active",
    source: "Website",
    assignedUserId: "",
    companyName: "",
    nextFollowUp: "",
    notes: "",
    address: ""
  });

  useEffect(() => {
    fetchMetadata();
    fetchCustomers(true);
  }, []);

  useEffect(() => {
    if (customerIdParam && customers.length > 0) {
      const cust = customers.find(c => c.id === customerIdParam);
      if (cust) {
        openViewModal(cust);
      }
    }
  }, [customerIdParam, customers]);

  const fetchMetadata = async () => {
    try {
      const res = await api.get("/users");
      if (res.success) setUsers(res.data);
    } catch (error) {
      console.error("Metadata fetch error:", error);
    }
  };

  const fetchCustomers = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get("/customers");
      if (res.success && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      toast.error("Failed to fetch customers");
      setCustomers([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!customers || !Array.isArray(customers)) return [];
    return customers.filter((cust) => {
      const matchesSearch = 
        cust.name.toLowerCase().includes(search.toLowerCase()) ||
        (cust.email && cust.email.toLowerCase().includes(search.toLowerCase())) ||
        (cust.phone && cust.phone.includes(search)) ||
        (cust.companyName && cust.companyName.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" ? true : cust.status === statusFilter;
      const matchesSource = sourceFilter === "all" ? true : cust.source === sourceFilter;
      const matchesAssignee = assigneeFilter === "all" ? true : cust.assignedUserId === assigneeFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesAssignee;
    });
  }, [customers, search, statusFilter, sourceFilter, assigneeFilter]);

  const handleSaveCustomer = async () => {
    if (!customerForm.name) {
      toast.error("Customer name is required");
      return;
    }
    setSubmitting(true);
    try {
      // Normalize dates and empty strings for backend
      const payload: any = { ...customerForm };
      if (!payload.nextFollowUp) delete payload.nextFollowUp;
      else payload.nextFollowUp = new Date(payload.nextFollowUp).toISOString();
      
      if (payload.assignedUserId === "none" || payload.assignedUserId === "") {
        payload.assignedUserId = null;
      }

      if (modalMode === "create") {
        const res = await api.post("/customers", payload);
        if (res.success) {
          toast.success("Customer created successfully");
          await fetchCustomers(false);
          handleCloseModal();
        } else {
          toast.error(res.error || res.message || "Failed to create customer");
        }
      } else {
        const res = await api.put(`/customers/${customerForm.id}`, payload);
        if (res.success) {
          toast.success("Customer updated successfully");
          await fetchCustomers(false);
          handleCloseModal();
        } else {
          toast.error(res.error || res.message || "Failed to update customer");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error saving customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    try {
      const res = await api.delete(`/customers/${id}`);
      if (res.success) {
        toast.success("Customer deleted");
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      id: "",
      name: "",
      email: "",
      phone: "",
      type: "Company",
      status: "Active",
      source: "Website",
      assignedUserId: "",
      companyName: "",
      nextFollowUp: "",
      notes: "",
      address: ""
    });
  };

  const openCreateModal = () => {
    resetCustomerForm();
    setModalMode("create");
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setCustomerForm({
      id: cust.id,
      name: cust.name,
      email: cust.email || "",
      phone: cust.phone || "",
      type: cust.type,
      status: cust.status,
      source: cust.source || "",
      assignedUserId: cust.assignedUserId || "",
      companyName: cust.companyName || "",
      nextFollowUp: cust.nextFollowUp ? new Date(cust.nextFollowUp).toISOString().split('T')[0] : "",
      notes: cust.notes || "",
      address: cust.address || ""
    });
    setModalMode("edit");
    setIsCustomerModalOpen(true);
  };

  const openViewModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setCustomerForm({
      id: cust.id,
      name: cust.name,
      email: cust.email || "",
      phone: cust.phone || "",
      type: cust.type,
      status: cust.status,
      source: cust.source || "",
      assignedUserId: cust.assignedUserId || "",
      companyName: cust.companyName || "",
      nextFollowUp: cust.nextFollowUp ? new Date(cust.nextFollowUp).toISOString().split('T')[0] : "",
      notes: cust.notes || "",
      address: cust.address || ""
    });
    setModalMode("view");
    setIsCustomerModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCustomerModalOpen(false);
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
    
    // Clear search param if present
    if (searchParams.has("id")) {
      searchParams.delete("id");
      setSearchParams(searchParams);
    }

    setTimeout(() => {
      setEditingCustomer(null);
      setSubmitting(false); 
      resetCustomerForm();
    }, 300);
  };

  const columns = [
    { id: "customer", label: "Customer" },
    { id: "type", label: "Type" },
    { id: "status", label: "Status" },
    { id: "nextFollowUp", label: "Next Follow-up" },
    { id: "source", label: "Source" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "phone", label: "Phone" },
    { id: "email", label: "Email" },
    { id: "createdAt", label: "Created Date" },
  ];

  const toggleColumn = (colId: string) => {
    setVisibleColumns(prev => 
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400";
      case "Inactive":
        return "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400";
      case "Lead":
        return "bg-amber-50 text-amber-600 dark:bg-amber-600/10 dark:text-amber-400";
      case "Prospect":
        return "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400";
      default:
        return "bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400";
    }
  };

  const handleExport = () => {
    toast.success("Exporting filtered customers... (CSV)");
  };

  const handleImport = () => {
    toast.info("Import modal would open here.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Customers</h1>
            <Badge className="bg-blue-50 text-blue-600 border-none dark:bg-blue-600/20 dark:text-blue-400 text-[10px] h-5">
              Total {customers.length}
            </Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of your customer database and activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button onClick={handleImport} variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>Import</span>
          </Button>
          <Dialog open={isCustomerModalOpen} onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}>
            <DialogTrigger
              render={
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Customer</span>
                </Button>
              }
            />
            <DialogContent 
              showCloseButton={false} 
              className="sm:max-w-none w-[95vw] lg:max-w-[1280px] max-h-[92vh] overflow-visible rounded-3xl dark:bg-[#1a1619] dark:border-white/5 p-0 border-none shadow-2xl z-[1000]"
            >
               <CustomerForm 
                mode={modalMode}
                title={modalMode === 'create' ? "Create New Customer" : modalMode === 'edit' ? "Edit Customer" : "View Customer"} 
                formData={customerForm} 
                setFormData={setCustomerForm} 
                users={users}
                onSave={handleSaveCustomer}
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
              placeholder="Search by name, email, phone..." 
              className="pl-10 h-11 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all" 
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <Filter className="h-3.5 w-3.5 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="h-11 w-[160px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                  <Columns className="h-4 w-4 opacity-50" />
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
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {visibleColumns.includes("customer") && <th className="px-6 py-4 whitespace-nowrap">Customer</th>}
                {visibleColumns.includes("type") && <th className="px-6 py-4 whitespace-nowrap">Type</th>}
                {visibleColumns.includes("status") && <th className="px-6 py-4 whitespace-nowrap">Status</th>}
                {visibleColumns.includes("nextFollowUp") && <th className="px-6 py-4 whitespace-nowrap">Next Follow-up</th>}
                {visibleColumns.includes("source") && <th className="px-6 py-4 whitespace-nowrap">Source</th>}
                {visibleColumns.includes("assignedTo") && <th className="px-6 py-4 whitespace-nowrap">Assigned To</th>}
                {visibleColumns.includes("phone") && <th className="px-6 py-4 whitespace-nowrap">Phone</th>}
                {visibleColumns.includes("email") && <th className="px-6 py-4 whitespace-nowrap">Email</th>}
                {visibleColumns.includes("createdAt") && <th className="px-6 py-4 whitespace-nowrap">Created</th>}
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={visibleColumns.length + 1} className="px-6 py-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-100 dark:bg-white/5 rounded-xl" />
                          <div className="space-y-2">
                             <div className="h-3 w-32 bg-slate-100 dark:bg-white/5 rounded-full" />
                             <div className="h-2 w-24 bg-slate-100 dark:bg-white/5 rounded-full" />
                          </div>
                       </div>
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">No customers found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or search.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  {visibleColumns.includes("customer") && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm rounded-xl transition-transform group-hover:scale-105">
                          <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                            {cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{cust.name}</p>
                          <p className="text-[10px] text-slate-400">{cust.companyName || "—"}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("type") && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {cust.type === "Company" ? <Building className="h-3 w-3 text-slate-400" /> : <User className="h-3 w-3 text-slate-400" />}
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{cust.type}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("status") && (
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-black uppercase px-2 h-5 tracking-tighter border-none",
                        getStatusBadge(cust.status)
                      )}>
                        {cust.status}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("nextFollowUp") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                       <div className="flex flex-col">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {cust.nextFollowUp ? new Date(cust.nextFollowUp).toLocaleDateString() : "—"}
                          </p>
                          {cust.nextFollowUp && new Date(cust.nextFollowUp) < new Date() && cust.status !== 'Inactive' && (
                             <span className="text-[9px] text-red-500 font-bold uppercase tracking-tight mt-0.5">Overdue</span>
                          )}
                       </div>
                    </td>
                  )}
                  {visibleColumns.includes("source") && (
                    <td className="px-6 py-5">
                      <Badge variant="secondary" className="text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border-none px-2 py-0">
                        {cust.source || "—"}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("assignedTo") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                         <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-slate-500">
                           {cust.assignedUser ? (cust.assignedUser.firstName[0] + (cust.assignedUser.lastName?.[0] || "")) : "?"}
                         </div>
                         <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                           {cust.assignedUser ? `${cust.assignedUser.firstName} ${cust.assignedUser.lastName}` : "Unassigned"}
                         </p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("phone") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{cust.phone || "—"}</p>
                    </td>
                  )}
                  {visibleColumns.includes("email") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{cust.email || "—"}</p>
                    </td>
                  )}
                   {visibleColumns.includes("createdAt") && (
                    <td className="px-6 py-5 text-[10px] text-slate-400">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl dark:bg-[#1a1619] dark:border-white/5 shadow-2xl">
                        <DropdownMenuItem onClick={() => openViewModal(cust)} className="rounded-xl gap-2 font-bold cursor-pointer transition-colors">
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(cust)} className="rounded-xl gap-2 font-bold cursor-pointer transition-colors">
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="opacity-10" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCustomer(cust.id)}
                          className="rounded-xl gap-2 font-bold cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Customer
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
             Showing {filteredCustomers.length > 0 ? "1" : "0"}-{filteredCustomers.length} of {filteredCustomers.length} customers
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

function CustomerForm({ 
  mode = "create",
  title, 
  formData, 
  setFormData, 
  users,
  onSave,
  onCancel,
  submitting
}: { 
  mode?: "create" | "edit" | "view";
  title: string;
  formData: any;
  setFormData: any;
  users: any[];
  onSave: () => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const isReadOnly = mode === "view";

  return (
    <div className="flex flex-col h-full max-h-[92vh] w-full bg-white dark:bg-[#1a1619]">
      {/* HEADER */}
      <div className="border-b px-8 py-5 flex items-start justify-between bg-white dark:bg-[#1a1619]">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center border border-blue-100 dark:border-blue-600/20">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <p className="text-slate-500 text-[11px] font-medium mt-1">Configure customer record and CRM details.</p>
          </div>
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

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-[#1a1619]">
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE (col-span-8) */}
          <div className="col-span-12 lg:col-span-8 space-y-5 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-visible">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name *</Label>
                <Input 
                  disabled={isReadOnly}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name" 
                  className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</Label>
                <Input 
                  disabled={isReadOnly}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Organization Name" 
                  className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    disabled={isReadOnly}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com" 
                    className="h-11 text-sm pl-10 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    disabled={isReadOnly}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890" 
                    className="h-11 text-sm pl-10 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <Textarea 
                  disabled={isReadOnly}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Physical address..." 
                  className="h-28 text-sm pl-10 pt-2 resize-none rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Notes</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <Textarea 
                  disabled={isReadOnly}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Private notes about this customer..." 
                  className="h-28 text-sm pl-10 pt-2 resize-none rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (col-span-4) */}
          <div className="col-span-12 lg:col-span-4 h-fit overflow-visible">
            <div className="border border-slate-100 dark:border-white/5 rounded-2xl p-5 pb-8 bg-slate-50 dark:bg-white/[0.03] space-y-5 h-fit shadow-sm overflow-visible">
              <div className="space-y-1.5 overflow-visible">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Customer Type</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg border-slate-100 dark:border-white/5 bg-white dark:bg-white/5">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" sideOffset={6}>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 overflow-visible">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg border-slate-100 dark:border-white/5 bg-white dark:bg-white/5">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" sideOffset={6}>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 overflow-visible">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Source</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.source} 
                  onValueChange={(val) => setFormData({ ...formData, source: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg border-slate-100 dark:border-white/5 bg-white dark:bg-white/5">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" sideOffset={6}>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 overflow-visible">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Assigned To</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.assignedUserId || "none"} 
                  onValueChange={(val) => setFormData({ ...formData, assignedUserId: val === "none" ? "" : val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg border-slate-100 dark:border-white/5 bg-white dark:bg-white/5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Briefcase className="h-3 w-3 shrink-0 opacity-50" />
                      <SelectValue placeholder="Unassigned" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" sideOffset={6}>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 pt-6 border-t border-slate-100 dark:border-white/5 mt-6">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">Next Follow-Up</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                    <Input 
                      disabled={isReadOnly}
                      type="date"
                      value={formData.nextFollowUp}
                      onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                      className="h-10 text-sm pl-9 rounded-lg border-slate-100 dark:border-white/5 bg-white dark:bg-white/5"
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t bg-white dark:bg-[#1a1619] px-8 py-4 flex justify-end gap-3 shrink-0">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="h-10 px-6 rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
        >
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button 
            disabled={submitting}
            onClick={onSave}
            className="h-10 px-8 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-premium transition-all gap-2 text-sm"
          >
            {submitting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'create' ? <Plus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            <span>{mode === 'create' ? 'Create Customer' : 'Update Customer'}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
