import React from "react";
import { 
  Cpu, 
  HardDrive, 
  Info, 
  ShieldCheck, 
  RefreshCcw, 
  Terminal,
  Database,
  Cloud,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SystemInfoPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none dark:bg-white/10">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">System Information</h1>
            <p className="text-sm text-slate-500 font-medium">General system health, versioning, server performance, and licensing details.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm h-11 px-6 dark:border-slate-800">
            <RefreshCcw className="h-4 w-4 mr-2" /> Check Updates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Application Version" value="v2.4.0-stable" icon={Info} color="blue" />
          <InfoCard title="Database Status" value="Healthy" icon={Database} color="emerald" subtitle="Lat: 12ms" />
          <InfoCard title="Server Uptime" value="142 Days" icon={Cloud} color="indigo" subtitle="99.98% availability" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">Environment Details</CardTitle>
                        <CardDescription>Server-side runtime configuration.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <EnvItem label="Node Version" value="v20.11.0" />
                <EnvItem label="Platform" value="Linux x64" />
                <EnvItem label="Database" value="PostgreSQL 15.4" />
                <EnvItem label="Cache Store" value="Redis 7.2" />
                <EnvItem label="Storage" value="AWS S3 (US-East)" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-soft overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">License Information</CardTitle>
                        <CardDescription>Verify your enterprise subscription.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                        <ShieldCheck className="h-20 w-20 text-orange-600" />
                    </div>
                    <div className="relative z-10">
                        <Badge className="bg-orange-600 text-white border-none rounded-lg px-2 py-0 text-[10px] font-bold uppercase mb-3">Enterprise Plan</Badge>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">Active for: TPD Global corp</h4>
                        <div className="flex items-center gap-4 mt-4">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs font-bold text-slate-600">All Modules Unlocked</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-400" />
                              <span className="text-xs font-bold text-slate-600">Renews May 2027</span>
                           </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl">Manage Subscription</Button>
                </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

function EnvItem({ label, value }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
    )
}

function InfoCard({ title, value, subtitle, icon: Icon, color }: any) {
    const colorMap: any = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      indigo: "bg-indigo-100 text-indigo-600"
    };
  
    return (
      <Card className="border-none shadow-soft group">
        <CardContent className="p-6 flex items-center gap-4">
           <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-lg", colorMap[color])}>
              <Icon className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">{title}</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
              {subtitle && <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">{subtitle}</p>}
           </div>
        </CardContent>
      </Card>
    );
  }
