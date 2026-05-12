import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  Shield,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  X,
  Lock,
  UserCheck,
  UserMinus,
  Key,
  Eye,
  Settings
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { api } from "@/lib/api";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string;
  mobile: string;
  designation: string;
  status: string;
  createdAt: string;
  department?: { id: string; name: string };
  location?: { id: string; name: string };
  roles: { id: string; name: string }[];
  reportingManager?: { id: string; firstName: string; lastName: string };
};

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");
  
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("user_table_columns");
    return saved ? JSON.parse(saved) : ["name", "code", "email", "mobile", "designation", "status", "created"];
  });

  useEffect(() => {
    localStorage.setItem("user_table_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form States
  const [userForm, setUserForm] = useState({
    id: "" as string | undefined,
    firstName: "",
    lastName: "",
    email: "",
    employeeCode: "",
    mobile: "",
    password: "",
    designation: "",
    departmentId: "",
    locationId: "",
    reportingManagerId: "",
    approverId: "",
    status: "Active",
    loginAccess: true,
    roleIds: [] as string[]
  });

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    departmentId: "",
    roleId: ""
  });

  useEffect(() => {
    fetchMetadata();
    fetchUsers(true);
  }, [statusFilter, roleFilter, deptFilter, locFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMetadata = async () => {
    try {
      const [rRes, dRes, lRes] = await Promise.all([
        api.get("/roles"),
        api.get("/departments"),
        api.get("/locations")
      ]);
      if (rRes.success) setRoles(rRes.data);
      if (dRes.success) setDepartments(dRes.data);
      if (lRes.success) setLocations(lRes.data);
    } catch (error) {
      console.error("Metadata fetch error:", error);
    }
  };

  const fetchUsers = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const params: any = { search };
      if (statusFilter) params.status = statusFilter;
      if (roleFilter) params.role = roleFilter;
      if (deptFilter) params.department = deptFilter;
      if (locFilter) params.location = locFilter;
      
      const query = new URLSearchParams(params).toString();
      
      const res = await api.get(`/users?${query}`);
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!userForm.email || !userForm.firstName || !userForm.employeeCode) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/users", userForm);
      if (res.success) {
        toast.success("User created successfully");
        // refresh table
        await fetchUsers(false);
        // IMPORTANT
        handleCloseModal();
      } else {
        toast.error(res.error || res.message || "Failed to create user");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error creating user");
    } finally {
      // VERY IMPORTANT
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!userForm.email || !userForm.firstName) {
      toast.error("Please fill required fields");
      return;
    }
    
    // Ensure we have an ID for update
    const userId = userForm.id || editingUser?.id;
    if (!userId) {
      toast.error("User ID missing for update");
      return;
    }

    setSubmitting(true);
    try {
      // Use the specific user ID in the URL
      const res = await api.put(`/users/${userId}`, userForm);
      if (res.success) {
        toast.success("User updated successfully");
        // refresh table
        await fetchUsers(false);
        // IMPORTANT
        handleCloseModal();
      } else {
        toast.error(res.error || res.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error updating user");
    } finally {
      // VERY IMPORTANT
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await api.delete(`/users/${id}`);
      if (res.success) {
        toast.success("User deleted");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleSendInvite = async () => {
    if (!inviteForm.email || !inviteForm.name) {
      toast.error("Name and Email are required");
      return;
    }
    try {
      const res = await api.post("/user-invitations", inviteForm);
      if (res.success) {
        toast.success("Invitation sent successfully");
        setIsInviteModalOpen(false);
        setInviteForm({ name: "", email: "", departmentId: "", roleId: "" });
      } else {
        toast.error(res.error || "Failed to send invitation");
      }
    } catch (error: any) {
      toast.error(error.message || "Error sending invitation");
    }
  };

  const resetUserForm = () => {
    setUserForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      employeeCode: "",
      mobile: "",
      password: "",
      designation: "",
      departmentId: "",
      locationId: "",
      reportingManagerId: "",
      approverId: "",
      status: "Active",
      loginAccess: true,
      roleIds: []
    });
  };

  const openCreateModal = () => {
    resetUserForm();
    setModalMode("create");
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUserForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName || "",
      email: user.email,
      employeeCode: user.employeeCode || "",
      mobile: user.mobile || "",
      password: "", // Handled separately
      designation: user.designation || "",
      departmentId: user.department?.id || "",
      locationId: user.location?.id || "",
      reportingManagerId: user.reportingManager?.id || "",
      approverId: (user as any).approver?.id || "",
      status: user.status,
      loginAccess: (user as any).loginAccess ?? true,
      roleIds: user.roles.map(r => r.id)
    });
    setModalMode("edit");
    setIsUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUserModalOpen(false);
    
    // Immediate cleanup of potential stuck styles and state
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
    
    // Delay clearing everything until after the animation would typically finish
    setTimeout(() => {
      setEditingUser(null);
      setSubmitting(false); 
      resetUserForm();
    }, 300);
  };

  const columns = [
    { id: "name", label: "Name" },
    { id: "code", label: "Emp. Code" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Mobile" },
    { id: "designation", label: "Designation" },
    { id: "location", label: "Location" },
    { id: "status", label: "Status" },
    { id: "created", label: "Created" },
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Users</h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <span>Manage system users, roles, and access.</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400 border-none px-1.5 py-0">
               {users.length} Total
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Dialog 
            open={isInviteModalOpen} 
            onOpenChange={setIsInviteModalOpen}
          >
            <DialogTrigger 
              render={
                <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Invite</span>
                </Button>
              }
            />
            <DialogContent className="max-w-md rounded-2xl dark:bg-[#1a1619] dark:border-white/5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Invite New User</DialogTitle>
                <DialogDescription>Send an email invitation for account setup.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="Enter name" 
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input 
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="Enter email" 
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={inviteForm.departmentId} onValueChange={(val) => setInviteForm({ ...inviteForm, departmentId: val })}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={inviteForm.roleId} onValueChange={(val) => setInviteForm({ ...inviteForm, roleId: val })}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                 <Button onClick={handleSendInvite} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                    <Mail className="h-4 w-4" />
                    Send Invitation
                 </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isUserModalOpen} onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}>
            <DialogTrigger
              render={
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New User</span>
                </Button>
              }
            />
            <DialogContent 
              showCloseButton={false} 
              className="sm:max-w-none w-[92vw] lg:w-[980px] h-[90vh] max-h-[820px] rounded-2xl dark:bg-[#1a1619] dark:border-white/5 overflow-hidden p-0 flex flex-col border-none shadow-2xl z-[100]"
            >
               <UserForm 
                mode={modalMode}
                title={modalMode === 'create' ? "Create New User" : "Edit User"} 
                formData={userForm} 
                setFormData={setUserForm} 
                roles={roles} 
                departments={departments} 
                locations={locations}
                onSave={modalMode === 'create' ? handleCreateUser : handleUpdateUser}
                allUsers={users}
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
          {/* Search - Left Side */}
          <div className="relative flex-1 min-w-[240px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, emp. code..." 
              className="pl-10 h-11 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all" 
            />
          </div>

          {/* Filters - Center */}
          <div className="flex flex-wrap items-center gap-2">
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

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2 text-left">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-premium border-slate-100 dark:border-white/5">
                <SelectItem value="">All Roles</SelectItem>
                {roles.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-11 w-[140px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2 text-left">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-premium border-slate-100 dark:border-white/5">
                <SelectItem value="">All Dept.</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locFilter} onValueChange={setLocFilter}>
              <SelectTrigger className="h-11 w-[140px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2 text-left">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-premium border-slate-100 dark:border-white/5">
                <SelectItem value="">All Locations</SelectItem>
                {locations.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
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

          {/* Export - Right Side */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {visibleColumns.includes("name") && <th className="px-6 py-4 whitespace-nowrap">Name</th>}
                {visibleColumns.includes("code") && <th className="px-6 py-4 whitespace-nowrap">Emp. Code</th>}
                {visibleColumns.includes("email") && <th className="px-6 py-4 whitespace-nowrap">Email</th>}
                {visibleColumns.includes("mobile") && <th className="px-6 py-4 whitespace-nowrap">Mobile</th>}
                {visibleColumns.includes("designation") && <th className="px-6 py-4 whitespace-nowrap">Designation</th>}
                {visibleColumns.includes("location") && <th className="px-6 py-4 whitespace-nowrap">Location</th>}
                {visibleColumns.includes("status") && <th className="px-6 py-4 whitespace-nowrap">Status</th>}
                {visibleColumns.includes("created") && <th className="px-6 py-4 whitespace-nowrap">Created</th>}
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-6 py-8">
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <Search className="h-6 w-6 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">No users found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or search.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  {visibleColumns.includes("name") && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-white dark:border-white/10 shadow-sm rounded-xl">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs">
                            {user.firstName[0]}{user.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {user.firstName} {user.lastName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {user.roles.slice(0, 1).map(r => (
                              <span key={r.id} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{r.name}</span>
                            ))}
                            {user.roles.length > 1 && (
                              <Badge variant="outline" className="h-3.5 px-1 text-[8px] border-slate-200 dark:border-white/10 text-slate-400 bg-slate-50 dark:bg-white/5 font-black">
                                +{user.roles.length - 1}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("code") && (
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[11px] font-mono border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                         {user.employeeCode || "N/A"}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("email") && (
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{user.email}</p>
                      <p className="text-[10px] text-slate-400">{user.department?.name || "No Dept."}</p>
                    </td>
                  )}
                  {visibleColumns.includes("mobile") && (
                    <td className="px-6 py-4 text-[11px] font-medium text-slate-500">{user.mobile || "—"}</td>
                  )}
                  {visibleColumns.includes("designation") && (
                    <td className="px-6 py-4 text-[11px] font-medium text-slate-500 whitespace-nowrap">{user.designation || "—"}</td>
                  )}
                  {visibleColumns.includes("location") && (
                    <td className="px-6 py-4 text-[11px] font-medium text-slate-500 whitespace-nowrap">{user.location?.name || "—"}</td>
                  )}
                  {visibleColumns.includes("status") && (
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase px-2 h-5 tracking-tighter border-none",
                        user.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400"
                      )}>
                        {user.status}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("created") && (
                    <td className="px-6 py-4 text-[10px] text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl dark:bg-[#1a1619] dark:border-white/5">
                        <DropdownMenuItem onClick={() => openEditModal(user)} className="rounded-xl gap-2 font-bold cursor-pointer">
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer">
                          <Key className="h-3.5 w-3.5 text-amber-500" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer">
                          <Lock className="h-3.5 w-3.5 text-emerald-500" />
                          Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="opacity-10" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-xl gap-2 font-bold cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete User
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
            Showing {users.length > 0 ? "1" : "0"}-{users.length} of {users.length} users
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

function UserForm({ 
  mode = "create",
  title, 
  formData, 
  setFormData, 
  roles, 
  departments, 
  locations,
  onSave,
  onCancel,
  allUsers,
  submitting
}: { 
  mode?: "create" | "edit";
  title: string;
  formData: any;
  setFormData: any;
  roles: any[];
  departments: any[];
  locations: any[];
  onSave: () => void;
  onCancel: () => void;
  allUsers: any[];
  submitting?: boolean;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1a1619] overflow-hidden">
      {/* modal-header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white dark:bg-[#1a1619]">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <p className="text-slate-500 text-[11px] font-medium mt-1">Configure user profile and organizational access.</p>
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
      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* ROW 1: Name | Employee Code */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First Name" 
                    className="h-11 rounded-md border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/10"
                  />
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last Name" 
                    className="h-11 rounded-md border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee Code *</Label>
                <Input 
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  placeholder="EMP-CODE" 
                  className="h-11 rounded-md border-slate-200 dark:border-white/10 font-mono uppercase text-sm px-4 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* ROW 2: Email | Mobile */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address *</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@company.com" 
                  className="h-11 rounded-md border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</Label>
                <Input 
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 XXXXX XXXXX" 
                  className="h-11 rounded-md border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* ROW 3: Password (full width) */}
              {!formData.id && (
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Password *</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter account password" 
                      className="h-11 rounded-md border-slate-200 dark:border-white/10 pl-10 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              )}

              {/* ROW 4: Designation | Department */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Designation</Label>
                <Input 
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Project Lead" 
                  className="h-11 rounded-md border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department</Label>
                <Select value={formData.departmentId} onValueChange={(val) => setFormData({ ...formData, departmentId: val })}>
                  <SelectTrigger className="h-11 rounded-md border-slate-200 dark:border-white/10 bg-white">
                    <SelectValue placeholder="Select Dept." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ROW 5: Reporting Manager | Approver */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reporting Manager</Label>
                <Select value={formData.reportingManagerId} onValueChange={(val) => setFormData({ ...formData, reportingManagerId: val })}>
                  <SelectTrigger className="h-11 rounded-md border-slate-200 dark:border-white/10 bg-white">
                    <SelectValue placeholder="Select Head" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {allUsers.filter(u => u.id !== formData.id).map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Approver</Label>
                <Select value={formData.approverId} onValueChange={(val) => setFormData({ ...formData, approverId: val })}>
                  <SelectTrigger className="h-11 rounded-md border-slate-200 dark:border-white/10 bg-white">
                    <SelectValue placeholder="Select Auth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {allUsers.filter(u => u.id !== formData.id).map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ROW 6: Sitting Location | Status */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sitting Location</Label>
                <Select value={formData.locationId} onValueChange={(val) => setFormData({ ...formData, locationId: val })}>
                  <SelectTrigger className="h-11 rounded-md border-slate-200 dark:border-white/10 bg-white">
                    <SelectValue placeholder="Select Loc." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {locations.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status & Access</Label>
                <div className="flex items-center gap-4 h-11 px-4 border border-slate-200 dark:border-white/10 rounded-md bg-slate-50/30">
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none p-0 focus:ring-0 font-bold min-w-[70px]">
                      <div className="flex items-center gap-2">
                         <div className={cn("h-1.5 w-1.5 rounded-full", formData.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]")} />
                         <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={formData.loginAccess}
                      onCheckedChange={(checked) => setFormData({ ...formData, loginAccess: !!checked })}
                      id="allow-login"
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor="allow-login" className="text-[11px] font-bold text-slate-600 cursor-pointer">Login Access</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 7: Roles */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Access Roles</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => {
                  const isSelected = formData.roleIds.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? formData.roleIds.filter((id: string) => id !== role.id)
                          : [...formData.roleIds, role.id];
                        setFormData({ ...formData, roleIds: next });
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-tight transition-all border-2 flex items-center gap-2",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10 translate-y-[-1px]" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-200 dark:bg-transparent dark:border-white/10"
                      )}
                    >
                      {role.name}
                      {isSelected && <Check className="h-3 w-3 stroke-[4]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
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
          onClick={onSave} 
          disabled={submitting}
          className="h-11 px-8 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{mode === 'edit' ? 'Updating...' : 'Creating...'}</span>
            </div>
          ) : (
            mode === 'edit' ? 'Update User' : 'Create User'
          )}
        </Button>
      </div>
    </div>
  );
}
