import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Ticket as TicketIcon,
  MessageSquare,
  Building2,
  Paperclip,
  Loader2,
  Tag,
  ShieldAlert,
  Clock,
  UserCheck,
  Globe,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const CATEGORIES = ["Technical", "Billing", "Sales", "General", "Onboarding"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SOURCES = ["Web", "Email", "Phone", "Chat", "Internal"];
const STATUSES = ["Open", "In Progress", "Pending", "Solved", "Closed"];

export default function TicketEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Initial form state
  const [formData, setFormData] = useState({
    subject: "",
    customerId: "",
    customerName: "",
    category: "Technical",
    priority: "Medium",
    source: "Web",
    assignedUserId: "unassigned",
    description: "",
    status: "Open",
    slaDueDate: ""
  });

  useEffect(() => {
    const fetchRequired = async () => {
      try {
        const [userRes, custRes, ticketRes] = await Promise.all([
          api.get('/users'),
          api.get('/customers'),
          api.get(`/support/tickets/${id}`)
        ]);
        
        if (userRes.success) setUsers(userRes.data || []);
        if (custRes.success) setCustomers(custRes.data?.items || custRes.data || []);
        
        if (ticketRes.success && ticketRes.data) {
          const t = ticketRes.data;
          setFormData({
            subject: t.subject || "",
            customerId: t.customerId || "",
            customerName: t.customerName || "",
            category: t.category || "Technical",
            priority: t.priority || "Medium",
            source: t.source || "Web",
            assignedUserId: t.assignedUserId || "unassigned",
            description: t.description || "",
            status: t.status || "Open",
            slaDueDate: t.slaDueDate || ""
          });
        }
      } catch (error) {
        console.error("Failed to load required data", error);
        toast.error("Failed to load ticket details");
      } finally {
        setFetching(false);
      }
    };
    fetchRequired();
  }, [id]);

  const saveTicket = async (e: React.FormEvent) => {
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
        // Match required payload from request
        customer_id: formData.customerId,
        category_id: formData.category,
        assigned_to: formData.assignedUserId === 'unassigned' ? null : formData.assignedUserId,

        // Keep internal ones
        customerName: selectedCustomer ? selectedCustomer.name : formData.customerName,
        assignedUserId: formData.assignedUserId === 'unassigned' ? null : formData.assignedUserId
      };

      const response = await api.put(`/support/tickets/${id}`, payload);
      if (response.success) {
        toast.success("Support ticket updated successfully!");
        navigate(`/support/tickets/${id}`);
      } else {
        toast.error(response.message || "Failed to update ticket");
      }
    } catch (error) {
      toast.error("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-bold italic animate-pulse">Retrieving case intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 font-jakarta">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 italic tracking-tight flex items-center gap-2">
               <Sparkles className="h-6 w-6 text-blue-600" />
               Edit Intelligence Case
            </h1>
            <p className="text-sm text-slate-500 italic font-medium">Modifying resolution parameters for current ticket.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6 h-11 font-bold italic border-slate-200 dark:border-white/10 dark:bg-white/5">
            Cancel
          </Button>
          <Button 
            type="submit"
            form="ticket-edit-form"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 font-black italic shadow-premium shadow-blue-600/30 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <form id="ticket-edit-form" onSubmit={saveTicket} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-lg font-black flex items-center gap-2 italic">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    ISSUE INTELLIGENCE
                  </CardTitle>
                  <CardDescription className="text-xs italic font-medium uppercase tracking-widest text-slate-400 mt-1">Core details of the support request</CardDescription>
               </div>
               <Badge className="bg-blue-600/10 text-blue-600 border-none font-black italic text-[9px] uppercase tracking-widest px-3 py-1">Editing Mode</Badge>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Ticket Subject *</Label>
                <div className="relative group">
                  <TicketIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="subject"
                    required
                    placeholder="e.g. Critical Failure: Payment Webhook Timeout" 
                    className="pl-12 h-14 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic text-lg shadow-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic text-right">Detailed Case Description *</Label>
                <div className="relative">
                   <Textarea 
                     id="description"
                     required
                     placeholder="Provide all technical context, error codes, and steps to reproduce..." 
                     className="min-h-[300px] rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5 p-6 italic font-medium focus:ring-blue-100 text-base leading-relaxed bg-slate-50/20"
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                   />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">STATUS & CLASSIFICATION</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <Clock className="h-3 w-3" /> Current Status
                </Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    {STATUSES.map(s => (
                      <SelectItem key={s} value={s} className="italic font-bold">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <ShieldAlert className="h-3 w-3" /> Priority Level
                </Label>
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Set Priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    {PRIORITIES.map(p => (
                      <SelectItem key={p} value={p} className={cn(
                        "italic font-black uppercase tracking-widest text-[10px]",
                        p === 'Critical' && "text-red-600 bg-red-50",
                        p === 'High' && "text-orange-500 bg-orange-50",
                        p === 'Medium' && "text-blue-500 bg-blue-50",
                        p === 'Low' && "text-slate-500 bg-slate-50"
                      )}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <Building2 className="h-3 w-3" /> Customer / Account
                </Label>
                <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Link to Customer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    <SelectItem value="walkin" className="italic text-slate-400 font-bold">-- Walk-In / No Account --</SelectItem>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id} className="italic">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <Tag className="h-3 w-3" /> Category
                </Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c} className="italic">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <Globe className="h-3 w-3" /> Source Channel
                </Label>
                <Select value={formData.source} onValueChange={(val) => setFormData({ ...formData, source: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    {SOURCES.map(s => (
                      <SelectItem key={s} value={s} className="italic">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">ASSIGNMENT</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <UserCheck className="h-3 w-3" /> Assigned Expert
                </Label>
                <Select value={formData.assignedUserId} onValueChange={(val) => setFormData({ ...formData, assignedUserId: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Assign To Agent" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    <SelectItem value="unassigned" className="italic text-slate-400 font-bold">-- Unassigned --</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id} className="italic font-medium">{u.firstName} {u.lastName}</SelectItem>
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
