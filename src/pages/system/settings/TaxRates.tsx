import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Percent, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BadgeCheck,
  Search,
  FileText,
  Loader2,
  RefreshCcw
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function TaxRatesPage() {
  const [taxRates, setTaxRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    rate: 0,
    isActive: true
  });

  const fetchTaxRates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/tax-rates');
      if (response.success) {
        setTaxRates(response.data);
      }
    } catch (error) {
      toast.error("Failed to load tax rates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxRates();
  }, [fetchTaxRates]);

  const handleOpenDialog = (rate?: any) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        name: rate.name,
        rate: rate.rate,
        isActive: rate.isActive
      });
    } else {
      setEditingRate(null);
      setFormData({
        name: "",
        rate: 0,
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingRate) {
        const response = await api.put(`/system/tax-rates/${editingRate.id}`, formData);
        if (response.success) {
          toast.success("Tax rate updated");
          fetchTaxRates();
          setIsDialogOpen(false);
        }
      } else {
        const response = await api.post('/system/tax-rates', formData);
        if (response.success) {
          toast.success("Tax rate created");
          fetchTaxRates();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tax rate?")) return;
    try {
      const response = await api.delete(`/system/tax-rates/${id}`);
      if (response.success) {
        toast.success("Tax rate deleted");
        fetchTaxRates();
      }
    } catch (error) {
      toast.error("Failed to delete tax rate");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Tax Rates</h1>
          <p className="text-sm text-slate-500 font-medium italic">Configure tax types and percentage rates used in billing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchTaxRates} className="rounded-xl border-slate-200">
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Add Tax Rate
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Name</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Rate %</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && taxRates.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={4} className="py-20 text-center">
                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Tax Rates...</p>
                 </TableCell>
               </TableRow>
            ) : taxRates.map((tax) => (
              <TableRow key={tax.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{tax.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-black text-xs px-2.5 py-1 rounded-lg">
                    {tax.rate.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className={cn(
                     "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                     tax.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                      onClick={() => handleOpenDialog(tax)}
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
                        <DropdownMenuItem onClick={() => handleDelete(tax.id)} className="text-rose-600 py-2">Delete Tax</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {editingRate ? "Edit Tax Rate" : "Add Tax Rate"}
            </DialogTitle>
            <DialogDescription>
              Set name and percentage for this tax rule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             <div className="space-y-2">
               <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Tax Name</Label>
               <Input 
                 placeholder="e.g. VAT 20%, GST 5%" 
                 value={formData.name}
                 onChange={e => setFormData({ ...formData, name: e.target.value })}
                 className="rounded-xl bg-slate-50 border-none h-11"
               />
             </div>
             <div className="space-y-2">
               <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Percentage Rate (%)</Label>
               <Input 
                 type="number"
                 step="0.1"
                 value={formData.rate}
                 onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                 className="rounded-xl bg-slate-50 border-none h-11 font-mono font-bold"
               />
             </div>
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-700">Active Status</Label>
               </div>
               <Switch 
                 checked={formData.isActive}
                 onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
               />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20">
              {editingRate ? "Save Changes" : "Create Tax Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
