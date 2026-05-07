import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Ticket as TicketIcon,
  User,
  MessageSquare,
  Building2,
  AlertCircle,
  Paperclip,
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const DEPARTMENTS = ["Technical Support", "Billing", "Sales", "General Inquiry", "Urgent Assistance"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export function TicketCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    subject: "",
    customerId: "",
    customerName: "",
    department: "Technical Support",
    priority: "Medium",
    assignedUserId: "",
    description: "",
    attachmentUrl: "",
    status: "Open"
  });

  useEffect(() => {
    const fetchRequired = async () => {
      try {
        const [userRes, custRes] = await Promise.all([
          api.get('/users'),
          api.get('/crm/customers')
        ]);
        if (userRes.success) setUsers(userRes.data);
        if (custRes.success) setCustomers(custRes.data);
      } catch (error) {
        console.error("Failed to load required data");
      }
    };
    fetchRequired();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error("Subject and description are required");
      return;
    }

    setLoading(true);
    try {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      const payload = {
        ...formData,
        customerName: selectedCustomer?.name || formData.customerName
      };

      const response = await api.post('/tickets', payload);
      if (response.success) {
        toast.success("Support ticket created!");
        navigate('/support/tickets');
      }
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-slate-800">New Support Ticket</h1>
            <p className="text-sm text-slate-500">Open a new case for customer support or issue tracking.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6">
            Discard
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 shadow-lg shadow-purple-600/20"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Create Ticket
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-purple-600" />
                 Ticket Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="subject" className="text-xs font-bold uppercase text-slate-500 ml-1">Subject *</Label>
                <div className="relative group">
                  <TicketIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  <Input 
                    id="subject"
                    required
                    placeholder="Brief summary of the issue" 
                    className="pl-10 h-11 rounded-xl border-slate-200"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase text-slate-500 ml-1">Detailed Description *</Label>
                <Textarea 
                  id="description"
                  required
                  placeholder="Explain the problem in detail so the agent can help..." 
                  className="min-h-[200px] rounded-xl border-slate-200 focus:ring-purple-100"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors group">
                 <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-purple-600 transition-colors">
                   <Paperclip className="h-5 w-5" />
                 </div>
                 <p className="text-xs font-bold text-slate-500">Click or drag to upload attachments (Max 5MB)</p>
                 <Input type="file" className="hidden" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Case Classification</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Customer / Requester</Label>
                <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Search Registered Client" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.customerId && (
                  <Input 
                    placeholder="Or enter name manually..." 
                    className="h-10 rounded-xl border-slate-100 text-xs mt-1" 
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  />
                )}
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Department</Label>
                <Select value={formData.department} onValueChange={(val) => setFormData({ ...formData, department: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {DEPARTMENTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Ownership</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500 ml-1">Assigned Support Agent</Label>
                <Select value={formData.assignedUserId} onValueChange={(val) => setFormData({ ...formData, assignedUserId: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Assign To Specialist" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
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
