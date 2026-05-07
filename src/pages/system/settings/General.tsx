import React, { useState, useEffect } from "react";
import { Save, Upload, Globe, Clock, Monitor, Layout, Settings, Image as ImageIcon, Loader2 } from "lucide-react";
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
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function GeneralSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/system/settings', { group: 'general' });
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post('/system/settings', { settings, group: 'general' });
      if (response.success) {
        toast.success("General settings saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
      </div>
    );
  }

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

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 px-8 h-12 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Settings"}
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
                 <Input 
                   value={settings.app_name || ""} 
                   onChange={e => updateSetting('app_name', e.target.value)}
                   className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500/20" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tagline</label>
                 <Input 
                   value={settings.tagline || ""} 
                   onChange={e => updateSetting('tagline', e.target.value)}
                   className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500/20" 
                 />
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
                 <div className="h-11 w-11 rounded-xl shadow-lg shadow-blue-600/20" style={{ backgroundColor: settings.primary_color || "#3b82f6" }} />
                 <Input 
                   value={settings.primary_color || "#3b82f6"} 
                   onChange={e => updateSetting('primary_color', e.target.value)}
                   className="h-11 max-w-[150px] rounded-xl border-slate-200 text-sm font-mono" 
                 />
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
                 <Select value={settings.language || "en"} onValueChange={val => updateSetting('language', val)}>
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
                 <Select value={settings.timezone || "utc"} onValueChange={val => updateSetting('timezone', val)}>
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
           </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
