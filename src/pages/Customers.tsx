import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone, 
  ExternalLink,
  MapPin,
  Building2,
  Briefcase
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const CUSTOMERS = [
  { id: "1", name: "Alex Thompson", email: "alex@techflow.com", phone: "+1 (555) 123-4567", company: "TechFlow Inc.", type: "Individual", status: "Active", source: "Website", user: "Sarah J." },
  { id: "2", name: "Sarah Miller", email: "sarah@nexus.io", phone: "+1 (555) 987-6543", company: "Nexus Digital", type: "Company", status: "Lead", source: "Referral", user: "Mike R." },
  { id: "3", name: "David Chen", email: "david.c@global.co", phone: "+1 (555) 444-2222", company: "Global Systems", type: "Individual", status: "Inactive", source: "Google", user: "Admin" },
  { id: "4", name: "Emma Wilson", email: "emma@creative.agency", phone: "+1 (555) 333-8888", company: "Creative Minds", type: "Company", status: "Active", source: "LinkedIn", user: "Sarah J." },
  { id: "5", name: "Robert Ross", email: "robert@greenfield.org", phone: "+1 (555) 666-1111", company: "GreenField LLC", type: "Individual", status: "Active", source: "Cold Call", user: "Mike R." },
];

export function CustomersPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500">Manage your business relationships and customer details.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-soft border border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input placeholder="Search customers by name, email, or company..." className="pl-10 h-10 border-none bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/20" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg border-slate-200">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[300px] py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Customer / Company</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Type</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Source</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Assigned To</TableHead>
              <TableHead className="py-4 px-6 text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CUSTOMERS.map((customer) => (
              <TableRow key={customer.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-soft">
                      <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{customer.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <p className="text-xs text-slate-500 truncate">{customer.company}</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border-none",
                    customer.status === "Active" ? "bg-emerald-50 text-emerald-600" : 
                    customer.status === "Lead" ? "bg-blue-50 text-blue-600" : 
                    "bg-slate-100 text-slate-500"
                  )}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-600">
                   <div className="flex items-center gap-2">
                     {customer.type === "Individual" ? <Briefcase className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                     {customer.type}
                   </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-xs text-slate-600">
                  {customer.source}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-600">
                      {customer.user.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-500">{customer.user}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-premium border-slate-100">
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4 text-slate-400" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                        <Mail className="mr-2 h-4 w-4 text-slate-400" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                        <Phone className="mr-2 h-4 w-4 text-slate-400" /> Call Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-slate-400">Showing 5 of 1,280 customers</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-8 px-3 rounded-lg text-xs opacity-50">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
