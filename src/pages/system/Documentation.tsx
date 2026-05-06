import React from "react";
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Code,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DocumentationPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-10 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden">
         {/* Abstract background elements */}
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-blue-500 blur-[100px]" />
            <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-500 blur-[100px]" />
         </div>

         <div className="relative z-10 space-y-4 px-6">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Documentation & Guides</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Learn how to build, scale and manage your business using the VeltroxCRM framework.</p>
            
            <div className="max-w-xl mx-auto relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input 
                placeholder="Search for articles, components, or tutorials..." 
                className="h-14 pl-12 pr-6 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 text-base" 
              />
            </div>
         </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DocCard title="Getting Started" icon={Zap} description="Basic setup and architectural overview." color="text-yellow-500 bg-yellow-500/10" />
          <DocCard title="Security & Roles" icon={ShieldCheck} description="How to manage user permissions and access." color="text-emerald-500 bg-emerald-500/10" />
          <DocCard title="Developer API" icon={Code} description="Integrate with our powerful REST API endpoints." color="text-blue-500 bg-blue-500/10" />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <FileText className="h-6 w-6 text-blue-600" />
               Popular Technical Guides
            </h2>
            <div className="space-y-3">
               <GuideLink title="Setting up multi-currency invoicing" />
               <GuideLink title="Configuring automated purchase orders" />
               <GuideLink title="Customizing the dashboard widgets" />
               <GuideLink title="Understanding inventory stock valuation" />
               <GuideLink title="Role-based dynamic routing setup" />
            </div>
         </section>

         <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <HelpCircle className="h-6 w-6 text-indigo-600" />
               Common Questions
            </h2>
            <div className="space-y-4">
                <Card className="border-none shadow-soft group hover:bg-slate-50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                        <p className="font-bold text-slate-800 text-sm">How do I reset my SMTP configuration?</p>
                        <p className="text-xs text-slate-500 mt-1">Visit System Settings &gt; Email and follow the test procedure.</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-soft group hover:bg-slate-50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                        <p className="font-bold text-slate-800 text-sm">What is the difference between specific and global roles?</p>
                        <p className="text-xs text-slate-500 mt-1">Global roles apply across all companies in the multi-tenant instance.</p>
                    </CardContent>
                </Card>
            </div>
         </section>
      </div>
    </div>
  );
}

function DocCard({ title, icon: Icon, description, color }: any) {
    return (
        <Card className="border-none shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group">
            <CardContent className="p-8 flex flex-col items-center text-center">
                <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12", color)}>
                    <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    );
}

function GuideLink({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-soft group hover:bg-slate-50 transition-all cursor-pointer">
            <span className="text-sm font-bold text-slate-700">{title}</span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
    );
}
