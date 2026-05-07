import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  FileEdit, 
  Trash2, 
  Mail, 
  Tag, 
  Variable, 
  Database,
  Filter,
  Columns,
  MoreVertical,
  ChevronRight,
  Loader2,
  RefreshCcw,
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
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    isActive: true
  });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/email-templates');
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEdit = (tmpl: any) => {
    setEditingTemplate(tmpl);
    setFormData({
      name: tmpl.name,
      subject: tmpl.subject,
      body: tmpl.body,
      isActive: tmpl.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingTemplate) {
        const response = await api.put(`/system/email-templates/${editingTemplate.id}`, formData);
        if (response.success) {
          toast.success("Template updated successfully");
          fetchTemplates();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      toast.error("Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  const filteredTemplates = templates.filter(tmpl => 
    tmpl.name.toLowerCase().includes(search.toLowerCase()) || 
    tmpl.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Email Templates</h1>
          <p className="text-sm text-slate-500 font-medium">Manage automated system emails and dynamic message content.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchTemplates} className="rounded-xl border-slate-200">
            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200">
             <Database className="h-4 w-4 mr-2" /> All Variables
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search templates by name or subject..." 
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
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Template</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Subject</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && templates.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={4} className="py-20 text-center">
                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Templates...</p>
                 </TableCell>
               </TableRow>
            ) : filteredTemplates.map((tmpl) => (
              <TableRow key={tmpl.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                       <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{tmpl.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-500 font-medium italic truncate max-w-[250px]">
                  {tmpl.subject}
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className={cn(
                     "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                     tmpl.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                   )}>
                      {tmpl.isActive ? 'Active' : 'Inactive'}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50" 
                            title="Edit Template"
                            onClick={() => handleEdit(tmpl)}
                          >
                           <FileEdit className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Edit Email Template</DialogTitle>
            <DialogDescription>
              Configure the subject and HTML body for this automated notification. Use {"{{ }} "} for variables.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
             <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Template Name</Label>
                <Input value={formData.name} disabled className="rounded-xl bg-slate-50 border-none h-11" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Email Subject</Label>
                <Input 
                  value={formData.subject} 
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="rounded-xl bg-slate-50 border-none h-11" 
                />
             </div>
             <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Content Body (HTML)</Label>
                   <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600 hover:bg-blue-50">
                      <Variable className="h-3 w-3 mr-1" /> Variable Help
                   </Button>
                </div>
                <Textarea 
                  value={formData.body} 
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="min-h-[300px] rounded-xl bg-slate-50 border-none font-mono text-sm leading-relaxed" 
                />
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
