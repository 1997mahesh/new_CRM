import React, { useState, useEffect, useCallback } from "react";
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
  Settings,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  crm: Users,
  sales: Target,
  purchase: ShoppingBag,
  inventory: Package,
  support: Headphones,
  finance: CreditCard,
  reports: BarChart2,
  projects: Briefcase,
};

const COLOR_MAP: Record<string, string> = {
  crm: "text-blue-600 bg-blue-50",
  sales: "text-emerald-600 bg-emerald-50",
  purchase: "text-amber-600 bg-amber-50",
  inventory: "text-indigo-600 bg-indigo-50",
  support: "text-rose-600 bg-rose-50",
  finance: "text-cyan-600 bg-cyan-50",
  reports: "text-violet-600 bg-violet-50",
  projects: "text-slate-600 bg-slate-50",
};

export default function ModuleManagerPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/modules');
      if (response.success) {
        setModules(response.data);
      }
    } catch (error) {
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleToggle = async (code: string, currentStatus: boolean) => {
    try {
      const response = await api.post(`/system/modules/${code}/toggle`, { enabled: !currentStatus });
      if (response.success) {
        toast.success(`Module ${code} ${!currentStatus ? 'enabled' : 'disabled'}`);
        setModules(prev => prev.map(m => m.code === code ? { ...m, isEnabled: !currentStatus } : m));
      }
    } catch (error) {
      toast.error("Failed to toggle module");
    }
  };

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
        <Button variant="outline" onClick={fetchModules} className="rounded-xl border-slate-200 h-11 px-6">
           <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      {loading && modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Scanning System Modules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = ICON_MAP[module.code.toLowerCase()] || Settings;
            const colorClass = COLOR_MAP[module.code.toLowerCase()] || "text-slate-600 bg-slate-50";
            
            return (
              <Card key={module.id} className={cn(
                "border-none shadow-soft transition-all duration-300 group overflow-hidden flex flex-col",
                !module.isEnabled && "opacity-75 grayscale-[0.5]"
              )}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", colorClass)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Switch 
                        checked={module.isEnabled} 
                        onCheckedChange={() => handleToggle(module.code, module.isEnabled)}
                        className="data-[state=checked]:bg-blue-600" 
                      />
                  </div>
                  
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-800">{module.name}</h3>
                        {module.isEnabled && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none px-1.5 py-0 text-[10px] font-bold uppercase">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {module.description || `Management system for ${module.name} tasks and data.`}
                      </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{module.code} module</span>
                      <div className="flex items-center gap-2">
                        {module.isEnabled ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                      </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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

import { Button } from "@/components/ui/button";
