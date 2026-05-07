import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  RefreshCcw, 
  Edit2, 
  Trash2, 
  Globe, 
  DollarSign, 
  Euro, 
  BadgeCheck,
  Filter,
  Columns,
  Loader2
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    rate: 1.0,
    isActive: true,
    isDefault: false
  });

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/currencies');
      if (response.success) {
        setCurrencies(response.data);
      }
    } catch (error) {
      toast.error("Failed to load currencies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const handleOpenDialog = (currency?: any) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        rate: currency.rate,
        isActive: currency.isActive,
        isDefault: currency.isDefault
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: "",
        name: "",
        symbol: "",
        rate: 1.0,
        isActive: true,
        isDefault: false
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCurrency) {
        const response = await api.put(`/system/currencies/${editingCurrency.id}`, formData);
        if (response.success) {
          toast.success("Currency updated successfully");
          fetchCurrencies();
          setIsDialogOpen(false);
        }
      } else {
        const response = await api.post('/system/currencies', formData);
        if (response.success) {
          toast.success("Currency created successfully");
          fetchCurrencies();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this currency?")) return;
    try {
      const response = await api.delete(`/system/currencies/${id}`);
      if (response.success) {
        toast.success("Currency deleted");
        fetchCurrencies();
      }
    } catch (error) {
      toast.error("Failed to delete currency");
    }
  };

  const filteredCurrencies = currencies.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-none">
            <Globe className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Currencies</h1>
            <p className="text-sm text-slate-500 font-medium">Manage system currencies, exchange rates, and business-wide fiscal settings.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchCurrencies} className="rounded-xl border-slate-200 shadow-sm h-11 px-6 dark:border-slate-800">
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 h-11 px-6">
            <Plus className="h-4 w-4 mr-2" /> Add Currency
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search currencies by code or name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Code</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Name</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Symbol</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Exchange Rate</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Currencies...</p>
                </TableCell>
              </TableRow>
            ) : filteredCurrencies.map((currency) => (
              <TableRow key={currency.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{currency.code}</span>
                    {currency.isDefault && (
                        <Badge className="bg-blue-600 text-white border-none rounded-full px-1.5 py-0 text-[8px] font-bold uppercase">Default</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-medium text-slate-600">
                  {currency.name}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-black text-slate-800">
                  {currency.symbol}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-mono text-slate-500 font-bold">
                  {currency.rate.toFixed(4)}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className={cn(
                     "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                     currency.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                      {currency.isActive ? 'Active' : 'Inactive'}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                      onClick={() => handleOpenDialog(currency)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 rounded-xl">
                        <DropdownMenuItem 
                          className={cn("py-2", currency.isDefault ? "text-slate-300" : "text-rose-600")} 
                          disabled={currency.isDefault}
                          onClick={() => handleDelete(currency.id)}
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
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {editingCurrency ? "Edit Currency" : "Add Currency"}
            </DialogTitle>
            <DialogDescription>
              Configure currency code, rates and system usage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Currency Code</Label>
                 <Input 
                   placeholder="USD, EUR, etc." 
                   value={formData.code}
                   onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                   className="rounded-xl bg-slate-50 border-none h-11"
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Symbol</Label>
                 <Input 
                   placeholder="$, €, etc." 
                   value={formData.symbol}
                   onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                   className="rounded-xl bg-slate-50 border-none h-11"
                 />
               </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Currency Name</Label>
              <Input 
                placeholder="US Dollar, Euro, etc." 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl bg-slate-50 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Exchange Rate (vs Default)</Label>
              <Input 
                type="number"
                step="0.0001"
                value={formData.rate}
                onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                className="rounded-xl bg-slate-50 border-none h-11 font-mono font-bold"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
               <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-700">Set as Default</Label>
                  <p className="text-[10px] text-slate-400">All fiscal reports will use this currency.</p>
               </div>
               <Switch 
                 checked={formData.isDefault}
                 onCheckedChange={checked => setFormData({ ...formData, isDefault: checked })}
               />
            </div>
            <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-700">Active Status</Label>
                  <p className="text-[10px] text-slate-400">Toggle currency availability in system.</p>
               </div>
               <Switch 
                 checked={formData.isActive}
                 onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
               />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-slate-50 mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 font-bold text-slate-500">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-blue-600/20">
              {editingCurrency ? "Save Changes" : "Create Currency"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
