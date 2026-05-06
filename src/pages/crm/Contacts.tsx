import React from "react";
import { 
  Plus, 
  Search, 
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CONTACTS = [
  { id: 1, name: "Sarah Jenkins", primary: true, customer: "Global Trade Corp", title: "Operations Manager", email: "sarah@globaltrade.com", phone: "+1 234 567 8901", avatar: "SJ" },
  { id: 2, name: "Mike Ross", primary: false, customer: "Global Trade Corp", title: "Sales Director", email: "mike@globaltrade.com", phone: "+1 234 567 8902", avatar: "MR" },
  { id: 3, name: "Alice Lee", primary: true, customer: "TechFlow Solutions", title: "CTO", email: "alice@techflow.io", phone: "+1 345 678 9012", avatar: "AL" },
  { id: 4, name: "Kevin Brown", primary: true, customer: "Nexa Logistics", title: "Head of Supply Chain", email: "kevin@nexa.com", phone: "+1 567 890 1234", avatar: "KB" },
  { id: 5, name: "Jane Doe", primary: true, customer: "Zenith Design", title: "Lead Designer", email: "jane@zenith.design", phone: "+1 678 901 2345", avatar: "JD" },
  { id: 6, name: "Tom Riddle", primary: false, customer: "Alpha Tech", title: "Developer", email: "tom@alphatech.com", phone: "+1 789 012 3456", avatar: "TR" },
  { id: 7, name: "Steve King", primary: true, customer: "Blue Sky Media", title: "Marketing Head", email: "steve@bluesky.com", phone: "+1 890 123 4567", avatar: "SK" },
];

export default function ContactsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Contacts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">All contacts across all customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="dark:bg-[#1f1a1d] dark:border-white/5 dark:text-slate-200 font-bold h-10 px-4 rounded-lg shadow-sm gap-2">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-lg shadow-premium gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-2 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-10 h-10 border-none bg-slate-50 dark:bg-white/5 dark:text-slate-200 rounded-xl focus-visible:ring-0" 
            />
          </div>
          <Button variant="ghost" className="h-10 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5 gap-2">
            <Columns className="h-4 w-4 text-slate-400" />
            Columns
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white dark:border-white/10 shadow-sm rounded-xl">
                        <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">{contact.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{contact.name}</p>
                          {contact.primary && (
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] h-3.5 px-1 uppercase font-bold">Primary</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{contact.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{contact.customer}</p>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                      {contact.title}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                       <Mail className="h-3 w-3" />
                       <p className="text-[11px] font-bold">{contact.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                       <Phone className="h-3 w-3" />
                       <p className="text-[11px] font-bold">{contact.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing 1-7 of 7 contacts</p>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5" disabled>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
