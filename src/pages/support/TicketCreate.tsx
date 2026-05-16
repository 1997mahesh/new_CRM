import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  FileText,
  Tag,
  ShieldAlert,
  Clock,
  UserCheck,
  Globe,
  HelpCircle,
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

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SOURCES = ["Web", "Email", "Phone", "Chat", "Internal"];

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Initial form state
  const [formData, setFormData] = useState({
    subject: searchParams.get("subject") || "",
    customerId: searchParams.get("customerId") || "",
    customerName: searchParams.get("customerName") || "",
    category: searchParams.get("category") || "",
    priority: searchParams.get("priority") || "Medium",
    source: "Web",
    assignedUserId: searchParams.get("assignTo") || "unassigned",
    description: "",
    status: "Open",
    slaDueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // Default 48h
  });

  useEffect(() => {
    const savedCategories = localStorage.getItem("support_categories");
    let activeCategories: any[] = [];
    
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed)) {
          activeCategories = parsed.filter((c: any) => c.active);
        }
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }

    // Fallback to minimal seed if empty to avoid broken UI
    if (activeCategories.length === 0) {
      activeCategories = [
        { id: "cat_1", name: "Technical Support", active: true },
        { id: "cat_2", name: "Billing & Finance", active: true },
        { id: "cat_3", name: "Product Training", active: true },
        { id: "cat_4", name: "Feature Requests", active: true },
      ];
    }

    setCategories(activeCategories);
    if (!formData.category && activeCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: activeCategories[0].name }));
    }
  }, []);

  useEffect(() => {
    const fetchRequired = async () => {
      try {
        const [userRes, custRes] = await Promise.all([
          api.get('/users'),
          api.get('/customers')
        ]);
        if (userRes.success) setUsers(userRes.data || []);
        if (custRes.success) setCustomers(custRes.data?.items || custRes.data || []);
      } catch (error) {
        console.error("Failed to load required data", error);
      }
    };
    fetchRequired();
  }, []);

  // Auto-calculate SLA based on priority
  useEffect(() => {
    let hours = 48;
    if (formData.priority === 'Critical') hours = 4;
    if (formData.priority === 'High') hours = 12;
    if (formData.priority === 'Medium') hours = 24;
    if (formData.priority === 'Low') hours = 72;

    const dueDate = new Date(Date.now() + hours * 60 * 60 * 1000);
    setFormData(prev => ({ ...prev, slaDueDate: dueDate.toISOString() }));
  }, [formData.priority]);

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
        
        // Keep internal ones just in case
        customerName: selectedCustomer ? selectedCustomer.name : formData.customerName,
        assignedUserId: formData.assignedUserId === 'unassigned' ? null : formData.assignedUserId
      };

      const response = await api.post('/support/tickets', payload);
      if (response.success) {
        toast.success("Support ticket created!");
        navigate('/support/tickets');
      } else {
        toast.error(response.message || "Failed to create ticket");
      }
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

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
               <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
               New Intelligence Ticket
            </h1>
            <p className="text-sm text-slate-500 italic font-medium">Drafting a high-priority resolution case.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-6 h-11 font-bold italic border-slate-200 dark:border-white/10 dark:bg-white/5">
            Discard Draft
          </Button>
          <Button 
            type="submit"
            form="ticket-form"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 font-black italic shadow-premium shadow-blue-600/30 gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save & Ship Ticket
          </Button>
        </div>
      </div>

      <form id="ticket-form" onSubmit={saveTicket} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
               <Badge className="bg-blue-600/10 text-blue-600 border-none font-black italic text-[9px] uppercase tracking-widest px-3 py-1">Drafting Mode</Badge>
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
                   <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] uppercase font-black tracking-widest text-slate-400 italic gap-2 hover:bg-slate-100">
                         <Paperclip className="h-3 w-3" />
                         Attach Assets
                      </Button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-white/5">
                 <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-600/5 border border-orange-100/50 dark:border-orange-900/20 flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-[#1f1a1d] shadow-sm flex items-center justify-center shrink-0">
                       <HelpCircle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">Pro Tip</p>
                       <p className="text-xs text-slate-600 dark:text-slate-400 italic">Include specific order IDs or transaction hashes for faster resolution.</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-600/5 border border-blue-100/50 dark:border-blue-900/20 flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white dark:bg-[#1f1a1d] shadow-sm flex items-center justify-center shrink-0">
                       <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Dynamic SLA</p>
                       <p className="text-xs text-slate-600 dark:text-slate-400 italic">Ticket SLA will be automatically assigned based on priority.</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">CLASSIFICATION & ROUTING</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic flex items-center gap-2">
                   <Building2 className="h-3 w-3" /> Customer / Account
                </Label>
                <Select value={formData.customerId} onValueChange={(val) => setFormData({ ...formData, customerId: val })}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-bold italic shadow-sm">
                    <SelectValue placeholder="Link to Customer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl italic">
                    <SelectItem value="walkin" className="italic text-slate-400 font-bold">-- Quick Walk-In Customer --</SelectItem>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id} className="italic">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.customerId && (
                  <Input 
                    placeholder="Enter customer name manually..." 
                    className="h-10 rounded-xl border-slate-100 dark:border-white/5 text-[10px] mt-1 italic font-bold" 
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  />
                )}
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
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.name} className="italic">{c.name}</SelectItem>
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
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft rounded-2xl overflow-hidden bg-white dark:bg-[#211c1f]">
            <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">OWNERSHIP & DEADLINE</CardTitle>
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
                    <SelectItem value="unassigned" className="italic text-slate-400 font-bold">-- Auto Assign / Keep Unassigned --</SelectItem>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id} className="italic font-medium">{u.firstName} {u.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
               </div>

               <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-premium">
                        <Clock className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest italic leading-none mb-1">Calculated SLA</p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 italic">
                           {new Date(formData.slaDueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                     </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Status</span>
                     <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase tracking-tighter px-2 h-4">On Track</Badge>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
