import React from "react";
import { Save, Upload, Globe, Clock, Monitor, Layout, Settings, Image as ImageIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export default function GeneralSettings() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
            <Settings className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">General Settings</h1>
            <p className="text-sm text-slate-500 font-medium">Configure your application branding, localization, and system defaults.</p>
          </div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 px-8 h-12 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Branding Section */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 dark:bg-white/5 dark:border-slate-800">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
                 <Monitor className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Branding</CardTitle>
                 <CardDescription className="dark:text-slate-400">Visual identity and application name.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">CRM Name</label>
                 <Input defaultValue="VeltroxCRM Enterprise" className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tagline</label>
                 <Input defaultValue="Infinite Business Scalability" className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500/20" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">App Logo</label>
                 <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                       <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase transition-all hover:bg-blue-50 hover:text-blue-600 border-slate-200 whitespace-nowrap">
                           <Upload className="h-3 w-3 mr-1.5" /> Change Logo
                        </Button>
                        <p className="text-[10px] text-slate-400 font-medium">Max size: 2MB. Format: PNG, SVG</p>
                    </div>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Favicon</label>
                 <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                       <ImageIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase transition-all hover:bg-blue-50 hover:text-blue-600 border-slate-200 whitespace-nowrap">
                           <Upload className="h-3 w-3 mr-1.5" /> Change Icon
                        </Button>
                        <p className="text-[10px] text-slate-400 font-medium">Size: 32x32px. Format: ICO, PNG</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Primary Color</label>
              <div className="flex items-center gap-3">
                 <div className="h-11 w-11 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20" />
                 <Input defaultValue="#3b82f6" className="h-11 max-w-[150px] rounded-xl border-slate-200 text-sm font-mono" />
                 <Badge variant="outline" className="bg-slate-50 text-slate-400 border-none font-medium">Default Theme</Badge>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Localization Section */}
      <Card className="border-none shadow-soft overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <Globe className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-lg font-bold text-slate-800">Localization</CardTitle>
                 <CardDescription>Date, time and regional formatting.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Default Language</label>
                 <Select defaultValue="en">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="en">English (US)</SelectItem>
                       <SelectItem value="es">Spanish</SelectItem>
                       <SelectItem value="fr">French</SelectItem>
                       <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Timezone</label>
                 <Select defaultValue="utc">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Timezone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                       <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                       <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                       <SelectItem value="gmt">GMT +0:00</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date Format</label>
                 <Select defaultValue="mdy">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Date Format" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                       <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                       <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Records Per Page</label>
                 <Select defaultValue="10">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Per Page" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="10">10 Rows</SelectItem>
                       <SelectItem value="25">25 Rows</SelectItem>
                       <SelectItem value="50">50 Rows</SelectItem>
                       <SelectItem value="100">100 Rows</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Currency Section */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 dark:bg-white/5 dark:border-slate-800">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/30 dark:text-amber-400">
                 <Globe className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Currency Settings</CardTitle>
                 <CardDescription className="dark:text-slate-400">Default system currency configuration.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Currency Code</label>
                 <Input defaultValue="USD" className="h-11 rounded-xl border-slate-200 font-mono" />
              </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Currency Symbol</label>
                 <Input defaultValue="$" className="h-11 rounded-xl border-slate-200 font-mono text-center max-w-[80px]" />
              </div>
           </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
