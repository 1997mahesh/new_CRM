import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Target,
  Building2,
  User,
  Mail,
  Phone,
  TrendingUp,
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

const STAGES = [
  { id: "New", name: "New" },
  { id: "Contacted", name: "Contacted" },
  { id: "Qualified", name: "Qualified" },
  { id: "Proposal", name: "Proposal" },
  { id: "Negotiation", name: "Negotiation" },
  { id: "Won", name: "Won" },
  { id: "Lost", name: "Lost" },
];

const SOURCES = ["Website", "Referral", "Cold Call", "Partner", "Trade Show", "Social Media", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export function LeadEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    source: "Website",
    pipelineStage: "New",
    value: "0",
    assignedUserId: "",
    priority: "Medium",
    notes: "",
    status: "Open"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, leadRes] = await Promise.all([
          api.get('/users'),
          api.get(`/leads/${id}`)
        ]);
        
        if (usersRes.success) setUsers(usersRes.data);
        if (leadRes.success) {
          const lead = leadRes.data;
          setFormData({
            title: lead.title || "",
            companyName: lead.companyName || "",
            contactPerson: lead.contactPerson || "",
            email: lead.email || "",
            phone: lead.phone || "",
            source: lead.source || "Website",
            pipelineStage: lead.pipelineStage || "New",
            value: lead.value?.toString() || "0",
            assignedUserId: lead.assignedUserId || "",
            priority: lead.priority || "Medium",
            notes: lead.notes || "",
            status: lead.status || "Open"
          });
        }
      } catch (error) {
        toast.error("Failed to load data");
        navigate('/sales/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.companyName) {
      toast.error("Title and Company are required");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/leads/${id}`, formData);
      if (response.success) {
        toast.success("Lead updated successfully");
        navigate('/sales/leads');
      }
    } catch (error) {
      toast.error("Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Retrieving Lead Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Lead</h1>
            <p className="text-sm text-slate-500">Update opportunity: <span className="font-bold text-blue-600 italic">"{formData.title}"</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-500 ml-1">Opportunity Title *</Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="title"
                    required
                    placeholder="e.g. Enterprise Cloud Migration" 
                    className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-blue-100"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="company" className="text-xs font-bold uppercase text-slate-500 ml-1">Company Name *</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      id="company"
                      required
                      placeholder="Organization Name" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact" className="text-xs font-bold uppercase text-slate-500 ml-1">Contact Person</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      id="contact"
                      placeholder="Full Name" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="contact@company.com" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 ml-1">Phone Number</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      id="phone"
                      placeholder="+1 (555) 000-0000" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid gap-2">
                <Label htmlFor="notes" className="text-xs font-bold uppercase text-slate-500 ml-1">Internal Notes</Label>
                <Textarea 
                  id="notes"
                  placeholder="Enter any additional background information..." 
                  className="min-h-[120px] rounded-xl border-slate-200 focus:ring-blue-100"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Pipeline Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Stage</Label>
                <Select value={formData.pipelineStage} onValueChange={(val) => setFormData({ ...formData, pipelineStage: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl overflow-hidden">
                    {STAGES.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Priority</Label>
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl overflow-hidden">
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="value" className="text-xs font-bold uppercase text-slate-500 ml-1">Lead value ($)</Label>
                <div className="relative group">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="value"
                    type="number"
                    placeholder="0.00" 
                    className="pl-10 h-11 rounded-xl border-slate-200"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
               <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Lead Source</Label>
                <Select value={formData.source} onValueChange={(val) => setFormData({ ...formData, source: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl overflow-hidden">
                    {SOURCES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Assigned To</Label>
                <Select value={formData.assignedUserId} onValueChange={(val) => setFormData({ ...formData, assignedUserId: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl overflow-hidden">
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
