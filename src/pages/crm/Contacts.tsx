import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Download,
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
  Briefcase,
  Star,
  MessageSquare,
  Archive,
  Send,
  Clock,
  UserCheck
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api } from "@/lib/api";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  altPhone: string | null;
  jobTitle: string | null;
  department: string | null;
  customerId: string | null;
  customer?: { id: string; name: string } | null;
  status: string;
  isPrimary: boolean;
  type: string;
  assignedUserId: string | null;
  assignedUser?: { id: string; firstName: string; lastName: string } | null;
  preferredCommunication: string | null;
  tags: string[] | null;
  followUpDate: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
};

export default function ContactsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  
  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem("contact_table_columns");
    return saved ? JSON.parse(saved) : ["contact", "customer", "jobTitle", "email", "phone", "status", "assignedTo"];
  });

  useEffect(() => {
    localStorage.setItem("contact_table_columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Form States
  const [contactForm, setContactForm] = useState({
    id: "" as string | undefined,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    jobTitle: "",
    department: "",
    customerId: "none",
    status: "Active",
    isPrimary: false,
    type: "Individual",
    assignedUserId: "none",
    preferredCommunication: "Email",
    tags: [] as string[],
    followUpDate: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchMetadata();
    fetchContacts(true);
  }, []);

  const fetchMetadata = async () => {
    try {
      const [usersRes, customersRes] = await Promise.all([
        api.get("/users"),
        api.get("/customers")
      ]);
      if (usersRes.success) setUsers(usersRes.data);
      if (customersRes.success) setCustomers(customersRes.data);
    } catch (error) {
      console.error("Metadata fetch error:", error);
    }
  };

  const fetchContacts = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get("/contacts");
      if (res.success && Array.isArray(res.data)) {
        setContacts(res.data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      toast.error("Failed to fetch contacts");
      setContacts([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    if (!contacts || !Array.isArray(contacts)) return [];
    return contacts.filter((contact) => {
      const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(search.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(search.toLowerCase())) ||
        (contact.phone && contact.phone.includes(search)) ||
        (contact.customer?.name && contact.customer.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" ? true : contact.status === statusFilter;
      const matchesType = typeFilter === "all" ? true : contact.type === typeFilter;
      const matchesAssignee = assigneeFilter === "all" ? true : contact.assignedUserId === assigneeFilter;

      return matchesSearch && matchesStatus && matchesType && matchesAssignee;
    });
  }, [contacts, search, statusFilter, typeFilter, assigneeFilter]);

  const handleSaveContact = async () => {
    if (!contactForm.firstName || !contactForm.lastName) {
      toast.error("First and last names are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = { ...contactForm };
      
      // Handle "none" selections
      if (payload.customerId === "none") payload.customerId = null;
      if (payload.assignedUserId === "none") payload.assignedUserId = null;
      
      // Formatting
      if (payload.followUpDate) payload.followUpDate = new Date(payload.followUpDate).toISOString();
      else delete payload.followUpDate;

      if (modalMode === "create") {
        const res = await api.post("/contacts", payload);
        if (res.success) {
          toast.success("Contact created successfully");
          await fetchContacts(false);
          handleCloseModal();
        } else {
          toast.error(res.error || "Failed to create contact");
        }
      } else {
        const res = await api.put(`/contacts/${contactForm.id}`, payload);
        if (res.success) {
          toast.success("Contact updated successfully");
          await fetchContacts(false);
          handleCloseModal();
        } else {
          toast.error(res.error || "Failed to update contact");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error saving contact");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) return;
    try {
      const res = await api.delete(`/contacts/${id}`);
      if (res.success) {
        toast.success("Contact deleted");
        fetchContacts();
      }
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const resetContactForm = () => {
    setContactForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      altPhone: "",
      jobTitle: "",
      department: "",
      customerId: "none",
      status: "Active",
      isPrimary: false,
      type: "Individual",
      assignedUserId: "none",
      preferredCommunication: "Email",
      tags: [],
      followUpDate: "",
      address: "",
      notes: ""
    });
  };

  const openCreateModal = () => {
    resetContactForm();
    setModalMode("create");
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setContactForm({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email || "",
      phone: contact.phone || "",
      altPhone: contact.altPhone || "",
      jobTitle: contact.jobTitle || "",
      department: contact.department || "",
      customerId: contact.customerId || "none",
      status: contact.status,
      isPrimary: contact.isPrimary,
      type: contact.type,
      assignedUserId: contact.assignedUserId || "none",
      preferredCommunication: contact.preferredCommunication || "Email",
      tags: contact.tags || [],
      followUpDate: contact.followUpDate ? new Date(contact.followUpDate).toISOString().split('T')[0] : "",
      address: contact.address || "",
      notes: contact.notes || ""
    });
    setModalMode("edit");
    setIsContactModalOpen(true);
  };

  const openViewModal = (contact: Contact) => {
    setEditingContact(contact);
    setContactForm({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email || "",
      phone: contact.phone || "",
      altPhone: contact.altPhone || "",
      jobTitle: contact.jobTitle || "",
      department: contact.department || "",
      customerId: contact.customerId || "none",
      status: contact.status,
      isPrimary: contact.isPrimary,
      type: contact.type,
      assignedUserId: contact.assignedUserId || "none",
      preferredCommunication: contact.preferredCommunication || "Email",
      tags: contact.tags || [],
      followUpDate: contact.followUpDate ? new Date(contact.followUpDate).toISOString().split('T')[0] : "",
      address: contact.address || "",
      notes: contact.notes || ""
    });
    setModalMode("view");
    setIsContactModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setTimeout(() => {
      setEditingContact(null);
      setSubmitting(false); 
      resetContactForm();
    }, 300);
  };

  const tableColumns = [
    { id: "contact", label: "Contact" },
    { id: "customer", label: "Customer" },
    { id: "jobTitle", label: "Job Title" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "status", label: "Status" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "createdAt", label: "Created Date" },
  ];

  const toggleColumn = (colId: string) => {
    setVisibleColumns(prev => 
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-400";
      case "Inactive": return "bg-red-50 text-red-600 dark:bg-red-600/10 dark:text-red-400";
      case "Archived": return "bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400";
      default: return "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400";
    }
  };

  const handleExport = () => {
    toast.success("Exporting contacts report...");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Contacts</h1>
            <Badge className="bg-blue-50 text-blue-600 border-none dark:bg-blue-600/20 dark:text-blue-400 text-[10px] h-5">
              Total {contacts.length}
            </Badge>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage individual contact points for your customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Dialog open={isContactModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
            <DialogTrigger 
              render={
                <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Contact</span>
                </Button>
              }
            />
            <DialogContent 
              showCloseButton={false} 
              className="sm:max-w-none w-[95vw] lg:max-w-[1150px] max-h-[92vh] overflow-visible rounded-3xl dark:bg-[#1a1619] dark:border-white/5 p-0 border-none shadow-2xl z-[1000]"
            >
               <ContactForm 
                mode={modalMode}
                title={modalMode === 'create' ? "Add New Contact" : modalMode === 'edit' ? "Edit Contact" : "Contact Details"} 
                formData={contactForm} 
                setFormData={setContactForm} 
                users={users}
                customers={customers}
                onSave={handleSaveContact}
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
              placeholder="Search by name, email, phone, company..." 
              className="pl-10 h-11 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all" 
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <Filter className="h-3.5 w-3.5 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent sideOffset={6}>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-11 w-[130px] border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 font-medium text-slate-600 dark:text-slate-400 rounded-xl gap-2">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent sideOffset={6}>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
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
                  {tableColumns.map(col => (
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
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-visible">
        <div className="overflow-x-auto min-h-[400px] overflow-visible">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {visibleColumns.includes("contact") && <th className="px-6 py-4 whitespace-nowrap">Contact</th>}
                {visibleColumns.includes("customer") && <th className="px-6 py-4 whitespace-nowrap">Customer</th>}
                {visibleColumns.includes("jobTitle") && <th className="px-6 py-4 whitespace-nowrap">Title</th>}
                {visibleColumns.includes("email") && <th className="px-6 py-4 whitespace-nowrap">Email</th>}
                {visibleColumns.includes("phone") && <th className="px-6 py-4 whitespace-nowrap">Phone</th>}
                {visibleColumns.includes("status") && <th className="px-6 py-4 whitespace-nowrap">Status</th>}
                {visibleColumns.includes("assignedTo") && <th className="px-6 py-4 whitespace-nowrap">Assigned To</th>}
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
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-slate-800 dark:text-slate-100 font-bold">No contacts found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or search.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  {visibleColumns.includes("contact") && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm rounded-xl transition-transform group-hover:scale-105">
                          <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                            {`${contact.firstName[0]}${contact.lastName[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{`${contact.firstName} ${contact.lastName}`}</p>
                            {contact.isPrimary && (
                              <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] h-3.5 px-1 uppercase font-bold">Primary</Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{contact.department || "General"}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("customer") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-slate-400" />
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{contact.customer?.name || "—"}</p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("jobTitle") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                       <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{contact.jobTitle || "—"}</p>
                    </td>
                  )}
                  {visibleColumns.includes("email") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-blue-600/70 dark:text-blue-400/70">
                         <Mail className="h-3 w-3" />
                         <p className="text-[11px] font-bold">{contact.email || "—"}</p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("phone") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                       <div className="flex items-center gap-1.5 text-slate-500">
                         <Phone className="h-3 w-3 opacity-50" />
                         <p className="text-[11px] font-bold">{contact.phone || "—"}</p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("status") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-black uppercase px-2 h-5 tracking-tighter border-none",
                        getStatusBadge(contact.status)
                      )}>
                        {contact.status}
                      </Badge>
                    </td>
                  )}
                  {visibleColumns.includes("assignedTo") && (
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                         <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold text-slate-500">
                           {contact.assignedUser ? (contact.assignedUser.firstName[0] + (contact.assignedUser.lastName?.[0] || "")) : "?"}
                         </div>
                         <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                           {contact.assignedUser ? `${contact.assignedUser.firstName} ${contact.assignedUser.lastName}` : "Unassigned"}
                         </p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes("createdAt") && (
                    <td className="px-6 py-5 text-[10px] text-slate-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  )}
                   <td className="px-6 py-5 text-right overflow-visible">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl dark:bg-[#1a1619] dark:border-white/5 shadow-2xl z-[10001]">
                        <DropdownMenuItem onClick={() => openViewModal(contact)} className="rounded-xl gap-2 font-bold cursor-pointer transition-colors p-2.5">
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(contact)} className="rounded-xl gap-2 font-bold cursor-pointer transition-colors p-2.5">
                          <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                          Edit Contact
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="mx-2 my-1 opacity-10" />
                        
                        <DropdownMenuGroup>
                           <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer transition-colors p-2.5">
                             <Send className="h-3.5 w-3.5 text-emerald-500" />
                             Send Email
                           </DropdownMenuItem>
                           <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer transition-colors p-2.5">
                             <Clock className="h-3.5 w-3.5 text-amber-500" />
                             Schedule Follow-up
                           </DropdownMenuItem>
                           <DropdownMenuItem className="rounded-xl gap-2 font-bold cursor-pointer transition-colors p-2.5">
                             <Archive className="h-3.5 w-3.5 text-slate-500" />
                             Archive Contact
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator className="mx-2 my-1 opacity-10" />
                        
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="rounded-xl gap-2 font-bold cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors p-2.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
             Showing {filteredContacts.length > 0 ? "1" : "0"}-{filteredContacts.length} of {filteredContacts.length} contacts
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

function ContactForm({ 
  mode = "create",
  title, 
  formData, 
  setFormData, 
  users,
  customers,
  onSave,
  onCancel,
  submitting
}: { 
  mode?: "create" | "edit" | "view";
  title: string;
  formData: any;
  setFormData: any;
  users: any[];
  customers: any[];
  onSave: () => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const isReadOnly = mode === "view";

  return (
    <div className="flex flex-col h-full max-h-[92vh] w-full bg-white dark:bg-[#1a1619]">
      {/* HEADER */}
      <div className="border-b px-8 py-5 flex items-start justify-between bg-white dark:bg-[#1a1619] shrink-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-600/20">
              <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
           </div>
           <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
            <p className="text-slate-500 text-[11px] font-medium mt-1 uppercase tracking-wider">Contact Profile Configuration</p>
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
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-[#1a1619] overflow-visible">
        <div className="grid grid-cols-12 gap-6 items-start overflow-visible">
          
          {/* LEFT SIDE (col-span-8) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Primary Details */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <div className="h-1 w-4 bg-indigo-500 rounded-full" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Information</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">First Name *</Label>
                  <Input 
                    disabled={isReadOnly}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John" 
                    className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Last Name *</Label>
                  <Input 
                    disabled={isReadOnly}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe" 
                    className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        disabled={isReadOnly}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john.doe@org.com" 
                        className="h-11 text-sm pl-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Primary Phone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        disabled={isReadOnly}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000" 
                        className="h-11 text-sm pl-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-2 pt-2">
                 <div className="h-1 w-4 bg-indigo-300 rounded-full" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Details</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Job Title</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        disabled={isReadOnly}
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="Executive Manager" 
                        className="h-11 text-sm pl-11 rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Department</Label>
                    <Input 
                      disabled={isReadOnly}
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Operations / Sales" 
                      className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 overflow-visible">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Customer / Organization</Label>
                  <Select 
                    disabled={isReadOnly}
                    value={formData.customerId} 
                    onValueChange={(val) => setFormData({ ...formData, customerId: val })}
                  >
                    <SelectTrigger className="h-11 text-sm rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20">
                      <div className="flex items-center gap-2">
                         <Building className="h-4 w-4 text-slate-300" />
                         <SelectValue placeholder="Select Organization" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl z-[10001]" sideOffset={6}>
                      <SelectItem value="none">No Organization (Private Contact)</SelectItem>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>

            {/* Address and Notes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 pt-2">
                <div className="h-1 w-4 bg-indigo-200 rounded-full" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Context</h3>
              </div>

               <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Mailing Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-300" />
                  <Textarea 
                    disabled={isReadOnly}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Physical or mailing address..." 
                    className="h-24 text-sm pl-11 pt-2 resize-none rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Internal Notes</Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-300" />
                  <Textarea 
                    disabled={isReadOnly}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Private notes for team reference..." 
                    className="h-24 text-sm pl-11 pt-2 resize-none rounded-xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (col-span-4) */}
          <div className="col-span-12 lg:col-span-4 h-fit sticky top-0 overflow-visible">
            <div className="border border-indigo-100 dark:border-white/5 rounded-3xl p-6 bg-slate-50 dark:bg-white/[0.03] space-y-6 shadow-sm overflow-visible pb-8">
              
              <div className="space-y-1.5 overflow-visible">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Type</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                    <SelectValue placeholder="Individual" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl z-[10001]" sideOffset={6}>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 overflow-visible">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relationship Status</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl z-[10001]" sideOffset={6}>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 overflow-visible">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Specialist</Label>
                <Select 
                  disabled={isReadOnly}
                  value={formData.assignedUserId} 
                  onValueChange={(val) => setFormData({ ...formData, assignedUserId: val })}
                >
                  <SelectTrigger className="h-10 text-sm rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                    <div className="flex items-center gap-2">
                       <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                       <SelectValue placeholder="Select Assignee" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl z-[10001]" sideOffset={6}>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-200 dark:border-white/10 mt-2">
                 <div className="space-y-0.5">
                   <Label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Primary Contact</Label>
                   <p className="text-[9px] text-slate-400">Mark as main POC for company</p>
                 </div>
                 <Checkbox 
                  disabled={isReadOnly}
                  checked={formData.isPrimary} 
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: !!checked })}
                  className="rounded-md border-slate-300 dark:border-white/10"
                 />
              </div>

               <div className="space-y-1.5 pt-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Follow-Up</Label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    type="date"
                    disabled={isReadOnly}
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="h-10 text-xs pl-10 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 focus-visible:ring-indigo-500/20"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t bg-white dark:bg-[#1a1619] px-8 py-5 flex justify-end gap-3 shrink-0">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="h-10 px-6 font-bold rounded-xl border-slate-200 dark:border-white/10 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs uppercase"
        >
          Cancel
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={onSave} 
            disabled={submitting}
            className="h-10 px-8 font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-premium transition-all text-xs uppercase gap-2"
          >
            {submitting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>{mode === 'create' ? "Save Contact" : "Update Contact"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
