import React from "react";
import { Save, Mail, Server, Shield, Send, CheckCircle2, User } from "lucide-react";
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

export default function EmailSettings() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Mail className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Email Settings</h1>
            <p className="text-sm text-slate-500 font-medium">Configure outgoing mail server (SMTP) and sender details.</p>
          </div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 px-8 h-12 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* SMTP Configuration */}
        <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 dark:bg-white/5 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">SMTP Configuration</CardTitle>
                  <CardDescription className="dark:text-slate-400">Advanced outgoing server connection details.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mailer</label>
                 <Select defaultValue="smtp">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Protocol" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="smtp">SMTP</SelectItem>
                       <SelectItem value="mailgun">Mailgun API</SelectItem>
                       <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Encryption</label>
                 <Select defaultValue="tls">
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                       <SelectValue placeholder="Encryption" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                       <SelectItem value="tls">TLS</SelectItem>
                       <SelectItem value="ssl">SSL</SelectItem>
                       <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">SMTP Host</label>
                 <Input defaultValue="smtp.mailtrap.io" className="h-11 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">SMTP Port</label>
                 <Input defaultValue="587" className="h-11 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">SMTP Username</label>
                 <Input defaultValue="api-user-889" className="h-11 rounded-xl border-slate-200" />
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                 <Input type="password" value="••••••••••••" readOnly className="h-11 rounded-xl border-slate-200 bg-slate-50" />
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Sender Details */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900/50">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 dark:bg-white/5 dark:border-slate-800">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/30 dark:text-amber-400">
                 <User className="h-5 w-5" />
              </div>
              <div>
                 <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Sender Details</CardTitle>
                 <CardDescription className="dark:text-slate-400">Default "From" details for system emails.</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sender Name</label>
                 <Input defaultValue="Veltrox CRM Systems" className="h-11 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sender Email</label>
                 <Input defaultValue="notifications@veltroxcrm.com" className="h-11 rounded-xl border-slate-200" />
              </div>
           </div>
        </CardContent>
      </Card>
      </div>

      {/* Test Email Section */}
      <Card className="border-2 border-dashed border-blue-100 bg-blue-50/20 shadow-none overflow-hidden">
        <CardHeader>
           <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base font-bold text-blue-800">Send Test Email</CardTitle>
           </div>
           <CardDescription>Verify your SMTP configuration by sending a test message.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-3">
           <Input placeholder="Recipient email address..." className="h-11 rounded-xl bg-white border-blue-100 flex-1" />
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm">
              Send Test
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
