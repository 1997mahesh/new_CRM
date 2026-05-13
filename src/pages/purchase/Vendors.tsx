import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search as SearchIcon, 
  Download, 
  Upload,
  UserCheck, 
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building2,
  Columns,
  ChevronRight,
  FileText,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  X
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ColumnVisibilityDropdown } from "@/components/shared/ColumnVisibilityDropdown";
import { VendorForm } from "@/components/purchase/VendorForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsPage() {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // State for Vendor Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    contact: true,
    email: true,
    phone: true,
    status: true,
    orders: true,
    country: true,
    terms: false
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const fetchData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      
      const response = await api.get("/vendors", { 
        search: searchQuery,
        status: activeTab 
      });
      let data = Array.isArray(response.data) ? response.data : [];
      
      // Sort logic
      data = [...data].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        // Handle nested objects like _count
        if (sortField === 'orders') {
          valA = a._count?.purchaseOrders || 0;
          valB = b._count?.purchaseOrders || 0;
        }

        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        const comparison = valA > valB ? 1 : -1;
        return sortOrder === "asc" ? comparison : -comparison;
      });

      setVendors(data);
    } catch (error) {
      console.error("Fetch vendors error:", error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, sortField, sortOrder]);

  const handleArchive = async (id: string) => {
    if (window.confirm("Are you sure you want to archive this vendor?")) {
      try {
        await api.patch(`/vendors/${id}/archive`);
        toast.success("Vendor archived successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to archive vendor");
      }
    }
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    // Mock export
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          const rows = text.split("\n");
          const headers = rows[0].split(",").map(h => h.trim());
          
          const importedVendors = rows.slice(1).map(row => {
            const values = row.split(",").map(v => v.trim());
            const vendor: any = {};
            headers.forEach((header, index) => {
              if (values[index]) {
                const key = header.charAt(0).toLowerCase() + header.slice(1).replace(/\s+/g, '');
                vendor[key] = values[index];
              }
            });
            return vendor;
          }).filter(v => v.name);

          if (importedVendors.length > 0) {
            try {
              toast.loading(`Importing ${importedVendors.length} vendors...`);
              await api.post("/vendors/import", { vendors: importedVendors });
              toast.dismiss();
              toast.success(`Successfully imported ${importedVendors.length} vendors`);
              fetchData();
            } catch (error) {
              toast.dismiss();
              toast.error("Failed to import vendors");
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const VENDOR_COLUMNS = [
    { key: "name", label: "Vendor Name" },
    { key: "contact", label: "Contact Person" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "status", label: "Status" },
    { key: "orders", label: "Total Orders" },
    { key: "country", label: "Country" },
    { key: "terms", label: "Payment Terms" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">Vendors</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">Manage your supplier directory and procurement relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10">
              <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs font-bold">CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')} className="text-xs font-bold">EXCEL</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-xs font-bold">PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleImport} variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-xl shadow-sm gap-2">
            <Upload className="h-4 w-4 text-slate-400" />
            <span>Import</span>
          </Button>
          
          <Button 
            onClick={() => { setSelectedVendor(null); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide"
          >
            <Plus className="h-4 w-4" />
            <span>New Vendor</span>
          </Button>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 h-11 rounded-xl">
              <TabsTrigger value="All" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">All</TabsTrigger>
              <TabsTrigger value="Active" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">Active</TabsTrigger>
              <TabsTrigger value="Inactive" className="rounded-lg text-xs font-bold uppercase tracking-wider px-6">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 w-full md:w-auto text-slate-800">
             <div className="relative flex-1 md:w-72 group">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
               <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by name, email, tax id..." 
                className="pl-10 h-11 border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d] rounded-xl shadow-soft font-medium italic" 
               />
             </div>
             
             <Button variant="outline" size="icon" onClick={() => fetchData(true)} className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/5 bg-white dark:bg-[#1f1a1d]">
               <RefreshCw className={cn("h-4 w-4 text-slate-400", refreshing && "animate-spin")} />
             </Button>

             <ColumnVisibilityDropdown 
                columns={VENDOR_COLUMNS}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
                persistenceKey="vendors_column_visibility"
             />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-slate-200 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[1000px]">
             <thead>
               <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  {visibleColumns.name && (
                    <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('name')}>
                      <div className="flex items-center gap-1">
                        Vendor Name
                        {sortField === 'name' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.contact && (
                    <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('contactPerson')}>
                      <div className="flex items-center gap-1">
                        Contact
                        {sortField === 'contactPerson' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('email')}>
                      <div className="flex items-center gap-1">
                        Email
                        {sortField === 'email' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.phone && <th className="px-6 py-4">Phone</th>}
                  {visibleColumns.status && <th className="px-6 py-4 text-center">Status</th>}
                  {visibleColumns.orders && (
                    <th className="px-6 py-4 text-center cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('orders')}>
                      <div className="flex items-center justify-center gap-1">
                        Orders
                        {sortField === 'orders' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </div>
                    </th>
                  )}
                  {visibleColumns.country && <th className="px-6 py-4 text-center">Country</th>}
                  {visibleColumns.terms && <th className="px-6 py-4 text-center">Terms</th>}
                  <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs">
               {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                   <tr key={i}>
                     {Object.entries(visibleColumns).filter(([_, v]) => v).map((_, j) => (
                       <td key={j} className="px-6 py-5"><Skeleton className="h-4 w-full" /></td>
                     ))}
                     <td className="px-6 py-5"><Skeleton className="h-4 w-full" /></td>
                   </tr>
                 ))
               ) : (
                 vendors.map((v) => (
                   <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                     {visibleColumns.name && (
                       <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/purchase/vendors/${v.id}`)}>
                             <span className="text-sm font-bold text-slate-800 dark:text-slate-100 italic group-hover:text-blue-600 transition-colors">{v.name}</span>
                             <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest italic">{v.taxNumber || 'No Tax ID'}</span>
                          </div>
                        </div>
                      </td>
                     )}
                     {visibleColumns.contact && (
                       <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-bold text-slate-700 dark:text-slate-200">{v.contactPerson || '-'}</span>
                        </div>
                      </td>
                     )}
                     {visibleColumns.email && (
                       <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 w-fit px-2 py-0.5 rounded-lg border border-slate-100 dark:border-white/5">
                          <Mail className="h-3 w-3" />
                          <span className="text-[10px] font-mono italic">{v.email || '-'}</span>
                        </div>
                      </td>
                     )}
                     {visibleColumns.phone && (
                       <td className="px-6 py-5">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{v.phone || '-'}</span>
                      </td>
                     )}
                     {visibleColumns.status && (
                       <td className="px-6 py-5 text-center">
                        <Badge className={cn(
                          "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                          v.status === "Active" ? "bg-emerald-50 text-emerald-600 shadow-emerald-500/10" : "bg-slate-100 text-slate-400"
                        )}>
                          {v.status === "Active" ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                     )}
                     {visibleColumns.orders && (
                       <td className="px-6 py-5 text-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{v._count?.purchaseOrders || 0}</span>
                      </td>
                     )}
                     {visibleColumns.country && (
                       <td className="px-6 py-5 text-center uppercase tracking-widest text-[10px] font-bold text-slate-500">
                        {v.country || '-'}
                      </td>
                     )}
                     {visibleColumns.terms && (
                       <td className="px-6 py-5 text-center font-mono">
                        {v.paymentTerms} Days
                      </td>
                     )}
                     <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10"
                            onClick={() => navigate(`/purchase/vendors/${v.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:bg-white/10"
                            onClick={() => { setSelectedVendor(v); setIsFormOpen(true); }}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-48 rounded-xl dark:bg-[#1f1a1d] dark:border-white/10 p-2">
                               <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 dark:focus:bg-blue-600/10 py-2.5 cursor-pointer">
                                 <Phone className="h-3.5 w-3.5" /> Call Vendor
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                 onClick={() => navigate(`/purchase/vendors/${v.id}?tab=orders`)}
                                 className="text-xs font-bold gap-2 py-2.5 cursor-pointer"
                                >
                                 <FileText className="h-3.5 w-3.5" /> View Purchase History
                               </DropdownMenuItem>
                               <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />
                               <DropdownMenuItem 
                                onClick={() => handleArchive(v.id)}
                                className="text-xs font-bold gap-2 text-red-500 py-2.5 cursor-pointer"
                               >
                                 <Trash2 className="h-3.5 w-3.5" /> Archive Vendor
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>

         {/* Pagination Footer */}
         {!loading && vendors.length > 0 && (
           <div className="bg-slate-50/50 dark:bg-white/5 px-6 py-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-blue-500/10 underline underline-offset-4">
                Showing {vendors.length} Suppliers
              </span>
              <div className="flex gap-1">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4 rotate-180" /></Button>
                 <Button variant="ghost" className="h-8 min-w-[32px] rounded-xl font-bold text-[10px] bg-blue-600 text-white shadow-premium">1</Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
              </div>
           </div>
         )}
      </Card>

      {/* Empty State */}
      {!loading && vendors.length === 0 && (
         <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-700">
               <Building2 className="h-10 w-10" />
            </div>
            <div className="text-center">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest italic">No Vendors Found</h3>
               <p className="text-slate-400 text-sm max-w-xs mt-1">There are no vendors matching your criteria. Start adding suppliers to see them here!</p>
            </div>
            <Button 
              onClick={() => { setSelectedVendor(null); setIsFormOpen(true); }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl shadow-premium uppercase tracking-widest text-[10px]"
            >
               Add New Vendor
            </Button>
         </div>
      )}

      {/* Vendor Form Modal */}
      <VendorForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vendor={selectedVendor}
        onSuccess={fetchData}
      />
    </div>
  );
}

