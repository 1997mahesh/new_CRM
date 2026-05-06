import React from "react";
import { 
  Users, 
  Target, 
  ShoppingBag, 
  Package, 
  Headphones, 
  BarChart2, 
  CreditCard, 
  Briefcase,
  Layers,
  CheckCircle2,
  XCircle,
  Settings
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const MODULES = [
  { id: "crm", icon: Users, title: "CRM", description: "Customer relationship management and lead tracking.", active: true, color: "text-blue-600 bg-blue-50" },
  { id: "sales", icon: Target, title: "Sales", description: "Invoices, quotations, and sales order processing.", active: true, color: "text-emerald-600 bg-emerald-50" },
  { id: "purchase", icon: ShoppingBag, title: "Purchase", description: "Vendor management and purchase orders.", active: true, color: "text-amber-600 bg-amber-50" },
  { id: "inventory", icon: Package, title: "Inventory", description: "Warehouse management and stock tracking.", active: true, color: "text-indigo-600 bg-indigo-50" },
  { id: "support", icon: Headphones, title: "Support", description: "Ticketing system and customer support portal.", active: true, color: "text-rose-600 bg-rose-50" },
  { id: "finance", icon: CreditCard, title: "Finance", description: "General ledger, expenses and financial reports.", active: true, color: "text-cyan-600 bg-cyan-50" },
  { id: "reports", icon: BarChart2, title: "Reports", description: "Advanced analytics and business intelligence.", active: true, color: "text-violet-600 bg-violet-50" },
  { id: "projects", icon: Briefcase, title: "Projects", description: "Project planning, tasks, and time tracking.", active: false, color: "text-slate-600 bg-slate-50" },
];

export default function ModuleManagerPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Layers className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Module Manager</h1>
            <p className="text-sm text-slate-500 font-medium">Enable or disable core system modules dynamically and configure global behavior.</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MODULES.map((module) => (
          <Card key={module.id} className={cn(
            "border-none shadow-soft transition-all duration-300 group overflow-hidden flex flex-col",
            !module.active && "opacity-75 grayscale-[0.5]"
          )}>
            <CardContent className="p-6 flex flex-col h-full">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", module.color)}>
                     <module.icon className="h-6 w-6" />
                  </div>
                  <Switch checked={module.active} className="data-[state=checked]:bg-blue-600" />
               </div>
               
               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                    {module.active && (
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none px-1.5 py-0 text-[10px] font-bold uppercase">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {module.description}
                  </p>
               </div>

               <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{module.id} module</span>
                  <div className="flex items-center gap-2">
                     <Settings className="h-3 w-3 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />
                     {module.active ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-slate-900 border-none shadow-xl shadow-slate-900/20 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Settings className="h-32 w-32 text-white" />
         </div>
         <CardContent className="p-8 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Architectural Note</h3>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Disabling a module will hide related sidebar navigation, routes, and API endpoints for all users except system administrators. Permission checks are strictly enforced based on active module states.
            </p>
            <div className="mt-6 flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Global Sync Active</span>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
