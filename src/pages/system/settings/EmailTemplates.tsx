import React from "react";
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
  ChevronRight
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: 1, name: "Invoice Sent", subject: "New Invoice from {{crm_name}} - {{invoice_number}}", variables: ["crm_name", "customer_name", "invoice_number", "amount"], status: "Active" },
  { id: 2, name: "Low Stock Alert", subject: "Attention: Low Stock for {{product_name}}", variables: ["product_name", "sku", "current_stock"], status: "Active" },
  { id: 3, name: "Password Reset", subject: "Reset your {{crm_name}} password", variables: ["user_name", "reset_link"], status: "Active" },
  { id: 4, name: "Quotation Sent", subject: "Quotation Request: {{quotation_id}}", variables: ["customer_name", "quotation_id", "link"], status: "Active" },
  { id: 5, name: "Ticket Opened", subject: "Support Ticket #{{ticket_id}} confirmed", variables: ["customer_name", "ticket_id", "subject"], status: "Active" },
  { id: 6, name: "Ticket Reply", subject: "Update on your Ticket #{{ticket_id}}", variables: ["agent_name", "ticket_id"], status: "Active" },
];

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Email Templates</h1>
          <p className="text-sm text-slate-500 font-medium">Manage automated system emails and dynamic message content.</p>
        </div>

        <div className="flex items-center gap-3">
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
            className="pl-10 h-10 border-none bg-slate-50 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20" 
          />
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 text-slate-600">
                <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 text-slate-600">
                <Columns className="h-4 w-4 mr-2" /> Columns
            </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Template</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Subject</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Variables</TableHead>
              <TableHead className="py-4 px-6 text-[10px] uppercase font-bold tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-[10px] uppercase font-bold tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEMPLATES.map((tmpl) => (
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
                  <div className="flex flex-wrap gap-1">
                    {tmpl.variables.map((v) => (
                        <Badge key={v} className="bg-slate-100 text-slate-500 border-none rounded px-1.5 py-0 text-[9px] font-mono lowercase">
                            {"{{"}{v}{"}}"}
                        </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                   <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {tmpl.status}
                   </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Edit Template"><FileEdit className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
