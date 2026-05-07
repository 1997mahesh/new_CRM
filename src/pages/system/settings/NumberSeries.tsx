import React, { useState, useEffect, useCallback } from "react";
import { 
  Hash, 
  Search, 
  MoreVertical, 
  RefreshCcw, 
  Edit2, 
  Trash2, 
  Layers, 
  Settings,
  Columns,
  PlayCircle,
  Loader2,
  Save
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function NumberSeriesPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    prefix: "",
    suffix: "",
    padding: 4,
    nextNumber: 1
  });

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/number-series');
      if (response.success) {
        setSeries(response.data);
      }
    } catch (error) {
      toast.error("Failed to load number series");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleEdit = (item: any) => {
    setEditingSeries(item);
    setFormData({
      prefix: item.prefix || "",
      suffix: item.suffix || "",
      padding: item.padding,
      nextNumber: item.nextNumber
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingSeries) {
        const response = await api.put(`/system/number-series/${editingSeries.id}`, formData);
        if (response.success) {
          toast.success("Number series updated");
          fetchSeries();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      toast.error("Failed to update series");
    } finally {
      setSaving(false);
    }
  };

  const getPreview = (item: any) => {
    const num = String(item.nextNumber).padStart(item.padding, '0');
    return `${item.prefix || ""}${num}${item.suffix || ""}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Number Series</h1>
          <p className="text-sm text-slate-500 font-medium italic">Configure automated sequencing patterns for various system documents.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchSeries} className="rounded-xl border-slate-200">
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Module</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Prefix</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Suffix</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Padding</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Next</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Preview</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && series.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={7} className="py-20 text-center">
                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Sequences...</p>
                 </TableCell>
               </TableRow>
            ) : series.map((item) => (
              <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                       <Layers className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge variant="outline" className="bg-slate-50 text-slate-400 border-none font-mono text-[10px] font-bold uppercase">{item.prefix || "-"}</Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-400 italic">
                  {item.suffix || "None"}
                </TableCell>
                <TableCell className="py-4 px-6 text-sm font-medium text-slate-600">
                  {item.padding}
                </TableCell>
                <TableCell className="py-4 px-6 font-bold text-sm text-slate-800">
                  {item.nextNumber}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className="bg-blue-600 text-white border-none rounded-lg font-mono text-[11px] px-2 py-0.5 shadow-sm">
                    {getPreview(item)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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
            <DialogTitle className="text-xl font-bold text-slate-800">Edit Number Series</DialogTitle>
            <DialogDescription>
              Configure the pattern for {editingSeries?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Prefix</Label>
                 <Input 
                   value={formData.prefix}
                   onChange={e => setFormData({ ...formData, prefix: e.target.value })}
                   className="rounded-xl bg-slate-50 border-none h-11 font-mono" 
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Suffix</Label>
                 <Input 
                   value={formData.suffix}
                   onChange={e => setFormData({ ...formData, suffix: e.target.value })}
                   className="rounded-xl bg-slate-50 border-none h-11 font-mono" 
                 />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Digits Padding</Label>
                 <Input 
                   type="number"
                   value={formData.padding}
                   onChange={e => setFormData({ ...formData, padding: parseInt(e.target.value) })}
                   className="rounded-xl bg-slate-50 border-none h-11" 
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Next Number</Label>
                 <Input 
                   type="number"
                   value={formData.nextNumber}
                   onChange={e => setFormData({ ...formData, nextNumber: parseInt(e.target.value) })}
                   className="rounded-xl bg-slate-50 border-none h-11" 
                 />
               </div>
             </div>
             
             <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1">Live Preview</p>
                <p className="text-2xl font-mono font-bold text-blue-700 tracking-tight">
                  {formData.prefix}{String(formData.nextNumber).padStart(formData.padding, '0')}{formData.suffix}
                </p>
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
