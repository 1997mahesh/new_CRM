import React, { useEffect, useState, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  FileText,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  draft: "bg-slate-50 text-slate-500 border-slate-100",
  rejected: "bg-rose-50 text-rose-600 border-rose-100",
  pending: "bg-amber-50 text-amber-600 border-amber-100"
};

export default function ExpensesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newExpense, setNewExpense] = useState<any>({
    description: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split('T')[0],
    merchant: "",
    paymentMethod: "Credit Card"
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;
      // Search logic would be here if API supported it, otherwise filter on frontend
      const response = await api.get('/expenses', params);
      if (response.success) {
        setItems(response.data.items);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', { type: 'expense' });
      if (response.success) setCategories(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!newExpense.categoryId || !newExpense.amount) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      let response;
      if (editingItem) {
        response = await api.put(`/expenses/${editingItem.id}`, newExpense);
      } else {
        response = await api.post('/expenses', { ...newExpense, status: 'pending' });
      }

      if (response.success) {
        toast.success(editingItem ? "Expense updated" : "Expense submitted for approval");
        setIsAddOpen(false);
        setEditingItem(null);
        fetchExpenses();
      }
    } catch (error) {
      toast.error(editingItem ? "Failed to update" : "Failed to create expense");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setNewExpense({
      description: item.description || "",
      amount: item.amount,
      categoryId: item.categoryId,
      date: new Date(item.date).toISOString().split('T')[0],
      merchant: item.merchant || "",
      paymentMethod: item.paymentMethod || "Credit Card"
    });
    setIsAddOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await api.post(`/expenses/${id}/approve`, {});
      if (response.success) {
        toast.success("Expense approved");
        fetchExpenses();
      }
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await api.post(`/expenses/${id}/reject`, { reason: 'Policy violation' });
      if (response.success) {
        toast.success("Expense rejected");
        fetchExpenses();
      }
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      if (response.success) {
        toast.success("Expense deleted");
        fetchExpenses();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredItems = items.filter(item => 
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApproved = items.filter(i => i.status === 'approved').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Expenses</h1>
          <p className="text-sm text-slate-500 font-medium"> 
            Approved this view: <span className="text-emerald-600 font-bold">${(totalApproved || 0).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-slate-200">
                <Filter className="h-4 w-4 mr-2" /> {statusFilter.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search by description, reference, or merchant..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={() => fetchExpenses()} variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><RotateCcw className="h-4 w-4" /></Button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-1">
               <Button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="ghost" size="icon" className="h-8 w-8 text-slate-400"
               >
                <ChevronRight className="h-4 w-4 rotate-180" />
               </Button>
               <span className="text-xs font-bold text-slate-600">Page {page}</span>
               <Button 
                onClick={() => setPage(p => p + 1)}
                disabled={items.length < 10}
                variant="ghost" size="icon" className="h-8 w-8 text-slate-400"
               >
                <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading expenses...</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</TableHead>
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Description</TableHead>
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</TableHead>
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</TableHead>
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Method</TableHead>
                <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((expense) => (
                <TableRow key={expense.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{expense.description || expense.merchant}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">{expense.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px] px-2 py-0">
                      {expense.category?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 font-black text-sm text-slate-800">
                    ${(expense.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                     <span className="text-xs text-slate-500">{expense.paymentMethod}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase", STATUS_COLORS[expense.status.toLowerCase()])}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {expense.status.toLowerCase() === 'pending' && (
                        <>
                          <Button 
                            onClick={() => handleApprove(expense.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleReject(expense.id)}
                            variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50" title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 rounded-xl">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(expense)}
                            className="text-slate-600 py-2"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(expense.id)}
                            className="text-rose-600 py-2"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {editingItem ? "Edit Expense" : "Submit New Expense"}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Update details of the expense claim" : "Submit your claim for approval"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="e.g., Office snacks, AWS Bill" className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input 
                  type="number"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="0.00" className="rounded-xl bg-slate-50 border-none" 
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(val) => setNewExpense({...newExpense, categoryId: val})}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={newExpense.date}
                  onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                  className="rounded-xl bg-slate-50 border-none" 
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={newExpense.paymentMethod} onValueChange={(val) => setNewExpense({...newExpense, paymentMethod: val})}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Reimbursement">Reimbursement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Merchant (Optional)</Label>
              <Input 
                value={newExpense.merchant}
                onChange={e => setNewExpense({...newExpense, merchant: e.target.value})}
                placeholder="e.g., Amazon, Starbucks" className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setIsAddOpen(false); setEditingItem(null); }} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreateOrUpdate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8">
              {editingItem ? "Update Claim" : "Submit Claim"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
